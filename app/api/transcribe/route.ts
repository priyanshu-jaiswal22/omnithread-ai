import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a'];
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

    const buffer = await file.arrayBuffer();
    const formDataToSend = new FormData();
    formDataToSend.append('file', new Blob([buffer], { type: file.type }), file.name);
    formDataToSend.append('model', 'whisper-large-v3');
    formDataToSend.append('language', 'en');

    const response = await fetch('https://api.groq.com/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const duration = Math.round((file.size / (128 * 1024)) * 8);

    return NextResponse.json({
      transcript: data.text,
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
