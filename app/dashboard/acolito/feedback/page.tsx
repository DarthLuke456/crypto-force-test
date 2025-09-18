'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, AlertCircle, CheckCircle, ArrowLeft, User, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMyFeedback } from '@/hooks/useMyFeedback';
import { useFeedbackAuth } from '@/hooks/useFeedbackAuth';
import { useFeedbackPersistence } from '@/hooks/useFeedbackPersistence';

// Usar el tipo del hook directamente
type FeedbackItem = import('@/hooks/useMyFeedback').FeedbackResponse;

export default function FeedbackPage() {
  const router = useRouter();
  const { feedbacks, loading, error, loadFeedbacks } = useMyFeedback();
  const { isAuthenticated, handleFeedbackSubmit } = useFeedbackAuth();
  const { feedbackData, updateFeedback, clearFeedback } = useFeedbackPersistence();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'send' | 'responses'>('send');

  // Cargar feedbacks al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      loadFeedbacks();
    }
  }, [isAuthenticated, loadFeedbacks]);

  // Función wrapper para el botón de reintentar
  const handleRetry = () => {
    loadFeedbacks();
  };

  // Manejar envío de feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackData.subject.trim() || !feedbackData.message.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos');
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage('Debes estar autenticado para enviar feedback');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await handleFeedbackSubmit(feedbackData);
      
      if (result.success) {
        setSubmitStatus('success');
        clearFeedback();
        
        // Cambiar a la pestaña de respuestas después de enviar
        setTimeout(() => {
          setActiveTab('responses');
          setSubmitStatus('idle');
          loadFeedbacks(); // Recargar respuestas
        }, 2000);
      } else if (result.error) {
        setSubmitStatus('error');
        setErrorMessage(result.error);
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Error inesperado al enviar feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cambio de campos
  const handleInputChange = (field: string, value: string) => {
    updateFeedback({ [field]: value });
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#FFD447]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#FFD447]/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#FAFAFA]" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FFD447] rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#FAFAFA]">Feedback</h1>
                <p className="text-sm text-[#FAFAFA]/70">Tu opinión es importante para nosotros</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1a1a1a] border-b border-[#FFD447]/20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'send'
                ? 'bg-[#FFD447] text-black'
                : 'text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-[#FFD447]/10'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Enviar Feedback</span>
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'responses'
                ? 'bg-[#FFD447] text-black'
                : 'text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-[#FFD447]/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ver Respuestas</span>
            {feedbacks.some(feedback => feedback.response && feedback.status !== 'resolved') && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'send' ? (
          // Pestaña de envío
          submitStatus === 'success' ? (
            // Estado de éxito
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#FAFAFA] mb-3">¡Feedback Enviado!</h3>
              <p className="text-[#FAFAFA]/70 text-lg">Gracias por tu contribución. Tu mensaje ha sido recibido.</p>
            </div>
          ) : (
            // Formulario
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Asunto */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-3">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    value={feedbackData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="¿De qué quieres hablar?"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#FFD447]/30 rounded-lg text-[#FAFAFA] placeholder-[#FAFAFA]/50 focus:border-[#FFD447] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-3">
                    Categoría
                  </label>
                  <select
                    value={feedbackData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#FFD447]/30 rounded-lg text-[#FAFAFA] focus:border-[#FFD447] focus:outline-none transition-colors"
                  >
                    <option value="general">General</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Nueva Funcionalidad</option>
                    <option value="suggestion">Sugerencia</option>
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-3">
                    Mensaje *
                  </label>
                  <textarea
                    value={feedbackData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Cuéntanos qué piensas, qué te gustaría ver, o qué problemas has encontrado..."
                    rows={6}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#FFD447]/30 rounded-lg text-[#FAFAFA] placeholder-[#FAFAFA]/50 focus:border-[#FFD447] focus:outline-none transition-colors resize-none"
                    required
                  />
                  <div className="text-right text-sm text-[#FAFAFA]/50 mt-2">
                    {feedbackData.message.length}/500
                  </div>
                </div>

                {/* Mensaje de error */}
                {errorMessage && (
                  <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-400">{errorMessage}</span>
                  </div>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isAuthenticated}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-[#FFD447] text-black rounded-lg font-medium hover:bg-[#FFD447]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Feedback</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )
        ) : (
          // Pestaña de respuestas
          <div className="max-w-4xl mx-auto">
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <MessageSquare className="w-20 h-20 text-[#FAFAFA]/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#FAFAFA] mb-3">Inicia sesión para ver respuestas</h3>
                <p className="text-[#FAFAFA]/70 text-lg">Necesitas estar autenticado para ver las respuestas a tu feedback</p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-2 border-[#FFD447] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#FAFAFA]/70 text-lg">Cargando respuestas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#FAFAFA] mb-3">Error al cargar respuestas</h3>
                <p className="text-red-400 mb-6 text-lg">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-[#FFD447] text-black rounded-lg hover:bg-[#FFD447]/90 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-20 h-20 text-[#FAFAFA]/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#FAFAFA] mb-3">No tienes feedback enviado</h3>
                <p className="text-[#FAFAFA]/70 mb-6 text-lg">Envía tu primer mensaje de feedback</p>
                <button
                  onClick={() => setActiveTab('send')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#FFD447] text-black rounded-lg hover:bg-[#FFD447]/90 transition-colors mx-auto"
                >
                  <Send className="w-5 h-5" />
                  <span>Enviar Feedback</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header con botón de actualizar */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-[#FAFAFA]">Tus Conversaciones</h3>
                  <button
                    onClick={handleRetry}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FFD447] text-black rounded-lg hover:bg-[#FFD447]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                    <span>Actualizar</span>
                  </button>
                </div>
                
                {/* Lista de conversaciones */}
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-[#1a1a1a] border border-[#FFD447]/30 rounded-xl p-6">
                    {/* Header del feedback */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-xl font-semibold text-[#FAFAFA] mb-2">{feedback.subject}</h4>
                        <div className="flex items-center space-x-4 text-sm text-[#FAFAFA]/70">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(feedback.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        feedback.status === 'resolved' 
                          ? 'bg-green-500/20 text-green-400' 
                          : feedback.response 
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {feedback.status === 'resolved' ? 'Resuelto' : feedback.response ? 'Respondido' : 'Pendiente'}
                      </span>
                    </div>

                    {/* Conversación estilo WhatsApp */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {/* Mensaje original del usuario */}
                      <div className="flex justify-start">
                        <div className="max-w-[80%]">
                          <div className="bg-[#FFD447]/20 border border-[#FFD447]/30 rounded-2xl rounded-bl-md p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-[#FFD447] rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-black">U</span>
                              </div>
                              <span className="text-sm font-medium text-[#FAFAFA]">Tú</span>
                              <span className="text-xs text-[#FAFAFA]/60">
                                {new Date(feedback.created_at).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-[#FAFAFA]/90 whitespace-pre-wrap">{feedback.message}</p>
                          </div>
                        </div>
                      </div>

                      {/* Respuestas del Maestro */}
                      {feedback.feedback_responses && feedback.feedback_responses.length > 0 ? (
                        feedback.feedback_responses
                          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                          .map((response) => (
                            <div key={response.id} className="flex justify-end">
                              <div className="max-w-[80%]">
                                <div className="bg-[#8a8a8a]/20 border border-[#8a8a8a]/30 rounded-2xl rounded-br-md p-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-6 h-6 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-white">M</span>
                                    </div>
                                    <span className="text-sm font-medium text-[#FAFAFA]">Maestro</span>
                                    <span className="text-xs text-[#FAFAFA]/60">
                                      {new Date(response.created_at).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#FAFAFA]/90 whitespace-pre-wrap">{response.response_text}</p>
                                </div>
                              </div>
                            </div>
                          ))
                      ) : feedback.response ? (
                        // Fallback para la respuesta antigua (compatibilidad)
                        <div className="flex justify-end">
                          <div className="max-w-[80%]">
                            <div className="bg-[#8a8a8a]/20 border border-[#8a8a8a]/30 rounded-2xl rounded-br-md p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-6 h-6 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">M</span>
                                </div>
                                <span className="text-sm font-medium text-[#FAFAFA]">Maestro</span>
                                <span className="text-xs text-[#FAFAFA]/60">
                                  {feedback.response_at ? new Date(feedback.response_at).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Ahora'}
                                </span>
                              </div>
                              <p className="text-sm text-[#FAFAFA]/90 whitespace-pre-wrap">{feedback.response}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-[#8a8a8a]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="w-6 h-6 text-[#8a8a8a]" />
                          </div>
                          <p className="text-sm text-[#8a8a8a]">Esperando respuesta del Maestro...</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
