'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Plus, 
  MoreHorizontal, 
  Type, 
  List, 
  CheckSquare, 
  Image, 
  Video, 
  Link, 
  Code, 
  Quote, 
  Minus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Settings,
  X,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Check
} from 'lucide-react';

interface ImageMetadata {
  width?: number;
  height?: number;
  position?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large' | 'full';
  aspectRatio?: number;
}

interface NotionBlockProps {
  id: string;
  type: 'text' | 'heading' | 'subheading' | 'list' | 'checklist' | 'image' | 'video' | 'link' | 'code' | 'quote' | 'divider';
  content: string;
  metadata?: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, content: string, metadata?: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onTypeChange: (id: string, newType: string) => void;
  onAddBlock: (id: string, type: string) => void;
}

const blockTypeIcons = {
  heading: Type,
  subheading: Type,
  text: Type,
  list: List,
  checklist: CheckSquare,
  image: Image,
  video: Video,
  link: Link,
  code: Code,
  quote: Quote,
  divider: Minus
};

const blockTypeNames = {
  heading: 'Título',
  subheading: 'Subtítulo',
  text: 'Texto',
  list: 'Lista',
  checklist: 'Checklist',
  image: 'Imagen',
  video: 'Video',
  link: 'Enlace',
  code: 'Código',
  quote: 'Cita',
  divider: 'Separador'
};

