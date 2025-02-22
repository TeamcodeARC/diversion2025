import { createClient } from '@supabase/supabase-js';
import { PowerGridMetrics } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getHistoricalMetrics(): Promise<PowerGridMetrics[]> {
  const { data, error } = await supabase
    .from('power_metrics')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }

  return data || [];
}

export async function saveMetrics(metrics: Omit<PowerGridMetrics, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('power_metrics')
    .insert([metrics]);

  if (error) {
    console.error('Error saving metrics:', error);
  }
}