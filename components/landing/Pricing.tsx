'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month forever',
    description: 'Perfect to get started',
    features: [
      '3 content inputs per month',
      '5 platforms only',
      'URL + Text input',
      'Basic formatting',
      'Community support',
    ],
    cta: 'Start Free',
    href: '/auth/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious creators',
    features: [
      '30 inputs/month',
      'All 10 platforms',
      'Audio upload (up to 25MB)',
      'Brand voice customization',
      'Full history & search',
      'CSV/Notion export',
      'Priority support',
    ],
    cta: 'Coming Soon',
    href: '#waitlist',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For growing teams',
    features: [
      'Unlimited inputs',
      '3 team members',
      'API access',
      'Custom prompts',
      'Advanced analytics',
      'Dedicated support',
    ],
    cta: 'Coming Soon',
    href: '#waitlist',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple Pricing. Serious Results.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your content creation needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? 'border-secondary bg-card/80 ring-2 ring-secondary/50 transform scale-105'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute top-4 right-4 bg-secondary text-background">
                  Most Popular
                </Badge>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
                </div>

                <Link href={plan.href}>
                  <Button
                    className={`w-full mb-8 ${
                      plan.highlighted
                        ? 'bg-gradient-primary hover:opacity-90 text-white'
                        : 'border-border text-white hover:bg-card border'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Pro and Team plans coming soon. Join our waitlist for early access + 3 bonus credits.
          </p>
        </div>
      </div>
    </section>
  );
}
