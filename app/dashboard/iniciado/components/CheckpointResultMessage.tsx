'use client';

import { CheckCircle, XCircle, AlertTriangle, Star, Trophy, Target, TrendingUp, Zap } from 'lucide-react';

interface CheckpointResultMessageProps {
  score: number;
  isApproved: boolean;
}

export default function CheckpointResultMessage({ score, isApproved }: CheckpointResultMessageProps) {
  const getMessageByScore = (score: number) => {
    const roundedScore = Math.round(score / 10) * 10; // Redondear a múltiplos de 10
    
    switch (roundedScore) {
      case 10:
        return {
          icon: <XCircle className="text-red-500" />,
          title: "Inicio del Camino",
          message: "Has dado el primer paso. Aunque el resultado es bajo, cada error es una oportunidad de aprendizaje. Revisa los conceptos fundamentales y vuelve a intentarlo.",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30"
        };
      
      case 20:
        return {
          icon: <AlertTriangle className="text-orange-500" />,
          title: "Aprendizaje en Progreso",
          message: "Estás comenzando a comprender los conceptos básicos. Necesitas más estudio y práctica para consolidar los fundamentos.",
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30"
        };
      
      case 30:
        return {
          icon: <Target className="text-yellow-500" />,
          title: "Fundamentos Emergentes",
          message: "Los conceptos básicos están tomando forma. Continúa estudiando para fortalecer tu comprensión de los principios fundamentales.",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30"
        };
      
      case 40:
        return {
          icon: <TrendingUp className="text-blue-500" />,
          title: "Comprensión en Desarrollo",
          message: "Tu comprensión está mejorando. Dedica más tiempo a los temas que aún no dominas completamente.",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30"
        };
      
      case 50:
        return {
          icon: <Zap className="text-purple-500" />,
          title: "Mitad del Camino",
          message: "Has alcanzado un punto intermedio. Estás en el camino correcto, pero necesitas más práctica para alcanzar la maestría.",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30"
        };
      
      case 60:
        return {
          icon: <Star className="text-indigo-500" />,
          title: "Conocimiento Sólido",
          message: "Demuestras una comprensión sólida de los conceptos. Estás cerca de alcanzar el nivel requerido.",
          color: "text-indigo-400",
          bgColor: "bg-indigo-500/10",
          borderColor: "border-indigo-500/30"
        };
      
      case 70:
        return {
          icon: <CheckCircle className="text-green-500" />,
          title: "¡Aprobado!",
          message: "¡Felicitaciones! Has alcanzado el nivel mínimo requerido. Tu comprensión de los conceptos es adecuada.",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30"
        };
      
      case 80:
        return {
          icon: <Trophy className="text-yellow-500" />,
          title: "Excelente Rendimiento",
          message: "¡Excelente trabajo! Demuestras un dominio sólido de los conceptos. Tu comprensión es notable.",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30"
        };
      
      case 90:
        return {
          icon: <Star className="text-blue-500" />,
          title: "Maestría Superior",
          message: "¡Impresionante! Demuestras un dominio excepcional. Tu comprensión es profunda y completa.",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30"
        };
      
      case 100:
        return {
          icon: <Trophy className="text-purple-500" />,
          title: "Perfección Absoluta",
          message: "¡Perfecto! Has alcanzado la maestría total. Tu comprensión es impecable y completa.",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30"
        };
      
      default:
        return {
          icon: <Target className="text-gray-500" />,
          title: "Evaluación Completada",
          message: "Has completado la evaluación. Revisa tus resultados y continúa tu aprendizaje.",
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30"
        };
    }
  };

  const messageData = getMessageByScore(score);

  return (
    <div className={`p-6 rounded-xl border ${messageData.bgColor} ${messageData.borderColor}`}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="text-4xl">
            {messageData.icon}
          </div>
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${messageData.color}`}>
          {messageData.title}
        </h3>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {messageData.message}
        </p>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {score.toFixed(1)}%
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                isApproved ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          
          <div className="text-sm text-gray-400">
            {isApproved ? '✅ Aprobado' : '❌ No aprobado (mínimo 70%)'}
          </div>
        </div>
      </div>
    </div>
  );
} 