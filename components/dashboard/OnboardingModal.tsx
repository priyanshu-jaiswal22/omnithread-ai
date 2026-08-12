'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Platform } from '@/types';
import { Loader2, Mic, PenTool, Video, Briefcase, Rocket } from 'lucide-react';

const CREATOR_TYPES = [
  { id: 'podcaster', label: 'Podcaster', icon: Mic },
  { id: 'blogger', label: 'Blogger/Writer', icon: PenTool },
  { id: 'youtuber', label: 'YouTuber', icon: Video },
  { id: 'marketer', label: 'Marketer', icon: Briefcase },
  { id: 'founder', label: 'Founder', icon: Rocket },
];

const PLATFORMS: Platform[] = [
  'linkedin', 'twitter', 'instagram', 'youtube', 'newsletter',
  'whatsapp', 'reddit', 'facebook', 'quora', 'blog'
];

interface OnboardingModalProps {
  onComplete: (data: { creator_type: string; default_platforms: Platform[]; brand_voice: string }) => Promise<void>;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creatorType, setCreatorType] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['linkedin', 'twitter']);
  const [brandVoice, setBrandVoice] = useState('');

  const handleNext = () => setStep(s => s + 1);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete({
        creator_type: creatorType,
        default_platforms: selectedPlatforms,
        brand_voice: brandVoice,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-xl w-full shadow-2xl relative">
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-16 rounded-full ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">What type of creator are you?</h2>
              <p className="text-muted-foreground">This helps us personalize your experience.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {CREATOR_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = creatorType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setCreatorType(type.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                      isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-medium text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>

            <Button onClick={handleNext} disabled={!creatorType} className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Which platforms do you post on?</h2>
              <p className="text-muted-foreground">Select the ones you use most often.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {PLATFORMS.map(platform => {
                const isSelected = selectedPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all capitalize ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border text-white hover:bg-card">
                Back
              </Button>
              <Button onClick={handleNext} disabled={selectedPlatforms.length === 0} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Describe your writing style</h2>
              <p className="text-muted-foreground">We'll use this to make AI posts sound like you.</p>
            </div>

            <div>
              <Label className="sr-only">Brand Voice</Label>
              <Textarea
                placeholder="e.g. Casual and fun, use simple words, speak to startup founders, add humor..."
                value={brandVoice}
                onChange={e => setBrandVoice(e.target.value)}
                className="min-h-[150px] bg-background border-border text-white placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-border text-white hover:bg-card">
                Back
              </Button>
              <Button onClick={handleComplete} disabled={loading} className="flex-1 bg-gradient-primary hover:opacity-90 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Get Started'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
