'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { InputPanel } from '@/components/dashboard/InputPanel';
import { OutputGrid } from '@/components/dashboard/OutputGrid';
import { User, Platform, PlatformOutputs } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardPageProps {
  params?: Record<string, string>;
}

export default function DashboardPage(props: DashboardPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [outputs, setOutputs] = useState<PlatformOutputs | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleGenerate = async (
    content: string,
    platforms: Platform[],
    brandVoice?: string
  ) => {
    setGenerating(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Session expired');
        return;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          content,
          platforms,
          brandVoice,
          inputType: 'text',
        }),
      });

      if (response.status === 402) {
        toast.error('No credits remaining');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setOutputs(data.outputs);
      setGenerationId(data.generation.id);
      setSelectedPlatforms(platforms);

      setUser(prev =>
        prev ? { ...prev, credits_used: prev.credits_used + 1 } : null
      );

      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Generate error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const handleFeedback = async (rating: 'up' | 'down') => {
    if (!generationId) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Session expired');
        return;
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          generationId,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save feedback');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Failed to save feedback');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const creditsRemaining = user.credits_limit - user.credits_used;
  const isFreeUser = user.plan === 'free';

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Generate Content</h1>
        <p className="text-muted-foreground">
          Turn your content into platform-native posts instantly
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <InputPanel
            creditsRemaining={creditsRemaining}
            isFreeUser={isFreeUser}
            onGenerate={handleGenerate}
          />
        </div>

        <div className="lg:col-span-2">
          {outputs ? (
            <OutputGrid
              outputs={outputs}
              generationId={generationId!}
              selectedPlatforms={selectedPlatforms}
              onFeedback={handleFeedback}
            />
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to create amazing content?
              </h3>
              <p className="text-muted-foreground">
                Enter your content in the panel on the left and generate platform-native posts
                across all your favorite social media platforms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
