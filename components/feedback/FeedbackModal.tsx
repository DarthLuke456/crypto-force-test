'use client';

import { useState, useEffect } from 'react';
import { X, Send, LogIn, UserPlus, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useFeedbackPersistence } from '@/hooks/useFeedbackPersistence';
import { useFeedbackAuth } from '@/hooks/useFeedbackAuth';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { feedbackData, updateFeedback, clearFeedback, hasSavedData } = useFeedbackPersistence();
  const { isAuthenticated, isChecking, handleFeedbackSubmit, redirectToLogin, redirectToSignup } = useFeedbackAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthButtons, setShowAuthButtons] = useState(false);

  // Limpiar estado al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setSubmitStatus('idle');
      setErrorMessage('');
      setShowAuthButtons(false);
    }
  }, [isOpen]);

  // Manejar envío de feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 FeedbackModal - handleSubmit iniciado');
    console.log('🔍 FeedbackModal - isAuthenticated:', isAuthenticated);
    console.log('🔍 FeedbackModal - isChecking:', isChecking);
    console.log('🔍 FeedbackModal - feedbackData:', feedbackData);
    
    if (!feedbackData.subject.trim() || !feedbackData.message.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos');
      return;
    }

    // Si no está autenticado, mostrar botones de auth
    if (!isAuthenticated) {
      console.log('🔍 FeedbackModal - Usuario no autenticado, mostrando botones de auth');
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
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          onClose();
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
      <div className="relative bg-[#121212] border border-[#FFD447]/30 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
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

        {/* Content */}
        <div className="p-6">
          {submitStatus === 'success' ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
