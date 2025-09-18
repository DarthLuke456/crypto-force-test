'use client';

import { useState, useEffect } from 'react';
import { X, Send, LogIn, UserPlus, MessageCircle, AlertCircle, CheckCircle, Eye, MessageSquare } from 'lucide-react';
import { useFeedbackPersistence } from '@/hooks/useFeedbackPersistence';
import { useFeedbackAuth } from '@/hooks/useFeedbackAuth';
import { useMyFeedback } from '@/hooks/useMyFeedback';

interface FeedbackModalEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModalEnhanced({ isOpen, onClose }: FeedbackModalEnhancedProps) {
  const { feedbackData, updateFeedback, clearFeedback, hasSavedData } = useFeedbackPersistence();
  const { isAuthenticated, isChecking, handleFeedbackSubmit, redirectToLogin, redirectToSignup } = useFeedbackAuth();
  const { feedbacks, loading: loadingFeedbacks, error: feedbackError, loadFeedbacks } = useMyFeedback();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthButtons, setShowAuthButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'responses'>('send');

  // Limpiar estado al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setSubmitStatus('idle');
      setErrorMessage('');
      setShowAuthButtons(false);
      setActiveTab('send');
    }
  }, [isOpen]);

  // Cargar feedbacks cuando se abre la pestaña de respuestas
  useEffect(() => {
    if (isOpen && activeTab === 'responses' && isAuthenticated) {
      loadFeedbacks();
    }
  }, [isOpen, activeTab, isAuthenticated, loadFeedbacks]);

  // Manejar envío de feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 FeedbackModalEnhanced - handleSubmit iniciado');
    console.log('🔍 FeedbackModalEnhanced - isAuthenticated:', isAuthenticated);
    console.log('🔍 FeedbackModalEnhanced - isChecking:', isChecking);
    console.log('🔍 FeedbackModalEnhanced - feedbackData:', feedbackData);
    
    if (!feedbackData.subject.trim() || !feedbackData.message.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos');
      return;
    }

    // Si no está autenticado, mostrar botones de auth
    if (!isAuthenticated) {
      console.log('🔍 FeedbackModalEnhanced - Usuario no autenticado, mostrando botones de auth');
      setShowAuthButtons(true);
      setErrorMessage('Para enviar feedback necesitas estar registrado. Selecciona una opción:');
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
      } else if (result.requiresAuth) {
        setShowAuthButtons(true);
        setErrorMessage('Debes iniciar sesión para enviar feedback');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Error inesperado al enviar feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función wrapper para el botón de reintentar
  const handleRetry = () => {
    loadFeedbacks();
  };

  // Manejar cambio de campos
  const handleInputChange = (field: string, value: string) => {
    updateFeedback({ [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#121212] border border-[#FFD447]/30 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#FFD447]/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#ec4d58] rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#FAFAFA]">Feedback</h2>
              <p className="text-sm text-[#FAFAFA]/70">Tu opinión es importante</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#ec4d58]/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#FAFAFA]/70" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#FFD447]/20">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'send'
                ? 'bg-[#ec4d58] text-white'
                : 'text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-[#ec4d58]/10'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Enviar Feedback</span>
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'responses'
                ? 'bg-[#ec4d58] text-white'
                : 'text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-[#ec4d58]/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ver Respuestas</span>
            {feedbacks.some(feedback => feedback.response && feedback.status !== 'resolved') && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'send' ? (
            // Pestaña de envío
            submitStatus === 'success' ? (
              // Estado de éxito
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">¡Feedback Enviado!</h3>
                <p className="text-[#FAFAFA]/70">Gracias por tu contribución. Tu mensaje ha sido recibido.</p>
              </div>
            ) : (
              // Formulario
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Asunto */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    value={feedbackData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="¿De qué quieres hablar?"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ec4d58]/30 rounded-lg text-[#FAFAFA] placeholder-[#FAFAFA]/50 focus:border-[#ec4d58] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
                    Categoría
                  </label>
                  <select
                    value={feedbackData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ec4d58]/30 rounded-lg text-[#FAFAFA] focus:border-[#ec4d58] focus:outline-none transition-colors"
                  >
                    <option value="general">General</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Nueva Funcionalidad</option>
                    <option value="suggestion">Sugerencia</option>
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    value={feedbackData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Cuéntanos qué piensas, qué te gustaría ver, o qué problemas has encontrado..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ec4d58]/30 rounded-lg text-[#FAFAFA] placeholder-[#FAFAFA]/50 focus:border-[#ec4d58] focus:outline-none transition-colors resize-none"
                    required
                  />
                  <div className="text-right text-xs text-[#FAFAFA]/50 mt-1">
                    {feedbackData.message.length}/500
                  </div>
                </div>

                {/* Mensaje de error */}
                {errorMessage && (
                  <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-400">{errorMessage}</span>
                  </div>
                )}

                {/* Botones */}
                <div className="flex flex-col space-y-3 pt-4">
                  {showAuthButtons ? (
                    // Botones de autenticación (solo después de intentar enviar)
                    <div className="space-y-3">
                      <p className="text-sm text-[#FAFAFA]/70 text-center">
                        Para enviar feedback necesitas estar registrado
                      </p>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={redirectToLogin}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[#ec4d58] text-white rounded-lg font-medium hover:bg-[#ec4d58]/90 transition-colors"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Iniciar Sesión</span>
                        </button>
                        <button
                          type="button"
                          onClick={redirectToSignup}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[#1a1a1a] border border-[#ec4d58]/50 text-[#FAFAFA] rounded-lg font-medium hover:bg-[#ec4d58]/10 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Registrarse</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Botón de envío (siempre visible)
                    <button
                      type="submit"
                      disabled={isSubmitting || isChecking}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#ec4d58] text-white rounded-lg font-medium hover:bg-[#ec4d58]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Feedback</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )
          ) : (
            // Pestaña de respuestas
            <div className="space-y-4">
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-[#FAFAFA]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">Inicia sesión para ver respuestas</h3>
                  <p className="text-[#FAFAFA]/70 mb-6">Necesitas estar autenticado para ver las respuestas a tu feedback</p>
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={redirectToLogin}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#ec4d58] text-white rounded-lg font-medium hover:bg-[#ec4d58]/90 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Iniciar Sesión</span>
                    </button>
                    <button
                      onClick={redirectToSignup}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#1a1a1a] border border-[#ec4d58]/50 text-[#FAFAFA] rounded-lg font-medium hover:bg-[#ec4d58]/10 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Registrarse</span>
                    </button>
                  </div>
                </div>
              ) : loadingFeedbacks ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-[#ec4d58] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[#FAFAFA]/70">Cargando respuestas...</p>
                </div>
              ) : feedbackError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">Error al cargar respuestas</h3>
                  <p className="text-red-400 mb-4">{feedbackError}</p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#ec4d58]/90 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-[#FAFAFA]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">No tienes feedback enviado</h3>
                  <p className="text-[#FAFAFA]/70 mb-4">Envía tu primer mensaje de feedback</p>
                  <button
                    onClick={handleRetry}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#ec4d58]/90 transition-colors mx-auto"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Actualizar</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Botón de actualizar */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#FAFAFA]">Tus Feedback</h3>
                    <button
                      onClick={handleRetry}
                      disabled={loadingFeedbacks}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#ec4d58]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {loadingFeedbacks ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      <span>Actualizar</span>
                    </button>
                  </div>
                  
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="bg-[#1a1a1a] border border-[#ec4d58]/30 rounded-lg p-4">
                      {/* Header del feedback */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-[#FAFAFA] mb-1">{feedback.subject}</h4>
                          <p className="text-sm text-[#FAFAFA]/70">
                            {new Date(feedback.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
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
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {/* Mensaje original del usuario */}
                        <div className="flex justify-start">
                          <div className="max-w-[80%]">
                            <div className="bg-[#ec4d58]/20 border border-[#ec4d58]/30 rounded-2xl rounded-bl-md p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="w-5 h-5 bg-[#ec4d58] rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">U</span>
                                </div>
                                <span className="text-xs font-medium text-[#FAFAFA]">Tú</span>
                                <span className="text-xs text-[#FAFAFA]/60">
                                  {new Date(feedback.created_at).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-[#FAFAFA]/90">{feedback.message}</p>
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
                                  <div className="bg-[#8a8a8a]/20 border border-[#8a8a8a]/30 rounded-2xl rounded-br-md p-3">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <div className="w-5 h-5 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">M</span>
                                      </div>
                                      <span className="text-xs font-medium text-[#FAFAFA]">Maestro</span>
                                      <span className="text-xs text-[#FAFAFA]/60">
                                        {new Date(response.created_at).toLocaleTimeString('es-ES', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-[#FAFAFA]/90">{response.response_text}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : feedback.response ? (
                          // Fallback para la respuesta antigua (compatibilidad)
                          <div className="flex justify-end">
                            <div className="max-w-[80%]">
                              <div className="bg-[#8a8a8a]/20 border border-[#8a8a8a]/30 rounded-2xl rounded-br-md p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="w-5 h-5 bg-[#8a8a8a] rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">M</span>
                                  </div>
                                  <span className="text-xs font-medium text-[#FAFAFA]">Maestro</span>
                                  <span className="text-xs text-[#FAFAFA]/60">
                                    {feedback.response_at ? new Date(feedback.response_at).toLocaleTimeString('es-ES', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) : 'Ahora'}
                                  </span>
                                </div>
                                <p className="text-sm text-[#FAFAFA]/90">{feedback.response}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="w-8 h-8 bg-[#8a8a8a]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <MessageCircle className="w-4 h-4 text-[#8a8a8a]" />
                            </div>
                            <p className="text-xs text-[#8a8a8a]">Esperando respuesta del Maestro...</p>
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
    </div>
  );
}
