'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('vision');

  const tabs = [
    { id: 'vision', label: 'Visión', icon: '🌟' },
    { id: 'mission', label: 'Misión', icon: '🎯' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
    { id: 'team', label: 'Equipo', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]"></div>
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ec4d58] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ec4d58] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-[#121212]/80 backdrop-blur-sm border-b border-[#333] sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-start">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-[#8a8a8a] hover:text-[#fafafa] transition-colors duration-200"
              >
                <span className="mr-2">←</span>
                Volver
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-[#fafafa] leading-tight">
              CRYPTO FORCE
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#ec4d58] to-[#d93c47] mx-auto mb-8"></div>
            <p className="text-xl text-[#8a8a8a] max-w-3xl mx-auto">
              Revolucionando el trading de criptomonedas a través de la educación, 
              la tecnología y una comunidad comprometida con el éxito.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#ec4d58] text-white shadow-lg shadow-[#ec4d58]/30'
                      : 'bg-[#1a1a1a] text-[#8a8a8a] hover:text-[#fafafa] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-[#121212] border border-[#333] rounded-2xl p-8 shadow-2xl">
              {activeTab === 'vision' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#fafafa] mb-4">Nuestra Visión</h2>
                    <p className="text-lg text-[#8a8a8a] max-w-4xl mx-auto">
                      Ser la plataforma líder en educación y trading de criptomonedas, 
                      democratizando el acceso al conocimiento financiero y creando una 
                      comunidad global de traders exitosos.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#ec4d58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#fafafa] mb-2">Global</h3>
                      <p className="text-[#8a8a8a]">Alcance mundial con impacto local</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#ec4d58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#fafafa] mb-2">Innovación</h3>
                      <p className="text-[#8a8a8a]">Tecnología de vanguardia en trading</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#ec4d58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💎</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#fafafa] mb-2">Excelencia</h3>
                      <p className="text-[#8a8a8a]">Calidad superior en cada aspecto</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mission' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#fafafa] mb-4">Nuestra Misión</h2>
                    <p className="text-lg text-[#8a8a8a] max-w-4xl mx-auto">
                      Empoderar a cada persona con las herramientas, conocimientos y 
                      comunidad necesaria para dominar el mundo de las criptomonedas 
                      y construir un futuro financiero sólido.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-[#1a1a1a] border-l-4 border-[#ec4d58] p-6 rounded-r-lg">
                      <h3 className="text-xl font-bold text-[#fafafa] mb-2">Educación Práctica</h3>
                      <p className="text-[#8a8a8a]">
                        Aprende haciendo con simuladores reales, casos prácticos y 
                        seguimiento de mercado en tiempo real.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border-l-4 border-[#ec4d58] p-6 rounded-r-lg">
                      <h3 className="text-xl font-bold text-[#fafafa] mb-2">Comunidad Meritocrática</h3>
                      <p className="text-[#8a8a8a]">
                        Sistema de niveles basado en conocimiento real y performance, 
                        no solo en tiempo de membresía.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border-l-4 border-[#ec4d58] p-6 rounded-r-lg">
                      <h3 className="text-xl font-bold text-[#fafafa] mb-2">Tecnología Avanzada</h3>
                      <p className="text-[#8a8a8a]">
                        Herramientas de trading, análisis y gestión de portfolio 
                        de nivel institucional para todos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#fafafa] mb-4">Roadmap Estratégico</h2>
                    <p className="text-lg text-[#8a8a8a] max-w-4xl mx-auto">
                      Nuestro plan de desarrollo está diseñado para crear la plataforma 
                      de trading más completa y educativa del mercado.
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Fase 1 */}
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-[#ec4d58] rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#fafafa]">Fase 1: Estabilización (1-3 meses)</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-[#fafafa] mb-2">Optimización Técnica</h4>
                          <ul className="text-[#8a8a8a] space-y-1 text-sm">
                            <li>• Migración completa a Next.js Image</li>
                            <li>• Implementación de lazy loading</li>
                            <li>• Optimización de performance</li>
                            <li>• Testing automatizado</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#fafafa] mb-2">Funcionalidades Core</h4>
                          <ul className="text-[#8a8a8a] space-y-1 text-sm">
                            <li>• Sistema de notificaciones</li>
                            <li>• Dashboard analytics avanzado</li>
                            <li>• Chat interno del equipo</li>
                            <li>• Onboarding interactivo</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Fase 2 */}
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-[#ec4d58] rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#fafafa]">Fase 2: Crecimiento (3-6 meses)</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-[#fafafa] mb-2">Trading Avanzado</h4>
                          <ul className="text-[#8a8a8a] space-y-1 text-sm">
                            <li>• Simulador de trading real</li>
                            <li>• Portfolio tracker personal</li>
                            <li>• Análisis técnico avanzado</li>
                            <li>• Social trading</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#fafafa] mb-2">Monetización</h4>
                          <ul className="text-[#8a8a8a] space-y-1 text-sm">
                            <li>• Planes premium por nivel</li>
                            <li>• Marketplace de estrategias</li>
                            <li>• Cursos exclusivos</li>
                            <li>• Sistema de recompensas</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Fase 3 */}
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-[#ec4d58] rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#fafafa]">Fase 3: Expansión (6-12 meses)</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-[#fafafa] mb-2">Plataforma Integral</h4>
                          <ul className="text-[#8a8a8a] space-y-1 text-sm">
                            <li>• Aplicación móvil nativa</li>
                            <li>• Desktop app</li>
                            <li>• API pública</li>
                            <li>• Solución white-label</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#fafafa] mb-2">Inteligencia Artificial</h4>
                          <ul className="text-[#8a8a8a] space-y-1 text-sm">
                            <li>• AI Trading Assistant</li>
                            <li>• Reconocimiento de patrones</li>
                            <li>• Análisis de sentimiento</li>
                            <li>• Predicciones ML</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#fafafa] mb-4">Nuestro Equipo</h2>
                    <p className="text-lg text-[#8a8a8a] max-w-4xl mx-auto">
                      Un equipo de desarrolladores, traders y educadores apasionados 
                      por revolucionar la industria de las criptomonedas.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ec4d58] mr-4">
                          <Image
                            src="/images/avt.jpg"
                            alt="Darth Luke"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#fafafa]">Darth Luke</h3>
                          <p className="text-[#ec4d58] font-semibold">Desarrollador Principal</p>
                        </div>
                      </div>
                      <p className="text-[#8a8a8a]">
                        Arquitecto de la plataforma y visionario detrás de Crypto Force. 
                        Con más de 10 años de experiencia en desarrollo de software y 
                        trading algorítmico.
                      </p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-[#ec4d58]/20 rounded-full flex items-center justify-center mr-4">
                          <span className="text-2xl">👥</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#fafafa]">Comunidad</h3>
                          <p className="text-[#ec4d58] font-semibold">Traders y Educadores</p>
                        </div>
                      </div>
                      <p className="text-[#8a8a8a]">
                        Una comunidad global de traders experimentados, educadores 
                        financieros y desarrolladores que contribuyen al crecimiento 
                        y evolución de la plataforma.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1a1a1a] border-l-4 border-[#ec4d58] p-6 rounded-r-lg">
                    <h3 className="text-xl font-bold text-[#fafafa] mb-2">¿Quieres unirte al equipo?</h3>
                    <p className="text-[#8a8a8a] mb-4">
                      Estamos siempre buscando talento excepcional para unirse a nuestra misión. 
                      Si eres un trader experimentado, desarrollador apasionado o educador 
                      financiero, queremos conocerte.
                    </p>
                    <button
                      onClick={() => window.location.href = '/login/signin'}
                      className="bg-[#ec4d58] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93c47] transition-colors duration-200"
                    >
                      Únete a la Fuerza
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="bg-[#121212] border border-[#333] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-[#fafafa] mb-4">
                ¿Listo para comenzar tu jornada?
              </h2>
              <p className="text-[#8a8a8a] mb-6 max-w-2xl mx-auto">
                Únete a la comunidad de traders más avanzada y comienza a construir 
                tu futuro financiero hoy mismo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="bg-[#ec4d58] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#d93c47] transition-colors duration-200"
                >
                  Comenzar Ahora
                </button>
                <button
                  onClick={() => window.location.href = '/login/signin'}
                  className="border-2 border-[#ec4d58] text-[#fafafa] px-8 py-4 rounded-xl font-bold hover:bg-[#ec4d58] hover:text-white transition-colors duration-200"
                >
                  Acceder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
