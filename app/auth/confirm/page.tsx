'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function EmailConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔍 [CONFIRM] Iniciando confirmación de email...');
        
        // Método 1: Intentar obtener sesión actual (método más confiable de Supabase)
        console.log('🔍 [CONFIRM] Método 1: Verificando sesión actual...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user && !sessionError) {
          console.log('✅ [CONFIRM] Sesión encontrada:', sessionData.session.user.email);
          
          // Usuario ya está autenticado, crear perfil si no existe
          await createUserProfileIfNeeded(sessionData.session.user);
          
          setStatus('success');
          setMessage('¡Email confirmado exitosamente!');
          
          setTimeout(() => {
            router.push('/login/dashboard-selection');
          }, 2000);
          return;
        }

        // Método 2: Extraer token de URL (método tradicional)
        console.log('🔍 [CONFIRM] Método 2: Extrayendo token de URL...');
        
        let token = null;
        let type = 'email';
        
        // Buscar en query params
        token = searchParams.get('token') || searchParams.get('access_token');
        type = searchParams.get('type') || 'email';
        
        // Buscar en hash
        if (!token && typeof window !== 'undefined') {
          const fullUrl = window.location.href;
          const hash = window.location.hash;
          
          console.log('🔍 [CONFIRM] URL completa:', fullUrl);
          console.log('🔍 [CONFIRM] Hash:', hash);
          
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            token = hashParams.get('access_token') || 
                   hashParams.get('token') || 
                   hashParams.get('confirmation_token');
            type = hashParams.get('type') || 'email';
          }
          
          // Método alternativo: buscar en toda la URL
          if (!token) {
            const urlMatch = fullUrl.match(/[?&#](?:access_token|token|confirmation_token)=([^&#]+)/);
            if (urlMatch) {
              token = urlMatch[1];
            }
          }
        }
        
        const debugData = {
          method1_session: !!sessionData?.session,
          method1_error: sessionError?.message,
          method2_token: !!token,
          searchParams: Object.fromEntries(searchParams.entries()),
          hash: typeof window !== 'undefined' ? window.location.hash : null,
          fullUrl: typeof window !== 'undefined' ? window.location.href : null
        };
        
        setDebugInfo(debugData);
        console.log('🔍 [CONFIRM] Debug info:', debugData);
        
        if (!token) {
          console.error('❌ [CONFIRM] No se encontró token');
          setStatus('error');
          setMessage('Token de confirmación no encontrado. Revisa el enlace del email.');
          return;
        }

        // Método 3: Verificar token con verifyOtp
        console.log('🔍 [CONFIRM] Método 3: Verificando token...');
        
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any
        });

        if (error) {
          console.error('❌ [CONFIRM] Error verificando token:', error);
          setStatus('error');
          setMessage(`Error verificando token: ${error.message}`);
          return;
        }

        if (data.user) {
          console.log('✅ [CONFIRM] Email confirmado para:', data.user.email);
          
          await createUserProfileIfNeeded(data.user);
          
          setStatus('success');
          setMessage('¡Email confirmado exitosamente!');
          
          setTimeout(() => {
            router.push('/login/dashboard-selection');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('No se pudo confirmar el email');
        }

      } catch (error) {
        console.error('❌ [CONFIRM] Error inesperado:', error);
        setStatus('error');
        setMessage(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  const createUserProfileIfNeeded = async (user: any) => {
    try {
      // Verificar si el usuario existe
      const { data: existingProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error verificando perfil:', profileError);
        return;
      }

      // Si no existe, crear perfil
      if (!existingProfile) {
        console.log('🔍 Creando perfil para:', user.email);
        
        const { error: createError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            uid: user.id,
            nickname: user.user_metadata?.nickname || user.email?.split('@')[0] || 'Usuario',
            nombre: user.user_metadata?.nombre || '',
            apellido: user.user_metadata?.apellido || '',
            user_level: 1,
            referral_code: `CRYPTOFORCE${user.email?.split('@')[0]?.toUpperCase() || 'USER'}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createError) {
          console.error('❌ Error creando perfil:', createError);
        } else {
          console.log('✅ Perfil creado exitosamente');
        }
      }
    } catch (error) {
      console.error('❌ Error en createUserProfileIfNeeded:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-[#ec4d58] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Confirmando Email</h2>
            <p className="text-[#8a8a8a]">Por favor espera mientras verificamos tu email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">¡Email Confirmado!</h2>
            <p className="text-[#8a8a8a] mb-4">{message}</p>
            <p className="text-sm text-[#6a6a6a]">Redirigiendo al dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Error de Confirmación</h2>
            <p className="text-[#8a8a8a] mb-4">{message}</p>
            
            {/* Información de debug */}
            <details className="text-left mb-4">
              <summary className="text-sm text-gray-400 cursor-pointer">Debug Info</summary>
              <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
            
            <div className="space-y-2">
              <button
                onClick={() => router.push('/login/signin')}
                className="w-full px-6 py-2 bg-[#ec4d58] hover:bg-[#d43d48] text-white rounded-lg transition-colors"
              >
                Volver al Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Intentar de Nuevo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EmailConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-[#8a8a8a] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Cargando</h2>
          <p className="text-[#a0a0a0]">Procesando confirmación...</p>
        </div>
      </div>
    }>
      <EmailConfirmContent />
    </Suspense>
  );
}
