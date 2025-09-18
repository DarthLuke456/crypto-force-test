'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
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
    question: "¿Qué es la gestión de riesgo en trading?",
    options: [
      "Arriesgar todo el capital en una operación",
      "Limitar las pérdidas potenciales por operación",
      "Solo operar cuando hay ganancias seguras",
      "Ignorar las pérdidas"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "¿Cuál es el porcentaje máximo recomendado de riesgo por operación?",
    options: [
      "1-2% del capital",
      "10-20% del capital",
      "50% del capital",
      "100% del capital"
    ],
    correct: 0
  },
  {
    id: 3,
    question: "¿Qué es el ratio riesgo/beneficio?",
    options: [
      "La relación entre pérdida potencial y ganancia potencial",
      "El porcentaje de ganancia",
      "El tiempo de la operación",
      "El volumen de operaciones"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "¿Cuál es un ratio riesgo/beneficio mínimo recomendado?",
    options: [
      "1:1",
      "1:2",
      "1:0.5",
      "1:0.1"
    ],
    correct: 1
  },
  {
    id: 5,
    question: "¿Qué es el stop loss?",
    options: [
      "Un nivel de precio donde se cierra la operación para limitar pérdidas",
      "Un nivel de precio donde se toma ganancia",
      "El precio de entrada de la operación",
      "El volumen de la operación"
    ],
    correct: 0
  },
  {
    id: 6,
    question: "¿Qué es el take profit?",
    options: [
      "Un nivel de precio donde se cierra la operación para tomar ganancias",
      "Un nivel de precio donde se limita la pérdida",
      "El precio de entrada de la operación",
      "El volumen de la operación"
    ],
    correct: 0
  },
  {
    id: 7,
    question: "¿Qué es la diversificación?",
    options: [
      "Concentrar todo el capital en un solo activo",
      "Distribuir el capital entre diferentes activos o mercados",
      "Operar solo en un mercado",
      "Ignorar otros mercados"
    ],
    correct: 1
  },
  {
    id: 8,
    question: "¿Por qué es importante la diversificación?",
    options: [
      "Para concentrar el riesgo",
      "Para reducir el riesgo general del portafolio",
      "Para operar solo en un mercado",
      "Para ignorar la gestión de riesgo"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "¿Qué es un plan de trading?",
    options: [
      "Un documento que define estrategias y reglas de trading",
      "Una lista de activos a comprar",
      "Un horario de operaciones",
      "Un presupuesto mensual"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "¿Qué debe incluir un plan de trading?",
    options: [
      "Solo las entradas",
      "Entradas, salidas, gestión de riesgo y reglas",
      "Solo las salidas",
      "Solo el capital inicial"
    ],
    correct: 1
  },
  {
    id: 11,
    question: "¿Qué son las reglas de trading?",
    options: [
      "Normas que definen cuándo y cómo operar",
      "Solo horarios de operación",
      "Solo niveles de entrada",
      "Solo niveles de salida"
    ],
    correct: 0
  },
  {
    id: 12,
    question: "¿Por qué es importante seguir un plan de trading?",
    options: [
      "Para mantener disciplina y consistencia",
      "Para operar sin pensar",
      "Para ignorar el análisis",
      "Para operar solo por intuición"
    ],
    correct: 0
  }
];

export default function PuntoControlPractico5() {
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60); // 8 minutos
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
    localStorage.setItem('practico_pc5_result', JSON.stringify(result));
    
    // Completar checkpoint en el sistema de progreso
    if (score >= 70) {
      completeCheckpoint('practical', 'nivel2', 'PC5', result);
    }

    // Mostrar modal de resultados
    setShowResultModal(true);
  }, [answers, shuffledQuestions, startTime, completeCheckpoint]);

  // Mezclar preguntas al cargar el componente
  useEffect(() => {
    setShuffledQuestions(shuffleQuestions(questions));
  }, []);

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
    setShuffledQuestions(shuffleQuestions(questions));
    setAnswers(new Array(questions.length).fill(-1));
    setSubmitted(false);
    setCurrentQuestion(0);
    setShowReview(false);
    setShowResultModal(false);
    setTimeLeft(8 * 60);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    // Función vacía ya que no usamos navegación por botones
  };

  const handleQuestionSelect = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
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
          <BackButton />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <Clock />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ec4d58] mb-2">
            Punto de Control: Gestión de Riesgo y Plan de Trading
          </h1>
          <p className="text-gray-400">
            Evalúa tu comprensión de los módulos 9 y 10. Necesitas 70% para aprobar.
          </p>
        </div>

        {/* Single Question View */}
        {!submitted && (
          <SingleQuestionView
            questions={shuffledQuestions}
            answers={answers}
            onAnswer={handleAnswer}
            onFinish={handleSubmit}
            currentQuestion={currentQuestion}
            onNavigate={handleNavigate}
            showReview={showReview}
            onToggleReview={() => setShowReview(!showReview)}
            isFinished={submitted}
            onQuestionSelect={handleQuestionSelect}
          />
        )}

        {/* Result Modal */}
        <CheckpointResultModal
          isOpen={showResultModal}
          onClose={() => router.push('/dashboard/iniciado')}
          onRestart={handleRestart}
          score={score}
          isApproved={score >= 70}
          totalQuestions={shuffledQuestions.length}
          correctAnswers={correctAnswers}
          checkpointTitle="Punto de Control 5: Gestión de Riesgo y Plan de Trading"
        />
      </div>
    </div>
  );
} 