'use client';

import { useSafeAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import FeedbackButton from '@/components/feedback/FeedbackButton';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function HomePage() {
  const { user, loading, isReady } = useSafeAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si hay un access token en la URL (después de confirmar email)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      console.log('🔑 HomePage: Access token detectado en URL, procesando...');
      
      // Extraer el access token
      const accessToken = hash.split('access_token=')[1]?.split('&')[0];
      if (accessToken) {
        console.log('🔑 HomePage: Token extraído, redirigiendo a login...');
        // Redirigir al login para procesar el token
        window.location.href = '/login/signin';
        return;
      }
    }

    // Mostrar contenido después de un breve delay para efecto dramático
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen bg-[#0a0a0a] relative overflow-hidden"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#fafafa #121212'
        }}
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0f0f0f]"></div>
        
        {/* Minimal geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ec4d58] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ec4d58] rounded-full blur-3xl"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Title section - Updated with TEST styling - Vercel Cache Buster 2024-12-19-1734567890 */}
            <div className="mb-16">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
                <span className="text-white">CRYPTOFORCE</span> <span className="text-red-500 font-bold text-6xl">- TEST</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#ec4d58] to-[#d93c47] mx-auto mb-8"></div>
              <p className="text-xl sm:text-2xl text-[#8a8a8a] font-light max-w-2xl mx-auto">
                Trading Team | Criptomonedas e Inversiones
              </p>
            </div>

            {/* Darth Luke invitation message */}
            <div className="mb-16 max-w-4xl mx-auto">
              <div className="bg-[#121212] border border-[#333] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center mb-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ec4d58] mb-4 sm:mb-0 sm:mr-6">
                    <Image
                      src="/images/avt.jpg"
                      alt="Darth Luke"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#fafafa] mb-2">
                      INVITACIÓN DEL DESARROLLADOR
                    </h2>
                    <p className="text-[#8a8a8a] text-sm">Darth Luke, Desarrollador Principal</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <p className="text-lg text-[#fafafa] leading-relaxed">
                    Saludos, <span className="text-[#ec4d58] font-semibold">Darth Luke</span> te invita a explorar esta plataforma en desarrollo. 
                    Tu feedback es <span className="text-[#ec4d58] font-semibold">crucial</span> para forjar una herramienta más poderosa.
                  </p>
                  
                  <div className="bg-[#1a1a1a] border-l-4 border-[#ec4d58] p-6 rounded-r-lg">
                    <blockquote className="text-[#fafafa] text-lg italic leading-relaxed">
                      "Cada opinión es un paso hacia la perfección. Tu experiencia como usuario 
                      <span className="text-[#ec4d58] font-semibold"> moldea el futuro</span> de esta plataforma."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mb-16">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="group relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#ec4d58] to-[#d93c47] text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ec4d58]/30"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-3 text-xl">🚀</span>
                    INICIAR JORNADA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d93c47] to-[#ec4d58] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => window.location.href = '/login/signin'}
                  className="group relative w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-[#ec4d58] text-[#fafafa] rounded-xl font-bold text-lg transition-all duration-300 hover:bg-[#ec4d58] hover:text-white hover:scale-105 hover:shadow-2xl hover:shadow-[#ec4d58]/30"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-3 text-xl">🛡️</span>
                    ACCESO AUTORIZADO
                  </span>
                </button>
              </div>
              
              {/* About Us button */}
              <div className="mt-8">
                <button
                  onClick={() => window.location.href = '/about'}
                  className="group relative px-8 py-3 bg-[#1a1a1a] border border-[#333] text-[#8a8a8a] rounded-xl font-medium text-base transition-all duration-300 hover:bg-[#2a2a2a] hover:text-[#fafafa] hover:border-[#ec4d58] hover:shadow-lg hover:shadow-[#ec4d58]/20"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2 text-lg">✨</span>
                    About Us
                  </span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 text-[#8a8a8a]">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ec4d58] rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Seguro</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ec4d58] rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Rápido</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#ec4d58] rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Preciso</span>
                </div>
              </div>
            </div>

            {/* Version info */}
            <div className="text-center">
              <p className="text-[#8a8a8a] text-sm">
                Plataforma en desarrollo • Versión Beta
              </p>
            </div>
          </div>
        </div>

        {/* Subtle border effects */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ec4d58] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ec4d58] to-transparent"></div>
        
        {/* Feedback button */}
        <FeedbackButton />
      </div>
    </ErrorBoundary>
  );
}