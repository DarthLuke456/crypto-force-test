'use client';

import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface ProtectedUserFieldsProps {
  email: string;
  userLevel: number;
  referralCode: string;
  nickname: string;
}

// Lista de emails de usuarios fundadores protegidos
const PROTECTED_FOUNDER_EMAILS = [
  'coeurdeluke.js@gmail.com',
  'infocryptoforce@gmail.com'
];

export default function ProtectedUserFields({ 
  email, 
  userLevel, 
  referralCode, 
  nickname 
}: ProtectedUserFieldsProps) {
  const isProtectedFounder = PROTECTED_FOUNDER_EMAILS.includes(email.toLowerCase().trim());
  
  if (!isProtectedFounder) {
    return null; // No mostrar protección para usuarios no fundadores
  }

  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Shield className="h-5 w-5 text-orange-400" />
        <h3 className="text-orange-400 font-semibold">Usuario Fundador Protegido</h3>
        <Lock className="h-4 w-4 text-orange-400" />
      </div>
      
      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-center space-x-2">
          <span className="text-orange-400">🔒</span>
          <span><strong>Nivel:</strong> Fundador (Inmutable)</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-orange-400">🔒</span>
          <span><strong>Código de Referido:</strong> {referralCode} (Inmutable)</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-orange-400">🔒</span>
          <span><strong>Nickname:</strong> {nickname} (Inmutable)</span>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-orange-500/5 rounded text-xs text-orange-300">
        ⚠️ Los usuarios fundadores tienen campos protegidos que no pueden ser modificados para mantener la integridad del sistema.
      </div>
    </div>
  );
}

// Hook para verificar si un usuario es fundador protegido
export function useIsProtectedFounder(email: string): boolean {
  return PROTECTED_FOUNDER_EMAILS.includes(email.toLowerCase().trim());
}

// Función para validar si un campo puede ser editado
export function canEditField(email: string, fieldName: string): boolean {
  const isProtectedFounder = PROTECTED_FOUNDER_EMAILS.includes(email.toLowerCase().trim());
  
  if (!isProtectedFounder) {
    return true; // Usuarios no fundadores pueden editar todos los campos
  }
  
  // Campos protegidos para fundadores
  const protectedFields = ['user_level', 'referral_code', 'nickname'];
  return !protectedFields.includes(fieldName);
}
