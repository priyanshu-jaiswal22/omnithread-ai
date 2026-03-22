'use client';

import { Smile, Zap, Headphones, Link as LinkIcon, Clock, Download } from 'lucide-react';

const features = [
  {
    title: 'Voice Preservation',
    description:
      'Unlike basic summarizers, OmniThread learns your tone — every output sounds like YOU.',
    icon: Smile,
  },
  {
    title: 'Algorithm-Optimized Formatting',
    description:
      'LinkedIn hooks, Twitter thread structure, Instagram hashtags — 2025 best practices.',
    icon: Zap,
  },
  {
    title: 'Podcast & Audio Support',
    description:
      'Upload MP3/WAV up to 25MB. Groq AI transcribes it instantly for free.',
    icon: Headphones,
  },
  {
    title: 'URL Magic',
    description:
      'Paste any YouTube, blog, or article URL. We extract content automatically.',
    icon: LinkIcon,
  },
  {
    title: 'Full Content History',
    description:
      'Every generation saved forever. Search and reuse anytime.',
    icon: Clock,
  },
  {
    title: 'One-Click Export',
    description:
      'Copy individual posts or export everything as CSV with one click.',
    icon: Download,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for Creators Who Value Their Time
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to turn one piece of content into multi-platform success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="space-y-4">
                <div className="inline-block p-3 bg-primary/10 rounded-xl">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
