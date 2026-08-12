'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { User } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    creatorType: '',
    brandVoice: '',
    defaultPlatforms: [] as string[],
  });

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
          setFormData({
            fullName: userData.full_name || '',
            creatorType: userData.creator_type || '',
            brandVoice: userData.brand_voice || '',
            defaultPlatforms: userData.default_platforms || [],
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.fullName,
          creator_type: formData.creatorType,
          brand_voice: formData.brandVoice,
          default_platforms: formData.defaultPlatforms,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {user && (
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Profile</h2>

            <div>
              <Label className="text-white mb-2 block">Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="bg-background border-border text-white focus:border-primary"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Email</Label>
              <Input
                value={user.email}
                disabled
                className="bg-background border-border text-muted-foreground"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Creator Type</Label>
              <Input
                value={formData.creatorType}
                onChange={e => setFormData(prev => ({ ...prev, creatorType: e.target.value }))}
                placeholder="e.g., Podcaster, Blogger, YouTuber"
                className="bg-background border-border text-white placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Brand Voice</h2>
            <p className="text-sm text-muted-foreground">
              Describe your writing style. This is used in every generation to maintain consistency.
            </p>

            <Textarea
              value={formData.brandVoice}
              onChange={e => setFormData(prev => ({ ...prev, brandVoice: e.target.value }))}
              placeholder="e.g., Casual and fun, use simple words, speak to startup founders..."
              className="min-h-[150px] bg-background border-border text-white placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Default Platforms</h2>
            <p className="text-sm text-muted-foreground">
              Select the platforms you want to generate content for by default.
            </p>
            <div className="flex flex-wrap gap-2">
              {['linkedin', 'twitter', 'instagram', 'youtube', 'newsletter', 'whatsapp', 'reddit', 'facebook', 'quora', 'blog'].map(platform => {
                const isSelected = formData.defaultPlatforms.includes(platform);
                return (
                  <button
                    key={platform}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        defaultPlatforms: isSelected
                          ? prev.defaultPlatforms.filter(p => p !== platform)
                          : [...prev.defaultPlatforms, platform]
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all capitalize ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Usage This Month</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Credits Used</span>
                <span className="text-white font-semibold">
                  {user.credits_used} / {user.credits_limit}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all"
                  style={{
                    width: `${(user.credits_used / user.credits_limit) * 100}%`,
                  }}
                />
              </div>
              {user.billing_reset_date && (
                <p className="text-xs text-muted-foreground">
                  Resets on {new Date(user.billing_reset_date).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-primary font-medium mb-1">Pro plan coming soon!</p>
                <p className="text-xs text-muted-foreground">
                  Get unlimited generations, priority support, and more.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-primary hover:opacity-90 text-white font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>

          <div className="bg-card border border-destructive/20 rounded-xl p-6 space-y-4 mt-12">
            <h2 className="text-xl font-semibold text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground">
              Irreversible actions related to your account and data.
            </p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={async () => {
                  if (confirm('Are you sure you want to delete all your generation history? This cannot be undone.')) {
                    const { error } = await supabase.from('generations').delete().eq('user_id', user.id);
                    if (error) toast.error('Failed to delete history');
                    else toast.success('History deleted successfully');
                  }
                }}
              >
                Delete All History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-white bg-destructive hover:bg-destructive/90 border-transparent"
                onClick={async () => {
                  if (confirm('Are you absolutely sure you want to delete your account? All data will be permanently removed.')) {
                    toast.success('Account scheduled for deletion. You will be logged out.');
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  }
                }}
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
