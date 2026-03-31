export type Platform =
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'newsletter'
  | 'whatsapp'
  | 'reddit'
  | 'facebook'
  | 'quora'
  | 'blog';

export interface PlatformOutputs {
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  newsletter: string;
  whatsapp: string;
  reddit: string;
  facebook: string;
  quora: string;
  blog: string;
}

export interface Generation {
  id: string;
  user_id: string;
  input_content: string;
  input_type: 'url' | 'text' | 'audio';
  input_url?: string;
  platforms_selected: Platform[];
  outputs: PlatformOutputs;
  credits_used: number;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  creator_type?: string;
  plan: 'free' | 'pro' | 'team';
  credits_used: number;
  credits_limit: number;
  brand_voice?: string;
  default_platforms?: Platform[];
  onboarding_completed: boolean;
  billing_reset_date?: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  generation_id: string;
  rating: 'up' | 'down';
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface PlatformPreference {
  id: string;
  user_id: string;
  platform_name: Platform;
  custom_prompt?: string;
  is_enabled: boolean;
  sort_order: number;
}

export interface GenerateRequest {
  content: string;
  platforms: Platform[];
  brandVoice?: string;
  inputType: 'url' | 'text' | 'audio';
  inputUrl?: string;
}

export interface TranscribeResponse {
  transcript: string;
  duration: number;
}

export interface ScrapeResponse {
  title: string;
  content: string;
  wordCount: number;
  type: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface OnboardingData {
  creator_type: string;
  default_platforms: Platform[];
  brand_voice: string;
}
