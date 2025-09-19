'use client';

import React, { useState, useRef } from 'react';
import { Plus, X, Save, Eye, ArrowRight, GripVertical, Lock, AlignLeft, AlignCenter, AlignRight, ZoomIn, ZoomOut, Play, ExternalLink } from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'title' | 'subtitle' | 'text' | 'image' | 'list' | 'quote' | 'link' | 'video' | 'code' | 'divider' | 'checklist' | 'carousel' | 'url';
  content: string;
  isFixed?: boolean;
  order: number;
  // Propiedades para imágenes
  imageSize?: 'small' | 'medium' | 'large' | 'full';
  imageAlignment?: 'left' | 'center' | 'right';
  // Propiedades para videos
  videoThumbnail?: string;
  videoTitle?: string;
}

interface MinimalContentCreatorProps {
  onSave: (content: ContentBlock[]) => void;
  onPreview: (content: ContentBlock[]) => void;
  initialContent?: ContentBlock[];
}

export default function MinimalContentCreator({ 
  onSave, 
  onPreview, 
  initialContent = [] 
}: MinimalContentCreatorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (initialContent.length > 0) return initialContent;
    
    // Bloques fijos iniciales
    return [
      {
        id: 'title-block',
        type: 'title',
        content: '',
        isFixed: true,
        order: 0
      },
      {
        id: 'subtitle-block', 
        type: 'subtitle',
        content: '',
        isFixed: true,
        order: 1
      }
    ];
  });

  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [showIndexEditor, setShowIndexEditor] = useState(false);
  const [indexSections, setIndexSections] = useState<string[]>(['']);
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [imageUploaded, setImageUploaded] = useState<{ [key: string]: boolean }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlocks, setPreviewBlocks] = useState<ContentBlock[]>([]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      order: blocks.length,
      isFixed: false
    };
    
    // Insertar después de los bloques fijos (título y subtítulo)
    setBlocks(prev => {
      const fixedBlocks = prev.filter(block => block.isFixed);
      const otherBlocks = prev.filter(block => !block.isFixed);
      return [...fixedBlocks, ...otherBlocks, newBlock];
    });
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  };

  // Función para agregar viñetas automáticamente a listas
  const handleListBlur = (blockId: string, content: string) => {
    if (content.trim()) {
      const lines = content.split('\n').filter(line => line.trim());
      const bulletedLines = lines.map(line => {
        // Si ya tiene viñeta, no agregar otra
        if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
          return line;
        }
        return `• ${line.trim()}`;
      });
      
      const formattedContent = bulletedLines.join('\n');
      if (formattedContent !== content) {
        updateBlock(blockId, formattedContent);
      }
    }
  };

  // Función para actualizar propiedades de imagen
  const updateImageProperties = (blockId: string, properties: Partial<Pick<ContentBlock, 'imageSize' | 'imageAlignment'>>) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === blockId ? { ...block, ...properties } : block
      )
    );
  };

  // Función para extraer video ID de YouTube/Vimeo
  const extractVideoId = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
    
    if (youtubeMatch) {
      return { platform: 'youtube', id: youtubeMatch[1] };
    } else if (vimeoMatch) {
      return { platform: 'vimeo', id: vimeoMatch[1] };
    }
    return null;
  };

  // Función para generar thumbnail de video
  const getVideoThumbnail = (url: string) => {
    const videoInfo = extractVideoId(url);
    if (!videoInfo) return null;
    
    if (videoInfo.platform === 'youtube') {
      return `https://img.youtube.com/vi/${videoInfo.id}/maxresdefault.jpg`;
    } else if (videoInfo.platform === 'vimeo') {
      return `https://vumbnail.com/${videoInfo.id}.jpg`;
    }
    return null;
  };

  // Función para generar iframe de video
  const getVideoEmbed = (url: string) => {
    const videoInfo = extractVideoId(url);
    if (!videoInfo) return null;
    
    if (videoInfo.platform === 'youtube') {
      return `https://www.youtube.com/embed/${videoInfo.id}`;
    } else if (videoInfo.platform === 'vimeo') {
      return `https://player.vimeo.com/video/${videoInfo.id}`;
    }
    return null;
  };

  // Función para abrir vista previa
  const handlePreview = () => {
    setPreviewBlocks(blocks);
    setShowPreview(true);
    onPreview(blocks);
  };

  // Función para renderizar bloque en vista previa
  const renderPreviewBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'title':
        return (
          <h1 className="text-3xl font-bold text-white mb-4">
            {block.content || 'Título del contenido'}
          </h1>
        );
      
      case 'subtitle':
        return (
          <h2 className="text-xl text-gray-300 mb-6">
            {block.content || 'Subtítulo del contenido'}
          </h2>
        );
      
      case 'text':
        return (
          <div className="text-gray-300 mb-4 leading-relaxed">
            {block.content.split('\n').map((line, index) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        );
      
      case 'image':
        const imageSize = block.imageSize || 'medium';
        const imageAlignment = block.imageAlignment || 'center';
        const sizeClasses = {
          small: 'w-32 h-32',
          medium: 'w-64 h-48',
          large: 'w-96 h-72',
          full: 'w-full h-64'
        };
        const alignmentClasses = {
          left: 'float-left mr-4 mb-4',
          center: 'mx-auto block',
          right: 'float-right ml-4 mb-4'
        };
        
        return (
          <div className={`${alignmentClasses[imageAlignment]} ${sizeClasses[imageSize]} mb-4`}>
            <img 
              src={imagePreviews[block.id] || block.content} 
              alt="Content image" 
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        );
      
      case 'video':
        const embedUrl = getVideoEmbed(block.content);
        const thumbnail = getVideoThumbnail(block.content);
        
        return (
          <div className="mb-6">
            {embedUrl ? (
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">URL de video inválida</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'list':
        return (
          <ul className="text-gray-300 mb-4 space-y-1">
            {block.content.split('\n').filter(line => line.trim()).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-white mr-2">•</span>
                <span>{item.replace(/^[•\-\*]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'divider':
        return (
          <div className="flex items-center justify-center my-8">
            <div className="flex-1 border-t border-gray-600"></div>
            <div className="px-4 text-gray-500 text-sm">
              {block.content || '---'}
            </div>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>
        );
      
      case 'url':
        return (
          <div className="mb-4">
            <a 
              href={block.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {block.content}
            </a>
          </div>
        );
      
      default:
        return null;
    }
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => !block.isFixed && block.id !== id));
  };

  const handleFileUpload = (file: File, blockId: string) => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
      return;
    }

    // Crear URL local para preview
    const localUrl = URL.createObjectURL(file);
    setImagePreviews(prev => ({
      ...prev,
      [blockId]: localUrl
    }));

    // Marcar como subida para ocultar elementos de carga
    setImageUploaded(prev => ({
      ...prev,
      [blockId]: true
    }));

    // Actualizar el contenido del bloque con el nombre del archivo
    updateBlock(blockId, file.name);

    console.log('✅ Imagen cargada:', file.name, 'Tamaño:', file.size, 'bytes');
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    
    // No permitir mover bloques fijos
    if (movedBlock.isFixed) return;
    
    // Ajustar toIndex para no interferir con bloques fijos
    const fixedBlocksCount = blocks.filter(block => block.isFixed).length;
    const adjustedToIndex = Math.max(fixedBlocksCount, toIndex);
    
    newBlocks.splice(adjustedToIndex, 0, movedBlock);
    
    // Reordenar
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }));
    
    setBlocks(reorderedBlocks);
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedBlock) return;
    
    const draggedIndex = blocks.findIndex(block => block.id === draggedBlock);
    if (draggedIndex === -1) return;
    
    // No permitir mover bloques fijos
    if (blocks[draggedIndex].isFixed) return;
    
    moveBlock(draggedIndex, targetIndex);
    setDraggedBlock(null);
  };

  const canPublish = () => {
    const hasTitle = blocks.find(b => b.type === 'title')?.content.trim();
    const hasSubtitle = blocks.find(b => b.type === 'subtitle')?.content.trim();
    const hasIndex = indexSections.some(section => section.trim());
    return hasTitle && hasSubtitle && hasIndex;
  };

  const addIndexSection = () => {
    setIndexSections(prev => [...prev, '']);
  };

  const updateIndexSection = (index: number, content: string) => {
    setIndexSections(prev => 
      prev.map((section, i) => i === index ? content : section)
    );
  };

  const removeIndexSection = (index: number) => {
    setIndexSections(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header Minimalista */}
      <div className="border-b border-[#1a1a1a] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Crear Contenido</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Vista Previa
            </button>
            <button
              onClick={() => onSave(blocks)}
              disabled={!canPublish()}
              className="px-6 py-2 bg-white text-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Publicar
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Editor Principal */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                draggable={!block.isFixed}
                onDragStart={(e) => handleDragStart(e, block.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`group relative p-4 rounded-lg border transition-all ${
                  block.isFixed 
                    ? 'border-[#333] bg-[#111]' 
                    : 'border-[#222] bg-[#0f0f0f] hover:border-[#333]'
                } ${
                  draggedBlock === block.id ? 'opacity-50' : ''
                }`}
              >
                {/* Drag Handle */}
                {!block.isFixed && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-500" />
                  </div>
                )}

                {/* Fixed Indicator */}
                {block.isFixed && (
                  <div className="absolute right-2 top-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}

                {/* Block Content */}
                <div className="ml-6">
                  {block.type === 'title' && (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Título del contenido..."
                      className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-500"
                    />
                  )}
                  
                  {block.type === 'subtitle' && (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Subtítulo del contenido..."
                      className="w-full text-lg text-gray-300 bg-transparent border-none outline-none placeholder-gray-600"
                    />
                  )}
                  
                  {block.type === 'text' && (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Escribe tu contenido aquí..."
                      className="w-full min-h-[100px] text-gray-300 bg-transparent border-none outline-none placeholder-gray-600 resize-none"
                    />
                  )}
                  
                  {block.type === 'divider' && (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex-1 border-t border-[#333]"></div>
                      <div className="px-4 text-gray-500 text-sm">
                        {block.content || '---'}
                      </div>
                      <div className="flex-1 border-t border-[#333]"></div>
                    </div>
                  )}
                  
                  {block.type === 'video' && (
                    <div className="space-y-4">
                      {/* Input de URL */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">URL del video:</label>
                        <input
                          type="url"
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                          className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-gray-300 placeholder-gray-600 focus:border-white focus:outline-none"
                        />
                      </div>
                      
                      {/* Preview del video */}
                      {block.content && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-300">Vista previa:</label>
                          <div className="border border-[#333] rounded-lg p-2 bg-[#111]">
                            {getVideoEmbed(block.content) ? (
                              <div className="relative w-full h-48 bg-black rounded overflow-hidden">
                                <iframe
                                  src={getVideoEmbed(block.content) || ''}
                                  className="w-full h-full"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <div className="w-full h-48 bg-gray-800 rounded flex items-center justify-center">
                                <div className="text-center">
                                  <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-gray-400 text-sm">URL de video inválida</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            URL: {block.content}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {block.type === 'url' && (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="https://ejemplo.com"
                        className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-gray-300 placeholder-gray-600 focus:border-white focus:outline-none"
                      />
                      {block.content && (
                        <div className="text-xs text-gray-500">
                          Enlace: {block.content}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {block.type === 'image' && (
                    <div className="space-y-4">
                      {/* Mostrar solo preview si hay imagen cargada */}
                      {(block.content && (block.content.startsWith('http') || imagePreviews[block.id])) ? (
                        <div className="space-y-4">
                          {/* Preview de la imagen con controles */}
                          <div className="border border-[#333] rounded-lg p-2 bg-[#111]">
                            <img 
                              src={imagePreviews[block.id] || block.content} 
                              alt="Preview" 
                              className="max-w-full h-32 object-cover rounded"
                              onError={(e) => {
                                console.error('Error cargando imagen:', e.currentTarget.src);
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => {
                                console.log('✅ Imagen cargada exitosamente:', imagePreviews[block.id] || block.content);
                              }}
                            />
                          </div>
                          
                          {/* Controles de imagen */}
                          <div className="space-y-3">
                            {/* Controles de tamaño */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Tamaño:</label>
                              <div className="flex gap-2">
                                {['small', 'medium', 'large', 'full'].map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => updateImageProperties(block.id, { imageSize: size as any })}
                                    className={`px-3 py-1 text-xs rounded transition-colors ${
                                      (block.imageSize || 'medium') === size
                                        ? 'bg-white text-black'
                                        : 'bg-[#222] text-gray-300 hover:bg-[#333]'
                                    }`}
                                  >
                                    {size === 'small' && <ZoomOut className="w-3 h-3 inline mr-1" />}
                                    {size === 'medium' && <ZoomIn className="w-3 h-3 inline mr-1" />}
                                    {size === 'large' && <ZoomIn className="w-3 h-3 inline mr-1" />}
                                    {size === 'full' && <ZoomIn className="w-3 h-3 inline mr-1" />}
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Controles de alineación */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Alineación:</label>
                              <div className="flex gap-2">
                                {[
                                  { value: 'left', icon: AlignLeft, label: 'Izquierda' },
                                  { value: 'center', icon: AlignCenter, label: 'Centro' },
                                  { value: 'right', icon: AlignRight, label: 'Derecha' }
                                ].map(({ value, icon: Icon, label }) => (
                                  <button
                                    key={value}
                                    onClick={() => updateImageProperties(block.id, { imageAlignment: value as any })}
                                    className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                                      (block.imageAlignment || 'center') === value
                                        ? 'bg-white text-black'
                                        : 'bg-[#222] text-gray-300 hover:bg-[#333]'
                                    }`}
                                  >
                                    <Icon className="w-3 h-3" />
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Información de la imagen */}
                          <div className="text-xs text-gray-500">
                            {imagePreviews[block.id] ? (
                              <p>Archivo local: {block.content}</p>
                            ) : (
                              <p>URL: {block.content}</p>
                            )}
                          </div>
                          
                          {/* Botón para cambiar imagen */}
                          <button
                            onClick={() => {
                              setImageUploaded(prev => ({ ...prev, [block.id]: false }));
                              updateBlock(block.id, '');
                            }}
                            className="px-3 py-1 text-xs text-gray-400 hover:text-white border border-[#333] rounded hover:border-[#555] transition-colors"
                          >
                            Cambiar imagen
                          </button>
                        </div>
                      ) : (
                        /* Mostrar opciones de carga solo si no hay imagen */
                        <div className="space-y-4">
                          {/* URL Input */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">URL de imagen:</label>
                            <input
                              type="url"
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, e.target.value)}
                              placeholder="https://ejemplo.com/imagen.jpg"
                              className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-gray-300 placeholder-gray-600 focus:border-white focus:outline-none"
                            />
                          </div>
                          
                          {/* Divider */}
                          <div className="flex items-center">
                            <div className="flex-1 border-t border-[#333]"></div>
                            <span className="px-3 text-sm text-gray-500">- O -</span>
                            <div className="flex-1 border-t border-[#333]"></div>
                          </div>
                          
                          {/* Upload Area */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Cargar desde tu computadora:</label>
                            <div 
                              className="border-2 border-dashed border-[#444] rounded-lg p-8 text-center hover:border-[#666] transition-colors cursor-pointer"
                              onClick={() => document.getElementById(`file-input-${block.id}`)?.click()}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('border-[#666]', 'bg-[#111]');
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-[#666]', 'bg-[#111]');
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-[#666]', 'bg-[#111]');
                                const files = e.dataTransfer.files;
                                if (files.length > 0) {
                                  handleFileUpload(files[0], block.id);
                                }
                              }}
                            >
                              <input
                                id={`file-input-${block.id}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(e.target.files[0], block.id);
                                  }
                                }}
                              />
                              <div className="space-y-2">
                                <div className="w-12 h-12 mx-auto text-gray-500">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-400">
                                  Haz clic para seleccionar una imagen o arrastra y suelta aquí
                                </p>
                                <p className="text-xs text-gray-500">
                                  Formatos soportados: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {block.type === 'list' && (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      onBlur={(e) => handleListBlur(block.id, e.target.value)}
                      placeholder="• Elemento 1&#10;• Elemento 2&#10;• Elemento 3"
                      className="w-full min-h-[100px] text-gray-300 bg-transparent border-none outline-none placeholder-gray-600 resize-none"
                    />
                  )}
                </div>

                {/* Remove Button */}
                {!block.isFixed && (
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {/* Add Block Button */}
            <div className="flex flex-wrap gap-2 pt-4">
              <button
                onClick={() => addBlock('text')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#333] rounded-lg hover:border-[#555] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Texto
              </button>
              <button
                onClick={() => addBlock('image')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#333] rounded-lg hover:border-[#555] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Imagen
              </button>
              <button
                onClick={() => addBlock('list')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#333] rounded-lg hover:border-[#555] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Lista
              </button>
              <button
                onClick={() => addBlock('divider')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#333] rounded-lg hover:border-[#555] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Divisor
              </button>
              <button
                onClick={() => addBlock('video')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#333] rounded-lg hover:border-[#555] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Video
              </button>
              <button
                onClick={() => addBlock('url')}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#333] rounded-lg hover:border-[#555] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                URL
              </button>
            </div>
          </div>
        </div>

        {/* Panel de Índice */}
        <div className="w-80 border-l border-[#1a1a1a] p-6">
          <div className="sticky top-6">
            <h3 className="text-lg font-medium mb-4">Índice del Contenido</h3>
            <p className="text-sm text-gray-400 mb-4">
              Crea el índice que los usuarios verán antes de acceder al contenido.
            </p>
            
            <div className="space-y-3">
              {indexSections.map((section, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => updateIndexSection(index, e.target.value)}
                    placeholder={`Sección ${index + 1}...`}
                    className="flex-1 px-3 py-2 text-sm bg-[#111] border border-[#333] rounded-lg focus:border-white focus:outline-none"
                  />
                  {indexSections.length > 1 && (
                    <button
                      onClick={() => removeIndexSection(index)}
                      className="px-2 py-2 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addIndexSection}
                className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white border border-dashed border-[#333] rounded-lg hover:border-[#555] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Agregar Sección
              </button>
            </div>

            {/* Estado de Publicación */}
            <div className="mt-6 p-4 bg-[#111] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${canPublish() ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm font-medium">
                  {canPublish() ? 'Listo para publicar' : 'Completa los campos requeridos'}
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div className={blocks.find(b => b.type === 'title')?.content.trim() ? 'text-green-400' : 'text-red-400'}>
                  ✓ Título
                </div>
                <div className={blocks.find(b => b.type === 'subtitle')?.content.trim() ? 'text-green-400' : 'text-red-400'}>
                  ✓ Subtítulo
                </div>
                <div className={indexSections.some(s => s.trim()) ? 'text-green-400' : 'text-red-400'}>
                  ✓ Índice
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] rounded-lg flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
              <h2 className="text-xl font-semibold text-white">Vista Previa del Contenido</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Contenido del modal */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                {previewBlocks.map((block) => (
                  <div key={block.id} className="mb-6">
                    {renderPreviewBlock(block)}
                  </div>
                ))}
                
                {/* Índice del contenido */}
                {indexSections.some(section => section.trim()) && (
                  <div className="mt-8 p-4 bg-[#111] rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Índice del Contenido</h3>
                    <ul className="space-y-2">
                      {indexSections.filter(section => section.trim()).map((section, index) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <span className="text-white mr-2">{index + 1}.</span>
                          <span>{section}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer del modal */}
            <div className="p-4 border-t border-[#1a1a1a]">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    onSave(blocks);
                    setShowPreview(false);
                  }}
                  disabled={!canPublish()}
                  className="px-6 py-2 bg-white text-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
