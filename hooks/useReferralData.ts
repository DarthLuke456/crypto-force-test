import { useState, useEffect, useCallback, useRef } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
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

interface UseReferralDataReturn {
  stats: ReferralStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Global cache to prevent multiple instances
const globalStatsCache = new Map<string, ReferralStats>();
const globalLoadingState = new Map<string, boolean>();

export function useReferralData(): UseReferralDataReturn {
  const { userData, isReady } = useSafeAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralStats = useCallback(async () => {
    if (!userData?.email || !isReady) {
      return;
    }

    const userEmail = userData.email;

    // Check global cache first
    if (globalStatsCache.has(userEmail)) {
      console.log('🚫 Using cached data for:', userEmail);
      setStats(globalStatsCache.get(userEmail)!);
      return;
    }

    // Check if already loading globally
    if (globalLoadingState.get(userEmail)) {
      console.log('🚫 Already loading globally for:', userEmail);
      return;
    }

    // Set global loading state
    globalLoadingState.set(userEmail, true);

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching referral stats for:', userEmail);

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
        setError(result.error);
      } else {
        // Cache globally
        globalStatsCache.set(userEmail, result);
        setStats(result);
        console.log('✅ Referral stats fetched and cached globally');
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
      globalLoadingState.set(userEmail, false);
    }
  }, []);

  // Only fetch once when component mounts and user is ready
  useEffect(() => {
    if (userData?.email && isReady) {
      const userEmail = userData.email;
      
      // Check cache first
      if (globalStatsCache.has(userEmail)) {
        setStats(globalStatsCache.get(userEmail)!);
        return;
      }

      // Only fetch if not already loading
      if (!globalLoadingState.get(userEmail)) {
        console.log('🚀 Initial fetch for user:', userEmail);
        fetchReferralStats();
      }
    }
  }, [userData?.email, isReady, fetchReferralStats]);

  const refetch = useCallback(async () => {
    if (!userData?.email) return;
    
    console.log('🔄 Manual refetch requested');
    const userEmail = userData.email;
    
    // Clear cache
    globalStatsCache.delete(userEmail);
    globalLoadingState.delete(userEmail);
    
    await fetchReferralStats();
  }, [fetchReferralStats, userData?.email]);

  return {
    stats,
    loading,
    error,
    refetch
  };
}

// Hook para validar código de referido
export function useReferralValidation() {
  const [validationState, setValidationState] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    referrerNickname: string | null;
    error: string | null;
  }>({
    isValidating: false,
    isValid: null,
    referrerNickname: null,
    error: null
  });

  const validateCode = async (code: string) => {
    if (!code.trim()) {
      setValidationState({
        isValidating: false,
        isValid: null,
        referrerNickname: null,
        error: null
      });
      return;
    }

    try {
      setValidationState(prev => ({ ...prev, isValidating: true, error: null }));

      // Obtener el token de sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('/api/referrals/validate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ code: code.trim() })
      });

      const result = await response.json();

      if (result.success && result.valid) {
        setValidationState({
          isValidating: false,
          isValid: true,
          referrerNickname: result.referrer.nickname,
          error: null
        });
      } else {
        setValidationState({
          isValidating: false,
          isValid: false,
          referrerNickname: null,
          error: 'Código de invitación no válido'
        });
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setValidationState({
        isValidating: false,
        isValid: false,
        referrerNickname: null,
        error: 'Error de conexión'
      });
    }
  };

  return {
    ...validationState,
    validateCode
  };
}
