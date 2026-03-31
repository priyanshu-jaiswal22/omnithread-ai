'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'This tool saved me 10+ hours per week. I can now focus on creating content instead of manually repurposing it.',
    author: 'Sarah Chen',
    role: 'Content Creator',
  },
  {
    quote:
      'The AI understands my voice perfectly. Every post sounds like me, not like some generic bot wrote it.',
    author: 'Mike Rodriguez',
    role: 'Founder',
  },
  {
    quote:
      'Finally, a tool that actually gets platform-specific formatting. My engagement is up 40% since using OmniThread.',
    author: 'Emma Wilson',
    role: 'Marketing Manager',
  },
  {
    quote:
      'The podcast transcription is incredible. I can turn a 1-hour podcast into 10 different posts in minutes.',
    author: 'David Park',
    role: 'Podcaster',
  },
  {
    quote:
      'As a busy entrepreneur, this is a game-changer. One piece of content, infinite reach across platforms.',
    author: 'Lisa Thompson',
    role: 'Entrepreneur',
  },
  {
    quote:
      "The free tier is generous and powerful. When Pro launches, I'm upgrading immediately.",
    author: 'James Murphy',
    role: 'Creator',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Creators Are Saving 10+ Hours Every Week
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have already transformed their content strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-white">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
