'use client';

import { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useMyFeedback } from '@/hooks/useMyFeedback';

interface FeedbackModalWithTabsProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function FeedbackModalWithTabs({ isOpen, onClose }: FeedbackModalWithTabsProps) {
  const [activeTab, setActiveTab] = useState<'send' | 'responses'>('send');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { feedbacks, loading, error, loadFeedbacks, hasNewResponses } = useMyFeedback();

  // Función wrapper para el botón de actualizar
  const handleRetry = () => {
    loadFeedbacks();
  };

  // Cargar respuestas cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadFeedbacks();
    }
  }, [isOpen, loadFeedbacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      // Usar el contexto de autenticación existente
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies de autenticación
        body: JSON.stringify({
          subject: 'Feedback desde dashboard', // Agregar subject requerido
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar feedback');
      }

      setSubmitSuccess(true);
      setMessage('');
      
      // Cambiar a la pestaña de respuestas después de enviar
      setTimeout(() => {
        setActiveTab('responses');
        setSubmitSuccess(false);
        loadFeedbacks(); // Recargar respuestas
      }, 1500);

    } catch (err) {
      console.error('Error al enviar feedback:', err);
      alert(err instanceof Error ? err.message : 'Error al enviar feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors ${
              activeTab === 'send'
                ? 'bg-[#fafafa] text-[#121212]'
                : 'text-gray-400 hover:text-[#fafafa] hover:bg-gray-800'
            }`}
          >
            <Send className="h-5 w-5" />
            Enviar Feedback
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors relative ${
              activeTab === 'responses'
                ? 'bg-[#fafafa] text-[#121212]'
                : 'text-gray-400 hover:text-[#fafafa] hover:bg-gray-800'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            Ver Respuestas
            {hasNewResponses() && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'send' ? (
            /* Send Feedback Tab */
            <div>
              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-400">¡Feedback enviado correctamente!</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tu mensaje
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu feedback, sugerencia o consulta aquí..."
                    className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="px-6 py-2 bg-[#fafafa] hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#121212] rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#121212]"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* View Responses Tab */
            <div>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-400">{error}</span>
                  </div>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No tienes feedback enviado
                  </h3>
                  <p className="text-gray-500">
                    Envía tu primer mensaje de feedback
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
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
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Tu mensaje:</h4>
                        <div className="bg-gray-700/30 rounded-lg p-3">
                          <p className="text-gray-200 whitespace-pre-wrap text-sm">{feedback.message}</p>
                        </div>
                      </div>

                      {/* Respuesta del Maestro */}
                      {feedback.response ? (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Respuesta del Maestro:
                          </h4>
                          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-3">
                            <p className="text-gray-200 whitespace-pre-wrap text-sm">{feedback.response}</p>
                            <div className="mt-2 pt-2 border-t border-purple-500/20">
                              <p className="text-xs text-purple-400">
                                Respondido por {feedback.response_by} el {formatDate(feedback.response_at!)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-700/20 border border-gray-600/30 rounded-lg p-3">
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
              <div className="mt-6 text-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
