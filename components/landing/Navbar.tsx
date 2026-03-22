'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OmniThread AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-card">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-primary hover:opacity-90 text-white">
                Start Free
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="#features" className="block text-muted-foreground hover:text-white transition-colors py-2">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-muted-foreground hover:text-white transition-colors py-2">
              How It Works
            </Link>
            <Link href="#pricing" className="block text-muted-foreground hover:text-white transition-colors py-2">
              Pricing
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full border-border text-white hover:bg-card">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button className="w-full bg-gradient-primary hover:opacity-90 text-white">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
