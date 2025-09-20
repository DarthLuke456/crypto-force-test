'use client';

import { AuthProvider } from '@/context/AuthContext-simple';

interface ClientAuthProviderProps {
  children: React.ReactNode;
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  console.log('🔍 [CLIENT-AUTH] ClientAuthProvider renderizando');
  return <AuthProvider>{children}</AuthProvider>;
} 