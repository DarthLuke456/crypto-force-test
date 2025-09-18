'use client';

import React, { useState } from 'react';
import { Copy, Check, Users, Gift } from 'lucide-react';

interface ReferralCodeProps {
  code: string;
  referrals: number;
  earnings: number;
}

export default function ReferralCode({ code, referrals, earnings }: ReferralCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const [referralLink, setReferralLink] = useState('');

  // Establecer el enlace de referido después del montaje
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setReferralLink(`${window.location.origin}/login?ref=${code}`);
    }
  }, [code]);

  return (
    <div className="bg-[#1e2028]/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-[#FFD447]" />
        <h3 className="text-lg font-semibold text-white">Mi Código de Invitación</h3>
      </div>

      {/* Código de referido */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Tu código
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#2a2d36] border border-white/20 rounded-lg px-4 py-3">
              <code className="text-[#FFD447] font-mono text-lg font-bold">{code}</code>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-[#2a2d36] border border-white/20 rounded-lg hover:bg-[#3a3d46] transition-colors"
            >
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-white/60" />}
            </button>
          </div>
        </div>

        {/* Enlace de referido */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Enlace de referido
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#2a2d36] border border-white/20 rounded-lg px-4 py-3 overflow-hidden">
              <code className="text-white/80 font-mono text-sm break-all">{referralLink}</code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-4 py-3 bg-[#2a2d36] border border-white/20 rounded-lg hover:bg-[#3a3d46] transition-colors"
            >
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-white/60" />}
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-[#2a2d36]/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users size={16} className="text-[#FFD447]" />
              <span className="text-white/60 text-sm">Invitados</span>
            </div>
            <div className="text-2xl font-bold text-white">{referrals}</div>
          </div>
          
          <div className="bg-[#2a2d36]/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift size={16} className="text-[#FFD447]" />
              <span className="text-white/60 text-sm">Ganancias</span>
            </div>
            <div className="text-2xl font-bold text-[#FFD447]">${earnings}</div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-[#2a2d36]/30 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">¿Cómo funciona?</h4>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Comparte tu código con amigos y familiares</li>
            <li>• Cuando se registren usando tu código, ambos obtienen beneficios</li>
            <li>• Ganas comisiones por cada invitado activo</li>
            <li>• Los beneficios aumentan con más invitados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
