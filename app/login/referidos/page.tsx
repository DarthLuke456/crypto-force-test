'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, BookOpen, CheckCircle, Share2, Heart, Target, TrendingUp } from 'lucide-react';
import ReferralStats from '@/components/ui/ReferralStats';
import { useSafeAuth } from '@/context/AuthContext';
import { SidebarProvider, useSidebar } from '@/components/sidebar/SidebarContext';
import Sidebar from '@/components/sidebar/Sidebar';

function ReferidosContent() {
  const router = useRouter();
  const { userData, isReady } = useSafeAuth();
  const { isExpanded, toggleSidebar } = useSidebar();

  // Mostrar loading mientras no esté listo
  if (!isReady || !userData?.email) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white">
      {/* Sidebar - Siempre visible */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-500 ease-in-out flex flex-col min-h-screen ${
        isExpanded ? 'ml-72' : 'ml-20'
      }`}>
        <main className="flex-1 overflow-auto md:pl-6 md:pr-6 transition-all duration-500 ease-in-out">
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#ec4d58] to-[#d43d47] rounded-full mx-auto mb-6 flex items-center justify-center">
                <GraduationCap size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Comparte Conocimiento, {userData.nickname || userData.nombre}
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Ayuda a tus amigos y familiares a transformar su futuro financiero a través de la educación. 
                El verdadero valor está en el conocimiento que compartimos.
              </p>
            </div>

            {/* Dynamic Referral Stats */}
            <ReferralStats userEmail={userData.email} className="mb-8" />

            {/* Cómo Funciona la Educación Financiera */}
            <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/10 mb-8">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                ¿Cómo Transformamos Vidas a Través de la Educación?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#ec4d58]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Share2 size={24} className="text-[#ec4d58]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Comparte Conocimiento</h4>
                  <p className="text-white/60">
                    Invita a tus seres queridos a descubrir el poder de la educación financiera
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#ec4d58]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BookOpen size={24} className="text-[#ec4d58]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Aprenden y Crecen</h4>
                  <p className="text-white/60">
                    Acceden a una educación de calidad que transforma su relación con el dinero
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#ec4d58]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp size={24} className="text-[#ec4d58]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Construimos Juntos</h4>
                  <p className="text-white/60">
                    Creamos una comunidad de personas empoderadas financieramente
                  </p>
                </div>
              </div>
            </div>

            {/* Impacto de la Educación Financiera */}
            <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">
                El Poder de Compartir Educación Financiera
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#ec4d58]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart size={16} className="text-[#ec4d58]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Transforma Vidas</h4>
                    <p className="text-white/60">
                      Cada persona que invitas obtiene las herramientas para mejorar su futuro financiero
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#ec4d58]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users size={16} className="text-[#ec4d58]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Construye Comunidad</h4>
                    <p className="text-white/60">
                      Formas parte de una red de personas comprometidas con su crecimiento financiero
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#ec4d58]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target size={16} className="text-[#ec4d58]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Crea Impacto Real</h4>
                    <p className="text-white/60">
                      Contribuyes a democratizar el acceso a educación financiera de calidad
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#ec4d58]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <GraduationCap size={16} className="text-[#ec4d58]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Aprende Enseñando</h4>
                    <p className="text-white/60">
                      Al compartir conocimiento, refuerzas tu propio aprendizaje y comprensión
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ReferidosPage() {
  return (
    <SidebarProvider>
      <ReferidosContent />
    </SidebarProvider>
  );
}
