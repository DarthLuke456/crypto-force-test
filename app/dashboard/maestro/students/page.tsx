'use client';

import React, { useState, useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext-offline';

export default function MaestroStudentsPage() {
  const { userData, loading } = useSafeAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (userData && !loading) {
      console.log('🔍 [STUDENTS] Cargando estudiantes para maestro:', userData.email);
      // Aquí se cargarían los estudiantes desde la API
      setStudents([]);
    }
  }, [userData, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec4d58]"></div>
      </div>
    );
  }

  if (!userData || (userData.user_level !== 0 && userData.user_level !== 6)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h1>
          <p className="text-gray-400">Solo los Maestros pueden acceder a esta página</p>
          <p className="text-gray-500 text-sm mt-2">Tu nivel actual: {userData?.user_level || 'No definido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Gestión de Estudiantes</h1>
        
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <p className="text-gray-400">Aquí se mostrarán los estudiantes asignados al maestro.</p>
          <p className="text-gray-500 text-sm mt-2">Funcionalidad en desarrollo...</p>
        </div>
      </div>
    </div>
  );
}
