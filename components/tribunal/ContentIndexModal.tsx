'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Clock, CheckCircle, Lock, ExternalLink } from 'lucide-react';
import { getTribunalColors, getLevelName, getLevelEmoji } from '@/lib/tribunal-colors';
import { useTribunalContent, ContentIndex, ContentSection } from '@/hooks/useTribunalContent';

interface ContentIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentTitle: string;
  level: number;
  onSectionClick?: (section: ContentIndex) => void;
  realContent?: any[];
}

export default function ContentIndexModal({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  level,
  onSectionClick,
  realContent
}: ContentIndexModalProps) {
  const [index, setIndex] = useState<ContentIndex[]>([]);
  const [sections, setSections] = useState<Record<string, ContentSection[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchContentIndex, fetchContentSections } = useTribunalContent(level);
  const colors = getTribunalColors(level);
  const levelName = getLevelName(level);
  const levelEmoji = getLevelEmoji(level);

  useEffect(() => {
    if (isOpen && contentId) {
      loadContentIndex();
    } else if (!isOpen) {
      // Limpiar estado cuando el modal se cierra
      setIndex([]);
      setSections({});
      setError(null);
    }
  }, [isOpen, contentId]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      setIndex([]);
      setSections({});
      setError(null);
    };
  }, []);

  const loadContentIndex = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 ContentIndexModal: Cargando contenido para ID:', contentId);
      console.log('🔍 ContentIndexModal: Contenido real disponible:', realContent);

      // Si hay contenido real, usarlo directamente
      if (realContent && Array.isArray(realContent) && realContent.length > 0) {
        console.log('✅ ContentIndexModal: Usando contenido real del creador');
        
        // Convertir el contenido real a formato ContentIndex
        const realContentIndex = realContent.map((block, index) => ({
          id: `block-${index}`,
          content_id: contentId,
          section_title: getBlockTitle(block),
          section_description: getBlockDescription(block),
          section_type: getBlockType(block.type),
          section_order: index + 1,
          estimated_duration: getBlockDuration(block),
          is_required: true
        }));

        setIndex(realContentIndex);
        setSections({});
        console.log('✅ ContentIndexModal: Contenido real cargado:', realContentIndex);
        return;
      }

      // Si no hay contenido real, intentar cargar desde la base de datos
      try {
        const indexData = await fetchContentIndex(contentId);
        console.log('🔍 ContentIndexModal: Datos de BD:', indexData);
        
        if (indexData && indexData.length > 0) {
          setIndex(indexData);

          // Cargar secciones para cada índice
          const sectionsData: Record<string, ContentSection[]> = {};
          for (const indexItem of indexData) {
            const sectionData = await fetchContentSections(indexItem.id);
            sectionsData[indexItem.id] = sectionData;
          }
          setSections(sectionsData);
          console.log('✅ ContentIndexModal: Contenido cargado desde BD');
          return;
        }
      } catch (dbError) {
        console.log('⚠️ ContentIndexModal: No hay contenido en la base de datos, usando contenido de ejemplo');
      }

      // Si no hay contenido real ni en BD, mostrar error
      console.log('❌ ContentIndexModal: No hay contenido disponible');
      setError('No hay contenido disponible para este módulo');
      setIndex([]);
      setSections({});
    } catch (err) {
      console.error('❌ ContentIndexModal: Error loading content index:', err);
      setError(err instanceof Error ? err.message : 'Error cargando contenido');
    } finally {
      setLoading(false);
    }
  };

  // Funciones auxiliares para procesar contenido real
  const getBlockTitle = (block: any): string => {
    if (block.type === 'title') return block.content || 'Título';
    if (block.type === 'subtitle') return block.content || 'Subtítulo';
    if (block.type === 'heading') return block.content || 'Encabezado';
    if (block.type === 'subheading') return block.content || 'Subencabezado';
    if (block.type === 'text') return block.content?.substring(0, 50) + '...' || 'Texto';
    if (block.type === 'image') return 'Imagen';
    if (block.type === 'video') return 'Video';
    if (block.type === 'code') return 'Código';
    if (block.type === 'quote') return 'Cita';
    if (block.type === 'list') return 'Lista';
    if (block.type === 'checklist') return 'Lista de verificación';
    if (block.type === 'divider') return 'Separador';
    if (block.type === 'link') return 'Enlace';
    return 'Contenido';
  };

  const getBlockDescription = (block: any): string => {
    if (block.type === 'title') return 'Título principal del módulo';
    if (block.type === 'subtitle') return 'Descripción del módulo';
    if (block.type === 'heading') return 'Encabezado de sección';
    if (block.type === 'subheading') return 'Subencabezado de sección';
    if (block.type === 'text') return block.content?.substring(0, 100) + '...' || 'Contenido de texto';
    if (block.type === 'image') return 'Imagen explicativa';
    if (block.type === 'video') return 'Video educativo';
    if (block.type === 'code') return 'Código de ejemplo';
    if (block.type === 'quote') return 'Cita importante';
    if (block.type === 'list') return 'Lista de elementos';
    if (block.type === 'checklist') return 'Lista de verificación';
    if (block.type === 'divider') return 'Separador visual';
    if (block.type === 'link') return 'Enlace externo';
    return 'Contenido del módulo';
  };

  const getBlockType = (blockType: string): 'content' | 'video' | 'quiz' | 'exercise' | 'resource' => {
    if (blockType === 'video') return 'video';
    if (blockType === 'code') return 'exercise';
    if (blockType === 'checklist') return 'quiz';
    if (blockType === 'link') return 'resource';
    return 'content';
  };

  const getBlockDuration = (block: any): number => {
    if (block.type === 'video') return 15;
    if (block.type === 'text') return 5;
    if (block.type === 'code') return 10;
    if (block.type === 'image') return 3;
    if (block.type === 'list') return 5;
    if (block.type === 'checklist') return 8;
    return 5;
  };


  const handleSectionClick = (section: ContentIndex) => {
    if (onSectionClick) {
      onSectionClick(section);
    }
  };

  const getSectionIcon = (sectionType: string) => {
    switch (sectionType) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'exercise':
        return <ExternalLink className="w-4 h-4" />;
      case 'resource':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        style={{ backgroundColor: colors.card.background }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                <span className="text-xl">{levelEmoji}</span>
              </div>
              <div>
                <h2 
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  {contentTitle}
                </h2>
                <p 
                  className="text-sm opacity-70"
                  style={{ color: colors.text }}
                >
                  {levelName} • Índice de contenido
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
              <p style={{ color: colors.text }}>Cargando contenido...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadContentIndex}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : index.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <p style={{ color: colors.text }}>No hay contenido disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {index.map((section, index) => (
                <div
                  key={section.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]
                    ${section.is_required ? 'border-opacity-100' : 'border-opacity-50'}
                  `}
                  style={{
                    backgroundColor: `${colors.primary}05`,
                    borderColor: section.is_required ? colors.border : `${colors.border}50`
                  }}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.button.text
                      }}
                    >
                      {getSectionIcon(section.section_type)}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 
                          className="font-semibold text-lg"
                          style={{ color: colors.text }}
                        >
                          {section.section_title}
                        </h3>
                        {section.estimated_duration > 0 && (
                          <div className="flex items-center space-x-1 text-sm opacity-70">
                            <Clock className="w-4 h-4" />
                            <span style={{ color: colors.text }}>
                              {section.estimated_duration} min
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {section.section_description && (
                        <p 
                          className="text-sm opacity-70 mb-2"
                          style={{ color: colors.text }}
                        >
                          {section.section_description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${colors.primary}20`,
                              color: colors.primary
                            }}
                          >
                            {section.section_type}
                          </span>
                          {section.is_required && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${colors.accent}20`,
                                color: colors.accent
                              }}
                            >
                              Requerido
                            </span>
                          )}
                        </div>
                        
                        <div 
                          className="flex items-center space-x-1 text-sm font-medium"
                          style={{ color: colors.primary }}
                        >
                          <span>Comenzar</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center justify-between">
            <p 
              className="text-sm opacity-70"
              style={{ color: colors.text }}
            >
              {index.length} sección{index.length !== 1 ? 'es' : ''} disponible{index.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: colors.button.background,
                color: colors.button.text
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
