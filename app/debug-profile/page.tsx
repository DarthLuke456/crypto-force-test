'use client';

import React, { useState } from 'react';
import { useSafeAuth } from '@/context/AuthContext-offline';

export default function DebugProfilePage() {
  const { userData } = useSafeAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDatabaseTest = async () => {
    if (!userData?.email) {
      setError('No hay datos de usuario disponibles');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Debug Profile: Iniciando test de base de datos');
      
      const response = await fetch('/api/profile/test-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          testField: 'nickname'
        })
      });

      const data = await response.json();
      console.log('🔍 Debug Profile: Respuesta del test:', data);

      if (response.ok) {
        setTestResults(data);
      } else {
        setError(data.error || 'Error en el test');
      }
    } catch (err) {
      console.error('❌ Debug Profile: Error en test:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const testProfileUpdate = async () => {
    if (!userData?.email) {
      setError('No hay datos de usuario disponibles');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Debug Profile: Probando actualización de perfil');
      
      const testData = {
        email: userData.email,
        nombre: 'Usuario Test',
        apellido: 'Crypto Force Test',
        nickname: `test_${Date.now()}`,
        movil: '123456789',
        exchange: 'Test Exchange',
        avatar: '/images/default-avatar.png',
        user_level: userData.user_level,
        birthdate: '1990-01-01',
        country: 'Test Country',
        bio: 'Test bio'
      };

      const response = await fetch('/api/profile/update-offline', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      console.log('🔍 Debug Profile: Respuesta de actualización:', data);

      if (response.ok) {
        setTestResults({
          success: true,
          message: 'Actualización de perfil exitosa',
          data: data
        });
      } else {
        setError(data.error || 'Error en la actualización');
      }
    } catch (err) {
      console.error('❌ Debug Profile: Error en actualización:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#8A8A8A] mb-8">
          Debug Profile Persistence
        </h1>

        {/* Current User Data */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Datos Actuales del Usuario</h2>
          {userData ? (
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Nombre:</strong> {userData.nombre}</p>
              <p><strong>Apellido:</strong> {userData.apellido}</p>
              <p><strong>Nickname:</strong> {userData.nickname}</p>
              <p><strong>Móvil:</strong> {userData.movil}</p>
              <p><strong>Exchange:</strong> {userData.exchange}</p>
              <p><strong>Avatar:</strong> {userData.avatar}</p>
              <p><strong>User Level:</strong> {userData.user_level}</p>
              <p><strong>Referral Code:</strong> {userData.referral_code}</p>
            </div>
          ) : (
            <p className="text-gray-400">No hay datos de usuario disponibles</p>
          )}
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Test de Base de Datos</h3>
            <p className="text-gray-400 text-sm mb-4">
              Prueba la conectividad y permisos de la base de datos
            </p>
            <button
              onClick={runDatabaseTest}
              disabled={loading}
              className="px-4 py-2 bg-[#8A8A8A] hover:bg-[#7a7a7a] disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {loading ? 'Ejecutando...' : 'Ejecutar Test'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Test de Actualización</h3>
            <p className="text-gray-400 text-sm mb-4">
              Prueba la actualización de datos del perfil
            </p>
            <button
              onClick={testProfileUpdate}
              disabled={loading}
              className="px-4 py-2 bg-[#ec4d58] hover:bg-[#d43d48] disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {loading ? 'Actualizando...' : 'Probar Actualización'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-semibold">Error:</p>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resultados del Test</h3>
            <pre className="bg-[#0a0a0a] rounded-lg p-4 text-sm text-gray-300 overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Instrucciones</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>1. <strong>Test de Base de Datos:</strong> Verifica que la conexión a la base de datos funcione correctamente</p>
            <p>2. <strong>Test de Actualización:</strong> Prueba si los datos se pueden actualizar en la base de datos</p>
            <p>3. <strong>Revisa los logs:</strong> Abre la consola del navegador para ver logs detallados</p>
            <p>4. <strong>Ejecuta las consultas SQL:</strong> Usa los archivos debug_profile_persistence.sql y fix_profile_persistence.sql en Supabase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
