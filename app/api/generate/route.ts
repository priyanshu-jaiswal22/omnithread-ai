import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateContent } from '@/lib/gemini';
import { GenerateRequest } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getUserFromToken(authHeader: string): Promise<string | null> {
  try {
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    return user?.id || null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getUserFromToken(authHeader);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body: GenerateRequest = await request.json();
    const { content, platforms, brandVoice, inputType, inputUrl } = body;

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'Content exceeds 10,000 character limit' },
        { status: 400 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits_used, credits_limit')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userData.credits_used >= userData.credits_limit) {
      return NextResponse.json(
        { error: 'No credits remaining' },
        { status: 402 }
      );
    }

    const outputs = await generateContent(content, brandVoice);

    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        input_content: content.substring(0, 1000),
        input_type: inputType,
        input_url: inputUrl,
        platforms_selected: platforms,
        outputs,
        credits_used: 1,
      })
      .select()
      .single();

    if (genError) {
      throw genError;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits_used: userData.credits_used + 1 })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update credits:', updateError);
    }

    return NextResponse.json({
      generation,
      outputs,
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate content',
      },
      { status: 500 }
    );
  }
}
