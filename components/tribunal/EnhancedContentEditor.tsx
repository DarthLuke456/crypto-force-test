// Editor de Contenido Mejorado del Tribunal Imperial
// Optimizado para experiencia de usuario, productividad y funcionalidad operativa

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentBlock, CustomModule } from '@/lib/tribunal/types';
import { PerformanceOptimizationSystem } from '@/lib/tribunal/performance-optimization-system';
import { EnhancedVotingSystem } from '@/lib/tribunal/enhanced-voting-system';

// Interfaz para las props del editor mejorado
interface EnhancedContentEditorProps {
  onSave: (content: ContentBlock[]) => void;
  onPreview: (content: ContentBlock[]) => void;
  onProposalCreated: (proposal: CustomModule) => void;
  authorId?: string;
  authorName?: string;
  authorLevel?: number;
  initialContent?: ContentBlock[];
  enableAdvancedFeatures?: boolean;
  enableRealTimePreview?: boolean;
  enableAutoSave?: boolean;
  enableCollaboration?: boolean;
}

// Interfaz para el estado del editor
interface EditorState {
  blocks: ContentBlock[];
  moduleTitle: string;
  moduleDescription: string;
  moduleCategory: 'theoretical' | 'practical' | 'checkpoint';
  targetHierarchy: number;
  showPreview: boolean;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  collaborationEnabled: boolean;
  performanceMetrics: {
    renderTime: number;
    memoryUsage: number;
    optimizationLevel: string;
  };
}

// Configuración del editor mejorado
const ENHANCED_EDITOR_CONFIG = {
  AUTO_SAVE_INTERVAL: 30000, // 30 segundos
  DEBOUNCE_DELAY: 500, // 500ms
  MAX_UNDO_STEPS: 50,
  PERFORMANCE_MONITORING: true,
  REAL_TIME_PREVIEW: true,
  COLLABORATION_ENABLED: false,
  ADVANCED_FEATURES: true
};