export default function NotionBlock({
  id,
  type,
  content,
  metadata,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  onTypeChange,
  onAddBlock
}: NotionBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isInteractingWithFileInput, setIsInteractingWithFileInput] = useState(false);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>({
    position: 'center',
    size: 'medium',
    ...metadata?.imageMetadata
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: type === 'heading' || type === 'subheading' // Deshabilitar drag para título y subtítulo
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  // Debounced preview URL for immediate image preview
  useEffect(() => {
    if (type === 'image' && isEditing && editContent) {
      const timer = setTimeout(() => {
        setPreviewUrl(editContent);
      }, 500); // 500ms delay for debouncing
      
      return () => clearTimeout(timer);
    }
  }, [editContent, type, isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowTypeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editContent !== content) {
      onUpdate(id, editContent, metadata);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
      onAddBlock(id, 'text');
    } else if (e.key === 'Escape') {
      setEditContent(content);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    // No cerrar el bloque si se está interactuando con el input de archivos
    if (isInteractingWithFileInput) {
      return;
    }
    handleSave();
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Mantener el estado de interacción durante el proceso
    setIsInteractingWithFileInput(true);
    
    if (!file) {
      setIsInteractingWithFileInput(false);
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB permitido.');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        
        if (result) {
          setEditContent(result);
          onUpdate(id, result, metadata);
        } else {
          throw new Error('No se pudo leer el archivo');
        }
      } catch (error) {
        alert('Error al procesar la imagen. Intenta con otra imagen.');
      } finally {
        setIsUploading(false);
        // Resetear el estado de interacción después de un delay
        setTimeout(() => setIsInteractingWithFileInput(false), 500);
      }
    };

    reader.onerror = () => {
      alert('Error al leer el archivo. Intenta con otra imagen.');
      setIsUploading(false);
      setIsInteractingWithFileInput(false);
    };

    reader.onabort = () => {
      setIsUploading(false);
      setIsInteractingWithFileInput(false);
    };

    // Iniciar la lectura del archivo
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error al procesar la imagen. Intenta con otra imagen.');
      setIsUploading(false);
      setIsInteractingWithFileInput(false);
    }
  };

  // Image edit functions
  const handleImageEdit = () => {
    setShowImageEditModal(true);
  };

  const handleImageMetadataUpdate = (newMetadata: Partial<ImageMetadata>) => {
    const updatedMetadata = { ...imageMetadata, ...newMetadata };
    setImageMetadata(updatedMetadata);
    onUpdate(id, editContent, { ...metadata, imageMetadata: updatedMetadata });
  };

  const getImageSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'max-w-xs';
      case 'medium': return 'max-w-md';
      case 'large': return 'max-w-lg';
      case 'full': return 'max-w-full';
      default: return 'max-w-md';
    }
  };

  const getImagePositionClass = (position: string) => {
    switch (position) {
      case 'left': return 'float-left mr-4 mb-2';
      case 'right': return 'float-right ml-4 mb-2';
      case 'center': return 'mx-auto block';
      default: return 'mx-auto block';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'heading':
        return (
          <div className="text-3xl font-bold text-[#fafafa]">
            {isEditing ? (
              <div className="relative">
              <input
                ref={inputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                  className="w-full bg-[#121212] border border-[#8a8a8a] rounded-xl px-6 py-4 text-3xl font-bold text-[#fafafa] placeholder-[#8a8a8a] focus:border-[#fafafa] focus:ring-2 focus:ring-[#fafafa]/20 transition-all duration-200"
                  placeholder="Escribe el título de tu propuesta aquí..."
                autoFocus
              />
                <div className="absolute top-2 right-3 text-xs text-[#8a8a8a] bg-[#121212] px-2 py-1 rounded-lg font-medium">
                  Título
                </div>
              </div>
            ) : (
              <div 
                onClick={handleClick} 
                className="cursor-text hover:bg-[#121212] px-6 py-4 rounded-xl transition-all duration-200 group border border-transparent hover:border-[#8a8a8a]"
              >
                <span className="text-3xl font-bold text-[#fafafa]">
                  {editContent || 'Escribe el título de tu propuesta aquí...'}
              </span>
                <div className="mt-2 text-xs text-[#8a8a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  💡 Haz clic para editar el título
                </div>
              </div>
            )}
          </div>
        );

      case 'subheading':
        return (
          <div className="text-xl font-semibold text-[#8a8a8a]">
            {isEditing ? (
              <div className="relative">
              <input
                ref={inputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                  className="w-full bg-[#121212] border border-[#8a8a8a] rounded-xl px-6 py-4 text-xl font-semibold text-[#8a8a8a] placeholder-[#8a8a8a] focus:border-[#fafafa] focus:ring-2 focus:ring-[#fafafa]/20 transition-all duration-200"
                  placeholder="Añade una descripción breve..."
                autoFocus
              />
                <div className="absolute top-2 right-3 text-xs text-[#8a8a8a] bg-[#121212] px-2 py-1 rounded-lg font-medium">
                  Subtítulo
                </div>
              </div>
            ) : (
              <div 
                onClick={handleClick} 
                className="cursor-text hover:bg-[#121212] px-6 py-4 rounded-xl transition-all duration-200 group border border-transparent hover:border-[#8a8a8a]"
              >
                <span className="text-xl font-semibold text-[#8a8a8a]">
                  {editContent || 'Añade una descripción breve...'}
              </span>
                <div className="mt-2 text-xs text-[#8a8a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  💡 Haz clic para editar el subtítulo
                </div>
              </div>
            )}
          </div>
        );

      case 'list':
        return (
          <div className="flex items-start space-x-3">
            <span className="text-[#fafafa] mt-1 text-lg">•</span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none text-[#fafafa] placeholder-[#8a8a8a] focus:placeholder-[#8a8a8a] transition-colors"
                  placeholder="Escribe un elemento de la lista..."
                />
              ) : (
                <span onClick={handleClick} className="cursor-text hover:bg-[#121212] px-3 py-2 rounded-lg transition-colors">
                  {editContent || 'Escribe un elemento de la lista...'}
                </span>
              )}
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={metadata?.checked || false}
              onChange={(e) => onUpdate(id, content, { ...metadata, checked: e.target.checked })}
              className="mt-1 w-5 h-5 text-[#fafafa] bg-[#121212] border-2 border-[#8a8a8a] rounded focus:ring-[#fafafa] focus:ring-2"
            />
            <div className="flex-1">
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-transparent border-none outline-none text-[#fafafa] placeholder-[#8a8a8a] focus:placeholder-[#8a8a8a] transition-colors ${
                    metadata?.checked ? 'line-through text-[#8a8a8a]' : ''
                  }`}
                  placeholder="Escribe una tarea..."
                />
              ) : (
                <span 
                  onClick={handleClick}
                  className={`cursor-text hover:bg-[#121212] px-3 py-2 rounded-lg transition-colors ${
                    metadata?.checked ? 'line-through text-[#8a8a8a]' : ''
                  }`}
                >
                  {editContent || 'Escribe una tarea...'}
                </span>
              )}
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="w-full h-px bg-[#8a8a8a] my-4" />
        );

      case 'image':
        return (
          <div className="text-[#fafafa]">
            {isEditing ? (
              <div className="space-y-4">
                {/* Input para URL */}
                <div>
                  <label className="block text-xs text-[#8a8a8a] mb-1">URL de imagen:</label>
                  <input
                    ref={inputRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#121212] border border-[#8a8a8a] rounded px-3 py-2 text-[#fafafa] text-sm"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    autoFocus
                  />
                </div>
                
                {/* Preview de imagen cuando hay contenido */}
                {(editContent || previewUrl) && (
                  <div className="space-y-2">
                    <label className="block text-xs text-[#8a8a8a] mb-1">Vista previa:</label>
                    <div className="relative group">
                      <div className={`${getImagePositionClass(imageMetadata.position || 'center')} ${getImageSizeClass(imageMetadata.size || 'medium')} relative z-20`}>
                        {isUploading ? (
                          <div className="w-full h-32 bg-[#121212] border border-[#8a8a8a] rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-8 h-8 border-2 border-[#fafafa] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                              <div className="text-[#fafafa] text-sm">Cargando imagen...</div>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={previewUrl || editContent} 
                            alt="Image preview" 
                            className="w-full h-auto rounded-lg border border-[#8a8a8a] hover:border-[#fafafa] transition-colors"
                            onLoad={() => setIsUploading(false)}
                            onError={(e) => {
                              const imgElement = e.currentTarget;
                              imgElement.style.display = 'none';
                              const errorDiv = document.createElement('div');
                              errorDiv.className = 'p-4 bg-red-900/20 border border-red-500 rounded-lg text-center';
                              errorDiv.innerHTML = `
                                <div class="text-red-400 text-sm mb-2">⚠️ Error al cargar imagen</div>
                                <div class="text-red-300 text-xs">Verifica la URL o archivo</div>
                              `;
                              imgElement.parentNode?.insertBefore(errorDiv, imgElement.nextSibling);
                            }}
                          />
                        )}
                        
                        {/* Edit button - always visible in top-right corner */}
                        {!isUploading && (previewUrl || editContent) && (
                          <div className="absolute top-2 right-2 z-30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageEdit();
                              }}
                              className="p-2 bg-[#fafafa] text-[#121212] rounded-full shadow-lg hover:bg-[#8a8a8a] transition-colors duration-200 hover:scale-110 opacity-80 hover:opacity-100"
                              title="Editar imagen"
                            >
                              <Settings size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Separador */}
                <div className="text-center text-[#8a8a8a] text-xs">- O -</div>
                
                {/* Carga local - MEJORADO */}
                <div 
                  className="space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className="block text-sm font-medium text-[#8a8a8a]">Cargar desde tu computadora:</label>
                  
                  {/* Input de archivo con overlay clickeable */}
                  <div 
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInteractingWithFileInput(true);
                    }}
                    onMouseEnter={() => setIsInteractingWithFileInput(true)}
                    onMouseLeave={() => setIsInteractingWithFileInput(false)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLocalImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id={`file-input-${id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsInteractingWithFileInput(true);
                      }}
                      onFocus={() => setIsInteractingWithFileInput(true)}
                      onBlur={() => {
                        // Delay para permitir que se procese la selección de archivo
                        setTimeout(() => setIsInteractingWithFileInput(false), 100);
                      }}
                    />
                    <div 
                      className="w-full bg-[#121212] border-2 border-dashed border-[#8a8a8a] rounded-lg px-6 py-8 text-center cursor-pointer hover:border-[#fafafa] hover:bg-[#fafafa]/5 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsInteractingWithFileInput(true);
                        // Trigger the file input click
                        const fileInput = document.getElementById(`file-input-${id}`) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-[#fafafa]/20 rounded-full flex items-center justify-center">
                          <Image size={24} className="text-[#fafafa]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#fafafa]">Haz clic para seleccionar una imagen</p>
                          <p className="text-xs text-[#8a8a8a] mt-1">o arrastra y suelta aquí</p>
                        </div>
                      </div>
                    </div>
                    
                    {isUploading && (
                      <div 
                        className="absolute inset-0 bg-[#121212]/90 rounded-lg flex items-center justify-center z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fafafa]"></div>
                          <div className="text-[#fafafa] text-sm font-medium">Cargando imagen...</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-[#8a8a8a] text-center">
                    Formatos soportados: JPG, PNG, GIF, WebP • Tamaño máximo: 5MB
                  </div>
                </div>
                
                <div className="text-xs text-[#8a8a8a]">
                  💡 Puedes usar una URL o cargar una imagen desde tu computadora
                </div>
              </div>
            ) : (
              <div className="relative group">
                {editContent ? (
                  <div className={`${getImagePositionClass(imageMetadata.position || 'center')} ${getImageSizeClass(imageMetadata.size || 'medium')} relative z-20`}>
                    <img 
                      ref={imageRef}
                      src={editContent} 
                      alt="Imagen" 
                      className="w-full h-auto rounded-lg border border-[#8a8a8a] hover:border-[#fafafa] transition-colors"
                      onError={(e) => {
                        // Mostrar mensaje de error más claro
                        const imgElement = e.currentTarget;
                        imgElement.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'p-4 bg-red-900/20 border border-red-500 rounded-lg text-center';
                        errorDiv.innerHTML = `
                          <div class="text-red-400 text-sm mb-2">⚠️ Error al cargar imagen</div>
                          <div class="text-red-300 text-xs">${editContent.length > 100 ? 'URL muy larga o inválida' : 'Verifica la URL o archivo'}</div>
                          <button class="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700" onclick="this.parentElement.previousElementSibling.style.display='block';this.parentElement.remove()">
                            Reintentar
                          </button>
                        `;
                        imgElement.parentNode?.insertBefore(errorDiv, imgElement.nextSibling);
                      }}
                    />
                    
                    {/* Edit button - always visible in top-right corner */}
                    <div className="absolute top-2 right-2 z-30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageEdit();
                        }}
                        className="p-2 bg-[#fafafa] text-[#121212] rounded-full shadow-lg hover:bg-[#8a8a8a] transition-colors duration-200 hover:scale-110 opacity-80 hover:opacity-100"
                        title="Editar imagen"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={handleClick} 
                    className="w-full h-40 bg-[#121212] border-2 border-dashed border-[#8a8a8a] rounded-lg flex items-center justify-center text-[#8a8a8a] text-sm cursor-pointer hover:border-[#fafafa] hover:bg-[#fafafa]/5 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-[#121212] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Image size={24} className="text-[#8a8a8a]" />
                      </div>
                      <p className="font-medium text-[#fafafa]">Haz clic para agregar una imagen</p>
                      <p className="text-xs text-[#8a8a8a] mt-1">JPG, PNG, GIF, WebP</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="text-[#fafafa]">
            {isEditing ? (
              <div className="space-y-2">
                                 <textarea
                   ref={textareaRef}
                   value={editContent}
                   onChange={(e) => setEditContent(e.target.value)}
                   onBlur={handleBlur}
                   onKeyDown={handleKeyDown}
                   className="w-full bg-[#121212] border border-[#8a8a8a] rounded p-3 text-[#fafafa] font-mono resize-none"
                   placeholder="Escribe tu código HTML o CSS aquí..."
                   rows={Math.max(3, editContent.split('\n').length)}
                   autoFocus
                 />
                <div className="text-xs text-[#8a8a8a]">
                  💡 El código se renderizará automáticamente en tiempo real
                </div>
              </div>
            ) : (
              <div onClick={handleClick} className="cursor-pointer">
                {editContent ? (
                  <div className="space-y-4">
                    {/* Código fuente */}
                    <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-4">
                      <div className="text-xs text-[#fafafa] font-medium mb-2">💻 Código Fuente:</div>
                      <pre className="text-sm text-[#8a8a8a] font-mono overflow-x-auto">
                        <code>{editContent}</code>
                      </pre>
                    </div>
                    
                    {/* Renderizado en vivo */}
                    <div className="bg-[#121212] text-[#fafafa] p-4 rounded-lg border border-[#8a8a8a]">
                      <div className="text-xs text-[#fafafa] font-medium mb-2">👁️ Vista Previa:</div>
                      <div 
                        className="min-h-[100px]"
                        dangerouslySetInnerHTML={{ __html: editContent }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[#8a8a8a] italic">Código no especificado</div>
                )}
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="text-[#fafafa]">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#8a8a8a] mb-1">URL del video (YouTube, Vimeo, etc.):</label>
                  <input
                    ref={inputRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#121212] border border-[#8a8a8a] rounded px-3 py-2 text-[#fafafa] text-sm"
                    placeholder="https://www.youtube.com/watch?v=..."
                    autoFocus
                  />
                </div>
                
                <div className="text-xs text-[#8a8a8a]">
                  💡 El video se reproducirá directamente en la plataforma
                </div>
              </div>
            ) : (
              <div onClick={handleClick} className="cursor-pointer">
                {editContent ? (
                  <div className="space-y-4">
                    {/* Video embebido */}
                    <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-4">
                      <div className="text-xs text-[#fafafa] font-medium mb-2">🎥 Video:</div>
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={editContent.includes('youtube.com') ? 
                            editContent.replace('watch?v=', 'embed/') :
                            editContent.includes('youtu.be') ?
                            editContent.replace('youtu.be/', 'youtube.com/embed/') :
                            editContent
                          }
                          title="Video"
                          className="absolute top-0 left-0 w-full h-full rounded border border-[#8a8a8a]"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                    
                    {/* URL del video */}
                    <div className="text-xs text-[#8a8a8a] break-all">
                      📍 {editContent}
                    </div>
                  </div>
                ) : (
                  <div className="text-[#8a8a8a] italic">Video no especificado</div>
                )}
              </div>
            )}
          </div>
        );

            case 'link':
        return (
          <div className="text-[#fafafa]">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  ref={inputRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-[#121212] border border-[#8a8a8a] rounded px-3 py-2 text-[#fafafa] text-sm"
                  placeholder="https://ejemplo.com"
                  autoFocus
                />
                <div className="text-xs text-[#8a8a8a]">
                  💡 Inserta la URL del enlace
                </div>
              </div>
            ) : (
              <div onClick={handleClick} className="cursor-pointer">
                {editContent ? (
                  <a 
                    href={editContent} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#fafafa] hover:text-[#8a8a8a] underline break-all"
                  >
                    🔗 {editContent}
                  </a>
                ) : (
                  <div className="text-[#8a8a8a] italic">Enlace no especificado</div>
                )}
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="text-[#fafafa]">
            {isEditing ? (
              <div className="space-y-2">
                                 <textarea
                   ref={textareaRef}
                   value={editContent}
                   onChange={(e) => setEditContent(e.target.value)}
                   onBlur={handleBlur}
                   onKeyDown={handleKeyDown}
                   className="w-full bg-[#121212] border-l-4 border-[#fafafa] rounded px-3 py-2 text-[#fafafa] resize-none"
                   placeholder="Escribe tu cita aquí..."
                   rows={Math.max(2, editContent.split('\n').length)}
                   autoFocus
                 />
                <div className="text-xs text-[#8a8a8a]">
                  💡 Las citas se mostrarán con un borde dorado especial
                </div>
              </div>
            ) : (
              <div onClick={handleClick} className="cursor-pointer">
                {editContent ? (
                  <blockquote className="border-l-4 border-[#fafafa] pl-4 py-2 bg-[#121212]/50 rounded-r">
                    <p className="text-[#8a8a8a] italic">"{editContent}"</p>
                  </blockquote>
                ) : (
                  <div className="text-[#8a8a8a] italic">Cita no especificada</div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-[#fafafa]">
            {isEditing ? (
              <div className="relative">
                             <textarea
                 ref={textareaRef}
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
                 onBlur={handleBlur}
                 onKeyDown={handleKeyDown}
                  className="w-full bg-[#121212] border border-[#8a8a8a] rounded-xl px-6 py-4 text-[#fafafa] resize-none min-h-[120px] focus:border-[#fafafa] focus:ring-2 focus:ring-[#fafafa]/20 transition-all duration-200"
                  placeholder="Escribe tu contenido aquí..."
                  rows={Math.max(3, editContent.split('\n').length)}
                 autoFocus
               />
                <div className="absolute top-2 right-3 text-xs text-[#8a8a8a] bg-[#121212] px-2 py-1 rounded-lg font-medium">
                  Texto
                </div>
                <div className="mt-2 text-xs text-[#8a8a8a]">
                  💡 Puedes usar múltiples líneas para organizar tu contenido
                </div>
              </div>
            ) : (
              <div 
                onClick={handleClick}
                className="cursor-text hover:bg-[#121212] px-6 py-4 rounded-xl transition-all duration-200 group border border-transparent hover:border-[#8a8a8a] min-h-[120px] w-full"
              >
                <div className="text-[#fafafa] leading-relaxed whitespace-pre-wrap w-full">
                  {editContent || 'Escribe tu contenido aquí...'}
                </div>
                <div className="mt-2 text-xs text-[#8a8a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  💡 Haz clic para editar el texto
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative min-h-[32px] py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer z-10 ${
        isSelected 
          ? 'bg-[#fafafa]/15 border-2 border-[#fafafa]/40 shadow-lg shadow-[#fafafa]/10' 
          : 'hover:bg-[#121212]/60 hover:shadow-lg hover:shadow-[#fafafa]/5 hover:border hover:border-[#fafafa]/20'
      } ${isDragging ? 'opacity-50 scale-105 z-50' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
             {/* Handle de Drag & Drop - Solo para bloques que no sean título o subtítulo */}
       {(type !== 'heading' && type !== 'subheading') && (
       <div
         {...attributes}
         {...listeners}
         className={`absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110 z-20 p-1 rounded hover:bg-[#8a8a8a]/20 ${
           isDragging ? 'opacity-100 scale-110' : ''
         }`}
         onClick={(e) => e.stopPropagation()}
       >
         <GripVertical size={16} className="text-gray-400 hover:text-[#fafafa]" />
       </div>
       )}

      {/* Botón de menú del bloque */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded hover:bg-[#8a8a8a]/20 transition-colors"
        >
          <MoreHorizontal size={16} className="text-gray-400 hover:text-[#fafafa]" />
        </button>
      </div>

      {/* Menú contextual del bloque */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 bg-[#121212] border border-[#8a8a8a] rounded-lg shadow-xl z-50 min-w-[200px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2">
            <button
              onClick={() => {
                setShowTypeMenu(!showTypeMenu);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#8a8a8a] rounded transition-colors"
            >
              <Type size={14} />
              <span>Cambiar tipo</span>
            </button>
            
            <button
              onClick={() => onDuplicate(id)}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#8a8a8a] rounded transition-colors"
            >
              <Copy size={14} />
              <span>Duplicar</span>
            </button>
            
            {/* Botón de editar imagen - solo para bloques de imagen */}
            {type === 'image' && (
              <button
                onClick={() => {
                  handleImageEdit();
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[#fafafa] hover:bg-[#8a8a8a] rounded transition-colors"
              >
                <Settings size={14} />
                <span>Editar imagen</span>
              </button>
            )}
            
            <button
              onClick={() => onMove(id, 'up')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#8a8a8a] rounded transition-colors"
            >
              <ArrowUp size={14} />
              <span>Mover arriba</span>
            </button>
            
            <button
              onClick={() => onMove(id, 'down')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#8a8a8a] rounded transition-colors"
            >
              <ArrowDown size={14} />
              <span>Mover abajo</span>
            </button>
            
            <div className="border-t border-[#8a8a8a] my-1" />
            
            <button
              onClick={() => onDelete(id)}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <Trash2 size={14} />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      )}

      {/* Menú de tipos de bloque */}
      {showTypeMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 bg-[#121212] border border-[#8a8a8a] rounded-lg shadow-xl z-50 min-w-[180px]"
        >
          <div className="p-2">
            {Object.entries(blockTypeNames).map(([blockType, blockName]) => {
              const IconComponent = blockTypeIcons[blockType as keyof typeof blockTypeIcons];
              return (
                <button
                  key={blockType}
                  onClick={() => {
                    onTypeChange(id, blockType);
                    setShowTypeMenu(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded transition-colors ${
                    type === blockType
                      ? 'bg-[#fafafa]/20 text-[#fafafa]'
                      : 'text-gray-300 hover:bg-[#8a8a8a]'
                  }`}
                >
                  <IconComponent size={14} />
                  <span>{blockName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón de agregar bloque - Mejorado para evitar superposiciones */}
      <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <button
          onClick={() => onAddBlock(id, 'text')}
          className="group/btn relative inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#121212] to-[#3a3a3a] border border-[#8a8a8a] hover:from-[#fafafa] hover:to-[#8a8a8a] hover:border-[#fafafa] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out transform hover:scale-110"
          title="Agregar bloque aquí"
        >
          <Plus size={14} className="text-gray-400 group-hover/btn:text-[#121212] transition-colors duration-200" />
        </button>
      </div>

      {/* Contenido del bloque */}
      <div className={`pr-8 relative z-10 ${(type !== 'heading' && type !== 'subheading') ? 'pl-6' : 'pl-4'}`}>
        {renderContent()}
      </div>

      {/* Image Edit Modal */}
      {showImageEditModal && type === 'image' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#8a8a8a] rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#fafafa] to-[#8a8a8a] rounded-xl flex items-center justify-center shadow-lg">
                    <Settings size={24} className="text-[#121212]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Editar Imagen</h3>
                    <p className="text-sm text-gray-400">Ajusta el tamaño y posición de la imagen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowImageEditModal(false)}
                  className="p-3 text-gray-400 hover:text-white hover:bg-[#8a8a8a] rounded-xl transition-all duration-200 group"
                >
                  <X size={24} className="group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preview Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Image size={16} className="text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white">Vista Previa</h4>
                  </div>
                  <div className="bg-[#0f0f0f] border-2 border-[#8a8a8a] rounded-xl p-6 min-h-[400px] flex items-center justify-center">
                    <div className={`${getImagePositionClass(imageMetadata.position || 'center')} ${getImageSizeClass(imageMetadata.size || 'medium')} transition-all duration-300`}>
                      <img 
                        src={editContent} 
                        alt="Image preview" 
                        className="w-full h-auto rounded-xl border-2 border-[#fafafa]/30 shadow-lg hover:shadow-xl transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleImageMetadataUpdate({ size: 'small' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        imageMetadata.size === 'small'
                          ? 'bg-[#fafafa] text-[#121212]'
                          : 'bg-[#121212] text-gray-300 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      Pequeño
                    </button>
                    <button
                      onClick={() => handleImageMetadataUpdate({ size: 'medium' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        imageMetadata.size === 'medium'
                          ? 'bg-[#fafafa] text-[#121212]'
                          : 'bg-[#121212] text-gray-300 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      Mediano
                    </button>
                    <button
                      onClick={() => handleImageMetadataUpdate({ size: 'large' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        imageMetadata.size === 'large'
                          ? 'bg-[#fafafa] text-[#121212]'
                          : 'bg-[#121212] text-gray-300 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      Grande
                    </button>
                  </div>
                </div>

                {/* Controls Section */}
                <div className="space-y-8">
                  {/* Size Controls */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Maximize2 size={16} className="text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-white">Tamaño</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'small', label: 'Pequeño', icon: Minimize2, description: '25% del ancho' },
                        { value: 'medium', label: 'Mediano', icon: Move, description: '50% del ancho' },
                        { value: 'large', label: 'Grande', icon: Maximize2, description: '75% del ancho' },
                        { value: 'full', label: 'Completo', icon: Maximize2, description: '100% del ancho' }
                      ].map(({ value, label, icon: Icon, description }) => (
                        <button
                          key={value}
                          onClick={() => handleImageMetadataUpdate({ size: value as any })}
                          className={`group flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            imageMetadata.size === value
                              ? 'bg-[#fafafa]/20 border-[#fafafa] text-[#fafafa] shadow-lg'
                              : 'bg-[#121212] border-[#8a8a8a] text-gray-300 hover:border-[#fafafa]/50 hover:bg-[#fafafa]/5'
                          }`}
                        >
                          <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm font-semibold">{label}</span>
                          <span className="text-xs text-gray-400 text-center">{description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <AlignCenter size={16} className="text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-white">Posición</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'left', label: 'Izquierda', icon: AlignLeft, description: 'Alineado a la izquierda' },
                        { value: 'center', label: 'Centro', icon: AlignCenter, description: 'Centrado' },
                        { value: 'right', label: 'Derecha', icon: AlignRight, description: 'Alineado a la derecha' }
                      ].map(({ value, label, icon: Icon, description }) => (
                        <button
                          key={value}
                          onClick={() => handleImageMetadataUpdate({ position: value as any })}
                          className={`group flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            imageMetadata.position === value
                              ? 'bg-[#fafafa]/20 border-[#fafafa] text-[#fafafa] shadow-lg'
                              : 'bg-[#121212] border-[#8a8a8a] text-gray-300 hover:border-[#fafafa]/50 hover:bg-[#fafafa]/5'
                          }`}
                        >
                          <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm font-semibold">{label}</span>
                          <span className="text-xs text-gray-400 text-center">{description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Settings size={16} className="text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-white">Configuración Avanzada</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Ancho personalizado (px)</label>
                        <input
                          type="number"
                          value={imageMetadata.width || ''}
                          onChange={(e) => handleImageMetadataUpdate({ width: parseInt(e.target.value) || undefined })}
                          className="w-full bg-[#121212] border border-[#8a8a8a] rounded-lg px-4 py-3 text-white text-sm focus:border-[#fafafa] focus:ring-1 focus:ring-[#fafafa] transition-all duration-200"
                          placeholder="Auto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Alto personalizado (px)</label>
                        <input
                          type="number"
                          value={imageMetadata.height || ''}
                          onChange={(e) => handleImageMetadataUpdate({ height: parseInt(e.target.value) || undefined })}
                          className="w-full bg-[#121212] border border-[#8a8a8a] rounded-lg px-4 py-3 text-white text-sm focus:border-[#fafafa] focus:ring-1 focus:ring-[#fafafa] transition-all duration-200"
                          placeholder="Auto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={() => {
                        onUpdate(id, editContent, { imageMetadata });
                        setShowImageEditModal(false);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#fafafa] to-[#8a8a8a] text-[#121212] rounded-xl font-semibold hover:from-[#8a8a8a] hover:to-[#8a8a8a] transition-all duration-200 hover:shadow-lg hover:shadow-[#fafafa]/25"
                    >
                      <Check size={18} />
                      <span>Aplicar Cambios</span>
                    </button>
                    <button
                      onClick={() => setShowImageEditModal(false)}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#121212] border border-[#8a8a8a] text-gray-300 rounded-xl font-medium hover:bg-[#3a3a3a] hover:border-[#666] transition-all duration-200"
                    >
                      <X size={18} />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
