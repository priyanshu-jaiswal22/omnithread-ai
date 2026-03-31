'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { PlatformOutputs, Platform } from '@/types';

const PLATFORM_LABELS: Record<Platform, string> = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  newsletter: 'Newsletter',
  whatsapp: 'WhatsApp',
  reddit: 'Reddit',
  facebook: 'Facebook',
  quora: 'Quora',
  blog: 'Blog/SEO',
};

interface OutputGridProps {
  outputs: PlatformOutputs;
  generationId: string;
  selectedPlatforms: Platform[];
  onFeedback: (rating: 'up' | 'down') => Promise<void>;
}

export function OutputGrid({
  outputs,
  generationId,
  selectedPlatforms,
  onFeedback,
}: OutputGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFeedback = async (rating: 'up' | 'down') => {
    setFeedbackLoading(true);
    try {
      await onFeedback(rating);
      setFeedbackGiven(rating);
      toast.success('Thank you for your feedback!');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const platformOrder = selectedPlatforms;
  const entries = platformOrder.map(platform => [
    platform,
    outputs[platform as keyof PlatformOutputs],
  ] as const);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {entries.map(([platform, content]) => (
          <div
            key={platform}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all animate-slide-up"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {PLATFORM_LABELS[platform as Platform]}
                <Check className="w-5 h-5 text-secondary" />
              </h3>
              <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded">
                {content.length} chars
              </span>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 mb-4 max-h-[300px] overflow-auto">
              <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                {content}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleCopy(content, selectedPlatforms.indexOf(platform as Platform))}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                {copiedIndex === selectedPlatforms.indexOf(platform as Platform) ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-border text-muted-foreground hover:text-white hover:bg-card"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Regen
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold mb-1">How helpful was this?</h4>
            <p className="text-sm text-muted-foreground">Your feedback helps us improve</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleFeedback('up')}
              disabled={feedbackLoading || feedbackGiven !== null}
              className={`${
                feedbackGiven === 'up'
                  ? 'bg-secondary text-background'
                  : 'bg-card border border-border text-muted-foreground hover:text-white hover:border-secondary'
              }`}
              size="sm"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleFeedback('down')}
              disabled={feedbackLoading || feedbackGiven !== null}
              className={`${
                feedbackGiven === 'down'
                  ? 'bg-destructive text-white'
                  : 'bg-card border border-border text-muted-foreground hover:text-white hover:border-destructive'
              }`}
              size="sm"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">
            📥 Export All as CSV
          </Button>
          <Button className="flex-1 border-border text-white hover:bg-card border">
            💾 Save to History
          </Button>
        </div>
      </div>
    </div>
  );
}
