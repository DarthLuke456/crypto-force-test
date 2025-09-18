'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Share2, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface ReferralStats {
  success: boolean;
  referral_code: string;
  registration_link: string;
  total_referrals: number;
  user_level: number;
  recent_referrals: Array<{
    email: string;
    date: string;
  }>;
}

interface ReferralSystemProps {
  userEmail: string;
}

export default function ReferralSystem({ userEmail }: ReferralSystemProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Función para obtener estadísticas de referidos
  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/referrals/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas de referidos');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    if (userEmail) {
      fetchReferralStats();
    }
  }, [userEmail]);

  // Función para copiar al portapapeles
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Función para compartir en redes sociales
  const shareReferralLink = async () => {
    if (stats?.registration_link) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: '¡Únete a Crypto Force!',
            text: `Usa mi código de referido: ${stats.referral_code}`,
            url: stats.registration_link,
          });
        } else {
          // Fallback para navegadores que no soportan Web Share API
          setShowShareModal(true);
        }
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    }
  };

  // Función para abrir enlace de registro
  const openRegistrationLink = () => {
    if (stats?.registration_link) {
      window.open(stats.registration_link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-[#8A8A8A]" />
        <span className="ml-2 text-gray-600">Cargando sistema de referidos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">Error: {error}</span>
        </div>
        <button
          onClick={fetchReferralStats}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!stats || !stats.success) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="text-yellow-700">No se pudieron cargar las estadísticas de referidos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Sistema de Referidos */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#8A8A8A] mb-2">
          🎯 Sistema de Invitaciones Crypto Force
        </h2>
        <p className="text-gray-400">
          Invita a otros usuarios y gana comisiones por cada invitado exitoso
        </p>
      </div>

      {/* Código de Referido Principal */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tu Código de Invitación</h3>
          <span className="px-3 py-1 bg-[#8A8A8A] text-white text-sm rounded-full">
            Nivel {stats.user_level}
          </span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <code className="text-2xl font-mono font-bold text-[#8A8A8A]">
              {stats.referral_code}
            </code>
            <button
              onClick={() => copyToClipboard(stats.referral_code, 'code')}
              className="flex items-center gap-2 px-3 py-2 bg-[#8A8A8A] hover:bg-[#7A7A7A] text-white rounded-lg transition-colors"
            >
              {copied === 'code' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enlace de Registro */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Enlace a Compartir</h4>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={stats.registration_link}
              readOnly
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
            />
            <button
              onClick={() => copyToClipboard(stats.registration_link, 'link')}
              className="px-4 py-3 bg-[#8A8A8A] hover:bg-[#7A7A7A] text-white rounded-lg transition-colors"
            >
              {copied === 'link' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={openRegistrationLink}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={shareReferralLink}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Compartir
          </button>
          <button
            onClick={fetchReferralStats}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas de Referidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#8A8A8A] mb-2">
              {stats.total_referrals}
            </div>
            <div className="text-gray-600">Invitados Totales</div>
          </div>
        </div>
        

        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              Nivel {stats.user_level}
            </div>
            <div className="text-gray-600">Nivel Actual</div>
          </div>
        </div>
      </div>

      {/* Referidos Recientes */}
      {stats.recent_referrals.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Invitados Recientes</h3>
          <div className="space-y-3">
            {stats.recent_referrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{referral.email}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(referral.date).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <div className="text-green-600 font-semibold">
                  Invitado activo
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Compartir (Fallback) */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Compartir Código de Invitación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Invitación
                </label>
                <input
                  type="text"
                  value={stats.referral_code}
                  readOnly
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace a Compartir
                </label>
                <input
                  type="text"
                  value={stats.registration_link}
                  readOnly
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(stats.referral_code, 'code')}
                  className="flex-1 px-4 py-2 bg-[#8A8A8A] hover:bg-[#7A7A7A] text-white rounded-lg transition-colors"
                >
                  Copiar Código
                </button>
                <button
                  onClick={() => copyToClipboard(stats.registration_link, 'link')}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Copiar Enlace
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
