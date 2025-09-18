'use client';

import { useState, useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import { MessageSquare, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FeedbackResponse {
  id: string;
  message: string;
  response: string | null;
  response_by: string | null;
  response_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function FeedbackResponsesPage() {
  const { user } = useSafeAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('supabase.auth.token');
      if (!token) {
        setError('No estás autenticado');
        return;
      }

      const response = await fetch('/api/feedback/my-feedback', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar feedback');
      }

      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error('Error al cargar feedback:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFeedbacks();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'resolved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <MessageSquare className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Proceso';
      case 'resolved':
        return 'Resuelto';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard/iniciado"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al Dashboard
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Mis Respuestas de Feedback
          </h1>
          <p className="text-gray-400">
            Aquí puedes ver las respuestas del Maestro a tus mensajes de feedback
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Feedbacks List */}
        {feedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No tienes feedback enviado
            </h3>
            <p className="text-gray-500">
              Envía tu primer mensaje de feedback desde la sidebar
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-700/50 ${getStatusColor(feedback.status)}`}>
                      {getStatusIcon(feedback.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {getStatusText(feedback.status)}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Enviado el {formatDate(feedback.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {feedback.response && (
                    <div className="text-sm text-green-400 font-medium">
                      ✓ Respondido
                    </div>
                  )}
                </div>

                {/* Tu mensaje */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Tu mensaje:</h4>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-200 whitespace-pre-wrap">{feedback.message}</p>
                  </div>
                </div>

                {/* Respuesta del Maestro */}
                {feedback.response ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Respuesta del Maestro:
                    </h4>
                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-gray-200 whitespace-pre-wrap">{feedback.response}</p>
                      <div className="mt-3 pt-3 border-t border-purple-500/20">
                        <p className="text-xs text-purple-400">
                          Respondido por {feedback.response_by} el {formatDate(feedback.response_at!)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/20 border border-gray-600/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Aún no hay respuesta del Maestro</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadFeedbacks}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
