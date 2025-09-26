'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Filter, Search, AlertCircle, XCircle, Eye, Reply, Trash2, Send, RotateCcw } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-working';
import { supabase } from '@/lib/supabaseClient';

interface FeedbackResponse {
  id: string;
  response_text: string;
  response_by: string;
  response_by_email: string;
  created_at: string;
}

interface FeedbackItem {
  id: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  response: string | null;
  response_by: string | null;
  response_at: string | null;
  nickname: string | null;
  whatsapp: string | null;
  email: string;
  user_id: string | null;
  feedback_responses?: FeedbackResponse[];
}

export default function FeedbackPage() {
  const { userData } = useSafeAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0
  });
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState<string | null>(null);

  // Cargar feedbacks
  useEffect(() => {
    if (userData) {
      loadFeedbacks();
    }
  }, [filters, userData]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Dashboard - loadFeedbacks iniciado');
      
      // Obtener sesión para autenticación
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('🔍 Dashboard - Sesión obtenida:', { session: !!session, error: sessionError });
      
      if (sessionError || !session) {
        console.error('❌ No hay sesión válida:', sessionError);
        return;
      }
      
      console.log('🔍 Dashboard - Token de sesión:', session.access_token?.substring(0, 20) + '...');
      
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      // Add cache busting parameter
      params.append('_t', Date.now().toString());

      const url = `/api/feedback?${params.toString()}`;
      console.log('🔍 Dashboard - URL de consulta:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      console.log('🔍 Dashboard - Response status:', response.status);
      console.log('🔍 Dashboard - Response ok:', response.ok);
      
      const data = await response.json();
      console.log('🔍 Dashboard - Data recibida:', data);
      console.log('🔍 Dashboard - Feedback items:', data.data?.map((f: FeedbackItem) => ({ id: f.id, email: f.email, nickname: f.nickname, whatsapp: f.whatsapp })));

      if (data.success) {
        console.log('✅ Dashboard - Feedbacks cargados:', data.data.length);
        setFeedbacks(data.data);
        calculateStats(data.data);
      } else {
        console.error('❌ Error en respuesta:', data.error);
      }
    } catch (error) {
      console.error('❌ Error al cargar feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: FeedbackItem[]) => {
    setStats({
      total: data.length,
      pending: data.filter(f => f.status === 'pending').length,
      in_progress: data.filter(f => f.status === 'in_progress').length,
      resolved: data.filter(f => f.status === 'resolved').length
    });
  };

  const handleReply = async () => {
    if (!selectedFeedback || !replyText.trim()) return;
    
    try {
      setIsReplying(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ No hay sesión válida:', sessionError);
        return;
      }

      const response = await fetch('/api/feedback/respond', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackId: selectedFeedback.id,
          response: replyText.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Respuesta enviada exitosamente');
        setReplyText('');
        setSelectedFeedback(null);
        loadFeedbacks(); // Recargar la lista
      } else {
        console.error('❌ Error al enviar respuesta:', data.error);
      }
    } catch (error) {
      console.error('❌ Error al enviar respuesta:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este feedback?')) return;
    
    try {
      setIsDeleting(feedbackId);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ No hay sesión válida:', sessionError);
        return;
      }

      const response = await fetch(`/api/feedback/delete?id=${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Feedback eliminado exitosamente');
        loadFeedbacks(); // Recargar la lista
      } else {
        console.error('❌ Error al eliminar feedback:', data.error);
      }
    } catch (error) {
      console.error('❌ Error al eliminar feedback:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleResolve = async (feedbackId: string) => {
    try {
      setIsResolving(feedbackId);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ No hay sesión válida:', sessionError);
        return;
      }

      const response = await fetch('/api/feedback/resolve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackId: feedbackId
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Feedback marcado como resuelto');
        loadFeedbacks(); // Recargar la lista
        if (selectedFeedback && selectedFeedback.id === feedbackId) {
          setSelectedFeedback(data.data);
        }
      } else {
        console.error('❌ Error al marcar como resuelto:', data.error);
      }
    } catch (error) {
      console.error('❌ Error al marcar como resuelto:', error);
    } finally {
      setIsResolving(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4 text-[#ec4d58]" />;
      case 'in_progress': return <AlertCircle className="w-4 h-4 text-[#8a8a8a]" />;
      case 'resolved': return <AlertCircle className="w-4 h-4 text-[#3ed598]" />;
      default: return <XCircle className="w-4 h-4 text-[#8a8a8a]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[#ec4d58]/20 text-[#ec4d58] border-[#ec4d58]/30';
      case 'in_progress': return 'bg-[#8a8a8a]/20 text-[#8a8a8a] border-[#8a8a8a]/30';
      case 'resolved': return 'bg-[#3ed598]/20 text-[#3ed598] border-[#3ed598]/30';
      default: return 'bg-[#8a8a8a]/20 text-[#8a8a8a] border-[#8a8a8a]/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return 'bg-[#ec4d58]/20 text-[#ec4d58]';
      case 'feature': return 'bg-[#8a8a8a]/20 text-[#8a8a8a]';
      case 'suggestion': return 'bg-[#8a8a8a]/20 text-[#8a8a8a]';
      default: return 'bg-[#8a8a8a]/20 text-[#8a8a8a]';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-[#8a8a8a] rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#fafafa]" />
            </div>
            <h1 className="text-3xl font-bold text-[#FAFAFA]">Feedback de Usuarios</h1>
          </div>
          <p className="text-[#FAFAFA]/70">Gestiona y responde a los comentarios de los usuarios</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-[#8a8a8a]/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a8a8a] text-sm">Total</p>
                <p className="text-2xl font-bold text-[#FAFAFA]">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-[#8a8a8a]" />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#8a8a8a]/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a8a8a] text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-[#8a8a8a]">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-[#8a8a8a]" />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#8a8a8a]/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a8a8a] text-sm">En Progreso</p>
                <p className="text-2xl font-bold text-[#8a8a8a]">{stats.in_progress}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-[#8a8a8a]" />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#3ed598]/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3ed598] text-sm">Resueltos</p>
                <p className="text-2xl font-bold text-[#3ed598]">{stats.resolved}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-[#3ed598]" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] border border-[#8a8a8a]/20 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
                <input
                  type="text"
                  placeholder="Buscar por asunto o mensaje..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#8a8a8a]/30 rounded-lg text-[#FAFAFA] placeholder-[#8a8a8a] focus:border-[#8a8a8a] focus:outline-none"
                />
              </div>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-[#121212] border border-[#8a8a8a]/30 rounded-lg text-[#FAFAFA] focus:border-[#8a8a8a] focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="in_progress">En Progreso</option>
              <option value="resolved">Resueltos</option>
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 bg-[#121212] border border-[#8a8a8a]/30 rounded-lg text-[#FAFAFA] focus:border-[#8a8a8a] focus:outline-none"
            >
              <option value="all">Todas las categorías</option>
              <option value="general">General</option>
              <option value="bug">Bug</option>
              <option value="feature">Nueva Funcionalidad</option>
              <option value="suggestion">Sugerencia</option>
            </select>
            </div>
            <button
              onClick={() => loadFeedbacks()}
              className="px-4 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#6a6a6a] transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-[#1a1a1a] border border-[#8a8a8a]/20 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#8a8a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#8a8a8a]">Cargando feedbacks...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-[#8a8a8a] mx-auto mb-4" />
              <p className="text-[#8a8a8a]">No hay feedbacks para mostrar</p>
            </div>
          ) : (
            <div className="divide-y divide-[#8a8a8a]/10">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-6 hover:bg-[#8a8a8a]/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#FAFAFA]">{feedback.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                          {feedback.category}
                        </span>
                      </div>
                      
                      <p className="text-[#FAFAFA]/70 mb-3 line-clamp-2">
                        {feedback.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-[#FAFAFA]/50">
                        <span>De: {feedback.nickname || feedback.email}</span>
                        {feedback.whatsapp && (
                          <>
                            <span>•</span>
                            <span>📱 {feedback.whatsapp}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{formatDate(feedback.created_at)}</span>
                        {feedback.resolved_at && (
                          <>
                            <span>•</span>
                            <span>Resuelto: {formatDate(feedback.resolved_at)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(feedback.status)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedback(feedback);
                        }}
                        className="p-1 hover:bg-[#8a8a8a]/20 rounded transition-colors"
                        title="Ver detalles"
                      >
                      <Eye className="w-4 h-4 text-[#FAFAFA]/50" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(feedback.id);
                        }}
                        disabled={isDeleting === feedback.id}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        {isDeleting === feedback.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-500" />
                        )}
                      </button>
                      {feedback.status !== 'resolved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolve(feedback.id);
                          }}
                          disabled={isResolving === feedback.id}
                          className="p-1 hover:bg-green-500/20 rounded transition-colors disabled:opacity-50"
                          title="Marcar como resuelto"
                        >
                          {isResolving === feedback.id ? (
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <AlertCircle className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedFeedback(null)} />
          <div className="relative bg-[#121212] border border-[#8a8a8a]/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#FAFAFA]">{selectedFeedback.subject}</h2>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="p-2 hover:bg-[#8a8a8a]/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-[#8a8a8a]" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Mensaje</h3>
                  <div className="bg-[#1a1a1a] border border-[#8a8a8a]/20 rounded-lg p-4">
                    <p className="text-[#FAFAFA]/90 whitespace-pre-wrap">{selectedFeedback.message}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-[#8a8a8a] mb-1">Usuario</h4>
                    <p className="text-[#FAFAFA]">
                      {selectedFeedback.nickname || selectedFeedback.email}
                    </p>
                    {selectedFeedback.whatsapp && (
                      <p className="text-sm text-[#8a8a8a] mt-1">
                        📱 {selectedFeedback.whatsapp}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#8a8a8a] mb-1">Categoría</h4>
                    <p className="text-[#FAFAFA] capitalize">{selectedFeedback.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#8a8a8a] mb-1">Estado</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedFeedback.status)}`}>
                      {selectedFeedback.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#8a8a8a] mb-1">Fecha</h4>
                    <p className="text-[#FAFAFA]">{formatDate(selectedFeedback.created_at)}</p>
                  </div>
                </div>
                
                {/* Conversación Apilada */}
                <div>
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-4">Conversación</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Mensaje original del usuario */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%]">
                        <div className="bg-[#8a8a8a]/20 border border-[#8a8a8a]/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {selectedFeedback.nickname?.charAt(0) || selectedFeedback.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-[#FAFAFA]">
                              {selectedFeedback.nickname || selectedFeedback.email}
                            </span>
                            <span className="text-xs text-[#8a8a8a]">
                              {formatDate(selectedFeedback.created_at)}
                            </span>
                          </div>
                          <p className="text-[#FAFAFA]/90 whitespace-pre-wrap">{selectedFeedback.message}</p>
                        </div>
                      </div>
                    </div>

                    {/* Respuestas del Maestro */}
                    {selectedFeedback.feedback_responses && selectedFeedback.feedback_responses.length > 0 ? (
                      selectedFeedback.feedback_responses
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map((response) => (
                          <div key={response.id} className="flex justify-end">
                            <div className="max-w-[80%]">
                              <div className="bg-[#8a8a8a]/20 border border-[#8a8a8a]/30 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="w-6 h-6 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">M</span>
                                  </div>
                                  <span className="text-sm font-medium text-[#FAFAFA]">Maestro</span>
                                  <span className="text-xs text-[#8a8a8a]">
                                    {formatDate(response.created_at)}
                                  </span>
                                </div>
                                <p className="text-[#FAFAFA]/90 whitespace-pre-wrap">{response.response_text}</p>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : selectedFeedback.response ? (
                      // Fallback para la respuesta antigua (compatibilidad)
                      <div className="flex justify-end">
                        <div className="max-w-[80%]">
                          <div className="bg-[#8a8a8a]/20 border border-[#8a8a8a]/30 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">M</span>
                              </div>
                              <span className="text-sm font-medium text-[#FAFAFA]">Maestro</span>
                              <span className="text-xs text-[#8a8a8a]">
                                {selectedFeedback.response_at ? formatDate(selectedFeedback.response_at) : 'Fecha no disponible'}
                              </span>
                            </div>
                            <p className="text-[#FAFAFA]/90 whitespace-pre-wrap">{selectedFeedback.response}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-[#8a8a8a] mx-auto mb-2" />
                        <p className="text-[#8a8a8a]">No hay respuestas aún</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedFeedback.status !== 'resolved' && (
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Responder</h3>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        className="w-full h-24 px-4 py-3 bg-[#1a1a1a] border border-[#8a8a8a]/30 rounded-lg text-[#FAFAFA] placeholder-[#8a8a8a] focus:border-[#8a8a8a] focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleReply}
                        disabled={isReplying || !replyText.trim()}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[#8a8a8a] text-[#fafafa] rounded-lg font-medium hover:bg-[#6a6a6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isReplying ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Enviar Respuesta</span>
                          </>
                        )}
                  </button>
                      <button
                        onClick={() => handleResolve(selectedFeedback.id)}
                        disabled={isResolving === selectedFeedback.id}
                        className="px-4 py-3 bg-[#1a1a1a] border border-green-500/50 text-green-500 rounded-lg font-medium hover:bg-green-500/10 transition-colors disabled:opacity-50"
                      >
                        {isResolving === selectedFeedback.id ? (
                          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Marcar como Resuelto'
                        )}
                  </button>
                </div>
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
