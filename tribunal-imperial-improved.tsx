'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Plus, 
  Eye,
  Trash2,
  Settings,
  Play,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { useProposals } from '@/lib/tribunal/hooks/useProposals';
import MinimalContentCreator from '@/components/tribunal/MinimalContentCreator';
import { getTribunalColors, getLevelName, getLevelEmoji } from '@/lib/tribunal-colors';

// Componente para mostrar propuestas aprobadas con gestión de contenido
function ApprovedProposals() {
  const [publishedContent, setPublishedContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch published content from database
  useEffect(() => {
    const fetchPublishedContent = async () => {
      try {
        const response = await fetch('/api/tribunal/content?published=true');
        if (response.ok) {
          const data = await response.json();
          setPublishedContent(data.content || []);
        }
      } catch (error) {
        console.error('Error fetching published content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublishedContent();
  }, []);
  
  const handleEditContent = (content: any) => {
    // TODO: Implement edit functionality
    console.log('Edit content:', content);
  };
  
  const handleDeleteContent = async (contentId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) return;
    
    try {
      const response = await fetch(`/api/tribunal/content/${contentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPublishedContent(prev => prev.filter(c => c.id !== contentId));
        alert('Contenido eliminado exitosamente');
      } else {
        alert('Error eliminando el contenido');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error eliminando el contenido');
    }
  };
  
  if (loading) {
    return (
      <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fafafa] mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando contenido...</p>
        </div>
      </div>
    );
  }
  
  if (publishedContent.length === 0) {
    return (
      <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
        <div className="text-center py-12">
          <CheckCircle size={64} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay contenido publicado</h3>
          <p className="text-gray-500 mb-4">El contenido publicado aparecerá aquí una vez que sea creado y aprobado</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {publishedContent.map((content) => (
        <div key={content.id} className="bg-[#121212] border border-[#333] rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#fafafa] mb-2">{content.title}</h3>
              <p className="text-gray-400 mb-2">{content.subtitle}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Nivel: {content.level}</span>
                <span>Categoría: {content.category}</span>
                <span>Creado: {new Date(content.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditContent(content)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteContent(content.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          
          {/* Dashboard selector */}
          <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dashboard de destino:
            </label>
            <select 
              className="w-full p-2 bg-[#2a2a2a] border border-[#333] rounded-md text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={content.level}
            >
              <option value="1">Nivel 1 - Iniciado</option>
              <option value="2">Nivel 2 - Acólito</option>
              <option value="3">Nivel 3 - Warrior</option>
              <option value="4">Nivel 4 - Lord</option>
              <option value="5">Nivel 5 - Darth</option>
              <option value="6">Nivel 6 - Maestro</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente mejorado para cards del carrusel
function ImprovedTribunalContentCard({
  id,
  title,
  subtitle,
  level,
  customLevelText,
  duration = 0,
  difficulty = 1,
  isCompleted = false,
  isLocked = false,
  onClick,
  className = ''
}: {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  customLevelText?: string;
  duration?: number;
  difficulty?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const colors = getTribunalColors(level);
  const levelName = getLevelName(level);
  const levelEmoji = getLevelEmoji(level);

  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-300 hover:scale-105
        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        ${className}
      `}
      onClick={handleClick}
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.border,
        boxShadow: colors.card.shadow
      }}
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-xl border-2 p-6 h-full flex flex-col">
        
        {/* Header con Nivel - Mejorado */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary,
              border: `1px solid ${colors.border}40`
            }}
          >
            <span className="text-lg">{levelEmoji}</span>
            <span>{customLevelText || levelName}</span>
          </div>
          
          {isCompleted && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Completado</span>
            </div>
          )}
        </div>

        {/* Título */}
        <h3 
          className="text-xl font-bold mb-2 line-clamp-2"
          style={{ color: colors.text }}
        >
          {title}
        </h3>

        {/* Subtítulo */}
        <p 
          className="text-sm mb-4 line-clamp-3 opacity-80 flex-grow"
          style={{ color: colors.text }}
        >
          {subtitle}
        </p>

        {/* Footer con duración y botón - Sin estrellitas */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-4 text-xs opacity-70">
            {duration > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span style={{ color: colors.text }}>{duration} min</span>
              </div>
            )}
          </div>

          {/* Botón Comenzar */}
          <div
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200 group-hover:scale-105
              ${isLocked ? 'opacity-50' : ''}
            `}
            style={{
              backgroundColor: colors.button.background,
              color: colors.button.text
            }}
          >
            <Play className="w-4 h-4" />
            <span>Comenzar</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Overlay de bloqueado */}
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-white text-xl">🔒</span>
              </div>
              <p className="text-white text-sm font-medium">Bloqueado</p>
            </div>
          </div>
        )}

        {/* Efecto hover */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundColor: colors.primary }}
        />
      </div>
    </div>
  );
}

// Componente mejorado del carrusel
function ImprovedTribunalContentCarousel({
  title,
  content,
  level,
  onContentClick,
  className = ''
}: {
  title: string;
  content: any[];
  level: number;
  onContentClick?: (content: any) => void;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const colors = getTribunalColors(level);
  const levelName = getLevelName(level);

  const itemsPerView = 3; // Número de items visibles
  const maxIndex = Math.max(0, content.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollLeft = index * (itemWidth + gap);
      
      scrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleContentClick = (contentItem: any) => {
    if (onContentClick) {
      onContentClick(contentItem);
    }
  };

  // Handle mouse wheel scrolling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrevious();
    }
  };

  if (content.length === 0) {
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="text-center py-12">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: `${colors.primary}20`,
              border: `2px solid ${colors.border}40`
            }}
          >
            <span className="text-2xl">📚</span>
          </div>
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            No hay contenido disponible
          </h3>
          <p 
            className="text-sm opacity-70"
            style={{ color: colors.text }}
          >
            El contenido para {levelName} se está preparando
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-2xl font-bold mb-1"
            style={{ color: colors.text }}
          >
            {title}
          </h2>
          <p 
            className="text-sm opacity-70"
            style={{ color: colors.text }}
          >
            Contenido específico para {levelName}
          </p>
        </div>

        {/* Controles de navegación */}
        {content.length > itemsPerView && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
              `}
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                border: `1px solid ${colors.border}40`
              }}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
              `}
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                border: `1px solid ${colors.border}40`
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel - Solo scroll horizontal */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth'
          }}
          onWheel={handleWheel}
        >
          {content.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-80"
            >
              <ImprovedTribunalContentCard
                {...item}
                onClick={() => handleContentClick(item)}
              />
            </div>
          ))}
        </div>

        {/* Indicadores de posición */}
        {content.length > itemsPerView && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${index === currentIndex ? 'scale-125' : 'scale-100'}
                `}
                style={{
                  backgroundColor: index === currentIndex ? colors.primary : `${colors.primary}40`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 text-center">
        <p 
          className="text-xs opacity-60"
          style={{ color: colors.text }}
        >
          {content.length} módulo{content.length !== 1 ? 's' : ''} disponible{content.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

export default function TribunalImperialPage() {
  const { userData, loading, isReady } = useSafeAuth();
  const { proposals, createProposal, updateProposal } = useProposals();
  const [activeTab, setActiveTab] = useState<'overview' | 'propuestas' | 'aprobados' | 'rechazados' | 'gestion'>('overview');
  const [editingProposal, setEditingProposal] = useState<any | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showMinimalCreator, setShowMinimalCreator] = useState(false);

  // Rest of the component logic...
  // (This would include all the existing logic from the original file)

  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fafafa] mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando acceso de maestro...</p>
        </div>
      </div>
    );
  }

  if (!userData || userData.user_level !== 6) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
          <p className="text-gray-400">Solo los maestros pueden acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#fafafa]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Vista General', icon: <BarChart3 size={18} /> },
              { id: 'propuestas', label: 'Propuestas', icon: <FileText size={18} /> },
              { id: 'aprobados', label: 'Aprobados', icon: <CheckCircle size={18} /> },
              { id: 'rechazados', label: 'Rechazados', icon: <XCircle size={18} /> },
              { id: 'gestion', label: 'Gestión', icon: <Edit size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                    ? 'bg-[#fafafa] text-[#121212]'
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowMinimalCreator(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#fafafa] text-[#121212] rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Crear Contenido</span>
            </button>
          </div>
        </div>

        {/* TAB: Aprobados */}
        {activeTab === 'aprobados' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#fafafa]">Contenido Aprobado</h2>
              <div className="text-sm text-gray-400">
                Propuestas que han sido aprobadas por Darth Nihilus o Darth Luke
              </div>
            </div>
            
            <ApprovedProposals />
          </div>
        )}

        {/* Minimal Content Creator Modal */}
        {showMinimalCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#121212] rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#333]">
                <h2 className="text-xl font-bold text-[#fafafa]">Crear Contenido</h2>
                <button
                  onClick={() => setShowMinimalCreator(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MinimalContentCreator
                  onSave={(blocks, metadata) => {
                    // Handle save logic
                    setShowMinimalCreator(false);
                  }}
                  onCancel={() => setShowMinimalCreator(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
