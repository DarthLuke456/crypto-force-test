'use client';

import React, { useState, useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { getTribunalColors, getLevelName, getLevelEmoji } from '@/lib/tribunal-colors';
import { 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronRight,
  BookOpen,
  Play,
  CheckCircle,
  ExternalLink,
  Clock,
  Star
} from 'lucide-react';

interface TribunalContent {
  id: string;
  title: string;
  subtitle: string;
  level: number;
  category: 'theoretical' | 'practical';
  content_type: 'module' | 'checkpoint' | 'resource';
  description: string;
  thumbnail_url: string;
  duration_minutes: number;
  difficulty_level: number;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
}

interface ContentIndex {
  id: string;
  content_id: string;
  section_title: string;
  section_description: string;
  section_order: number;
  section_type: 'content' | 'video' | 'quiz' | 'exercise' | 'resource';
  section_data: any;
  is_required: boolean;
  estimated_duration: number;
}

export default function TribunalCreatorPage() {
  const { userData, isReady } = useSafeAuth();
  const [content, setContent] = useState<TribunalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<TribunalContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showIndexEditor, setShowIndexEditor] = useState(false);
  const [contentIndex, setContentIndex] = useState<ContentIndex[]>([]);

  // Verificar acceso de maestro
  const isMaestroAuthorized = userData?.user_level === 0 || userData?.user_level === 6 || 
    (userData?.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(userData.email.toLowerCase().trim()));

  useEffect(() => {
    if (isReady && isMaestroAuthorized) {
      fetchContent();
    }
  }, [isReady, isMaestroAuthorized]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tribunal_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentIndex = async (contentId: string) => {
    try {
      const { data, error } = await supabase
        .from('content_index')
        .select('*')
        .eq('content_id', contentId)
        .order('section_order', { ascending: true });

      if (error) throw error;
      setContentIndex(data || []);
    } catch (err) {
      console.error('Error fetching content index:', err);
    }
  };

  const handleCreateContent = () => {
    setSelectedContent({
      id: '',
      title: '',
      subtitle: '',
      level: 1,
      category: 'theoretical',
      content_type: 'module',
      description: '',
      thumbnail_url: '',
      duration_minutes: 0,
      difficulty_level: 1,
      is_published: false,
      is_featured: false,
      sort_order: 0
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEditContent = (contentItem: TribunalContent) => {
    setSelectedContent(contentItem);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleViewIndex = async (contentItem: TribunalContent) => {
    setSelectedContent(contentItem);
    await fetchContentIndex(contentItem.id);
    setShowIndexEditor(true);
  };

  const handleSaveContent = async () => {
    if (!selectedContent) return;

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('tribunal_content')
          .insert([selectedContent]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tribunal_content')
          .update(selectedContent)
          .eq('id', selectedContent.id);

        if (error) throw error;
      }

      await fetchContent();
      setIsCreating(false);
      setIsEditing(false);
      setSelectedContent(null);
    } catch (err) {
      console.error('Error saving content:', err);
      setError(err instanceof Error ? err.message : 'Error guardando contenido');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) return;

    try {
      const { error } = await supabase
        .from('tribunal_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;
      await fetchContent();
    } catch (err) {
      console.error('Error deleting content:', err);
      setError(err instanceof Error ? err.message : 'Error eliminando contenido');
    }
  };

  const handlePublishToggle = async (contentId: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('tribunal_content')
        .update({ is_published: !isPublished })
        .eq('id', contentId);

      if (error) throw error;
      await fetchContent();
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isMaestroAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h1>
          <p className="text-[#a0a0a0] mb-6">Solo los Maestros pueden acceder a esta página</p>
          <p className="text-[#6a6a6a] text-sm">Tu nivel actual: {userData?.user_level}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tribunal Imperial - Creador de Contenido</h1>
          <p className="text-[#a0a0a0]">Crea y gestiona contenido dinámico para todos los niveles</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleCreateContent}
            className="flex items-center space-x-2 px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Contenido</span>
          </button>

          <div className="text-sm text-[#a0a0a0]">
            {content.length} contenido{content.length !== 1 ? 's' : ''} creado{content.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
            <p className="text-[#a0a0a0]">Cargando contenido...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => {
              const colors = getTribunalColors(item.level);
              const levelName = getLevelName(item.level);
              const levelEmoji = getLevelEmoji(item.level);

              return (
                <div
                  key={item.id}
                  className="bg-[#1a1a1a] rounded-xl border border-[#333] p-6 hover:border-[#444] transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{levelEmoji}</span>
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          color: colors.primary
                        }}
                      >
                        {levelName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handlePublishToggle(item.id, item.is_published)}
                        className={`p-1 rounded ${
                          item.is_published ? 'text-green-400' : 'text-gray-400'
                        }`}
                        title={item.is_published ? 'Publicado' : 'No publicado'}
                      >
                        {item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-[#a0a0a0] mb-2">{item.subtitle}</p>
                    <div className="flex items-center space-x-4 text-xs text-[#666]">
                      <span className="capitalize">{item.category}</span>
                      <span>•</span>
                      <span className="capitalize">{item.content_type}</span>
                      {item.duration_minutes > 0 && (
                        <>
                          <span>•</span>
                          <span>{item.duration_minutes} min</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditContent(item)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleViewIndex(item)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Índice</span>
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Content Editor Modal */}
        {(isCreating || isEditing) && selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {isCreating ? 'Crear Contenido' : 'Editar Contenido'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input
                      type="text"
                      value={selectedContent.title}
                      onChange={(e) => setSelectedContent({...selectedContent, title: e.target.value})}
                      className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white"
                      placeholder="Título del contenido"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subtítulo</label>
                    <input
                      type="text"
                      value={selectedContent.subtitle}
                      onChange={(e) => setSelectedContent({...selectedContent, subtitle: e.target.value})}
                      className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white"
                      placeholder="Subtítulo descriptivo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nivel</label>
                      <select
                        value={selectedContent.level}
                        onChange={(e) => setSelectedContent({...selectedContent, level: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white"
                      >
                        <option value={0}>Fundador ⭐</option>
                        <option value={1}>Iniciado 👤</option>
                        <option value={2}>Acólito 🔮</option>
                        <option value={3}>Warrior ⚔️</option>
                        <option value={4}>Lord 👑</option>
                        <option value={5}>Darth 💀</option>
                        <option value={6}>Maestro 👨‍🏫</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Categoría</label>
                      <select
                        value={selectedContent.category}
                        onChange={(e) => setSelectedContent({...selectedContent, category: e.target.value as 'theoretical' | 'practical'})}
                        className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white"
                      >
                        <option value="theoretical">Teórico</option>
                        <option value="practical">Práctico</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <textarea
                      value={selectedContent.description}
                      onChange={(e) => setSelectedContent({...selectedContent, description: e.target.value})}
                      className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white h-20"
                      placeholder="Descripción del contenido"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duración (minutos)</label>
                      <input
                        type="number"
                        value={selectedContent.duration_minutes}
                        onChange={(e) => setSelectedContent({...selectedContent, duration_minutes: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Dificultad (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={selectedContent.difficulty_level}
                        onChange={(e) => setSelectedContent({...selectedContent, difficulty_level: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 bg-[#333] border border-[#555] rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedContent.is_published}
                        onChange={(e) => setSelectedContent({...selectedContent, is_published: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Publicado</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedContent.is_featured}
                        onChange={(e) => setSelectedContent({...selectedContent, is_featured: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Destacado</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                      setSelectedContent(null);
                    }}
                    className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveContent}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#ec4d58] hover:bg-[#d43d48] rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Index Editor Modal */}
        {showIndexEditor && selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Índice de Contenido: {selectedContent.title}</h2>
                  <button
                    onClick={() => setShowIndexEditor(false)}
                    className="p-2 hover:bg-[#333] rounded-lg transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>

                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="text-[#a0a0a0]">Editor de índice en desarrollo</p>
                  <p className="text-sm text-[#666] mt-2">
                    Aquí podrás crear y editar las secciones del módulo
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
