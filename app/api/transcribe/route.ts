import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/groq';

const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/x-m4a'];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: MP3, WAV, M4A' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      );
    }

    const transcriptText = await transcribeAudio(file);
    const duration = Math.round((file.size / (128 * 1024)) * 8); // approximate duration

    return NextResponse.json({
      transcript: transcriptText,
      duration,
    });
  } catch (error) {
    console.error('Transcribe error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to transcribe audio',
      },
      { status: 500 }
    );
  }
}
