'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Plus, Type, List, CheckSquare, Image, Video, Link, Code, Quote, Minus, XCircle, Settings, X, Info, Tag, Target, ChevronDown, Save } from 'lucide-react';
import NotionBlock from './NotionBlock';
import ProposalHeader from './ProposalHeader';

interface Block {
  id: string;
  type: 'text' | 'heading' | 'subheading' | 'list' | 'checklist' | 'image' | 'video' | 'link' | 'code' | 'quote' | 'divider';
  content: string;
  metadata?: any;
  order: number;
}

// Función para convertir bloques del NotionEditor a ContentBlock del sistema
const convertBlockToContentBlock = (block: Block): any => {
  const baseBlock = {
    id: block.id,
    order: block.order,
    metadata: block.metadata || {}
  };

  switch (block.type) {
    case 'heading':
      return {
        ...baseBlock,
        type: 'text',
        content: block.content,
        metadata: {
          ...block.metadata,
          isHeading: true
        }
      };
    case 'subheading':
      return {
        ...baseBlock,
        type: 'text',
        content: block.content,
        metadata: {
          ...block.metadata,
          isSubheading: true
        }
      };
    case 'list':
      return {
        ...baseBlock,
        type: 'text',
        content: block.content,
        metadata: {
          ...block.metadata,
          isList: true
        }
      };
    case 'checklist':
      return {
        ...baseBlock,
        type: 'checklist',
        content: block.content
      };
    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        content: block.content
      };
    case 'video':
      return {
        ...baseBlock,
        type: 'video',
        content: block.content
      };
    case 'link':
      return {
        ...baseBlock,
        type: 'link',
        content: block.content
      };
    case 'code':
      return {
        ...baseBlock,
        type: 'code',
        content: block.content
      };
    case 'quote':
      return {
        ...baseBlock,
        type: 'quote',
        content: block.content
      };
    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        content: block.content
      };
    default:
      return {
        ...baseBlock,
        type: 'text',
        content: block.content
      };
  }
};

interface NotionEditorProps {
  initialBlocks?: Block[];
  onBlocksChange?: (blocks: Block[]) => void;
  onSave?: (blocks: any[], metadata: ProposalMetadata) => void;
  readOnly?: boolean;
}

interface ProposalMetadata {
  title: string;
  description: string;
  category: 'theoretical' | 'practical' | 'checkpoint';
  targetHierarchy: number;
}

const blockTypeOptions = [
  { type: 'heading', icon: Type, label: 'Título', description: 'Título principal grande' },
  { type: 'subheading', icon: Type, label: 'Subtítulo', description: 'Subtítulo mediano' },
  { type: 'text', icon: Type, label: 'Texto', description: 'Párrafo simple' },
  { type: 'list', icon: List, label: 'Lista', description: 'Lista con viñetas' },
  { type: 'checklist', icon: CheckSquare, label: 'Checklist', description: 'Lista de tareas' },
  { type: 'image', icon: Image, label: 'Imagen', description: 'Insertar imagen' },
  { type: 'video', icon: Video, label: 'Video', description: 'Insertar video' },
  { type: 'link', icon: Link, label: 'Enlace', description: 'Enlace externo' },
  { type: 'code', icon: Code, label: 'Código', description: 'Bloque de código' },
  { type: 'quote', icon: Quote, label: 'Cita', description: 'Cita destacada' },
  { type: 'divider', icon: Minus, label: 'Separador', description: 'Línea divisoria' },
];

