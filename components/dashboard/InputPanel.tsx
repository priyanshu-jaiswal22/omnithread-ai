'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Link as LinkIcon, FileText, Volume2, Zap } from 'lucide-react';
import { Platform } from '@/types';

const PLATFORMS: Platform[] = [
  'linkedin',
  'twitter',
  'instagram',
  'youtube',
  'newsletter',
  'whatsapp',
  'reddit',
  'facebook',
  'quora',
  'blog',
];

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

interface InputPanelProps {
  creditsRemaining: number;
  isFreeUser: boolean;
  onGenerate: (content: string, platforms: Platform[], brandVoice?: string) => Promise<void>;
}

export function InputPanel({
  creditsRemaining,
  isFreeUser,
  onGenerate,
}: InputPanelProps) {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(
    isFreeUser ? PLATFORMS.slice(0, 5) : PLATFORMS
  );
  const [brandVoice, setBrandVoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrapedContent, setScrapedContent] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);

  const handleFetchContent = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setUrlLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setScrapedContent(data.content);
      setContent(data.content);
      toast.success('Content fetched successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch content');
    } finally {
      setUrlLoading(false);
    }
  };

  const handleGenerateClick = async () => {
    if (!content.trim()) {
      toast.error('Please provide content to generate posts from');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (creditsRemaining <= 0) {
      toast.error('No credits remaining');
      return;
    }

    setLoading(true);
    try {
      await onGenerate(content, selectedPlatforms, brandVoice || undefined);
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform: Platform) => {
    if (isFreeUser && !selectedPlatforms.includes(platform) && selectedPlatforms.length >= 5) {
      toast.error('Free plan limited to 5 platforms');
      return;
    }

    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            <span className="hidden sm:inline">URL</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div>
            <Label className="text-white mb-2 block">Your Content</Label>
            <Textarea
              placeholder="Paste your blog, script, podcast transcript, or any content..."
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={loading}
              className="min-h-[200px] bg-background border-border text-white placeholder:text-muted-foreground focus:border-primary"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>{content.length} / 10,000 characters</span>
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div>
            <Label className="text-white mb-2 block">Paste URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com or https://youtube.com/watch?v=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={urlLoading || loading}
                className="bg-background border-border text-white placeholder:text-muted-foreground focus:border-primary"
              />
              <Button
                onClick={handleFetchContent}
                disabled={urlLoading || loading || !url}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {urlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
              </Button>
            </div>
          </div>
          {scrapedContent && (
            <div>
              <Label className="text-white mb-2 block">Fetched Content</Label>
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={loading}
                className="min-h-[200px] bg-background border-border text-white focus:border-primary"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <div className="bg-background border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Volume2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Upload Audio</p>
            <p className="text-sm text-muted-foreground mb-4">
              MP3, WAV, M4A • Max 25MB
            </p>
            <Button
              variant="outline"
              className="border-primary text-white hover:bg-card"
              disabled={loading}
            >
              Coming Soon
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-white">Select Platforms</Label>
          {isFreeUser && (
            <Badge className="bg-primary/20 text-primary text-xs">
              Free: 5 platforms max
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PLATFORMS.map(platform => {
            const isSelected = selectedPlatforms.includes(platform);
            const isLocked = isFreeUser && !isSelected && selectedPlatforms.length >= 5;

            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                disabled={isLocked || loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-white'
                    : isLocked
                      ? 'bg-card border border-border text-muted-foreground opacity-50 cursor-not-allowed'
                      : 'bg-card border border-border text-muted-foreground hover:border-primary'
                }`}
              >
                {PLATFORM_LABELS[platform]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-white mb-2 block">Brand Voice (Optional)</Label>
        <Textarea
          placeholder="Describe your writing style. E.g., casual and fun, use simple words, speak to startup founders..."
          value={brandVoice}
          onChange={e => setBrandVoice(e.target.value)}
          disabled={loading}
          className="min-h-[100px] bg-background border-border text-white placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <Button
        onClick={handleGenerateClick}
        disabled={loading || creditsRemaining <= 0 || !content.trim()}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold h-12 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Generate Content
          </>
        )}
      </Button>

      {creditsRemaining <= 0 && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">
            You've used all {selectedPlatforms.length} free credits this month. Pro plan coming soon!
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Uses 1 credit • {creditsRemaining} credit{creditsRemaining !== 1 ? 's' : ''} remaining
      </p>
    </div>
  );
}
