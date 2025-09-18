'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import CheckpointResultMessage from '@/app/dashboard/iniciado/components/CheckpointResultMessage';
import CheckpointResultModal from '@/app/dashboard/iniciado/components/CheckpointResultModal';
import SingleQuestionView from '@/app/dashboard/iniciado/components/SingleQuestionView';
import BackButton from '@/components/ui/BackButton';
import { shuffleQuestions } from '@/utils/questionShuffler';
import { useProgress } from '@/context/ProgressContext';

const questions = [
  {
    id: 1,
    question: "¿Qué es una criptomoneda?",
    options: [
      "Una moneda digital descentralizada",
      "Una moneda física tradicional",
      "Un billete digital del banco",
      "Un cupón de descuento"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "¿Qué es el análisis fundamental en criptomonedas?",
    options: [
      "Analizar solo los gráficos de precios",
      "Evaluar la tecnología, equipo, adopción y casos de uso",
      "Seguir las noticias del día",
      "Usar solo indicadores técnicos"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "¿Qué es la capitalización de mercado?",
    options: [
      "El precio de una criptomoneda",
      "El número total de monedas multiplicado por el precio actual",
      "La cantidad de dinero invertido",
      "El volumen de operaciones"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "¿Qué es el volumen de operaciones?",
    options: [
      "El precio de la criptomoneda",
      "La cantidad total de monedas en circulación",
      "La cantidad de monedas intercambiadas en un período",
      "La capitalización de mercado"
    ],
    correct: 2
  },
  {
    id: 5,
    question: "¿Qué es un exchange de criptomonedas?",
    options: [
      "Un banco tradicional",
      "Una plataforma para comprar y vender criptomonedas",
      "Una criptomoneda específica",
      "Un tipo de wallet"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "¿Qué es una wallet de criptomonedas?",
    options: [
      "Una billetera física",
      "Un software o dispositivo para almacenar claves privadas",
      "Un banco digital",
      "Un exchange"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "¿Qué es el trading de criptomonedas?",
    options: [
      "Solo comprar y mantener",
      "Comprar y vender criptomonedas para obtener ganancias",
      "Solo minar criptomonedas",
      "Solo usar criptomonedas para pagos"
    ],
    correct: 1
  },
  {
    id: 8,
    question: "¿Qué es el leverage en trading?",
    options: [
      "Usar dinero prestado para operar",
      "Solo usar capital propio",
      "Un tipo de criptomoneda",
      "Un indicador técnico"
    ],
    correct: 0
  },
  {
    id: 9,
    question: "¿Qué es un stop loss?",
    options: [
      "Una orden para vender automáticamente a un precio específico",
      "Una orden para comprar automáticamente",
      "Un tipo de análisis",
      "Un indicador técnico"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "¿Qué es el análisis de sentimiento?",
    options: [
      "Analizar solo los gráficos",
      "Evaluar las emociones y opiniones del mercado",
      "Usar solo indicadores técnicos",
      "Seguir solo las noticias oficiales"
    ],
    correct: 1
  },
  {
    id: 11,
    question: "¿Qué es la volatilidad en criptomonedas?",
    options: [
      "La estabilidad del precio",
      "La variabilidad del precio en el tiempo",
      "El volumen de operaciones",
      "La capitalización de mercado"
    ],
    correct: 1
  },
  {
    id: 12,
    question: "¿Qué es el arbitraje en criptomonedas?",
    options: [
      "Comprar y vender en el mismo exchange",
      "Comprar en un exchange y vender en otro con diferencia de precio",
      "Solo comprar y mantener",
      "Usar solo un exchange"
    ],
    correct: 1
  }
];

export default function PuntoControl4() {
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleQuestions(questions));
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60); // 8 minutos
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [startTime] = useState(Date.now());
  const router = useRouter();
  const { completeCheckpoint } = useProgress();

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const correctAnswers = answers.filter((answer, index) => answer === shuffledQuestions[index].correct).length;
    const score = (correctAnswers / shuffledQuestions.length) * 100;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Crear resultado detallado
    const result = {
      score,
      completed: true,
      timestamp: Date.now(),
      timeSpent,
      correctAnswers,
      totalQuestions: shuffledQuestions.length
    };
    
    // Guardar resultado en localStorage
    localStorage.setItem('teorico_pc4_result', JSON.stringify(result));
    
    // Completar checkpoint en el sistema de progreso
    if (score >= 70) {
      completeCheckpoint('theoretical', 'nivel2', 'PC4', result);
    }

    // Mostrar modal de resultados
    setShowResultModal(true);
  }, [answers, shuffledQuestions, startTime, completeCheckpoint]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleRestart = () => {
    setAnswers(new Array(shuffledQuestions.length).fill(-1));
    setSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(8 * 60);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionSelect = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctAnswers = answers.filter((answer, index) => answer === shuffledQuestions[index].correct).length;
  const score = (correctAnswers / shuffledQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#212121] via-[#121212] to-[#121212] text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard/iniciado"
            className="flex items-center text-[#ec4d58] hover:text-[#d43d47] transition-colors"
          >
            <ArrowLeft className="mr-2" />
            Volver al Dashboard
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <Clock />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-gray-400">
              {answers.filter(a => a !== -1).length}/{shuffledQuestions.length} respondidas
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ec4d58] mb-2">
            Punto de Control: Criptomonedas y Operaciones con Criptomonedas
          </h1>
          <p className="text-gray-400">
            Evalúa tu comprensión de los módulos 7 y 8. Necesitas 70% para aprobar.
          </p>
        </div>

        {/* Question View */}
        <SingleQuestionView
          questions={shuffledQuestions}
          currentQuestion={currentQuestionIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onFinish={handleSubmit}
          onNavigate={handleNavigate}
          showReview={showReview}
          onToggleReview={() => setShowReview(!showReview)}
          isFinished={submitted}
          onQuestionSelect={handleQuestionSelect}
        />

        {/* Submit Button */}
        {!submitted && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={answers.includes(-1)}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                answers.includes(-1)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ec4d58] hover:bg-[#d43d47] text-white'
              }`}
            >
              Enviar Evaluación
            </button>
          </div>
        )}

        {/* Results */}
        {submitted && (
          <div className="mt-8">
            <CheckpointResultMessage 
              score={score} 
              isApproved={score >= 70} 
            />
          </div>
        )}

        {/* Result Modal */}
        {showResultModal && (
          <CheckpointResultModal
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            onRestart={handleRestart}
            score={score}
            correctAnswers={correctAnswers}
            totalQuestions={shuffledQuestions.length}
            isApproved={score >= 70}
            checkpointTitle="Punto de Control: Criptomonedas y Trading"
          />
        )}
      </div>
    </div>
  );
} 