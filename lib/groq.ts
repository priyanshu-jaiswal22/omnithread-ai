import Groq from 'groq-sdk';

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GROQ_API_KEY environment variable');
    }
    client = new Groq({ apiKey });
  }
  return client;
}

export async function transcribeAudio(file: File): Promise<string> {
  const clientInstance = getClient();
  const transcription = await clientInstance.audio.transcriptions.create({
    file: file,
    model: 'whisper-large-v3',
    response_format: 'json',
    language: 'en',
  });

  return transcription.text;
}
