'use client';

import { useState, useEffect, useRef } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Play, 
  Eye, 
  Zap, 
  Flame, 
  Crown, 
  Users, 
  Target, 
  Gamepad2, 
  Network,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  Building2,
  Handshake,
  BarChart3,
  DollarSign,
  Star,
  Award,
  Briefcase,
  Globe,
  Shield,
  Settings,
  MessageSquare,
  Calendar,
  PieChart
} from 'lucide-react';
import Image from 'next/image';
import EnhancedCarousel from '@/app/dashboard/iniciado/components/EnhancedCarousel';

// Tipos para el carrusel
interface CarouselSlide {
  type: 'image' | 'title' | 'subtitle' | 'description' | 'quote' | 'philosophy';
  content: string;
  duration: number;
}

// Interfaces para el sistema de gestión de personas
interface TeamMember {
  id: string;
  name: string;
  role: string;
  level: number;
  performance: number;
  revenue: number;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  commission: number;
  sales: number;
  revenue: number;
  status: 'active' | 'inactive' | 'pending';
  image: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  commission: number;
  bookings: number;
  revenue: number;
  status: 'active' | 'inactive' | 'pending';
  category: string;
}

// Datos de ejemplo para el dashboard
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'María González',
    role: 'Senior Warrior',
    level: 3,
    performance: 95,
    revenue: 12500,
    avatar: '/images/avatars/maria.jpg',
    status: 'active',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    role: 'Acólito',
    level: 2,
    performance: 78,
    revenue: 8500,
    avatar: '/images/avatars/carlos.jpg',
    status: 'active',
    joinDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    role: 'Iniciado',
    level: 1,
    performance: 65,
    revenue: 3200,
    avatar: '/images/avatars/ana.jpg',
    status: 'pending',
    joinDate: '2024-03-10'
  }
];

const products: Product[] = [
  {
    id: '1',
    name: 'Curso Avanzado de Trading',
    category: 'Educación',
    price: 299,
    commission: 15,
    sales: 45,
    revenue: 13455,
    status: 'active',
    image: '/images/products/trading-course.jpg'
  },
  {
    id: '2',
    name: 'Sistema de Señales Premium',
    category: 'Herramientas',
    price: 99,
    commission: 25,
    sales: 78,
    revenue: 7722,
    status: 'active',
    image: '/images/products/signals-system.jpg'
  },
  {
    id: '3',
    name: 'Mentoría Personalizada',
    category: 'Servicios',
    price: 199,
    commission: 30,
    sales: 23,
    revenue: 4577,
    status: 'active',
    image: '/images/products/mentoring.jpg'
  }
];

const services: Service[] = [
  {
    id: '1',
    name: 'Consultoría Estratégica',
    description: 'Asesoramiento personalizado para portafolios institucionales',
    price: 500,
    commission: 20,
    bookings: 12,
    revenue: 6000,
    status: 'active',
    category: 'Consultoría'
  },
  {
    id: '2',
    name: 'Análisis de Mercado',
    description: 'Reportes detallados de análisis técnico y fundamental',
    price: 150,
    commission: 35,
    bookings: 28,
    revenue: 4200,
    status: 'active',
    category: 'Análisis'
  },
  {
    id: '3',
    name: 'Gestión de Equipos',
    description: 'Formación y liderazgo de equipos de trading',
    price: 300,
    commission: 25,
    bookings: 8,
    revenue: 2400,
    status: 'active',
    category: 'Liderazgo'
  }
];

// Módulos de gestión de personas
const peopleManagementModules = [
  {
    id: '1',
    title: 'Reclutamiento y Selección',
    description: 'Estrategias para identificar y atraer talento de alto nivel al ecosistema crypto.',
    icon: <UserPlus className="w-8 h-8 text-[#4671D5]" />,
    isCompleted: false,
    level: 'nivel4',
    type: 'theoretical',
    moduleNumber: 1
  },
  {
    id: '2',
    title: 'Desarrollo de Equipos',
    description: 'Técnicas de formación y motivación para maximizar el rendimiento del equipo.',
    icon: <Users className="w-8 h-8 text-[#4671D5]" />,
    isCompleted: false,
    level: 'nivel4',
    type: 'theoretical',
    moduleNumber: 2
  },
  {
    id: '3',
    title: 'Gestión de Performance',
    description: 'Sistemas de evaluación y mejora continua para optimizar resultados.',
    icon: <BarChart3 className="w-8 h-8 text-[#4671D5]" />,
    isCompleted: false,
    level: 'nivel4',
    type: 'theoretical',
    moduleNumber: 3
  }
];

