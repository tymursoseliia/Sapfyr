import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Car = {
  id: string;
  created_at: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  engine_volume?: number; // Объем двигателя в литрах
  drive_type?: string; // Тип привода (передний, задний, полный)
  description: string;
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  location: string;
};

export type VideoReview = {
  id: string;
  created_at: string;
  title: string;
  video_url: string;
  platform: 'rutube' | 'youtube';
  thumbnail_url?: string;
};
