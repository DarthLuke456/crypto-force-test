'use client';

import React, { useState, useRef } from 'react';
import { Plus, X, Save, Eye, ArrowRight, GripVertical, Lock } from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'title' | 'subtitle' | 'text' | 'image' | 'list' | 'quote' | 'link' | 'video' | 'code' | 'divider' | 'checklist' | 'carousel';
  content: string;
  isFixed?: boolean;
  order: number;
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

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => !block.isFixed && block.id !== id));
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
              onClick={() => onPreview(blocks)}
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
                  
                  {block.type === 'image' && (
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
                        <div className="border-2 border-dashed border-[#444] rounded-lg p-8 text-center hover:border-[#666] transition-colors cursor-pointer">
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
                      
                      {/* Preview if image exists */}
                      {block.content && block.content.startsWith('http') && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-300 mb-2 block">Vista previa:</label>
                          <div className="border border-[#333] rounded-lg p-2 bg-[#111]">
                            <img 
                              src={block.content} 
                              alt="Preview" 
                              className="max-w-full h-32 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {block.type === 'list' && (
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
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
            <div className="flex gap-2 pt-4">
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
    </div>
  );
}
