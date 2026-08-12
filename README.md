# OmniThread AI

> Turn one piece of content into 10 platform-ready posts — instantly.

OmniThread AI is a full-stack SaaS application that uses Google Gemini AI to repurpose your content (text, URLs, YouTube videos, or audio) into optimized posts for LinkedIn, Twitter/X, Instagram, YouTube, Newsletter, WhatsApp, Reddit, Facebook, Quora, and Blog/SEO.

## Features

- 🧠 **AI-Powered Generation** — Powered by Google Gemini for high-quality, platform-specific content
- 🎙️ **Audio Transcription** — Upload MP3/WAV/M4A files, transcribed instantly via Groq Whisper
- 🌐 **Smart Web Scraping** — Paste any URL or YouTube link to extract content automatically
- 🎯 **10 Platform Templates** — Each post is tailored for the platform's audience and format
- 🔐 **Secure Auth** — Supabase-powered authentication with protected routes
- 📊 **Usage Tracking** — Credit-based system with monthly auto-reset
- 📥 **CSV Export** — Download all generated posts in one click
- ✍️ **Brand Voice** — Personalized writing style applied to every generation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **AI**: Google Gemini (`@google/generative-ai`)
- **Audio**: Groq SDK (Whisper Large V3)
- **Styling**: Tailwind CSS + Radix UI (shadcn/ui)
- **Emails**: Resend

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local` and fill in your API keys
4. Run the dev server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## License

MIT