// Módulos de productos y servicios
const productServiceModules = [
  {
    id: '4',
    title: 'Estrategias de Ventas',
    description: 'Técnicas avanzadas para promocionar y vender productos crypto.',
    icon: <ShoppingCart className="w-8 h-8 text-[#4671D5]" />,
    isCompleted: false,
    level: 'nivel4',
    type: 'practical',
    moduleNumber: 1
  },
  {
    id: '5',
    title: 'Gestión de Portafolio de Servicios',
    description: 'Desarrollo y optimización de una cartera diversificada de servicios.',
    icon: <Briefcase className="w-8 h-8 text-[#4671D5]" />,
    isCompleted: false,
    level: 'nivel4',
    type: 'practical',
    moduleNumber: 2
  },
  {
    id: '6',
    title: 'Análisis de Rentabilidad',
    description: 'Métricas y KPIs para evaluar el éxito de productos y servicios.',
    icon: <TrendingUp className="w-8 h-8 text-[#4671D5]" />,
    isCompleted: false,
    level: 'nivel4',
    type: 'practical',
    moduleNumber: 3
  }
];

// Contenido del carrusel para Lord
const carouselContent = [
  {
    id: 1,
    title: 'Bienvenido al Reino del Lord',
    description: 'Tu dominio se extiende sobre la gestión de personas y la asociación de productos. Aquí forjas el futuro del ecosistema crypto.',
    icon: <Crown className="w-12 h-12 text-[#4671D5]" />,
    color: 'from-[#4671D5]/20 to-[#4671D5]/30',
    borderColor: 'border border-[#232323] hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5]'
  },
  {
    id: 2,
    title: 'Gestión de Personas',
    description: 'Recluta, forma y lidera equipos de élite que transformen el mercado crypto.',
    icon: <Users className="w-12 h-12 text-[#4671D5]" />,
    color: 'from-[#4671D5]/20 to-[#4671D5]/30',
    borderColor: 'border border-[#232323] hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5]'
  },
  {
    id: 3,
    title: 'Productos y Servicios',
    description: 'Desarrolla y comercializa soluciones que generen valor para toda la comunidad.',
    icon: <ShoppingCart className="w-12 h-12 text-[#4671D5]" />,
    color: 'from-[#4671D5]/20 to-[#4671D5]/30',
    borderColor: 'border border-[#232323] hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5]'
  }
];

