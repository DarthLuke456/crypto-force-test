'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Manejando callback de autenticación de Supabase...');
        
        // Obtener la sesión actual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error obteniendo sesión:', error);
          router.push('/login/signin?error=session_error');
          return;
        }

        if (!session?.user) {
          console.log('No hay usuario en sesión');
          router.push('/login/signin?error=no_user');
          return;
        }

        console.log('Usuario autenticado:', session.user.email);

        // Verificar si el usuario existe en la tabla de perfiles
        const { data: existingProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error verificando perfil:', profileError);
          router.push('/login/signin?error=profile_error');
          return;
        }

        // Si el usuario no existe, crear su perfil
        if (!existingProfile) {
          console.log('Creando nuevo perfil para usuario:', session.user.email);
          
          const { error: createError } = await supabase
            .from('users')
            .insert({
              email: session.user.email,
              uid: session.user.id,
              nickname: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
              user_level: 1, // Nivel por defecto
              referral_code: `CRYPTOFORCE_${session.user.user_metadata?.full_name?.replace(/\s+/g, '_').toUpperCase() || 'USER'}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (createError) {
            console.error('Error creando perfil:', createError);
            router.push('/login/signin?error=create_profile_error');
            return;
          }
        }

        // Redirigir al selector de dashboard
        console.log('Redirigiendo al selector de dashboard...');
        router.push('/login/dashboard-selection');

      } catch (error) {
        console.error('Error en auth callback:', error);
        router.push('/login/signin?error=callback_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-white mt-4">Procesando autenticación...</p>
      </div>
    </div>
  );
}
