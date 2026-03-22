import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getUserFromToken(authHeader);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('credits_used, credits_limit, billing_reset_date')
      .eq('id', userId)
      .single();

    if (error || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      used: userData.credits_used,
      limit: userData.credits_limit,
      resetsOn: userData.billing_reset_date,
    });
  } catch (error) {
    console.error('Credits error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch credits',
      },
      { status: 500 }
    );
  }
}
