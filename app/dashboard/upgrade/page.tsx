'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const tiers = [
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
  }
];

export default function UpgradePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('waitlist').insert([{ email }]);
      if (error && error.code !== '23505') throw error; // Ignore duplicate email errors
      
      toast.success("You're on the list! We'll notify you when Pro is ready.");
      setEmail('');
    } catch (error) {
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Upgrade Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We are currently polishing our paid tiers to ensure the best experience. 
          Join the waitlist to get early access and an exclusive lifetime discount!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {tiers.map((tier) => (
          <div key={tier.name} className="bg-card border border-border hover:border-primary/50 transition-colors rounded-2xl p-8 flex flex-col">
            <h3 className="text-2xl font-semibold text-white mb-2">{tier.name}</h3>
            <p className="text-muted-foreground mb-6">{tier.description}</p>
            
            <div className="mb-8 flex items-baseline">
              <span className="text-4xl font-bold text-white">{tier.price}</span>
              <span className="text-muted-foreground ml-2">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-primary shrink-0 mr-3" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Join the Pro Waitlist</h2>
        <p className="text-muted-foreground mb-6">
          Enter your email to be the first to know when we launch and receive a 20% lifetime discount.
        </p>
        <form onSubmit={handleJoinWaitlist} className="flex gap-3 max-w-md mx-auto">
          <Input
            type="email"
            required
            placeholder="hello@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-background border-border text-white flex-1"
          />
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Join Waitlist
          </Button>
        </form>
      </div>
    </div>
  );
}
