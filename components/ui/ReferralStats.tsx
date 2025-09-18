'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Share2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';

interface ReferralStatsProps {
  userEmail: string;
  className?: string;
}

interface ReferralData {
  referral_code: string;
  total_referrals: number;
  total_earnings: number;
  user_level: number;
  recent_referrals: Array<{
    email: string;
    date: string;
  }>;
}

export default function ReferralStats({ userEmail, className = '' }: ReferralStatsProps) {
  const [stats, setStats] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { userData } = useSafeAuth();

  // Generar código de referido basado en el nickname como fallback
  const generateReferralCode = useCallback(() => {
    if (userData?.nickname) {
      // Limpiar nickname: solo letras, números y guiones bajos, convertir a mayúsculas
      const cleanNickname = userData.nickname.replace(/[^A-Z0-9]/g, '').toUpperCase();
      return `CRYPTOFORCE_${cleanNickname}`;
    }
    return 'CRYPTOFORCE_USER';
  }, [userData?.nickname]);

  const fetchReferralStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/referrals/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: userEmail })
      });

      const result = await response.json();

      if (result.success) {
        setStats(result.stats);
      } else {
        setError(result.error || 'Error cargando estadísticas');
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      fetchReferralStats();
    }
  }, [userEmail, fetchReferralStats]);

  const handleCopyCode = async () => {
    const codeToUse = stats?.referral_code || generateReferralCode();
    
    try {
      await navigator.clipboard.writeText(codeToUse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleCopyLink = async () => {
    const codeToUse = stats?.referral_code;
    if (!codeToUse) return;

    const referralLink = `${window.location.origin}/login?ref=${codeToUse}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Error al copiar enlace:', err);
    }
  };

  const handleShare = async () => {
    const codeToUse = stats?.referral_code;
    if (!codeToUse) return;

    const referralLink = `${window.location.origin}/login?ref=${codeToUse}`;
    const shareText = `¡Únete a Crypto Force usando mi código de invitación: ${codeToUse}! ${referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Crypto Force - Código de Invitación',
          text: shareText,
          url: referralLink
        });
      } catch (err) {
        console.error('Error compartiendo:', err);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      try {
        await navigator.clipboard.writeText(shareText);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }
  };

  const handleRefresh = async () => {
    setUpdating(true);
    await fetchReferralStats();
    setUpdating(false);
  };

  const getLevelBadge = (level: number) => {
    if (level === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          🏆 Fundador
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Nivel {level}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#3a3a3a] rounded w-1/3"></div>
          <div className="h-8 bg-[#3a3a3a] rounded w-1/2"></div>
          <div className="h-4 bg-[#3a3a3a] rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 ${className}`}>
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-3 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

      const codeToUse = stats?.referral_code || generateReferralCode();
  const referralLink = `${window.location.origin}/login?ref=${codeToUse}`;

  return (
    <div className={`bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 ${className}`}>
      {/* Header con nivel */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Sistema de Invitaciones
          </h3>
          {stats && getLevelBadge(stats.user_level)}
        </div>
        <button
          onClick={handleRefresh}
          disabled={updating}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          title="Actualizar estadísticas"
        >
          <RefreshCw className={`w-5 h-5 ${updating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Código de referido */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Tu Código de Invitación
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-2">
            <code className="text-white font-mono text-sm">{codeToUse}</code>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-2 bg-[#8A8A8A] hover:bg-[#9A9A9A] text-white rounded-lg transition-colors"
            title="Copiar código"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Enlace de referido */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Enlace a Compartir
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-2">
            <code className="text-white font-mono text-xs break-all">{referralLink}</code>
          </div>
          <button
            onClick={handleCopyLink}
            className="p-2 bg-[#8A8A8A] hover:bg-[#9A9A9A] text-white rounded-lg transition-colors"
            title="Copiar enlace"
          >
            {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Botón de compartir */}
      <div className="mb-6">
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8A8A8A] to-[#9A9A9A] hover:from-[#9A9A9A] hover:to-[#AAAAAA] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Share2 className="w-5 h-5" />
          Compartir Código de Invitación
        </button>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-[#2a2a2a] rounded-lg">
            <div className="text-2xl font-bold text-white">{stats.total_referrals}</div>
            <div className="text-sm text-gray-400">Invitados</div>
          </div>
          
        </div>
      )}

      {/* Referidos recientes */}
      {stats && stats.recent_referrals.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Invitados Recientes
          </h4>
          <div className="space-y-2">
            {stats.recent_referrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">
                    {referral.email}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(referral.date).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <div className="text-green-400 font-medium">
                  Invitado activo
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
        <div className="text-sm text-gray-400">
          <p className="mb-2">💡 <strong>¿Cómo funciona?</strong></p>
          <ul className="space-y-1 text-xs">
            <li>• Comparte tu código con amigos</li>
            <li>• Gana $5 por cada invitado exitoso</li>
            <li>• Sin límite de invitados</li>
            <li>• Comisiones instantáneas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