// Componente principal del editor mejorado
export default function EnhancedContentEditor({
  onSave,
  onPreview,
  onProposalCreated,
  authorId = 'default_author',
  authorName = 'Autor',
  authorLevel = 6,
  initialContent = [],
  enableAdvancedFeatures = true,
  enableRealTimePreview = true,
  enableAutoSave = true,
  enableCollaboration = false
}: EnhancedContentEditorProps) {
  
  // Estados principales
  const [editorState, setEditorState] = useState<EditorState>({
    blocks: initialContent,
    moduleTitle: '',
    moduleDescription: '',
    moduleCategory: 'theoretical',
    targetHierarchy: 1,
    showPreview: false,
    isDirty: false,
    isSaving: false,
    lastSaved: null,
    autoSaveEnabled: enableAutoSave,
    collaborationEnabled: enableCollaboration,
    performanceMetrics: {
      renderTime: 0,
      memoryUsage: 0,
      optimizationLevel: 'standard'
    }
  });
  
  // Referencias
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const undoStackRef = useRef<ContentBlock[][]>([]);
  const redoStackRef = useRef<ContentBlock[][]>([]);
  const performanceStartRef = useRef<number>(0);
  
  // Inicializar sistema de optimización
  useEffect(() => {
    PerformanceOptimizationSystem.initialize();
    performanceStartRef.current = performance.now();
  }, []);
  
  // Configurar auto-save
  useEffect(() => {
    if (editorState.autoSaveEnabled && editorState.isDirty) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, ENHANCED_EDITOR_CONFIG.AUTO_SAVE_INTERVAL);
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorState.isDirty, editorState.autoSaveEnabled]);
  
  // Configurar debounce para cambios
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (editorState.isDirty) {
        updatePerformanceMetrics();
      }
    }, ENHANCED_EDITOR_CONFIG.DEBOUNCE_DELAY);
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [editorState.blocks, editorState.moduleTitle, editorState.moduleDescription]);
  
  // Manejar auto-save
  const handleAutoSave = useCallback(async () => {
    if (!editorState.isDirty) return;
    
    try {
      setEditorState(prev => ({ ...prev, isSaving: true }));
      
      // Optimizar contenido antes de guardar
      const optimizedContent = await PerformanceOptimizationSystem.optimizeContentForDashboard(
        [{
          id: 'temp_module',
          title: editorState.moduleTitle,
          description: editorState.moduleDescription,
          content: editorState.blocks,
          category: editorState.moduleCategory,
          targetLevels: [editorState.targetHierarchy],
          difficulty: 'intermediate',
          tags: [],
          prerequisites: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublished: false,
          estimatedDuration: 30,
          authorId,
          authorName,
          authorLevel
        }],
        editorState.targetHierarchy,
        { enableCompression: true, enableMinification: true }
      );
      
      // Guardar en localStorage
      const savedContent = {
        blocks: editorState.blocks,
        moduleTitle: editorState.moduleTitle,
        moduleDescription: editorState.moduleDescription,
        moduleCategory: editorState.moduleCategory,
        targetHierarchy: editorState.targetHierarchy,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem(`tribunal_editor_draft_${authorId}`, JSON.stringify(savedContent));
      
      setEditorState(prev => ({
        ...prev,
        isDirty: false,
        isSaving: false,
        lastSaved: new Date()
      }));
      
      console.log('💾 Auto-guardado completado');
      
    } catch (error) {
      console.error('Error en auto-guardado:', error);
      setEditorState(prev => ({ ...prev, isSaving: false }));
    }
  }, [editorState, authorId]);
  
  // Actualizar métricas de rendimiento
  const updatePerformanceMetrics = useCallback(() => {
    const renderTime = performance.now() - performanceStartRef.current;
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    setEditorState(prev => ({
      ...prev,
      performanceMetrics: {
        renderTime,
        memoryUsage,
        optimizationLevel: 'advanced'
      }
    }));
  }, []);
  
  // Agregar bloque de contenido
  const addBlock = useCallback((type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      order: editorState.blocks.length,
      metadata: {
        fontSize: 'text-base',
        isBold: false,
        isItalic: false,
        isUnderlined: false,
        width: type === 'image' ? '100%' : undefined,
        height: type === 'image' ? 'auto' : undefined
      }
    };
    
    // Guardar estado para undo
    saveToUndoStack();
    
    setEditorState(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      isDirty: true
    }));
    
    // Establecer título por defecto si es el primer bloque
    if (editorState.blocks.length === 0 && !editorState.moduleTitle.trim()) {
      setEditorState(prev => ({ ...prev, moduleTitle: 'Nuevo Módulo' }));
    }
    
    if (editorState.blocks.length === 0 && !editorState.moduleDescription.trim()) {
      setEditorState(prev => ({ ...prev, moduleDescription: 'Descripción del módulo' }));
    }
  }, [editorState.blocks.length, editorState.moduleTitle, editorState.moduleDescription]);
  
  // Actualizar bloque
  const updateBlock = useCallback((id: string, content: string, metadata?: any) => {
    setEditorState(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === id
          ? { ...block, content, metadata: { ...block.metadata, ...metadata } }
          : block
      ),
      isDirty: true
    }));
  }, []);
  
  // Eliminar bloque
  const deleteBlock = useCallback((id: string) => {
    // Guardar estado para undo
    saveToUndoStack();
    
    setEditorState(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== id),
      isDirty: true
    }));
  }, []);
  
  // Reordenar bloques
  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    // Guardar estado para undo
    saveToUndoStack();
    
    setEditorState(prev => {
      const newBlocks = [...prev.blocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      
      // Actualizar orden
      newBlocks.forEach((block, index) => {
        block.order = index;
      });
      
      return {
        ...prev,
        blocks: newBlocks,
        isDirty: true
      };
    });
  }, []);
  
  // Guardar en stack de undo
  const saveToUndoStack = useCallback(() => {
    undoStackRef.current.push([...editorState.blocks]);
    
    // Limitar tamaño del stack
    if (undoStackRef.current.length > ENHANCED_EDITOR_CONFIG.MAX_UNDO_STEPS) {
      undoStackRef.current.shift();
    }
    
    // Limpiar redo stack
    redoStackRef.current = [];
  }, [editorState.blocks]);
  
  // Deshacer
  const undo = useCallback(() => {
    if (undoStackRef.current.length > 0) {
      const previousState = undoStackRef.current.pop()!;
      redoStackRef.current.push([...editorState.blocks]);
      
      setEditorState(prev => ({
        ...prev,
        blocks: previousState,
        isDirty: true
      }));
    }
  }, [editorState.blocks]);
  
  // Rehacer
  const redo = useCallback(() => {
    if (redoStackRef.current.length > 0) {
      const nextState = redoStackRef.current.pop()!;
      undoStackRef.current.push([...editorState.blocks]);
      
      setEditorState(prev => ({
        ...prev,
        blocks: nextState,
        isDirty: true
      }));
    }
  }, [editorState.blocks]);
  
  // Guardar propuesta
  const handleSaveProposal = useCallback(async () => {
    try {
      setEditorState(prev => ({ ...prev, isSaving: true }));
      
      // Crear módulo personalizado
      const customModule: CustomModule = {
        id: `module_${Date.now()}`,
        title: editorState.moduleTitle,
        description: editorState.moduleDescription,
        content: editorState.blocks,
        category: editorState.moduleCategory,
        targetLevels: [editorState.targetHierarchy],
        difficulty: 'intermediate',
        tags: [],
        prerequisites: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false,
        estimatedDuration: 30,
        authorId,
        authorName,
        authorLevel
      };
      
      // Optimizar contenido
      const optimizedContent = await PerformanceOptimizationSystem.optimizeContentForDashboard(
        [customModule],
        editorState.targetHierarchy,
        { enableCompression: true, enableMinification: true }
      );
      
      // Guardar propuesta
      const storedProposals = localStorage.getItem('tribunal_proposals');
      const allProposals = storedProposals ? JSON.parse(storedProposals) : [];
      
      allProposals.push({
        ...customModule,
        content: optimizedContent[0].content
      });
      
      localStorage.setItem('tribunal_proposals', JSON.stringify(allProposals));
      
      // Crear propuesta en el sistema de votación
      await EnhancedVotingSystem.createProposal(
        customModule,
        authorId,
        authorName,
        authorLevel
      );
      
      setEditorState(prev => ({
        ...prev,
        isDirty: false,
        isSaving: false,
        lastSaved: new Date()
      }));
      
      onProposalCreated(customModule);
      
      console.log('✅ Propuesta guardada exitosamente');
      
    } catch (error) {
      console.error('Error guardando propuesta:', error);
      setEditorState(prev => ({ ...prev, isSaving: false }));
    }
  }, [editorState, authorId, authorName, authorLevel, onProposalCreated]);
  
  // Vista previa en tiempo real
  const handleRealTimePreview = useCallback(() => {
    if (enableRealTimePreview) {
      onPreview(editorState.blocks);
    }
  }, [editorState.blocks, enableRealTimePreview, onPreview]);
  
  // Cargar borrador guardado
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(`tribunal_editor_draft_${authorId}`);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setEditorState(prev => ({
          ...prev,
          blocks: draft.blocks || [],
          moduleTitle: draft.moduleTitle || '',
          moduleDescription: draft.moduleDescription || '',
          moduleCategory: draft.moduleCategory || 'theoretical',
          targetHierarchy: draft.targetHierarchy || 1,
          isDirty: false,
          lastSaved: draft.lastSaved ? new Date(draft.lastSaved) : null
        }));
        console.log('📄 Borrador cargado');
      }
    } catch (error) {
      console.error('Error cargando borrador:', error);
    }
  }, [authorId]);
  
  // Cargar borrador al inicializar
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);
  
  // Renderizar bloque de contenido
  const renderBlock = useCallback((block: ContentBlock, index: number) => {
    const BlockComponent = getBlockComponent(block.type);
    return (
      <div key={block.id} className="mb-4">
        <BlockComponent
          block={block}
          onUpdate={(content, metadata) => updateBlock(block.id, content, metadata)}
          onDelete={() => deleteBlock(block.id)}
          onMoveUp={index > 0 ? () => reorderBlocks(index, index - 1) : undefined}
          onMoveDown={index < editorState.blocks.length - 1 ? () => reorderBlocks(index, index + 1) : undefined}
          enableAdvancedFeatures={enableAdvancedFeatures}
        />
      </div>
    );
  }, [updateBlock, deleteBlock, reorderBlocks, editorState.blocks.length, enableAdvancedFeatures]);
  
  return (
    <div className="enhanced-content-editor min-h-screen bg-[#121212] text-white">
      {/* Header del Editor */}
      <div className="sticky top-0 z-50 bg-[#121212] border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Editor del Tribunal Imperial</h1>
            {editorState.isDirty && (
              <span className="text-yellow-400 text-sm">● Sin guardar</span>
            )}
            {editorState.isSaving && (
              <span className="text-blue-400 text-sm">💾 Guardando...</span>
            )}
            {editorState.lastSaved && (
              <span className="text-green-400 text-sm">
                ✅ Guardado {editorState.lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Métricas de rendimiento */}
            {ENHANCED_EDITOR_CONFIG.PERFORMANCE_MONITORING && (
              <div className="text-xs text-gray-400">
                ⚡ {editorState.performanceMetrics.renderTime.toFixed(0)}ms
              </div>
            )}
            
            {/* Botones de acción */}
            <button
              onClick={undo}
              disabled={undoStackRef.current.length === 0}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
            >
              ↶ Deshacer
            </button>
            
            <button
              onClick={redo}
              disabled={redoStackRef.current.length === 0}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm"
            >
              ↷ Rehacer
            </button>
            
            <button
              onClick={handleRealTimePreview}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              👁️ Vista Previa
            </button>
            
            <button
              onClick={handleSaveProposal}
              disabled={editorState.isSaving || !editorState.moduleTitle.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium"
            >
              {editorState.isSaving ? 'Guardando...' : 'Guardar Propuesta'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido Principal */}
      <div className="flex">
        {/* Panel Lateral */}
        <div className="w-80 bg-[#121212] border-r border-gray-800 p-4">
          {/* Información del Módulo */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Información del Módulo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={editorState.moduleTitle}
                  onChange={(e) => setEditorState(prev => ({ 
                    ...prev, 
                    moduleTitle: e.target.value, 
                    isDirty: true 
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Título del módulo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={editorState.moduleDescription}
                  onChange={(e) => setEditorState(prev => ({ 
                    ...prev, 
                    moduleDescription: e.target.value, 
                    isDirty: true 
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white h-20 resize-none"
                  placeholder="Descripción del módulo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <select
                  value={editorState.moduleCategory}
                  onChange={(e) => setEditorState(prev => ({ 
                    ...prev, 
                    moduleCategory: e.target.value as any, 
                    isDirty: true 
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="theoretical">Teórico</option>
                  <option value="practical">Práctico</option>
                  <option value="checkpoint">Punto de Control</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Nivel Objetivo</label>
                <select
                  value={editorState.targetHierarchy}
                  onChange={(e) => setEditorState(prev => ({ 
                    ...prev, 
                    targetHierarchy: parseInt(e.target.value), 
                    isDirty: true 
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value={1}>Iniciado</option>
                  <option value={2}>Acólito</option>
                  <option value={3}>Warrior</option>
                  <option value={4}>Lord</option>
                  <option value={5}>Darth</option>
                  <option value={6}>Maestro</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Herramientas de Contenido */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Agregar Contenido</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addBlock('text')}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                📝 Texto
              </button>
              <button
                onClick={() => addBlock('image')}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                🖼️ Imagen
              </button>
              <button
                onClick={() => addBlock('video')}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                🎥 Video
              </button>
              <button
                onClick={() => addBlock('code')}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                💻 Código
              </button>
            </div>
          </div>
          
          {/* Configuraciones Avanzadas */}
          {enableAdvancedFeatures && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Configuraciones</h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editorState.autoSaveEnabled}
                    onChange={(e) => setEditorState(prev => ({ 
                      ...prev, 
                      autoSaveEnabled: e.target.checked 
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Auto-guardado</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editorState.showPreview}
                    onChange={(e) => setEditorState(prev => ({ 
                      ...prev, 
                      showPreview: e.target.checked 
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Vista previa en tiempo real</span>
                </label>
              </div>
            </div>
          )}
        </div>
        
        {/* Área de Edición */}
        <div className="flex-1 p-6">
          <div ref={editorRef} className="max-w-4xl mx-auto">
            {editorState.blocks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-semibold mb-2">Comienza a crear tu contenido</h2>
                <p className="text-gray-400 mb-6">
                  Agrega bloques de contenido desde el panel lateral para comenzar
                </p>
                <button
                  onClick={() => addBlock('text')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                >
                  Agregar Primer Bloque
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {editorState.blocks.map((block, index) => renderBlock(block, index))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para renderizar diferentes tipos de bloques
function getBlockComponent(type: ContentBlock['type']) {
  switch (type) {
    case 'text':
      return TextBlock;
    case 'image':
      return ImageBlock;
    case 'video':
      return VideoBlock;
    case 'code':
      return CodeBlock;
    default:
      return TextBlock;
  }
}

// Componente para bloques de texto
function TextBlock({ 
  block, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  enableAdvancedFeatures 
}: {
  block: ContentBlock;
  onUpdate: (content: string, metadata?: any) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  enableAdvancedFeatures: boolean;
}) {
  const [content, setContent] = useState(block.content as string || '');
  
  useEffect(() => {
    onUpdate(content);
  }, [content, onUpdate]);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">📝 Texto</span>
          {enableAdvancedFeatures && (
            <>
              {onMoveUp && (
                <button onClick={onMoveUp} className="text-gray-400 hover:text-white">
                  ↑
                </button>
              )}
              {onMoveDown && (
                <button onClick={onMoveDown} className="text-gray-400 hover:text-white">
                  ↓
                </button>
              )}
            </>
          )}
        </div>
        <button onClick={onDelete} className="text-red-400 hover:text-red-300">
          🗑️
        </button>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-32 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white resize-none"
        placeholder="Escribe tu contenido aquí..."
      />
    </div>
  );
}

// Componente para bloques de imagen
function ImageBlock({ 
  block, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  enableAdvancedFeatures 
}: {
  block: ContentBlock;
  onUpdate: (content: string, metadata?: any) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  enableAdvancedFeatures: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(block.content as string || '');
  
  useEffect(() => {
    onUpdate(imageUrl);
  }, [imageUrl, onUpdate]);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">🖼️ Imagen</span>
          {enableAdvancedFeatures && (
            <>
              {onMoveUp && (
                <button onClick={onMoveUp} className="text-gray-400 hover:text-white">
                  ↑
                </button>
              )}
              {onMoveDown && (
                <button onClick={onMoveDown} className="text-gray-400 hover:text-white">
                  ↓
                </button>
              )}
            </>
          )}
        </div>
        <button onClick={onDelete} className="text-red-400 hover:text-red-300">
          🗑️
        </button>
      </div>
      
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white mb-3"
        placeholder="URL de la imagen"
      />
      
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Imagen del contenido"
          className="w-full h-48 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>
  );
}

// Componente para bloques de video
function VideoBlock({ 
  block, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  enableAdvancedFeatures 
}: {
  block: ContentBlock;
  onUpdate: (content: string, metadata?: any) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  enableAdvancedFeatures: boolean;
}) {
  const [videoUrl, setVideoUrl] = useState(block.content as string || '');
  
  useEffect(() => {
    onUpdate(videoUrl);
  }, [videoUrl, onUpdate]);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">🎥 Video</span>
          {enableAdvancedFeatures && (
            <>
              {onMoveUp && (
                <button onClick={onMoveUp} className="text-gray-400 hover:text-white">
                  ↑
                </button>
              )}
              {onMoveDown && (
                <button onClick={onMoveDown} className="text-gray-400 hover:text-white">
                  ↓
                </button>
              )}
            </>
          )}
        </div>
        <button onClick={onDelete} className="text-red-400 hover:text-red-300">
          🗑️
        </button>
      </div>
      
      <input
        type="url"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white mb-3"
        placeholder="URL del video"
      />
      
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          className="w-full h-48 rounded"
        />
      )}
    </div>
  );
}

// Componente para bloques de código
function CodeBlock({ 
  block, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  enableAdvancedFeatures 
}: {
  block: ContentBlock;
  onUpdate: (content: string, metadata?: any) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  enableAdvancedFeatures: boolean;
}) {
  const [code, setCode] = useState(block.content as string || '');
  
  useEffect(() => {
    onUpdate(code);
  }, [code, onUpdate]);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">💻 Código</span>
          {enableAdvancedFeatures && (
            <>
              {onMoveUp && (
                <button onClick={onMoveUp} className="text-gray-400 hover:text-white">
                  ↑
                </button>
              )}
              {onMoveDown && (
                <button onClick={onMoveDown} className="text-gray-400 hover:text-white">
                  ↓
                </button>
              )}
            </>
          )}
        </div>
        <button onClick={onDelete} className="text-red-400 hover:text-red-300">
          🗑️
        </button>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white font-mono text-sm resize-none"
        placeholder="Escribe tu código aquí..."
      />
    </div>
  );
}
