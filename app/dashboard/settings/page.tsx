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
        </div>
      )}
    </div>
  );
}