export default function LordDashboard() {
  const { userData } = useSafeAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Obtener todos los módulos según el tab activo
  const getAllModules = () => {
    if (activeTab === 'people') {
      return peopleManagementModules;
    } else if (activeTab === 'products') {
      return productServiceModules;
    }
    return [];
  };

  // Calcular métricas del dashboard
  const totalRevenue = [...products, ...services].reduce((sum, item) => sum + item.revenue, 0);
  const totalTeamMembers = teamMembers.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const activeServices = services.filter(s => s.status === 'active').length;
  const averagePerformance = teamMembers.reduce((sum, member) => sum + member.performance, 0) / teamMembers.length;

  // Contenido del carrusel principal
  const mainCarouselContent: CarouselSlide[] = [
    {
      type: 'image' as const,
      content: '/images/insignias/4-lords.png',
      duration: 2500
    },
    {
      type: 'title' as const,
      content: 'LORD',
      duration: 2500
    },
    {
      type: 'subtitle' as const,
      content: 'El líder que gestiona personas y forja el futuro del ecosistema.',
      duration: 2500
    },
    {
      type: 'description' as const,
      content: 'Tu reino se extiende sobre la gestión estratégica de personas y la asociación de productos y servicios. Aquí desarrollas equipos de élite, comercializas soluciones innovadoras y construyes el ecosistema que transformará el mercado crypto. Cada decisión impacta no solo tu éxito, sino el de toda tu red.',
      duration: 12000
    },
    {
      type: 'quote' as const,
      content: 'Un Lord no solo lidera, sino que crea oportunidades, desarrolla talento y construye legados duraderos.',
      duration: 3000
    },
    {
      type: 'philosophy' as const,
      content: 'Ser Lord es la capacidad de ver el potencial en cada persona, de identificar oportunidades en cada producto, de crear valor donde otros ven obstáculos. Tu éxito se mide no solo por tus ganancias, sino por el crecimiento y la prosperidad de todos los que forman parte de tu reino.',
      duration: 14000
    }
  ];

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen bg-[#0f0f0f] text-white overflow-y-auto scrollbar-lord"
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .objectives-grid > div {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }
        
        .objectives-grid > div:nth-child(1) { animation-delay: 0.1s; }
        .objectives-grid > div:nth-child(2) { animation-delay: 0.2s; }
        .objectives-grid > div:nth-child(3) { animation-delay: 0.3s; }
        .objectives-grid > div:nth-child(4) { animation-delay: 0.4s; }
        .objectives-grid > div:nth-child(5) { animation-delay: 0.5s; }
        .objectives-grid > div:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 pb-24 md:pb-8 transition-all duration-300">
        {/* Welcome Message */}
        <div className="w-full max-w-4xl mx-auto mb-6 md:mb-8 text-center px-4 md:px-0">
          <h2 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">
            Te damos la bienvenida{userData?.nickname ? (
              <>
                <span className="text-[#fafafa]">, </span>
                <span className="text-[#4671D5] font-medium">{userData.nickname}</span>
              </>
            ) : ''}
          </h2>
        </div>

        {/* Carousel Component */}
        <EnhancedCarousel content={mainCarouselContent} titleColor="#4671D5" dotsColor="#4671D5" />

        {/* Carrusel de Bienvenida */}
        <div className="w-full max-w-6xl mx-auto mb-8 px-2 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {carouselContent.map((item, index) => (
              <div
                key={item.id}
                className={`bg-gradient-to-br ${item.color} ${item.borderColor} rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#4671D5]/20 animate-slide-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación por Pestañas */}
        <div className="flex justify-center mb-8 px-2 md:px-0">
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-1 md:p-2 w-full max-w-4xl hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5] hover:shadow-lg hover:shadow-[#4671D5]/20 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
              <button
                onClick={() => handleTabChange('overview')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base ${
                  activeTab === 'overview'
                    ? 'bg-[#4671D5] text-gray-900 shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <PieChart className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
                Resumen
              </button>
              <button
                onClick={() => handleTabChange('people')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base ${
                  activeTab === 'people'
                    ? 'bg-[#4671D5] text-gray-900 shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <Users className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
                Equipo
              </button>
              <button
                onClick={() => handleTabChange('products')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base ${
                  activeTab === 'products'
                    ? 'bg-[#4671D5] text-gray-900 shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <ShoppingCart className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
                Productos
              </button>
              <button
                onClick={() => handleTabChange('services')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base ${
                  activeTab === 'services'
                    ? 'bg-[#4671D5] text-gray-900 shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <Briefcase className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
                Servicios
              </button>
            </div>
          </div>
        </div>

        {/* Contenido según la pestaña activa */}
        {activeTab === 'overview' && (
          <div className="w-full max-w-6xl mx-auto px-2 md:px-0">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-2xl p-6 hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#4671D5]" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-2xl p-6 hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Miembros del Equipo</p>
                    <p className="text-2xl font-bold text-white">{totalTeamMembers}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#4671D5]" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-2xl p-6 hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Productos Activos</p>
                    <p className="text-2xl font-bold text-white">{activeProducts}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-[#4671D5]" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-2xl p-6 hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Rendimiento Promedio</p>
                    <p className="text-2xl font-bold text-white">{averagePerformance.toFixed(0)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#4671D5]" />
                </div>
              </div>
            </div>

            {/* Módulos de aprendizaje */}
            <div className="bg-gradient-to-r from-[#4671D5]/10 to-[#4671D5]/20 border border-[#232323] rounded-xl p-6 mb-8 hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5] transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Crown className="w-8 h-8 text-[#4671D5]" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#4671D5]">Módulos de Aprendizaje</h3>
                    <p className="text-gray-300 text-sm">Desarrolla tus habilidades de liderazgo</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...peopleManagementModules, ...productServiceModules].slice(0, 6).map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4 hover:border-[#4671D5] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      {module.icon}
                      <div>
                        <h4 className="text-white font-medium text-sm">{module.title}</h4>
                        <p className="text-gray-400 text-xs">Módulo {module.moduleNumber}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">{module.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="w-full max-w-6xl mx-auto px-2 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de miembros del equipo */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Miembros del Equipo</h3>
                    <button className="bg-[#4671D5] text-white px-4 py-2 rounded-lg hover:bg-[#3a5bb5] transition-colors">
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Agregar Miembro
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 hover:border-[#4671D5] transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#4671D5] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{member.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{member.name}</h4>
                              <p className="text-gray-400 text-sm">{member.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#4671D5] font-bold">${member.revenue.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{member.performance}% rendimiento</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Módulos de gestión de personas */}
              <div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Módulos de Gestión</h3>
                  <div className="space-y-4">
                    {peopleManagementModules.map((module, index) => (
                      <div
                        key={module.id}
                        className="bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 hover:border-[#4671D5] transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {module.icon}
                          <h4 className="text-white font-medium text-sm">{module.title}</h4>
                        </div>
                        <p className="text-gray-300 text-xs">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="w-full max-w-6xl mx-auto px-2 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de productos */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Productos</h3>
                    <button className="bg-[#4671D5] text-white px-4 py-2 rounded-lg hover:bg-[#3a5bb5] transition-colors">
                      <ShoppingCart className="w-4 h-4 inline mr-2" />
                      Agregar Producto
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 hover:border-[#4671D5] transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#4671D5] rounded-lg flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{product.name}</h4>
                              <p className="text-gray-400 text-sm">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#4671D5] font-bold">${product.revenue.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{product.sales} ventas</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Módulos de productos */}
              <div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Módulos de Productos</h3>
                  <div className="space-y-4">
                    {productServiceModules.map((module, index) => (
                      <div
                        key={module.id}
                        className="bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 hover:border-[#4671D5] transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {module.icon}
                          <h4 className="text-white font-medium text-sm">{module.title}</h4>
                        </div>
                        <p className="text-gray-300 text-xs">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="w-full max-w-6xl mx-auto px-2 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de servicios */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Servicios</h3>
                    <button className="bg-[#4671D5] text-white px-4 py-2 rounded-lg hover:bg-[#3a5bb5] transition-colors">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Agregar Servicio
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 hover:border-[#4671D5] transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#4671D5] rounded-lg flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{service.name}</h4>
                              <p className="text-gray-400 text-sm">{service.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#4671D5] font-bold">${service.revenue.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{service.bookings} reservas</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Módulos de servicios */}
              <div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#232323] rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Módulos de Servicios</h3>
                  <div className="space-y-4">
                    {productServiceModules.map((module, index) => (
                      <div
                        key={module.id}
                        className="bg-[#0f0f0f] border border-[#232323] rounded-lg p-4 hover:border-[#4671D5] transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {module.icon}
                          <h4 className="text-white font-medium text-sm">{module.title}</h4>
                        </div>
                        <p className="text-gray-300 text-xs">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Tribunal Imperial - Integración dinámica */}
        <div className="w-full max-w-6xl mx-auto mt-12 px-2 md:px-0">
          <div className="bg-gradient-to-r from-[#4671D5]/10 to-[#4671D5]/20 border border-[#232323] rounded-xl p-6 hover:border-[#4671D5] hover:border-t-2 hover:border-t-[#4671D5] hover:shadow-lg hover:shadow-[#4671D5]/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-[#4671D5]" />
                <div>
                  <h3 className="text-xl font-semibold text-[#4671D5]">Contenido del Tribunal Imperial</h3>
                  <p className="text-gray-300 text-sm">Módulos aprobados por los Maestros</p>
                </div>
              </div>
              <div className="bg-[#4671D5] text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Dinámico
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Los Maestros del Tribunal Imperial pueden inyectar contenido directamente en tu carrusel de aprendizaje. 
              Estos módulos aparecerán automáticamente cuando sean aprobados y estarán marcados con el sello del Tribunal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Módulos Pendientes</h4>
                <p className="text-gray-400 text-sm">Esperando aprobación del Tribunal</p>
                <div className="text-[#4671D5] text-sm font-medium mt-2">0 módulos</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Última Actualización</h4>
                <p className="text-gray-400 text-sm">Contenido del Tribunal</p>
                <div className="text-[#4671D5] text-sm font-medium mt-2">Hace 1 día</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}