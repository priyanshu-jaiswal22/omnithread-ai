import { NextRequest, NextResponse } from 'next/server';

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTextFromHTML(html: string): string {
  let text = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.substring(0, 10000);
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();

  return 'Article';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (videoId) {
      return NextResponse.json({
        title: 'YouTube Video',
        content: 'YouTube transcription feature coming soon. Please use text or URL mode for now.',
        wordCount: 10,
        type: 'youtube',
      });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const html = await response.text();
    const content = extractTextFromHTML(html);
    const title = extractTitle(html);
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      title,
      content,
      wordCount,
      type: 'article',
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to scrape content',
      },
      { status: 500 }
    );
  }
}
