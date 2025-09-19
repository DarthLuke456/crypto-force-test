'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface TribunalContent {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  category?: 'theoretical' | 'practical';
  content_type?: 'module' | 'checkpoint' | 'resource';
  description?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  difficulty_level?: number;
  is_published?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContentIndex {
  id: string;
  content_id: string;
  section_title: string;
  section_description?: string;
  section_order: number;
  section_type: 'content' | 'video' | 'quiz' | 'exercise' | 'resource';
  section_data?: any;
  is_required: boolean;
  estimated_duration: number;
}

export interface ContentSection {
  id: string;
  index_id: string;
  section_title: string;
  section_content: string;
  section_type: 'text' | 'html' | 'markdown' | 'code' | 'image' | 'video' | 'link';
  section_data?: any;
  sort_order: number;
  is_published: boolean;
}

export function useTribunalContent(level: number, category?: 'theoretical' | 'practical') {
  const [content, setContent] = useState<TribunalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('tribunal_content')
        .select('*')
        .eq('level', level)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setContent(data || []);
    } catch (err) {
      console.error('Error fetching tribunal content:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [level, category]);

  const fetchContentIndex = useCallback(async (contentId: string): Promise<ContentIndex[]> => {
    try {
      const { data, error } = await supabase
        .from('content_index')
        .select('*')
        .eq('content_id', contentId)
        .order('section_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching content index:', err);
      return [];
    }
  }, []);

  const fetchContentSections = useCallback(async (indexId: string): Promise<ContentSection[]> => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('index_id', indexId)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching content sections:', err);
      return [];
    }
  }, []);

  const refreshContent = useCallback(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refreshContent,
    fetchContentIndex,
    fetchContentSections
  };
}

export function useTribunalContentInjection(targetLevel: number, targetDashboard: string) {
  const [injections, setInjections] = useState<TribunalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInjections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/tribunal/inject?targetLevel=${targetLevel}&targetDashboard=${targetDashboard}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInjections(data.content || []);
    } catch (err) {
      console.error('Error fetching content injections:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [targetLevel, targetDashboard]);

  const refreshInjections = useCallback(() => {
    fetchInjections();
  }, [fetchInjections]);

  useEffect(() => {
    fetchInjections();
  }, [fetchInjections]);

  return {
    injections,
    loading,
    error,
    refreshInjections
  };
}
