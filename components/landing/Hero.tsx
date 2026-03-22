'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <Badge className="bg-primary/20 text-secondary border-primary/30 mb-4 inline-block">
          ✨ Powered by Gemini AI
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Turn 1 Piece of Content
          <br />
          <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
            Into 10 Platform-Ready Posts
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Paste a URL, upload a podcast, or type your idea. OmniThread AI transforms it into perfectly formatted posts for LinkedIn, Twitter, Instagram, and 7 more platforms — in under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/signup">
            <Button className="h-12 px-8 bg-gradient-primary hover:opacity-90 text-white font-semibold text-base">
              Start Free — No Credit Card
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-12 px-8 border-border text-white hover:bg-card font-semibold text-base flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          🔒 Free forever • No credit card • Cancel anytime
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center mt-16 pt-12 border-t border-border">
        <div>
          <div className="text-2xl font-bold text-secondary mb-1">5,000+</div>
          <div className="text-muted-foreground">Creators Using OmniThread</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-secondary mb-1">50,000+</div>
          <div className="text-muted-foreground">Posts Generated</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-secondary mb-1">10 Platforms</div>
          <div className="text-muted-foreground">Supported</div>
        </div>
      </div>
    </section>
  );
}
