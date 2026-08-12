import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out OmniThread AI.',
    features: [
      '3 credits per month',
      'Generate 10 posts per credit',
      'Basic templates',
      'Standard support'
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For serious creators and professionals.',
    features: [
      'Unlimited credits',
      'Custom brand voice',
      'Advanced platform templates',
      'Priority support',
      'Early access to new features'
    ],
    cta: 'Join Waitlist',
    href: '/auth/signup?waitlist=true',
    popular: true,
  },
  {
    name: 'Team',
    price: '$49',
    description: 'For agencies and marketing teams.',
    features: [
      'Everything in Pro',
      '5 team members',
      'Collaborative workspace',
      'Custom API access',
      'Dedicated account manager'
    ],
    cta: 'Join Waitlist',
    href: '/auth/signup?waitlist=true',
    popular: false,
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the plan that best fits your content creation needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-card rounded-2xl p-8 border ${
                tier.popular ? 'border-primary shadow-2xl shadow-primary/20 scale-105' : 'border-border'
              } flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="bg-primary text-white text-xs font-bold uppercase tracking-wide py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-2">{tier.name}</h3>
                <p className="text-muted-foreground h-10">{tier.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">{tier.price}</span>
                <span className="text-xl text-muted-foreground ml-2">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-primary shrink-0 mr-3" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={tier.href} className="mt-auto">
                <Button 
                  className={`w-full ${tier.popular ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-secondary hover:bg-secondary/90 text-background'}`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
