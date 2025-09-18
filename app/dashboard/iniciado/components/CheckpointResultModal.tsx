'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Star, Trophy, Target, TrendingUp, Zap, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface CheckpointResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  score: number;
  isApproved: boolean;
  totalQuestions: number;
  correctAnswers: number;
  checkpointTitle: string;
}

export default function CheckpointResultModal({ 
  isOpen, 
  onClose, 
  onRestart, 
  score, 
  isApproved, 
  totalQuestions, 
  correctAnswers, 
  checkpointTitle 
}: CheckpointResultModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const getMessageByScore = (score: number) => {
    const roundedScore = Math.round(score / 10) * 10;
    
    switch (roundedScore) {
      case 10:
        return {
          icon: <XCircle className="text-red-500" />,
          title: "Inicio del Camino",
          message: "Has dado el primer paso. Aunque el resultado es bajo, cada error es una oportunidad de aprendizaje.",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          gradient: "from-red-500/20 to-red-600/20"
        };
      
      case 20:
        return {
          icon: <AlertTriangle className="text-orange-500" />,
          title: "Aprendizaje en Progreso",
          message: "Estás comenzando a comprender los conceptos básicos. Necesitas más estudio y práctica.",
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
          gradient: "from-orange-500/20 to-orange-600/20"
        };
      
      case 30:
        return {
          icon: <Target className="text-yellow-500" />,
          title: "Fundamentos Emergentes",
          message: "Los conceptos básicos están tomando forma. Continúa estudiando para fortalecer tu comprensión.",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          gradient: "from-yellow-500/20 to-yellow-600/20"
        };
      
      case 40:
        return {
          icon: <TrendingUp className="text-blue-500" />,
          title: "Comprensión en Desarrollo",
          message: "Tu comprensión está mejorando. Dedica más tiempo a los temas que aún no dominas.",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          gradient: "from-blue-500/20 to-blue-600/20"
        };
      
      case 50:
        return {
          icon: <Zap className="text-purple-500" />,
          title: "Mitad del Camino",
          message: "Has alcanzado un punto intermedio. Estás en el camino correcto, pero necesitas más práctica.",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30",
          gradient: "from-purple-500/20 to-purple-600/20"
        };
      
      case 60:
        return {
          icon: <Star className="text-indigo-500" />,
          title: "Conocimiento Sólido",
          message: "Demuestras una comprensión sólida de los conceptos. Estás cerca de alcanzar el nivel requerido.",
          color: "text-indigo-400",
          bgColor: "bg-indigo-500/10",
          borderColor: "border-indigo-500/30",
          gradient: "from-indigo-500/20 to-indigo-600/20"
        };
      
      case 70:
        return {
          icon: <CheckCircle className="text-green-500" />,
          title: "¡Aprobado!",
          message: "¡Felicitaciones! Has alcanzado el nivel mínimo requerido. Tu comprensión de los conceptos es adecuada.",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          gradient: "from-green-500/20 to-green-600/20"
        };
      
      case 80:
        return {
          icon: <Trophy className="text-yellow-500" />,
          title: "Excelente Rendimiento",
          message: "¡Excelente trabajo! Demuestras un dominio sólido de los conceptos. Tu comprensión es notable.",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          gradient: "from-yellow-500/20 to-yellow-600/20"
        };
      
      case 90:
        return {
          icon: <Star className="text-blue-500" />,
          title: "Maestría Superior",
          message: "¡Impresionante! Demuestras un dominio excepcional. Tu comprensión es profunda y completa.",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          gradient: "from-blue-500/20 to-blue-600/20"
        };
      
      case 100:
        return {
          icon: <Trophy className="text-purple-500" />,
          title: "Perfección Absoluta",
          message: "¡Perfecto! Has alcanzado la maestría total. Tu comprensión es impecable y completa.",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30",
          gradient: "from-purple-500/20 to-purple-600/20"
        };
      
      default:
        return {
          icon: <Target className="text-gray-500" />,
          title: "Evaluación Completada",
          message: "Has completado la evaluación. Revisa tus resultados y continúa tu aprendizaje.",
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          gradient: "from-gray-500/20 to-gray-600/20"
        };
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const messageData = getMessageByScore(score);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl transform transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className={`relative overflow-hidden rounded-2xl border ${messageData.borderColor} bg-gradient-to-br ${messageData.gradient} backdrop-blur-xl`}>
          {/* Header con gradiente */}
          <div className="relative p-8 text-center">
            {/* Partículas de fondo */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
            </div>
            
            {/* Ícono principal */}
            <div className="relative mb-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <div className="text-5xl">
                  {messageData.icon}
                </div>
              </div>
            </div>
            
            {/* Título */}
            <h2 className={`text-3xl font-bold mb-2 ${messageData.color}`}>
              {messageData.title}
            </h2>
            
            {/* Mensaje */}
            <p className="text-gray-200 text-lg leading-relaxed mb-6 max-w-md mx-auto">
              {messageData.message}
            </p>
            
            {/* Score principal */}
            <div className="mb-8">
              <div className="text-6xl font-bold text-white mb-2">
                {score.toFixed(1)}%
              </div>
              
              {/* Barra de progreso */}
              <div className="w-full max-w-md mx-auto">
                <div className="w-full bg-white/10 rounded-full h-4 mb-4 backdrop-blur-sm">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      isApproved ? 'bg-green-500' : 'bg-red-500'
                    } shadow-lg`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                
                {/* Estadísticas */}
                <div className="flex justify-center gap-8 text-sm text-gray-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{correctAnswers}</div>
                    <div>Correctas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalQuestions - correctAnswers}</div>
                    <div>Incorrectas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                    <div>Total</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Estado de aprobación */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              isApproved 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {isApproved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobado
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  No aprobado (mínimo 70%)
                </>
              )}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="flex gap-3 justify-center">
              <button
                onClick={onRestart}
                className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </button>
              
              <Link
                href="/dashboard/iniciado"
                className="flex items-center px-6 py-3 bg-[#ec4d58] hover:bg-[#d63d47] text-white rounded-lg transition-all duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 