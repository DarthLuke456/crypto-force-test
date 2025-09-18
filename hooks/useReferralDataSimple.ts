import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ReferralStats {
  referral_code: string;
  total_referrals: number;
  user_level: number;
  recent_referrals: Array<{
    email: string;
    date: string;
  }>;
}

interface UseReferralDataSimpleReturn {
  stats: ReferralStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Global cache to prevent multiple instances
const globalStatsCache = new Map<string, ReferralStats>();
const globalLoadingState = new Map<string, boolean>();
const globalFetchPromises = new Map<string, Promise<ReferralStats | null>>();

export function useReferralDataSimple(): UseReferralDataSimpleReturn {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const isMounted = useRef(true);

  const fetchReferralStats = useCallback(async (email: string, forceRefresh: boolean = false): Promise<ReferralStats | null> => {
    // Check global cache first (unless force refresh)
    if (!forceRefresh && globalStatsCache.has(email)) {
      console.log('🚫 Using cached data for:', email);
      return globalStatsCache.get(email)!;
    }

    // Check if already loading globally (unless force refresh)
    if (!forceRefresh && globalLoadingState.get(email)) {
      console.log('🚫 Already loading globally for:', email);
      // Return the existing promise
      return globalFetchPromises.get(email) || null;
    }

    // Set global loading state
    globalLoadingState.set(email, true);

    const fetchPromise = (async () => {
      try {
        if (!isMounted.current) return null;

        console.log('🔄 Fetching referral stats for:', email, forceRefresh ? '(force refresh)' : '');

        // Obtener el token de sesión
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No hay sesión activa');
        }

        const response = await fetch('/api/referrals/stats-client', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        } else {
          // Cache globally
          globalStatsCache.set(email, result);
          console.log('✅ Referral stats fetched and cached globally');
          return result;
        }
      } catch (error) {
        console.error('Error fetching referral stats:', error);
        throw error;
      } finally {
        globalLoadingState.set(email, false);
        globalFetchPromises.delete(email);
      }
    })();

    globalFetchPromises.set(email, fetchPromise);
    return fetchPromise;
  }, []);

  // Get user email from session - only once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const getCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email && isMounted.current) {
          setUserEmail(session.user.email);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    getCurrentUser();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch data when user email is available - only once
  useEffect(() => {
    if (!userEmail || !isMounted.current) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        if (globalStatsCache.has(userEmail)) {
          setStats(globalStatsCache.get(userEmail)!);
          setLoading(false);
          return;
        }

        // Only fetch if not already loading
        if (!globalLoadingState.get(userEmail)) {
          console.log('🚀 Initial fetch for user:', userEmail);
          const result = await fetchReferralStats(userEmail);
          if (result && isMounted.current) {
            setStats(result);
          }
        }
      } catch (error) {
        if (isMounted.current) {
          setError('Error de conexión');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [userEmail, fetchReferralStats]);

  const refetch = useCallback(async () => {
    if (!userEmail || !isMounted.current) {
      console.log('🚫 Refetch blocked - no email or not mounted');
      return;
    }
    
    console.log('🔄 Manual refetch requested for:', userEmail);
    
    // Clear cache
    globalStatsCache.delete(userEmail);
    globalLoadingState.delete(userEmail);
    globalFetchPromises.delete(userEmail);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Starting fresh fetch...');
      const result = await fetchReferralStats(userEmail, true);
      
      if (result && isMounted.current) {
        console.log('✅ Refetch successful, updating stats');
        setStats(result);
      } else {
        console.log('❌ Refetch failed or component unmounted');
      }
    } catch (error) {
      console.error('❌ Refetch error:', error);
      if (isMounted.current) {
        setError('Error de conexión');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        console.log('✅ Refetch completed');
      }
    }
  }, [fetchReferralStats, userEmail]);

  return {
    stats,
    loading,
    error,
    refetch
  };
}
