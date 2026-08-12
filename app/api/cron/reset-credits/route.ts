import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Vercel Cron uses GET requests and sends CRON_SECRET via Authorization header
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const { error } = await supabase
      .from('users')
      .update({ 
        credits_used: 0,
        billing_reset_date: nextMonth.toISOString()
      })
      .neq('credits_used', -1); // Update all users

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Credits reset successfully' });
  } catch (error) {
    console.error('Cron reset-credits error:', error);
    return NextResponse.json(
      { error: 'Failed to reset credits' },
      { status: 500 }
    );
  }
}

