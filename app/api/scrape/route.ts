import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (videoId) {
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        const content = transcript.map(t => t.text).join(' ').substring(0, 10000);
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        
        return NextResponse.json({
          title: 'YouTube Video',
          content,
          wordCount,
          type: 'youtube',
        });
      } catch (error) {
        throw new Error('Failed to fetch YouTube transcript. The video might not have captions enabled.');
      }
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
    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .ad, .advertisement, [role="banner"], [role="navigation"]').remove();
    
    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Article';
    
    // Extract content
    // We prioritize article body, main content, or fall back to body
    let contentNode = $('article, main, [role="main"]').first();
    if (contentNode.length === 0) {
      contentNode = $('body');
    }
    
    const content = contentNode.text().replace(/\s+/g, ' ').trim().substring(0, 10000);
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
