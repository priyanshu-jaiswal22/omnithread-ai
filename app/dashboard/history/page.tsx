'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2, Eye } from 'lucide-react';
import { Generation } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadHistory() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGenerations((data as Generation[]) || []);
      } catch (error) {
        console.error('Error loading history:', error);
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this generation?')) return;

    try {
      const { error } = await supabase.from('generations').delete().eq('id', id);

      if (error) throw error;
      setGenerations(prev => prev.filter(g => g.id !== id));
      toast.success('Generation deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete generation');
    }
  };

  const filteredGenerations = generations.filter(g =>
    g.input_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Content History</h1>
        <p className="text-muted-foreground">View and manage all your generated content</p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search your generations..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-card border-border text-white placeholder:text-muted-foreground focus:border-primary max-w-md"
        />
      </div>

      {filteredGenerations.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No generations yet</h3>
          <p className="text-muted-foreground">
            When you generate content, it will appear here for easy access.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGenerations.map(generation => (
            <div
              key={generation.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate mb-1">
                  {generation.input_content.substring(0, 60)}...
                </p>
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <span>{new Date(generation.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{generation.platforms_selected.length} platforms</span>
                  <span>•</span>
                  <span>1 credit</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => {
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
                    modal.innerHTML = `
                      <div class="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-auto">
                        <p class="text-white text-sm">${generation.input_content}</p>
                      </div>
                    `;
                    modal.onclick = e => {
                      if (e.target === modal) document.body.removeChild(modal);
                    };
                    document.body.appendChild(modal);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(generation.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
