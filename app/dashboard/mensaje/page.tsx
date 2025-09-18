'use client';

import Link from 'next/link';
import { MailOpen, ArrowLeft, Star, GraduationCap, TrendingUp, Users, Trophy, MessageCircle, Share2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSafeAuth } from '@/context/AuthContext';

export default function MensajeBienvenida() {
  const { userData, isReady } = useSafeAuth();

  // Mostrar loading mientras no esté listo
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#121212] text-white pt-8 md:pt-20">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#ec4d58] to-[#d63d47] rounded-full mb-4 md:mb-6">
            <MessageCircle className="text-white text-2xl md:text-3xl" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            ¡Bienvenido{userData?.nickname ? (
              <>
                <span className="text-white">, </span>
                <span className="text-[#ec4d58]">{userData.nickname}</span>
              </>
            ) : ''} a Crypto Force!
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {userData?.nickname ? `${userData.nickname}, tu` : 'Tu'} viaje hacia el dominio del trading comienza aquí
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#ec4d58] mb-6">
              {userData?.nickname ? `¡Hola ${userData.nickname}!` : 'Mensaje de Bienvenida'}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {userData?.nickname ? `${userData.nickname}, has` : 'Has'} dado el primer paso hacia una nueva dimensión del trading. En Crypto Force, 
                no solo aprenderás las técnicas más avanzadas, sino que también desarrollarás 
                la mentalidad y disciplina necesarias para convertirte en un trader profesional.
              </p>
              
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Nuestro sistema de aprendizaje está diseñado para llevarte desde los fundamentos 
                básicos hasta las estrategias más sofisticadas, todo mientras construyes una 
                base sólida en análisis técnico, fundamental y gestión de riesgo.
              </p>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {userData?.nickname ? `${userData.nickname}, recuerda` : 'Recuerda'}: el éxito en el trading no se logra de la noche a la mañana. 
                Es un proceso de aprendizaje continuo, práctica constante y mejora constante. 
                Estamos aquí para guiarte en cada paso del camino.
              </p>

              <p className="text-lg text-[#ec4d58] mb-8 leading-relaxed font-medium">
                ¡Te damos la bienvenida oficialmente a la familia Crypto Force! 🚀
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-[#232323] rounded-xl">
              <div className="w-12 h-12 bg-[#ec4d58] rounded-lg flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aprendizaje Estructurado</h3>
              <p className="text-gray-300 text-sm">
                Módulos organizados progresivamente para un aprendizaje efectivo
              </p>
            </div>

            <div className="text-center p-6 bg-[#232323] rounded-xl">
              <div className="w-12 h-12 bg-[#ec4d58] rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Análisis Técnico</h3>
              <p className="text-gray-300 text-sm">
                Herramientas y técnicas profesionales de análisis de mercados
              </p>
            </div>

            <div className="text-center p-6 bg-[#232323] rounded-xl">
              <div className="w-12 h-12 bg-[#ec4d58] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Comunidad</h3>
              <p className="text-gray-300 text-sm">
                Conecta con otros traders y comparte experiencias
              </p>
            </div>


          </div>

          {/* Next Steps */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#ec4d58] mb-4">¿Qué sigue?</h3>
            <p className="text-gray-300 mb-6">
              {userData?.nickname ? `${userData.nickname}, comienza` : 'Comienza'} explorando los módulos disponibles en tu dashboard. 
              Te recomendamos empezar con los módulos teóricos para construir una base sólida.
            </p>
            <Link
              href="/dashboard/iniciado"
              className="inline-flex items-center px-6 py-3 bg-[#ec4d58] hover:bg-[#d63d47] text-white rounded-lg transition-colors font-semibold"
            >
              {userData?.nickname ? `Comenzar mi viaje` : 'Ir al Dashboard'}
              <ArrowLeft className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Sección de Invitación a Compartir */}
        <div className="mt-12 text-center bg-[#1a1a1a] rounded-xl p-8 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">
            ¡Ayúdanos a Transformar Más Vidas!
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Tu viaje en Crypto Force es solo el comienzo. Si crees en el poder de la educación financiera, 
            te invitamos a compartir esta oportunidad con quienes más lo necesitan. Juntos, podemos construir 
            una comunidad más fuerte y empoderada.
          </p>
          <Link
            href="/login/invitaciones"
            className="inline-flex items-center px-6 py-3 bg-[#ec4d58] hover:bg-[#d63d47] text-white rounded-lg transition-colors font-semibold"
          >
            <Share2 className="mr-2" />
            Compartir Crypto Force
          </Link>
        </div>

      </div>
    </div>
  );
} 