export default function NotionEditor({
  initialBlocks = [],
  onBlocksChange,
  onSave,
  readOnly = false,
  isEditing = false,
  onUpdate
}: NotionEditorProps & {
  isEditing?: boolean;
  onUpdate?: (blocks: any[], metadata: ProposalMetadata) => void;
}) {
  const [blocks, setBlocks] = useState<Block[]>(Array.isArray(initialBlocks) ? initialBlocks : []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [slashMenuFilter, setSlashMenuFilter] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
     const [proposalMetadata, setProposalMetadata] = useState<ProposalMetadata>({
     title: '',
     description: '',
     category: 'theoretical',
     targetHierarchy: 2, // Acólito por defecto (Nivel 2)
   });
  const editorRef = useRef<HTMLDivElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Autosave con debounce
  useEffect(() => {
    if (onBlocksChange) {
      const timeoutId = setTimeout(() => {
        onBlocksChange(blocks);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [blocks, onBlocksChange]);

  // Generar ID único
  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Crear nuevo bloque
  const createBlock = useCallback((type: string, content: string = '', metadata?: any): Block => ({
    id: generateId(),
    type: type as Block['type'],
    content,
    metadata,
    order: blocks.length,
  }), [blocks.length]);

  // Agregar bloque
  const addBlock = (afterId: string, type: string) => {
    const afterIndex = blocks.findIndex(b => b.id === afterId);
    const newBlock = createBlock(type);
    
    const newBlocks = [...blocks];
    newBlocks.splice(afterIndex + 1, 0, newBlock);
    
    // Reordenar
    newBlocks.forEach((block, index) => {
      block.order = index;
    });
    
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    setShowBlockMenu(false);
  };

  // Actualizar bloque
  const updateBlock = (id: string, content: string, metadata?: any) => {
    setBlocks(prev => prev.map(block => 
      block.id === id 
        ? { ...block, content, metadata: { ...block.metadata, ...metadata } }
        : block
    ));
  };

     // Eliminar bloque
   const deleteBlock = (id: string) => {
     const blockToDelete = blocks.find(b => b.id === id);
     
     // No permitir eliminar bloques obligatorios si son los únicos de su tipo
     if (blockToDelete?.type === 'heading' && blocks.filter(b => b.type === 'heading').length <= 1) {
       alert('No puedes eliminar el único bloque de título. Debes tener al menos uno.');
       return;
     }
     
     if (blockToDelete?.type === 'subheading' && blocks.filter(b => b.type === 'subheading').length <= 1) {
       alert('No puedes eliminar el único bloque de subtítulo. Debes tener al menos uno.');
       return;
     }
     
     if (blocks.length <= 2) return; // Mantener al menos título y subtítulo
     
     setBlocks(prev => {
       const newBlocks = prev.filter(block => block.id !== id);
       // Reordenar
       newBlocks.forEach((block, index) => {
         block.order = index;
       });
       return newBlocks;
     });
     
     setSelectedBlockId(null);
   };

  // Duplicar bloque
  const duplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find(b => b.id === id);
    if (!blockToDuplicate) return;
    
    const newBlock = createBlock(
      blockToDuplicate.type,
      blockToDuplicate.content,
      blockToDuplicate.metadata
    );
    
    const blockIndex = blocks.findIndex(b => b.id === id);
    const newBlocks = [...blocks];
    newBlocks.splice(blockIndex + 1, 0, newBlock);
    
    // Reordenar
    newBlocks.forEach((block, index) => {
      block.order = index;
    });
    
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  // Mover bloque
  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(b => b.id === id);
    if (currentIndex === -1) return;
    
    let newIndex: number;
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < blocks.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return;
    }
    
    const newBlocks = [...blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];
    
    // Reordenar
    newBlocks.forEach((block, index) => {
      block.order = index;
    });
    
    setBlocks(newBlocks);
  };

     // Cambiar tipo de bloque
   const changeBlockType = (id: string, newType: string) => {
     const blockToChange = blocks.find(b => b.id === id);
     
     // No permitir cambiar el tipo de bloques obligatorios si son los únicos de su tipo
     if (blockToChange?.type === 'heading' && blocks.filter(b => b.type === 'heading').length <= 1 && newType !== 'heading') {
       alert('No puedes cambiar el tipo del único bloque de título. Debes mantener al menos uno.');
       return;
     }
     
     if (blockToChange?.type === 'subheading' && blocks.filter(b => b.type === 'subheading').length <= 1 && newType !== 'subheading') {
       alert('No puedes cambiar el tipo del único bloque de subtítulo. Debes mantener al menos uno.');
       return;
     }
     
     setBlocks(prev => prev.map(block => 
       block.id === id 
         ? { ...block, type: newType as Block['type'] }
         : block
     ));
   };

  // Drag & Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedBlock = blocks.find(block => block.id === active.id);
    setDraggedBlock(draggedBlock || null);
  };

  const handleDragOver = (event: any) => {
    const { over } = event;
    if (over?.id && typeof over.id === 'string' && over.id.startsWith('drop-zone-')) {
      setActiveDropZone(over.id);
    } else {
      setActiveDropZone(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedBlock(null);
    setActiveDropZone(null);

    if (active.id !== over?.id) {
      const draggedBlock = blocks.find(block => block.id === active.id);
      
      // No permitir mover bloques de título o subtítulo
      if (draggedBlock && (draggedBlock.type === 'heading' || draggedBlock.type === 'subheading')) {
        return;
      }

      // Check if dropping on a drop zone around an image
      if (over?.id && typeof over.id === 'string' && over.id.startsWith('drop-zone-')) {
        const targetBlockId = over.id.replace('drop-zone-', '');
        const targetIndex = blocks.findIndex(block => block.id === targetBlockId);
        const draggedIndex = blocks.findIndex(block => block.id === active.id);
        
        if (targetIndex !== -1 && draggedIndex !== -1) {
          setBlocks((items) => {
            const newBlocks = [...items];
            const [draggedItem] = newBlocks.splice(draggedIndex, 1);
            
            // Insert before or after the target based on drop zone
            const insertIndex = String(over.id).includes('-before') ? targetIndex : targetIndex + 1;
            newBlocks.splice(insertIndex, 0, draggedItem);
            
            // Reordenar
            newBlocks.forEach((block, index) => {
              block.order = index;
            });
            
            return newBlocks;
          });
        }
        return;
      }
      
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newBlocks = arrayMove(items, oldIndex, newIndex);
        
        // Reordenar
        newBlocks.forEach((block, index) => {
          block.order = index;
        });
        
        return newBlocks;
      });
    }
  };

  // Slash menu
  const handleSlashKey = (e: React.KeyboardEvent) => {
    if (e.key === '/' && !showSlashMenu) {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSlashMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.bottom + window.scrollY
        });
        setShowSlashMenu(true);
        setSlashMenuFilter('');
      }
    }
  };

  // Filtrar opciones del slash menu
  const filteredBlockOptions = blockTypeOptions.filter(option =>
    option.label.toLowerCase().includes(slashMenuFilter.toLowerCase()) ||
    option.description.toLowerCase().includes(slashMenuFilter.toLowerCase())
  );

  // Agregar bloque desde slash menu
  const addBlockFromSlash = (type: string) => {
    if (selectedBlockId) {
      addBlock(selectedBlockId, type);
    } else {
      const newBlock = createBlock(type);
      setBlocks(prev => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);
    }
    setShowSlashMenu(false);
  };

  // Click fuera del slash menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(event.target as Node)) {
        setShowSlashMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

     // Inicializar con bloques obligatorios si no hay ninguno
   useEffect(() => {
     if (blocks.length === 0) {
       const titleBlock = createBlock('heading', 'Título de la propuesta');
       const subtitleBlock = createBlock('subheading', 'Subtítulo de la propuesta');
       const initialBlocks = [titleBlock, subtitleBlock];
       setBlocks(initialBlocks);
       setSelectedBlockId(titleBlock.id);
     }
   }, [blocks.length, createBlock]);

     // Solo sugerir título y descripción si están vacíos
   useEffect(() => {
     if (!proposalMetadata.title && !proposalMetadata.description) {
       const titleBlock = blocks.find(b => b.type === 'heading');
       const subtitleBlock = blocks.find(b => b.type === 'subheading');
       
       setProposalMetadata(prev => ({
         ...prev,
         title: titleBlock?.content || '',
         description: subtitleBlock?.content || '',
       }));
     }
   }, [blocks, proposalMetadata.title, proposalMetadata.description]);

  return (
    <div className="min-h-screen bg-[#121212] text-[#fafafa]">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header del editor - Mejorado */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#fafafa] mb-1">Creador de Contenido</h1>
              <p className="text-sm text-[#8a8a8a]">Crea contenido visual y atractivo para el Tribunal Imperial</p>
          </div>
          
            {/* Status indicator */}
           {isEditing && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-900/20 border border-blue-500/30 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium">Editando</span>
             </div>
           )}
         </div>

          {/* Quick tips */}
          <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#fafafa] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#121212] text-xs font-bold">💡</span>
              </div>
              <div className="text-sm text-[#8a8a8a]">
                <p className="font-medium text-[#fafafa] mb-1">Consejos para crear contenido efectivo:</p>
                <ul className="space-y-1 text-[#8a8a8a]">
                  <li>• Usa títulos claros y descriptivos</li>
                  <li>• Añade imágenes para hacer el contenido más visual</li>
                  <li>• Organiza la información con subtítulos y listas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Editor principal - Mejorado */}
        <div
          ref={editorRef}
          className="bg-[#121212] border border-[#8a8a8a] rounded-xl shadow-lg p-8 min-h-[700px] relative"
          onKeyDown={handleSlashKey}
        >
          {/* Editor background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#121212] to-[#0f0f0f] rounded-xl opacity-50"></div>
          
          {/* Content area */}
          <div className="relative z-10">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={Array.isArray(blocks) ? [
                ...blocks.map(block => block.id),
                ...blocks.filter(block => block.type === 'image').flatMap(block => [
                  `drop-zone-${block.id}-before`,
                  `drop-zone-${block.id}-after`
                ])
              ] : []}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {Array.isArray(blocks) ? (() => {
                  const renderedBlocks = [];
                  let skipNext = false;
                  
                  for (let index = 0; index < blocks.length; index++) {
                    if (skipNext) {
                      skipNext = false;
                      continue;
                    }
                    
                    const block = blocks[index];
                    const nextBlock = blocks[index + 1];
                    const isImageWithText = block.type === 'image' && nextBlock && nextBlock.type === 'text';
                    
                    if (isImageWithText) {
                      skipNext = true; // Skip the next block as it will be rendered with this one
                    }
                    
                    renderedBlocks.push(
                      <div key={block.id} className="group">
                    {/* Drop zone before image blocks */}
                    {block.type === 'image' && (
                      <div
                        id={`drop-zone-${block.id}-before`}
                        className={`h-4 bg-transparent hover:bg-[#fafafa]/10 hover:border-2 hover:border-dashed hover:border-[#fafafa]/30 transition-all duration-200 rounded-lg mx-4 group relative ${
                          activeDropZone === `drop-zone-${block.id}-before` ? 'bg-[#fafafa]/20 border-2 border-dashed border-[#fafafa]/50' : ''
                        }`}
                        data-drop-zone="before"
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center space-x-2 text-[#8a8a8a] text-sm">
                            <div className="w-2 h-2 bg-[#fafafa] rounded-full"></div>
                            <span>Drop content here</span>
                            <div className="w-2 h-2 bg-[#fafafa] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                        
                        {/* Render image and text together if they should wrap */}
                        {isImageWithText ? (
                          <div className="relative">
                            {/* Image block - positioned with float */}
                            <div className="float-left mr-4 mb-4">
                  <NotionBlock
                    id={block.id}
                    type={block.type}
                    content={block.content}
                    metadata={block.metadata}
                    isSelected={selectedBlockId === block.id}
                    onSelect={setSelectedBlockId}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                    onDuplicate={duplicateBlock}
                    onMove={moveBlock}
                    onTypeChange={changeBlockType}
                    onAddBlock={addBlock}
                  />
                            </div>
                            
                            {/* Text block that wraps around image naturally */}
                            <div className="text-flow magazine-layout">
                              <NotionBlock
                                id={nextBlock.id}
                                type={nextBlock.type}
                                content={nextBlock.content}
                                metadata={nextBlock.metadata}
                                isSelected={selectedBlockId === nextBlock.id}
                                onSelect={setSelectedBlockId}
                                onUpdate={updateBlock}
                                onDelete={deleteBlock}
                                onDuplicate={duplicateBlock}
                                onMove={moveBlock}
                                onTypeChange={changeBlockType}
                                onAddBlock={addBlock}
                              />
                            </div>
                            
                            {/* Clear float */}
                            <div className="clear-both"></div>
                          </div>
                        ) : (
                          <NotionBlock
                            id={block.id}
                            type={block.type}
                            content={block.content}
                            metadata={block.metadata}
                            isSelected={selectedBlockId === block.id}
                            onSelect={setSelectedBlockId}
                            onUpdate={updateBlock}
                            onDelete={deleteBlock}
                            onDuplicate={duplicateBlock}
                            onMove={moveBlock}
                            onTypeChange={changeBlockType}
                            onAddBlock={addBlock}
                          />
                        )}
                        
                        {/* Drop zone after image blocks */}
                        {block.type === 'image' && (
                          <div
                            id={`drop-zone-${block.id}-after`}
                            className={`h-4 bg-transparent hover:bg-[#fafafa]/10 hover:border-2 hover:border-dashed hover:border-[#fafafa]/30 transition-all duration-200 rounded-lg mx-4 group relative ${
                              activeDropZone === `drop-zone-${block.id}-after` ? 'bg-[#fafafa]/20 border-2 border-dashed border-[#fafafa]/50' : ''
                            }`}
                            data-drop-zone="after"
                          >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="flex items-center space-x-2 text-[#8a8a8a] text-sm">
                                <div className="w-2 h-2 bg-[#fafafa] rounded-full"></div>
                                <span>Drop content here</span>
                                <div className="w-2 h-2 bg-[#fafafa] rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return renderedBlocks;
                })() : (
                  <div className="text-center py-12 text-[#8a8a8a]">
                    <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus size={24} className="text-[#8a8a8a]" />
                    </div>
                    <p className="text-lg font-medium mb-2 text-[#fafafa]">Comienza a crear contenido</p>
                    <p className="text-sm text-[#8a8a8a]">Haz clic en el botón de abajo para agregar tu primer bloque</p>
                  </div>
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {draggedBlock ? (
                <div className="bg-[#121212] border-2 border-[#fafafa] rounded-lg p-4 shadow-2xl opacity-95 transform rotate-2 scale-105">
                  <div className="flex items-center space-x-3 text-[#fafafa]">
                    <div className="w-3 h-3 bg-[#fafafa] rounded-full animate-pulse"></div>
                    <span className="font-medium">{draggedBlock.content || 'Bloque vacío'}</span>
                    <div className="w-3 h-3 bg-[#fafafa] rounded-full animate-pulse"></div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          </div>

          {/* Botón flotante para agregar bloque - MEJORADO */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="group relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out overflow-hidden hover:scale-105"
            >
              {/* Fondo expandible */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out group-hover:w-56 group-hover:rounded-xl"></div>
              
              {/* Ícono */}
              <div className="relative z-10 flex items-center justify-center w-14 h-14">
                <Plus size={24} className="transition-all duration-300 group-hover:scale-110" />
              </div>
              
              {/* Texto que aparece */}
              <span className="absolute left-14 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 whitespace-nowrap">
                Agregar nuevo bloque
              </span>
              
              {/* Indicador de estado */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </button>
            
            {/* Texto de ayuda */}
            <p className="text-xs text-[#8a8a8a] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Haz clic para ver todos los tipos de contenido disponibles
            </p>
          </div>

          {/* Menú de tipos de bloque - MEJORADO */}
          {showBlockMenu && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-[#121212] border border-[#8a8a8a] rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-[#8a8a8a] bg-[#121212]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#fafafa]">Agregar nuevo bloque</h3>
                      <p className="text-sm text-[#8a8a8a] mt-1">Selecciona el tipo de contenido que quieres crear</p>
                </div>
                    <button
                      onClick={() => setShowBlockMenu(false)}
                      className="p-2 text-[#8a8a8a] hover:text-[#fafafa] hover:bg-[#8a8a8a] rounded-lg transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {blockTypeOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.type}
                          onClick={() => {
                            if (selectedBlockId) {
                              addBlock(selectedBlockId, option.type);
                            } else {
                              const newBlock = createBlock(option.type);
                              setBlocks(prev => [...prev, newBlock]);
                              setSelectedBlockId(newBlock.id);
                            }
                            setShowBlockMenu(false);
                          }}
                          className="group relative overflow-hidden flex items-center space-x-4 p-4 text-left hover:bg-[#fafafa]/10 rounded-xl transition-all duration-200 ease-out transform hover:scale-105 border border-[#8a8a8a] hover:border-[#fafafa] hover:shadow-md"
                        >
                          {/* Icono */}
                          <div className="p-3 bg-[#121212] group-hover:bg-[#fafafa]/20 rounded-xl transition-all duration-200 ease-out transform group-hover:scale-110">
                            <IconComponent size={20} className="text-[#8a8a8a] group-hover:text-[#fafafa]" />
                          </div>
                          
                          {/* Contenido */}
                            <div className="flex-1">
                            <div className="font-semibold text-[#fafafa] group-hover:text-[#fafafa] transition-colors duration-200">{option.label}</div>
                            <div className="text-sm text-[#8a8a8a] group-hover:text-[#8a8a8a] transition-colors duration-200">{option.description}</div>
                          </div>
                          
                          {/* Indicador de selección */}
                          <div className="w-2 h-2 bg-[#fafafa] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slash menu */}
        {showSlashMenu && (
          <div
            ref={slashMenuRef}
            className="fixed z-50 bg-[#121212] border border-[#8a8a8a] rounded-lg shadow-2xl max-w-sm w-full"
            style={{
              left: slashMenuPosition.x - 150,
              top: slashMenuPosition.y + 10,
            }}
          >
            <div className="p-3 border-b border-[#8a8a8a]">
              <input
                type="text"
                value={slashMenuFilter}
                onChange={(e) => setSlashMenuFilter(e.target.value)}
                placeholder="Buscar tipo de bloque..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredBlockOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => addBlockFromSlash(option.type)}
                    className="group relative overflow-hidden w-full flex items-center space-x-3 p-4 text-left hover:bg-gradient-to-r hover:from-[#121212] hover:to-[#3a3a3a] rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 border border-transparent hover:border-[#fafafa]/30"
                  >
                    {/* Efecto de brillo animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa]/10 to-[#8a8a8a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Contenido del botón */}
                    <div className="relative flex items-center space-x-3 w-full">
                      <div className="p-3 bg-gradient-to-br from-[#8a8a8a] to-[#8a8a8a] rounded-xl group-hover:from-[#fafafa] group-hover:to-[#8a8a8a] group-hover:text-[#121212] transition-all duration-300 ease-out transform group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                        <IconComponent size={18} />
                    </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white group-hover:text-[#fafafa] transition-colors duration-300">{option.label}</div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{option.description}</div>
                    </div>
                    </div>
                    
                    {/* Indicador de selección */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-[#fafafa] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Barra de herramientas flotante - MINIMALISTA */}
        {selectedBlockId && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#121212] to-[#121212] border border-[#8a8a8a] rounded-2xl shadow-2xl p-3 z-40 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              {/* Botón de Guardar - MEJORADO */}
              <button
                onClick={() => setShowConfigModal(true)}
                className="group relative inline-flex items-center justify-center w-12 h-12 text-[#121212] rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-out overflow-hidden"
                title="Configurar y Guardar Propuesta"
              >
                {/* Fondo expandible con pulso */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] to-[#8a8a8a] rounded-full transition-all duration-500 ease-out group-hover:w-40 group-hover:rounded-xl group-active:scale-95"></div>
                
                {/* Efecto de pulso sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] to-[#8a8a8a] rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
                
                {/* Ícono mejorado */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12">
                  <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z"/>
                  <path d="M14 2v6h6"/>
                  <path d="M16 13H8"/>
                  <path d="M16 17H8"/>
                  <path d="M10 9H8"/>
                    {/* Indicador de guardado */}
                    <circle cx="18" cy="6" r="2" fill="#121212" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    <path d="M17 5l1 1 2-2" stroke="#fafafa" strokeWidth="1.5" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                </svg>
                </div>
                
                {/* Texto que aparece con mejor tipografía */}
                <span className="absolute left-12 text-sm font-bold text-[#121212] opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 whitespace-nowrap z-20 tracking-wide">
                  Guardar
                </span>
                
                {/* Indicador de estado */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300">
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                </div>
              </button>
              
              {/* Botón de Deseleccionar - MEJORADO */}
              <button
                onClick={() => setSelectedBlockId(null)}
                className="group relative inline-flex items-center justify-center w-12 h-12 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-out overflow-hidden"
                title="Deseleccionar Bloque"
              >
                {/* Fondo expandible con gradiente mejorado */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full transition-all duration-500 ease-out group-hover:w-44 group-hover:rounded-xl group-active:scale-95"></div>
                
                {/* Efecto de hover sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                
                {/* Ícono mejorado con mejor semántica */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12">
                  <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {/* Círculo de selección */}
                    <circle cx="12" cy="12" r="10" className="opacity-30 group-hover:opacity-60 transition-opacity duration-300"/>
                    {/* Flecha de salida */}
                    <path d="M8 12h8M12 8l4 4-4 4" className="group-hover:stroke-blue-300 transition-colors duration-300"/>
                    {/* Indicador de deselección */}
                    <circle cx="18" cy="6" r="2" fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    <path d="M17 5l1 1 2-2" stroke="white" strokeWidth="1" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                </svg>
                </div>
                
                {/* Texto que aparece con mejor semántica */}
                <span className="absolute left-12 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 whitespace-nowrap z-20 tracking-wide">
                  Deseleccionar
                </span>
                
                {/* Indicador de acción */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300">
                  <div className="w-full h-full bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Modal de Configuración */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#fafafa] to-[#8a8a8a] rounded-xl flex items-center justify-center shadow-lg">
                      <Settings size={22} className="text-[#121212]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Configurar Propuesta</h3>
                      <p className="text-sm text-gray-400">Define los detalles de tu contenido</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#8a8a8a] rounded-lg transition-all duration-200 group"
                  >
                    <XCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </div>
                 
                                 <div className="space-y-4">
                  {/* Información automática */}
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                        <Info size={14} className="text-white" />
                      </div>
                      <h4 className="text-blue-300 font-semibold">Información Automática</h4>
                    </div>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      El título y descripción se obtienen automáticamente del primer bloque (Título) y segundo bloque (Subtítulo) del contenido.
                    </p>
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Tag size={16} className="mr-2 text-[#fafafa]" />
                      Categoría
                    </label>
                    <div className="relative">
                    <select
                      value={proposalMetadata.category}
                      onChange={(e) => setProposalMetadata(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full bg-[#121212] border border-[#8a8a8a] rounded-lg px-3 py-2 text-white appearance-none cursor-pointer hover:border-[#fafafa]/50 transition-colors"
                    >
                      <option value="theoretical">Teórico</option>
                      <option value="practical">Práctico</option>
                      <option value="checkpoint">Punto de Control</option>
                    </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Dashboard Destino */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Target size={16} className="mr-2 text-[#fafafa]" />
                      Dashboard Destino
                    </label>
                    <div className="relative">
                    <select
                      value={proposalMetadata.targetHierarchy}
                      onChange={(e) => setProposalMetadata(prev => ({ ...prev, targetHierarchy: parseInt(e.target.value) }))}
                        className="w-full bg-[#121212] border border-[#8a8a8a] rounded-lg px-3 py-2 text-white appearance-none cursor-pointer hover:border-[#fafafa]/50 transition-colors"
                    >
                      <option value={1}>1 - Iniciado (Nivel 1)</option>
                      <option value={2}>2 - Acólito (Nivel 2)</option>
                      <option value={3}>3 - Warrior (Nivel 3)</option>
                      <option value={4}>4 - Lord (Nivel 4)</option>
                      <option value={5}>5 - Darth (Nivel 5)</option>
                      <option value={6}>6 - Maestro (Nivel 6)</option>
                    </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    
                    {/* Vista previa de la insignia seleccionada */}
                    <div className="mt-3 flex items-center space-x-3 p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        proposalMetadata.targetHierarchy === 1 ? 'bg-gradient-to-br from-green-400 to-green-600' :
                        proposalMetadata.targetHierarchy === 2 ? 'bg-gradient-to-br from-#fafafa to-#8a8a8a' :
                        proposalMetadata.targetHierarchy === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        proposalMetadata.targetHierarchy === 4 ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                        proposalMetadata.targetHierarchy === 5 ? 'bg-gradient-to-br from-red-500 to-red-700' :
                        'bg-gradient-to-br from-gray-500 to-gray-700'
                      }`}>
                        <span className="text-white text-sm font-bold">{proposalMetadata.targetHierarchy}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {proposalMetadata.targetHierarchy === 1 ? 'Iniciado' :
                           proposalMetadata.targetHierarchy === 2 ? 'Acólito' :
                           proposalMetadata.targetHierarchy === 3 ? 'Warrior' :
                           proposalMetadata.targetHierarchy === 4 ? 'Lord' :
                           proposalMetadata.targetHierarchy === 5 ? 'Darth' :
                           'Maestro'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Nivel {proposalMetadata.targetHierarchy}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  {/* Botón Cancelar */}
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="group flex items-center space-x-2 px-6 py-3 bg-[#121212] hover:bg-[#3a3a3a] border border-[#8a8a8a] hover:border-[#666] text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <X size={18} className="group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Cancelar</span>
                  </button>
                  
                  {/* Botón Guardar Propuesta */}
                                     <button
                     onClick={() => {
                       // Validar que existan los bloques obligatorios
                       const hasTitle = blocks.some(b => b.type === 'heading' && b.content.trim());
                       const hasSubtitle = blocks.some(b => b.type === 'subheading' && b.content.trim());
                       
                       if (!hasTitle) {
                         alert('Debes tener al menos un bloque de tipo "Título" con contenido.');
                         return;
                       }
                       
                       if (!hasSubtitle) {
                         alert('Debes tener al menos un bloque de tipo "Subtítulo" con contenido.');
                         return;
                       }
                       
                       // Obtener título y descripción automáticamente de los bloques
                       const titleBlock = blocks.find(b => b.type === 'heading');
                       const subtitleBlock = blocks.find(b => b.type === 'subheading');
                       
                       if (titleBlock && subtitleBlock) {
                         // Actualizar metadata con el contenido de los bloques
                         const updatedMetadata = {
                           ...proposalMetadata,
                           title: titleBlock.content.trim(),
                           description: subtitleBlock.content.trim()
                         };
                         
                         // Convertir bloques al formato del sistema
                        const convertedBlocks = Array.isArray(blocks) ? blocks.map(convertBlockToContentBlock) : [];
                         
                         if (isEditing && onUpdate) {
                           onUpdate(convertedBlocks, updatedMetadata);
                         } else if (onSave) {
                           onSave(convertedBlocks, updatedMetadata);
                         }
                         
                         setShowConfigModal(false);
                       } else {
                         alert('Error: No se pudieron obtener el título y subtítulo de los bloques.');
                       }
                     }}
                    className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#fafafa] to-[#8a8a8a] hover:from-[#8a8a8a] hover:to-[#8a8a8a] text-[#121212] rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#fafafa]/25"
                  >
                    <Save size={18} className="group-hover:scale-110 transition-transform duration-200" />
                    <span>{isEditing ? 'Actualizar' : 'Guardar'} Propuesta</span>
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
