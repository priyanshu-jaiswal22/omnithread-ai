'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Zap, FileText, Settings, LogOut, Zap as ZapIcon } from 'lucide-react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const creditsRemaining = user.credits_limit - user.credits_used;

  const menuItems = [
    { href: '/dashboard', label: 'Generate', icon: Zap },
    { href: '/dashboard/history', label: 'History', icon: FileText },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">OmniThread</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-white hover:bg-card'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-4 border-t border-border">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Credits</span>
            <span className="text-xs font-mono bg-primary/20 text-secondary px-2 py-1 rounded">
              {creditsRemaining}/{user.credits_limit}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300"
              style={{
                width: `${((user.credits_limit - creditsRemaining) / user.credits_limit) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {creditsRemaining > 0
              ? `${creditsRemaining} generations left this month`
              : 'No credits remaining'}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Account</p>
            <p className="text-sm font-medium text-white mt-1">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full border-border text-muted-foreground hover:text-white hover:bg-card border mt-2"
            variant="outline"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
