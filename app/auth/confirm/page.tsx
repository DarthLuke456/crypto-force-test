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

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔍 Procesando confirmación de email...');
        
        // Obtener parámetros de la URL (Supabase usa hash # en lugar de query params)
        let token = searchParams.get('token');
        let type = searchParams.get('type');
        
        // Si no se encuentra en query params, buscar en el hash
        if (!token && typeof window !== 'undefined') {
          const hash = window.location.hash;
          console.log('🔍 Hash de URL:', hash);
          
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            token = hashParams.get('access_token') || hashParams.get('token');
            type = hashParams.get('type') || 'email';
          }
        }
        
        console.log('🔍 Parámetros recibidos:', { token: !!token, type });
        
        if (!token) {
          console.error('❌ No se encontró token en la URL');
          setStatus('error');
          setMessage('Token de confirmación no encontrado');
          return;
        }

        // Verificar el token con Supabase usando verifyOtp
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any
        });

        if (error) {
          console.error('❌ Error verificando token:', error);
          setStatus('error');
          setMessage('Token inválido o expirado');
          return;
        }

        if (data.user) {
          console.log('✅ Email confirmado exitosamente para:', data.user.email);
          
          // Verificar si el usuario existe en la tabla users
          const { data: existingProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('email', data.user.email)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('❌ Error verificando perfil:', profileError);
            setStatus('error');
            setMessage('Error verificando perfil de usuario');
            return;
          }

          // Si el usuario no existe, crear su perfil
          if (!existingProfile) {
            console.log('🔍 Creando perfil para usuario confirmado:', data.user.email);
            
            const { error: createError } = await supabase
              .from('users')
              .insert({
                email: data.user.email,
                uid: data.user.id,
                nickname: data.user.user_metadata?.nickname || data.user.email?.split('@')[0] || 'Usuario',
                nombre: data.user.user_metadata?.nombre || '',
                apellido: data.user.user_metadata?.apellido || '',
                user_level: 1,
                referral_code: `CRYPTOFORCE-${Date.now().toString(36).toUpperCase()}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (createError) {
              console.error('❌ Error creando perfil:', createError);
              setStatus('error');
              setMessage('Error creando perfil de usuario');
              return;
            }
          }

          setStatus('success');
          setMessage('¡Email confirmado exitosamente!');
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            router.push('/login/dashboard-selection');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('No se pudo confirmar el email');
        }

      } catch (error) {
        console.error('❌ Error inesperado:', error);
        setStatus('error');
        setMessage('Error inesperado al confirmar email');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

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
            <button
              onClick={() => router.push('/login/signin')}
              className="px-6 py-2 bg-[#ec4d58] hover:bg-[#d43d48] text-white rounded-lg transition-colors"
            >
              Volver al Login
            </button>
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
