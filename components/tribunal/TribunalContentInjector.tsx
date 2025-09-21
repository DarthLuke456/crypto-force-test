'use client';

import React, { useState, useEffect } from 'react';
import { useTribunalContentInjection } from '@/hooks/useTribunalContent';
import TribunalContentCarousel from './TribunalContentCarousel';
import ContentIndexModal from './ContentIndexModal';
import { TribunalContent } from '@/hooks/useTribunalContent';

interface TribunalContentInjectorProps {
  targetLevel: number;
  targetDashboard: string;
  category: 'theoretical' | 'practical';
  onContentClick?: (content: TribunalContent) => void;
  className?: string;
}

export default function TribunalContentInjector({
  targetLevel,
  targetDashboard,
  category,
  onContentClick,
  className = ''
}: TribunalContentInjectorProps) {
  const { injections, loading, error, refreshInjections } = useTribunalContentInjection(targetLevel, targetDashboard);
  const [selectedContent, setSelectedContent] = useState<TribunalContent | null>(null);
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);

  // Filtrar contenido por categoría
  const filteredContent = injections.filter(content => content.category === category);

  const handleContentClick = (content: TribunalContent) => {
    setSelectedContent(content);
    setIsIndexModalOpen(true);
    
    if (onContentClick) {
      onContentClick(content);
    }
  };

  const handleIndexModalClose = () => {
    setIsIndexModalOpen(false);
    setSelectedContent(null);
  };

  const handleSectionClick = (section: any) => {
    // Aquí se redirigiría al contenido específico del módulo
    console.log('Navegando a sección:', section);
    // TODO: Implementar navegación al contenido específico
  };

  if (loading) {
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando contenido del Tribunal Imperial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <p className="text-red-600 mb-4">Error cargando contenido: {error}</p>
          <button
            onClick={refreshInjections}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (filteredContent.length === 0) {
    // Buscar contenido real desde localStorage primero
    const getRealContent = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedProposals = localStorage.getItem('tribunal_proposals');
          if (storedProposals) {
            const proposals = JSON.parse(storedProposals);
            const approvedProposals = proposals.filter((p: any) => p.status === 'approved' || p.status === 'pending');
            
            if (approvedProposals.length > 0) {
              return approvedProposals.map((proposal: any) => ({
                id: proposal.id,
                title: proposal.title,
                subtitle: proposal.description || '',
                level: proposal.targetHierarchy || targetLevel,
                category: proposal.category || category,
                duration_minutes: 45,
                difficulty_level: 1,
                is_published: true,
                is_featured: true,
                sort_order: 1,
                created_at: proposal.createdAt || new Date().toISOString(),
                updated_at: proposal.updatedAt || new Date().toISOString(),
                content: proposal.content || []
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading real content:', error);
      }
      return [];
    };

    const realContent = getRealContent();
    
    if (realContent.length > 0) {
      return (
        <>
          <TribunalContentCarousel
            title={category === 'theoretical' ? 'Módulos Teóricos' : 'Módulos Prácticos'}
            content={realContent.map((content: any) => ({
              id: content.id,
              title: content.title,
              subtitle: content.subtitle || '',
              level: content.level,
              duration: content.duration_minutes,
              difficulty: content.difficulty_level,
              isCompleted: false,
              isLocked: false
            }))}
            level={targetLevel}
            onContentClick={handleContentClick}
            className={className}
          />

          {/* Modal de Índice para contenido real */}
          {selectedContent && (
            <ContentIndexModal
              isOpen={isIndexModalOpen}
              onClose={handleIndexModalClose}
              contentId={selectedContent.id}
              contentTitle={selectedContent.title}
              level={targetLevel}
              onSectionClick={handleSectionClick}
              realContent={selectedContent.content}
            />
          )}
        </>
      );
    }

    // Solo mostrar contenido de ejemplo si no hay contenido real
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No hay contenido disponible
          </h3>
          <p className="text-gray-500">
            El contenido para {category === 'theoretical' ? 'módulos teóricos' : 'módulos prácticos'} se está preparando
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TribunalContentCarousel
        title={category === 'theoretical' ? 'Módulos Teóricos' : 'Módulos Prácticos'}
        content={filteredContent.map(content => ({
          id: content.id,
          title: content.title,
          subtitle: content.subtitle || content.description || '',
          level: content.level,
          duration: content.duration_minutes,
          difficulty: content.difficulty_level,
          isCompleted: false, // TODO: Implementar lógica de progreso
          isLocked: false // TODO: Implementar lógica de desbloqueo
        }))}
        level={targetLevel}
        onContentClick={handleContentClick}
        className={className}
      />

      {/* Modal de Índice */}
      {selectedContent && (
        <ContentIndexModal
          isOpen={isIndexModalOpen}
          onClose={handleIndexModalClose}
          contentId={selectedContent.id}
          contentTitle={selectedContent.title}
          level={targetLevel}
          onSectionClick={handleSectionClick}
        />
      )}
    </>
  );
}
