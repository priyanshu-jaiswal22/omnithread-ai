'use client';

import { Upload, Wand as Wand2, Rocket } from 'lucide-react';

const steps = [
  {
    title: 'Input Your Content',
    description:
      'Paste any URL, upload an MP3 podcast, or type your raw content directly.',
    icon: Upload,
  },
  {
    title: 'AI Magic',
    description:
      'Gemini AI reads, understands your voice, and rewrites for each platform\'s unique algorithm.',
    icon: Wand2,
  },
  {
    title: 'Copy & Post',
    description:
      'Copy each output with one click. Schedule directly or export all as CSV.',
    icon: Rocket,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Three Steps. Ten Outputs. Zero Stress.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From raw content to published posts in seconds, with zero manual formatting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
              >
                <div className="mb-6 inline-block p-3 bg-primary/10 rounded-xl">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
