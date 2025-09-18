'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, X, Eye, Save, FileText, Image as ImageIcon, Video, Link, Code, Quote, Minus, CheckSquare, Upload, Bold, Italic, Underline, Type, Move, Maximize2, ArrowLeft } from 'lucide-react';
import { ContentBlock } from '@/lib/tribunal/types';
import { useProposals, TribunalProposal } from '@/lib/tribunal/hooks/useProposals';

interface ContentEditorProps {
  onSave?: (content: ContentBlock[]) => void;
  onPreview?: (content: ContentBlock[]) => void;
  onProposalCreated?: (proposal: any) => void;
  authorId?: string;
  authorName?: string;
  authorLevel?: number;
}

// Nueva paleta de colores basada en la identidad visual de Crypto Force
const HIERARCHY_LEVELS = [
  { id: 1, name: 'Iniciado', color: '#FAFAFA', bgColor: 'bg-gray-100/20', borderColor: 'border-gray-300/30', insignia: '/images/insignias/1-iniciados.png' },
  { id: 2, name: 'Acólito', color: '#fafafa', bgColor: 'bg-#8a8a8a/20', borderColor: 'border-#fafafa/30', insignia: '/images/insignias/2-acolitos.png' },
  { id: 3, name: 'Warrior', color: '#3ED598', bgColor: 'bg-green-500/20', borderColor: 'border-green-400/30', insignia: '/images/insignias/3-warriors.png' },
  { id: 4, name: 'Lord', color: '#4671D5', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-400/30', insignia: '/images/insignias/4-lords.png' },
  { id: 5, name: 'Darth', color: '#EC4D58', bgColor: 'bg-red-500/20', borderColor: 'border-red-400/30', insignia: '/images/insignias/5-darths.png' },
  { id: 6, name: 'Maestro', color: '#8A8A8A', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-400/30', insignia: '/images/insignias/6-maestros.png' }
];

// Configuración de tamaños de texto estándar
const TEXT_SIZES = [
  { value: 'text-xs', label: 'Muy Pequeño' },
  { value: 'text-sm', label: 'Pequeño' },
  { value: 'text-base', label: 'Normal' },
  { value: 'text-lg', label: 'Grande' },
  { value: 'text-xl', label: 'Muy Grande' },
  { value: 'text-2xl', label: 'Título' },
  { value: 'text-3xl', label: 'Título Principal' }
];

export default function ContentEditor({ 
  onSave, 
  onPreview, 
  onProposalCreated,
  authorId = 'default_author',
  authorName = 'Autor',
  authorLevel = 6
}: ContentEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleCategory, setModuleCategory] = useState<'theoretical' | 'practical' | 'checkpoint'>('theoretical');
  const [targetHierarchy, setTargetHierarchy] = useState<number>(1);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
  const [textWrapMode, setTextWrapMode] = useState<'left' | 'right' | 'none'>('none');
  const [checkpointModules, setCheckpointModules] = useState<{ module1: string; module2: string }>({ module1: '', module2: '' });
  const [availableModules, setAvailableModules] = useState<Array<{ id: string; title: string; category: string }>>([]);
  const [draggedTextBlock, setDraggedTextBlock] = useState<string | null>(null);
  const [dropZoneHighlight, setDropZoneHighlight] = useState<'left' | 'right' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hook para gestionar propuestas
  const { createProposal } = useProposals();

  // Cargar módulos disponibles para Puntos de Control
  useEffect(() => {
    if (moduleCategory === 'checkpoint') {
      const loadAvailableModules = () => {
        try {
          const stored = localStorage.getItem('tribunal_proposals');
          if (stored) {
            const allProposals = JSON.parse(stored);
            const approvedModules = allProposals
              .filter((proposal: any) => proposal.status === 'approved')
              .map((proposal: any) => ({
                id: proposal.id,
                title: proposal.title,
                category: proposal.category
              }));
            setAvailableModules(approvedModules);
          }
        } catch (error) {
          console.error('Error loading available modules:', error);
        }
      };
      
      loadAvailableModules();
    }
  }, [moduleCategory]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      order: blocks.length,
      metadata: {
        fontSize: 'text-base',
        isBold: false,
        isItalic: false,
        isUnderlined: false,
        width: type === 'image' ? '100%' : undefined,
        height: type === 'image' ? 'auto' : undefined
      }
    };
    
    // Si es el primer bloque y no hay título, establecer uno por defecto
    if (blocks.length === 0 && !moduleTitle.trim()) {
      setModuleTitle('Nuevo Módulo');
    }
    
    // Si es el primer bloque y no hay descripción, establecer una por defecto
    if (blocks.length === 0 && !moduleDescription.trim()) {
      setModuleDescription('Descripción del módulo');
    }
    
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string, metadata?: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { 
        ...block, 
        content: content.trim() === '' ? ' ' : content, // Evitar contenido completamente vacío
        ...(metadata && { metadata: { ...block.metadata, ...metadata } }) 
      } : block
    ));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;

    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    
    // Actualizar el orden
    newBlocks.forEach((block, idx) => {
      block.order = idx;
    });
    
    setBlocks(newBlocks);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Timeout de seguridad para limpiar estados si algo sale mal
    setTimeout(() => {
      if (draggedBlock === blockId) {
        setDraggedBlock(null);
        setDragOverBlock(null);
      }
    }, 5000); // 5 segundos de timeout
    
    // Agregar efecto visual al cursor
    if (e.dataTransfer.setDragImage) {
      const dragImage = document.createElement('div');
      dragImage.innerHTML = '📄 Arrastrando...';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      dragImage.style.left = '-1000px';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = () => {
    // Limpiar estados cuando termina el arrastre
    setDraggedBlock(null);
    setDragOverBlock(null);
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    if (draggedBlock && draggedBlock !== blockId) {
      setDragOverBlock(blockId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Solo limpiar si realmente salimos del elemento
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverBlock(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (!draggedBlock || draggedBlock === targetBlockId) {
      // Si no hay bloque arrastrado o es el mismo, solo limpiar estados
      setDraggedBlock(null);
      setDragOverBlock(null);
      return;
    }

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlock);
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      // Si hay algún error, limpiar estados
      setDraggedBlock(null);
      setDragOverBlock(null);
      return;
    }

    const newBlocks = [...blocks];
    const [draggedBlockData] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlockData);
    
    // Actualizar el orden
    newBlocks.forEach((block, idx) => {
      block.order = idx;
    });
    
    setBlocks(newBlocks);
    
    // Limpiar estados después de un breve delay para permitir la animación
    setTimeout(() => {
      setDraggedBlock(null);
      setDragOverBlock(null);
    }, 100);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          updateBlock(blockId, result, { 
            fileName: file.name, 
            fileType: file.type,
            width: '100%',
            height: 'auto'
          });
          console.log(`✅ Imagen cargada exitosamente para el bloque ${blockId}:`, file.name);
        } else {
          console.error('❌ Error al cargar la imagen: resultado vacío');
        }
      };
      reader.onerror = () => {
        console.error('❌ Error al leer el archivo de imagen');
        alert('Error al cargar la imagen. Por favor, intenta de nuevo.');
      };
      reader.readAsDataURL(file);
    }
    // Limpiar el input para permitir cargar la misma imagen nuevamente
    event.target.value = '';
  };

  const triggerImageUpload = (blockId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-block-id', blockId);
      fileInputRef.current.click();
    }
  };



  const handlePreview = () => {
    if (blocks.length === 0) {
      alert('Por favor, agrega al menos un bloque de contenido antes de ver la vista previa');
      return;
    }
    
    setShowPreview(true);
    if (onPreview) {
      onPreview(blocks);
    }
  };

  const handleSave = () => {
    if (!moduleTitle.trim()) {
      alert('Por favor, ingresa un título para el módulo');
      return;
    }
    
    if (blocks.length === 0) {
      alert('Por favor, agrega al menos un bloque de contenido antes de guardar');
      return;
    }
    
    try {
      console.log('Guardando propuesta con bloques:', blocks);
      console.log('Tipos de bloques:', blocks.map(b => ({ id: b.id, type: b.type, content: b.content.substring(0, 100) })));
      
      // Crear la propuesta usando el hook
      const proposal = createProposal({
        title: moduleTitle,
        description: moduleDescription,
        category: moduleCategory,
        targetHierarchy,
        content: blocks,
        authorId,
        authorName,
        authorLevel,
        status: 'draft',
        votes: {
          maestros: [],
          approvals: [],
          rejections: []
        }
      });
      
      console.log('Propuesta creada exitosamente:', proposal);
      console.log('Contenido guardado:', proposal.content);
      
      // Llamar al callback si existe
      if (onProposalCreated) {
        onProposalCreated(proposal);
      }
      
      // Llamar al callback original si existe
      if (onSave) {
        onSave(blocks);
      }
      
      // Mostrar confirmación
      alert('Propuesta guardada exitosamente en localStorage');
      
      // Opcional: limpiar el editor después de guardar
      // setBlocks([]);
      // setModuleTitle('');
      // setModuleDescription('');
      
    } catch (error) {
      console.error('Error al guardar la propuesta:', error);
      alert('Error al guardar la propuesta. Por favor, intenta de nuevo.');
    }
  };

  const getCurrentHierarchy = () => {
    return HIERARCHY_LEVELS.find(level => level.id === targetHierarchy) || HIERARCHY_LEVELS[0];
  };

  const toggleTextStyle = (blockId: string, style: 'isBold' | 'isItalic' | 'isUnderlined') => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      updateBlock(blockId, block.content, {
        [style]: !block.metadata?.[style]
      });
    }
  };

  const updateTextSize = (blockId: string, fontSize: string) => {
    updateBlock(blockId, '', { fontSize });
  };

  const renderTextToolbar = (block: ContentBlock) => (
    <div className="flex items-center space-x-2 mb-3 p-2 bg-[#121212] rounded-lg border border-[#8a8a8a]">
      <span className="text-xs text-gray-400 mr-2">Formato:</span>
      
      <button
        onClick={() => toggleTextStyle(block.id, 'isBold')}
        className={`p-1 rounded ${block.metadata?.isBold ? 'bg-[#fafafa] text-[#121212]' : 'text-gray-400 hover:text-white'}`}
        title="Negrita"
      >
        <Bold size={14} />
      </button>
      
      <button
        onClick={() => toggleTextStyle(block.id, 'isItalic')}
        className={`p-1 rounded ${block.metadata?.isItalic ? 'bg-[#fafafa] text-[#121212]' : 'text-gray-400 hover:text-white'}`}
        title="Cursiva"
      >
        <Italic size={14} />
      </button>
      
      <button
        onClick={() => toggleTextStyle(block.id, 'isUnderlined')}
        className={`p-1 rounded ${block.metadata?.isUnderlined ? 'bg-[#fafafa] text-[#121212]' : 'text-gray-400 hover:text-white'}`}
        title="Subrayado"
      >
        <Underline size={14} />
      </button>
      
      <select
        value={block.metadata?.fontSize || 'text-base'}
        onChange={(e) => updateTextSize(block.id, e.target.value)}
        className="ml-2 px-2 py-1 bg-[#121212] border border-[#8a8a8a] rounded text-xs text-white"
      >
        {TEXT_SIZES.map(size => (
          <option key={size.value} value={size.value}>{size.label}</option>
        ))}
      </select>
    </div>
  );

  const renderBlockInput = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div>
            {renderTextToolbar(block)}
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Escribe tu texto aquí..."
              className={`w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400 resize-none ${
                block.metadata?.fontSize || 'text-base'
              } ${
                block.metadata?.isBold ? 'font-bold' : ''
              } ${
                block.metadata?.isItalic ? 'italic' : ''
              } ${
                block.metadata?.isUnderlined ? 'underline' : ''
              }`}
              rows={4}
            />
          </div>
        );
      case 'image':
        return (
          <div className="space-y-3">
            {/* Carga local de imagen */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => triggerImageUpload(block.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#fafafa] text-[#121212] rounded-lg hover:bg-[#8a8a8a] transition-colors"
              >
                <Upload size={16} />
                <span>Cargar Imagen Local</span>
              </button>
              <span className="text-sm text-gray-400">o</span>
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="URL de la imagen..."
                className="flex-1 p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400"
              />
            </div>
            
                             {/* Vista previa de la imagen con botón de redimensionamiento */}
                 {block.content && (
                   <div className="mt-3">
                     <div className="relative inline-block">
                       <img 
                         src={block.content} 
                         alt="Vista previa" 
                         className="max-w-full rounded-lg border border-[#8a8a8a]"
                         style={{
                           width: block.metadata?.width || '100%',
                           height: block.metadata?.height || 'auto'
                         }}
                       />
                       <button
                         onClick={() => updateBlock(block.id, block.content, { 
                           ...block.metadata, 
                           showResizeMenu: !block.metadata?.showResizeMenu 
                         })}
                         className="absolute bottom-2 right-2 bg-[#121212] hover:bg-[#121212] rounded-lg p-2 border border-[#8a8a8a] transition-colors"
                         title="Redimensionar imagen"
                       >
                         <div className="flex items-center space-x-2 text-white text-xs">
                           <Maximize2 size={14} />
                           <span>Redimensionar</span>
                         </div>
                       </button>
                     </div>
                
                                 {/* Menú desplegable de redimensionamiento */}
                 {block.metadata?.showResizeMenu && (
                   <div className="mt-3 bg-[#121212] border border-[#8a8a8a] rounded-lg p-4 shadow-lg">
                     <div className="flex items-center justify-between mb-4">
                       <h4 className="text-sm font-semibold text-[#fafafa]">Configuración de Imagen</h4>
                       <button
                         onClick={() => updateBlock(block.id, block.content, { ...block.metadata, showResizeMenu: false })}
                         className="text-gray-400 hover:text-white"
                       >
                         <X size={16} />
                       </button>
                     </div>
                     
                     <div className="space-y-4">
                       {/* Posicionamiento Intuitivo */}
                       <div>
                         <label className="block text-sm text-gray-300 mb-2">Posicionamiento de la Imagen</label>
                         <div className="grid grid-cols-3 gap-2">
                           <button
                             onClick={() => updateBlock(block.id, block.content, { ...block.metadata, alignment: 'left', textWrap: 'right' })}
                             className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                               block.metadata?.alignment === 'left' 
                                 ? 'bg-[#fafafa] text-[#121212] border-[#fafafa] shadow-lg' 
                                 : 'bg-[#8a8a8a] text-gray-300 hover:bg-[#8a8a8a] border-[#8a8a8a] hover:border-[#fafafa]/50'
                             }`}
                           >
                             <div className="text-center">
                               <div className="text-lg mb-1">📝</div>
                               <div>Imagen</div>
                               <div className="font-bold">Izquierda</div>
                               <div className="text-xs opacity-75">Texto a la derecha</div>
                             </div>
                           </button>
                           <button
                             onClick={() => updateBlock(block.id, block.content, { ...block.metadata, alignment: 'center', textWrap: 'none' })}
                             className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                               block.metadata?.alignment === 'center' 
                                 ? 'bg-[#fafafa] text-[#121212] border-[#fafafa] shadow-lg' 
                                 : 'bg-[#8a8a8a] text-gray-300 hover:bg-[#8a8a8a] border-[#8a8a8a] hover:border-[#fafafa]/50'
                             }`}
                           >
                             <div className="text-center">
                               <div className="text-lg mb-1">🖼️</div>
                               <div>Imagen</div>
                               <div className="font-bold">Centrada</div>
                               <div className="text-xs opacity-75">Sin texto alrededor</div>
                             </div>
                           </button>
                           <button
                             onClick={() => updateBlock(block.id, block.content, { ...block.metadata, alignment: 'right', textWrap: 'left' })}
                             className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                               block.metadata?.alignment === 'right' 
                                 ? 'bg-[#fafafa] text-[#121212] border-[#fafafa] shadow-lg' 
                                 : 'bg-[#8a8a8a] text-gray-300 hover:bg-[#8a8a8a] border-[#8a8a8a] hover:border-[#fafafa]/50'
                             }`}
                           >
                             <div className="text-center">
                               <div className="text-lg mb-1">📝</div>
                               <div>Imagen</div>
                               <div className="font-bold">Derecha</div>
                               <div className="text-xs opacity-75">Texto a la izquierda</div>
                             </div>
                           </button>
                         </div>
                         
                         {/* Instrucciones de Drag & Drop */}
                         <div className="mt-3 p-3 bg-[#121212] rounded-lg border border-[#8a8a8a]">
                           <div className="text-xs text-[#fafafa] font-medium mb-2">🎯 Cómo usar el Drag & Drop:</div>
                           <div className="text-xs text-gray-400 space-y-1">
                             <div>• Selecciona el posicionamiento deseado arriba</div>
                             <div>• Arrastra bloques de texto desde la lista de bloques</div>
                             <div>• Suéltalos en la zona de vista previa donde quieras que aparezcan</div>
                             <div>• El texto se ajustará automáticamente alrededor de la imagen</div>
                           </div>
                         </div>
                       </div>
                       
                                              {/* Redimensionamiento Unificado */}
                       <div>
                         <label className="block text-sm text-gray-300 mb-2">Redimensionamiento de la Imagen</label>
                         <div className="space-y-3">
                           {/* Ancho */}
                           <div>
                             <label className="block text-xs text-gray-400 mb-2">Ancho (en incrementos de 10%)</label>
                             <div className="flex items-center space-x-2">
                               <button
                                 onClick={() => {
                                   const currentWidth = block.metadata?.width || '100%';
                                   const numericWidth = currentWidth === '100%' ? 100 : parseInt(currentWidth);
                                   if (!isNaN(numericWidth)) {
                                     const newWidth = Math.max(10, numericWidth - 10);
                                     updateBlock(block.id, block.content, { ...block.metadata, width: `${newWidth}%` });
                                   }
                                 }}
                                 className="p-2 bg-[#8a8a8a] text-gray-300 hover:text-white rounded-lg transition-colors hover:bg-[#8a8a8a]"
                                 title="Reducir ancho 10%"
                               >
                                 <Minus size={16} />
                               </button>
                               <div className="flex-1 bg-[#121212] border border-[#8a8a8a] rounded-lg p-3 text-center">
                                 <span className="text-white font-mono text-lg">{block.metadata?.width || '100%'}</span>
                               </div>
                               <button
                                 onClick={() => {
                                   const currentWidth = block.metadata?.width || '100%';
                                   const numericWidth = currentWidth === '100%' ? 100 : parseInt(currentWidth);
                                   if (!isNaN(numericWidth)) {
                                     const newWidth = Math.min(200, numericWidth + 10);
                                     updateBlock(block.id, block.content, { ...block.metadata, width: `${newWidth}%` });
                                   }
                                 }}
                                 className="p-2 bg-[#8a8a8a] text-gray-300 hover:text-white rounded-lg transition-colors hover:bg-[#8a8a8a]"
                                 title="Aumentar ancho 10%"
                               >
                                 <Plus size={16} />
                               </button>
                             </div>
                             <div className="text-xs text-gray-400 mt-1 text-center">
                               💡 Usa los botones + y - para ajustar en incrementos de 10%
                             </div>
                           </div>
                           
                           {/* Alto */}
                           <div>
                             <label className="block text-xs text-gray-400 mb-2">Alto (en incrementos de 20px)</label>
                             <div className="flex items-center space-x-2">
                               <button
                                 onClick={() => {
                                   const currentHeight = block.metadata?.height || 'auto';
                                   if (currentHeight === 'auto') {
                                     updateBlock(block.id, block.content, { ...block.metadata, height: '200px' });
                                   } else {
                                     const numericHeight = parseInt(currentHeight);
                                     if (!isNaN(numericHeight)) {
                                       const newHeight = Math.max(50, numericHeight - 20);
                                       updateBlock(block.id, block.content, { ...block.metadata, height: `${newHeight}px` });
                                     }
                                   }
                                 }}
                                 className="p-2 bg-[#8a8a8a] text-gray-300 hover:text-white rounded-lg transition-colors hover:bg-[#8a8a8a]"
                                 title="Reducir alto 20px"
                               >
                                 <Minus size={16} />
                               </button>
                               <div className="flex-1 bg-[#121212] border border-[#8a8a8a] rounded-lg p-3 text-center">
                                 <span className="text-white font-mono text-lg">{block.metadata?.height || 'auto'}</span>
                                 </div>
                               <button
                                 onClick={() => {
                                   const currentHeight = block.metadata?.height || 'auto';
                                   if (currentHeight === 'auto') {
                                     updateBlock(block.id, block.content, { ...block.metadata, height: '200px' });
                                   } else {
                                     const numericHeight = parseInt(currentHeight);
                                     if (!isNaN(numericHeight)) {
                                       const newHeight = Math.min(800, numericHeight + 20);
                                       updateBlock(block.id, block.content, { ...block.metadata, height: `${newHeight}px` });
                                     }
                                   }
                                 }}
                                 className="p-2 bg-[#8a8a8a] text-gray-300 hover:text-white rounded-lg transition-colors hover:bg-[#8a8a8a]"
                                 title="Aumentar alto 20px"
                               >
                                 <Plus size={16} />
                               </button>
                             </div>
                             <div className="text-xs text-gray-400 mt-1 text-center">
                               💡 Usa los botones + y - para ajustar en incrementos de 20px
                             </div>
                           </div>
                           
                           {/* Input manual opcional - Menú desplegable sutil */}
                           <div className="pt-2 border-t border-[#8a8a8a]">
                             <button
                               onClick={() => updateBlock(block.id, block.content, { ...block.metadata, showCustomValues: !block.metadata?.showCustomValues })}
                               className="flex items-center space-x-2 text-xs text-gray-400 hover:text-[#fafafa] transition-colors"
                             >
                               <span className="text-[#fafafa]">⚙️</span>
                               <span>Valores personalizados</span>
                               <span className={`transition-transform ${block.metadata?.showCustomValues ? 'rotate-90' : ''}`}>▶</span>
                             </button>
                             
                             {block.metadata?.showCustomValues && (
                               <div className="mt-2 p-2 bg-[#121212] rounded border border-[#8a8a8a]">
                                 <div className="grid grid-cols-2 gap-2">
                                   <input
                                     type="text"
                                     value={block.metadata?.width || '100%'}
                                     onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, width: e.target.value })}
                                     placeholder="100%"
                                     className="p-2 bg-[#121212] border border-[#8a8a8a] rounded text-white text-xs text-center"
                                   />
                                   <input
                                     type="text"
                                     value={block.metadata?.height || 'auto'}
                                     onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, height: e.target.value })}
                                     placeholder="auto"
                                     className="p-2 bg-[#121212] border border-[#8a8a8a] rounded text-white text-xs text-center"
                                   />
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                       

                     </div>
                   </div>
                 )}
              </div>
            )}
            
            <input
              type="text"
              value={block.metadata?.alt || ''}
              onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, alt: e.target.value })}
              placeholder="Texto alternativo (alt)..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400"
            />
          </div>
        );
      case 'video':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="URL del video (YouTube, Vimeo, etc.)..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="text"
              value={block.metadata?.caption || ''}
              onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, caption: e.target.value })}
              placeholder="Descripción del video (opcional)..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400"
            />
            {block.content && (
              <div className="text-xs text-gray-400">
                💡 Para YouTube: pega la URL completa del video (ej: https://www.youtube.com/watch?v=...)
              </div>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="URL del enlace..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="text"
              value={block.metadata?.text || ''}
              onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, text: e.target.value })}
              placeholder="Texto del enlace..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400"
            />
          </div>
        );
      case 'code':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#fafafa] font-medium">💻 Editor de Código</span>
              <div className="flex space-x-2">
                <span className="text-xs bg-[#fafafa]/20 text-[#fafafa] px-2 py-1 rounded">HTML</span>
                <span className="text-xs bg-[#fafafa]/20 text-[#fafafa] px-2 py-1 rounded">CSS</span>
              </div>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Escribe tu código HTML o CSS aquí..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400 font-mono resize-none"
              rows={8}
            />
            <div className="text-xs text-gray-400">
              💡 El código se renderizará en tiempo real en la vista previa
            </div>
          </div>
        );
      case 'quote':
        return (
          <div className="space-y-2">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Cita..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400 resize-none"
              rows={3}
            />
            <input
              type="text"
              value={block.metadata?.author || ''}
              onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, author: e.target.value })}
              placeholder="Autor de la cita..."
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400"
            />
          </div>
        );
      case 'checklist':
        return (
          <div className="space-y-3">
            <div className="text-sm text-gray-400 mb-2">
              💡 Escribe cada elemento en una línea separada. Usa "✓" al inicio para marcar como completado.
            </div>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="✓ Elemento completado&#10;Elemento pendiente&#10;✓ Otro completado"
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400 resize-none font-mono"
              rows={6}
            />
            <div className="text-xs text-gray-500">
              Ejemplo: ✓ Tarea completada | Tarea pendiente
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreviewBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none">
            <p className={`leading-relaxed ${
              block.metadata?.fontSize || 'text-base'
            } ${
              block.metadata?.isBold ? 'font-bold' : ''
            } ${
              block.metadata?.isItalic ? 'italic' : ''
            } ${
              block.metadata?.isUnderlined ? 'underline' : ''
            }`}>
              {block.content}
            </p>
          </div>
        );
             case 'image':
         return (
           <div className="my-4">
             {block.content ? (
                                         <div className="relative">
               {/* Zona de drop izquierda */}
               {block.metadata?.textWrap === 'left' && (
                 <div
                   className={`absolute left-0 top-0 w-1/2 h-full transition-all duration-200 ${
                     dropZoneHighlight === 'left' 
                       ? 'bg-[#fafafa]/20 border-2 border-[#fafafa] border-dashed' 
                       : 'bg-transparent'
                   }`}
                   onDragOver={(e) => {
                     e.preventDefault();
                     setDropZoneHighlight('left');
                   }}
                   onDragLeave={() => setDropZoneHighlight(null)}
                   onDrop={(e) => {
                     e.preventDefault();
                     setDropZoneHighlight(null);
                     // Aquí se procesaría el drop del texto
                   }}
                 >
                   <div className="h-full flex items-center justify-center">
                     {dropZoneHighlight === 'left' && (
                       <div className="text-[#fafafa] text-sm font-medium">
                         📝 Suelta el texto aquí
                       </div>
                     )}
                   </div>
                 </div>
               )}

               {/* Zona de drop derecha */}
               {block.metadata?.textWrap === 'right' && (
                 <div
                   className={`absolute right-0 top-0 w-1/2 h-full transition-all duration-200 ${
                     dropZoneHighlight === 'right' 
                       ? 'bg-[#fafafa]/20 border-2 border-[#fafafa] border-dashed' 
                       : 'bg-transparent'
                   }`}
                   onDragOver={(e) => {
                     e.preventDefault();
                     setDropZoneHighlight('right');
                   }}
                   onDragLeave={() => setDropZoneHighlight(null)}
                   onDrop={(e) => {
                     e.preventDefault();
                     setDropZoneHighlight(null);
                     // Aquí se procesaría el drop del texto
                   }}
                 >
                   <div className="h-full flex items-center justify-center">
                     {dropZoneHighlight === 'right' && (
                       <div className="text-[#fafafa] text-sm font-medium">
                         📝 Suelta el texto aquí
                       </div>
                     )}
                   </div>
                 </div>
               )}

               <div 
                 className={`${
                   block.metadata?.textWrap === 'left' ? 'float-right ml-4 mb-2' :
                   block.metadata?.textWrap === 'right' ? 'float-left mr-4 mb-2' :
                   'block'
                 }`}
                 style={{
                   textAlign: block.metadata?.alignment || 'left',
                   width: block.metadata?.width || '100%',
                   maxWidth: block.metadata?.width === '100%' ? '100%' : 'auto',
                   height: block.metadata?.height || 'auto'
                 }}
               >
                 <img 
                   src={block.content} 
                   alt={block.metadata?.alt || 'Imagen'} 
                   className="max-w-full rounded-lg border border-[#8a8a8a]"
                   style={{
                     width: block.metadata?.width || '100%',
                     height: block.metadata?.height || 'auto',
                     display: 'block',
                     float: block.metadata?.textWrap === 'left' ? 'left' : 
                            block.metadata?.textWrap === 'right' ? 'right' : 'none',
                     margin: block.metadata?.textWrap === 'left' ? '0 1rem 0.5rem 0' :
                             block.metadata?.textWrap === 'right' ? '0 0 0.5rem 1rem' : '0'
                   }}
                   onError={(e) => {
                     e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBlbmNvbnRyYWRhPC90ZXh0Pjwvc3ZnPg==';
                   }}
                 />
                 {block.metadata?.alt && (
                   <p className="text-sm text-gray-400 mt-2 italic">{block.metadata.alt}</p>
                 )}
               </div>
             </div>
             ) : (
               <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-8 text-center">
                 <ImageIcon size={48} className="text-gray-500 mx-auto mb-2" />
                 <p className="text-gray-400">Sin imagen</p>
               </div>
             )}
           </div>
         );
      case 'video':
        return (
          <div className="my-4">
            {block.content ? (
              <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-4">
                {block.content.includes('youtube.com') || block.content.includes('youtu.be') ? (
                  <div className="aspect-video bg-[#121212] rounded-lg border border-[#8a8a8a] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-2xl">▶</span>
                      </div>
                      <p className="text-white text-sm font-medium">Video de YouTube</p>
                      <p className="text-gray-400 text-xs mt-1">Se reproducirá en el módulo</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-[#121212] rounded-lg border border-[#8a8a8a] flex items-center justify-center">
                    <div className="text-center">
                      <Video size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Video: {block.content}</p>
                    </div>
                  </div>
                )}
                {block.metadata?.caption && (
                  <p className="text-sm text-gray-400 mt-2 italic text-center">{block.metadata.caption}</p>
                )}
              </div>
            ) : (
              <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-8 text-center">
                <Video size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Sin video</p>
              </div>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="my-4">
            <a 
              href={block.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#fafafa] hover:text-[#8a8a8a] underline break-all"
            >
              {block.metadata?.text || block.content}
            </a>
          </div>
        );
      case 'code':
        return (
          <div className="my-4">
            <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#fafafa] font-mono font-medium">
                  💻 Código
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const newWindow = window.open('', '_blank');
                      if (newWindow) {
                        newWindow.document.write(`
                          <!DOCTYPE html>
                          <html>
                          <head>
                            <title>Preview - Código HTML</title>
                            <style>
                              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }
                            </style>
                          </head>
                          <body>
                            ${block.content}
                          </body>
                          </html>
                        `);
                        newWindow.document.close();
                      }
                    }}
                    className="text-xs bg-[#fafafa] text-gray-900 px-2 py-1 rounded hover:bg-[#8a8a8a] transition-colors"
                  >
                    🚀 Ver Preview
                  </button>
                </div>
              </div>
              
              {/* Código fuente */}
              <pre className="text-sm text-white font-mono overflow-x-auto bg-[#121212] p-3 rounded border border-[#8a8a8a] mb-4">
                <code>{block.content}</code>
              </pre>
              
              {/* Renderizado en vivo para HTML */}
              {block.content && (
                <div className="pt-4 border-t border-[#8a8a8a]">
                  <div className="text-xs text-[#fafafa] font-medium mb-3 flex items-center">
                    👁️ Vista Previa del Código:
                  </div>
                  <div 
                    className="bg-white text-black p-4 rounded border shadow-lg"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 'quote':
        return (
          <div className="my-4">
            <blockquote className="border-l-4 border-[#fafafa] pl-4 italic text-white">
              <p className="text-lg mb-2">"{block.content}"</p>
              {block.metadata?.author && (
                <footer className="text-sm text-gray-400">— {block.metadata.author}</footer>
              )}
            </blockquote>
          </div>
        );
      case 'checklist':
        return (
          <div className="my-4">
            <div className="space-y-2">
              {block.content.split('\n').filter((item: string) => item.trim()).map((item: string, index: number) => {
                const isCompleted = item.trim().startsWith('✓');
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckSquare 
                      size={20} 
                      className={`flex-shrink-0 ${isCompleted ? 'text-green-500' : 'text-gray-400'}`} 
                    />
                    <span className={`text-white ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                      {item.trim().replace(/^✓\s*/, '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const currentHierarchy = getCurrentHierarchy();

  return (
    <div className="space-y-6">
      {/* Configuración del Módulo */}
      <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#fafafa] mb-4">Configuración del Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título del Módulo *</label>
            <input
              type="text"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Ej: Introducción a la Lógica Económica"
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400 text-lg font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
            <input
              type="text"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              placeholder="Breve descripción del módulo"
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select
              value={moduleCategory}
              onChange={(e) => setModuleCategory(e.target.value as 'theoretical' | 'practical' | 'checkpoint')}
              className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white"
            >
              <option value="theoretical">Teórico</option>
              <option value="practical">Práctico</option>
              <option value="checkpoint">Punto de Control</option>
            </select>
          </div>
          
          {/* Submenú para Puntos de Control */}
          {moduleCategory === 'checkpoint' && (
            <div className="col-span-2 bg-[#121212] border border-[#8a8a8a] rounded-lg p-4">
              <label className="block text-sm font-medium text-[#fafafa] mb-3">
                🎯 Selecciona los módulos que este Punto de Control evaluará:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Módulo 1 (Origen)</label>
                  <select
                    value={checkpointModules?.module1 || ''}
                    onChange={(e) => setCheckpointModules(prev => ({ ...prev, module1: e.target.value }))}
                    className="w-full p-2 bg-[#121212] border border-[#8a8a8a] rounded text-white text-sm"
                  >
                    <option value="">Selecciona un módulo...</option>
                    {availableModules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.title} ({module.category === 'theoretical' ? 'Teórico' : 'Práctico'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Módulo 2 (Complementario)</label>
                  <select
                    value={checkpointModules?.module2 || ''}
                    onChange={(e) => setCheckpointModules(prev => ({ ...prev, module2: e.target.value }))}
                    className="w-full p-2 bg-[#121212] border border-[#8a8a8a] rounded text-white text-sm"
                  >
                    <option value="">Selecciona un módulo...</option>
                    {availableModules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.title} ({module.category === 'theoretical' ? 'Teórico' : 'Práctico'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 p-2 bg-[#fafafa]/10 border border-[#fafafa]/20 rounded">
                <p className="text-xs text-[#fafafa]">
                  💡 Los Puntos de Control evalúan la comprensión de los módulos seleccionados
                </p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nivel Objetivo</label>
            <div className="flex items-center space-x-3">
              <select
                value={targetHierarchy}
                onChange={(e) => setTargetHierarchy(Number(e.target.value))}
                className="flex-1 p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white"
                style={{ color: currentHierarchy.color }}
              >
                {HIERARCHY_LEVELS.map((level) => (
                  <option 
                    key={level.id} 
                    value={level.id}
                    style={{ 
                      color: level.color,
                      backgroundColor: '#121212'
                    }}
                  >
                    {level.name}
                  </option>
                ))}
              </select>
              <div 
                className="w-12 h-12 rounded-lg border-2 flex items-center justify-center"
                style={{ 
                  backgroundColor: currentHierarchy.bgColor.replace('bg-', '').replace('/20', ''),
                  borderColor: currentHierarchy.borderColor.replace('border-', '').replace('/30', '')
                }}
              >
                <img 
                  src={currentHierarchy.insignia} 
                  alt={currentHierarchy.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Editor de Contenido */}
      <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-6">
        {/* Barra de estado de la propuesta */}
        <div className="mb-4 p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${moduleTitle.trim() ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-400">
                  {moduleTitle.trim() ? 'Título ✓' : 'Título requerido'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${blocks.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-400">
                  {blocks.length > 0 ? `${blocks.length} bloque${blocks.length !== 1 ? 's' : ''} ✓` : 'Sin contenido'}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {moduleTitle.trim() && blocks.length > 0 ? '✅ Listo para guardar' : '⚠️ Completar propuesta'}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#fafafa]">Contenido del Módulo</h3>
          <div className="flex items-center space-x-4">
            {/* Indicador de estado */}
            <div className="flex items-center space-x-2 text-sm">
              <span className={`w-3 h-3 rounded-full ${blocks.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-400">
                {blocks.length > 0 ? `${blocks.length} bloque${blocks.length !== 1 ? 's' : ''}` : 'Sin bloques'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePreview}
                disabled={blocks.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye size={16} />
                <span>Vista Previa</span>
              </button>
              <button
                onClick={handleSave}
                disabled={blocks.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-[#fafafa] text-[#121212] rounded-lg hover:bg-[#8a8a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                <span>Guardar Propuesta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Botones para agregar bloques */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addBlock('text')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <FileText size={16} />
              <span>Texto</span>
            </button>
            <button
              onClick={() => addBlock('image')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <ImageIcon size={16} />
              <span>Imagen</span>
            </button>
            <button
              onClick={() => addBlock('video')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <Video size={16} />
              <span>Video</span>
            </button>
            <button
              onClick={() => addBlock('link')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <Link size={16} />
              <span>Enlace</span>
            </button>
            <button
              onClick={() => addBlock('code')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <Code size={16} />
              <span>Código</span>
            </button>
            <button
              onClick={() => addBlock('quote')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <Quote size={16} />
              <span>Cita</span>
            </button>
            <button
              onClick={() => addBlock('checklist')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <CheckSquare size={16} />
              <span>Lista</span>
            </button>
            <button
              onClick={() => addBlock('divider')}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#8a8a8a] transition-colors text-sm"
            >
              <Minus size={16} />
              <span>Separador</span>
            </button>
          </div>
        </div>

        {/* Bloques de contenido con Drag & Drop */}
        <div className="space-y-4">
          {/* Indicador de instrucciones de Drag & Drop */}
          {blocks.length > 1 && (
            <div className="bg-gradient-to-r from-[#fafafa]/10 to-[#8a8a8a]/10 border border-[#fafafa]/20 rounded-lg p-3 text-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#fafafa]">
                  <Move size={16} />
                  <span className="text-sm font-medium">💡 Arrastra los bloques para reorganizarlos</span>
                  <Move size={16} />
                </div>
                <button
                  onClick={() => {
                    setDraggedBlock(null);
                    setDragOverBlock(null);
                  }}
                  className="px-3 py-1 bg-[#fafafa] text-[#121212] rounded text-xs font-medium hover:bg-[#8a8a8a] transition-colors"
                  title="Resetear estado de arrastre"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          )}
          {blocks.map((block, index) => (
            <div 
              key={block.id} 
              className={`bg-[#121212] border border-[#8a8a8a] rounded-lg p-4 transition-all duration-300 ${
                dragOverBlock === block.id ? 'border-[#fafafa] border-2 bg-[#121212]/90 scale-105 shadow-lg shadow-[#fafafa]/20' : ''
              } ${
                draggedBlock === block.id ? 'opacity-50 scale-98 rotate-0' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, block.id)}
            >
              <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                 <div className={`flex items-center space-x-2 p-2 rounded-lg border transition-all duration-300 cursor-move group ${
                   draggedBlock === block.id 
                     ? 'bg-[#fafafa] text-[#121212] border-[#fafafa]' 
                     : 'bg-[#8a8a8a] text-gray-400 border-[#8a8a8a] hover:border-[#fafafa] hover:text-[#fafafa]'
                 }`}>
                   <Move size={16} className="transition-colors" />
                   <span className="text-sm font-medium transition-colors">
                     {draggedBlock === block.id ? 'Arrastrando...' : 'Arrastrar'}
                   </span>
                 </div>
                <span className="text-sm text-gray-400">Bloque {index + 1}</span>
                <span className="px-2 py-1 bg-[#8a8a8a] text-xs text-gray-300 rounded">
                  {block.type}
                </span>
              </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveBlock(block.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveBlock(block.id, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Eliminar bloque"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              {renderBlockInput(block)}
            </div>
          ))}
          {blocks.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="bg-gradient-to-r from-[#fafafa]/10 to-[#8a8a8a]/10 border border-[#fafafa]/20 rounded-lg p-8">
                <FileText size={64} className="mx-auto mb-4 text-[#fafafa]" />
                <h3 className="text-xl font-semibold text-[#fafafa] mb-2">¡Comienza a crear contenido!</h3>
                <p className="text-gray-300 mb-4">No hay bloques de contenido aún. Usa los botones de arriba para agregar tu primer elemento.</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 mb-4">
                  <span>💡</span>
                  <span>Usa los botones de arriba para agregar contenido</span>
                </div>
                <div className="text-xs text-gray-500 bg-[#121212] p-3 rounded-lg border border-[#8a8a8a]">
                  <p><strong>💾 Para guardar:</strong> Agrega al menos un bloque de contenido</p>
                  <p><strong>👁️ Para vista previa:</strong> Agrega al menos un bloque de contenido</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input oculto para carga de archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const blockId = e.currentTarget.getAttribute('data-block-id');
          if (blockId) {
            handleImageUpload(e, blockId);
          }
        }}
        className="hidden"
      />

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#121212] border-b border-[#8a8a8a] p-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#fafafa]">Vista Previa del Módulo</h3>
                             <div className="flex items-center space-x-2">
                 <button
                   onClick={() => setShowPreview(false)}
                   className="flex items-center space-x-2 px-4 py-2 bg-[#6B7280] text-white rounded-lg hover:bg-[#4B5563] transition-colors"
                 >
                   <ArrowLeft size={16} />
                   <span>Volver</span>
                 </button>
                 <button
                   onClick={() => setShowPreview(false)}
                   className="p-2 text-gray-400 hover:text-white hover:bg-[#8a8a8a] rounded-lg transition-colors"
                 >
                   <X size={20} />
                 </button>
               </div>
            </div>
            <div className="p-6">
              {/* Header del módulo */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">{moduleTitle || 'Título del Módulo'}</h1>
                {moduleDescription && (
                  <p className="text-lg text-gray-300 mb-4">{moduleDescription}</p>
                )}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <span className="px-4 py-2 bg-[#8a8a8a] rounded-full font-medium min-w-[100px] text-center">
                    {moduleCategory === 'theoretical' ? 'Teórico' : 'Práctico'}
                  </span>
                  <span 
                    className="px-4 py-2 rounded-full font-medium border-2 min-w-[100px] text-center"
                    style={{ 
                      backgroundColor: currentHierarchy.bgColor.replace('bg-', '').replace('/20', ''),
                      color: currentHierarchy.color,
                      borderColor: currentHierarchy.color
                    }}
                  >
                    {currentHierarchy.name}
                  </span>
                </div>
              </div>

                             {/* Contenido renderizado */}
               <div className="space-y-6">
                 {blocks.map((block) => (
                   <div key={block.id}>
                     {renderPreviewBlock(block)}
                   </div>
                 ))}
                 {blocks.length === 0 && (
                   <div className="text-center py-12 text-gray-400">
                     <FileText size={48} className="mx-auto mb-4" />
                     <p>No hay contenido para mostrar en la vista previa.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
