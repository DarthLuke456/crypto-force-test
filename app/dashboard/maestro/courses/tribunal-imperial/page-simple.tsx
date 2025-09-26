'use client';

import { useSafeAuth } from '@/context/AuthContext-working';
import { canUserAccessTribunal } from '@/lib/tribunal/permissions';

export default function TribunalImperialPageSimple() {
  const { userData, loading, isReady } = useSafeAuth();

  // Logs de diagnóstico
  console.log('🔍 Tribunal Imperial Simple - Debug de acceso:', {
    isReady,
    loading,
    userData: userData ? {
      email: userData.email,
      user_level: userData.user_level,
      nickname: userData.nickname
    } : null,
    canAccess: userData ? canUserAccessTribunal(userData.user_level) : false,
    timestamp: new Date().toISOString()
  });

  // Si está cargando
  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white mt-4">Verificando acceso de maestro...</p>
        </div>
      </div>
    );
  }

  // Si no hay datos de usuario
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error de Autenticación</h1>
          <p className="text-[#a0a0a0] mb-6">No se pudo cargar la información del usuario</p>
        </div>
      </div>
    );
  }

  // Si no tiene acceso
  if (!canUserAccessTribunal(userData.user_level)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
          <p className="text-[#a0a0a0] mb-6">Tu nivel de usuario no tiene acceso al Tribunal Imperial</p>
          <p className="text-[#6a6a6a] text-sm">Tu nivel actual: {userData.user_level}</p>
          <p className="text-[#6a6a6a] text-sm">Niveles permitidos: 0 (Maestro Fundador), 5 (Darth), 6 (Maestro)</p>
        </div>
      </div>
    );
  }

  // Si tiene acceso, mostrar contenido
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tribunal Imperial - Acceso Exitoso</h1>
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">¡Bienvenido al Tribunal Imperial!</h2>
          <p className="text-[#a0a0a0] mb-4">
            Has accedido correctamente como {userData.nickname} (Nivel {userData.user_level})
          </p>
          <p className="text-[#a0a0a0]">
            El sistema de inyección de contenido está funcionando correctamente.
          </p>
        </div>
      </div>
    </div>
  );
}
