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
    question: "¿Qué información contiene una vela japonesa?",
    options: [
      "Precio de apertura, cierre, máximo y mínimo del período",
      "Solo el precio de cierre",
      "Solo el volumen",
      "Solo la tendencia"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "¿Qué es el cuerpo de una vela?",
    options: [
      "La parte rectangular entre el precio de apertura y cierre",
      "La línea que conecta el máximo y mínimo",
      "Solo la sombra superior",
      "El volumen de operaciones"
    ],
    correct: 0
  },
  {
    id: 3,
    question: "¿Qué es la mecha o sombra de una vela?",
    options: [
      "La parte delgada que representa los puntos extremos máximo y mínimo",
      "La parte rectangular de la vela",
      "Solo el precio de cierre",
      "El volumen de operaciones"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "¿Qué patrón de vela indica una posible reversión alcista?",
    options: [
      "Martillo",
      "Estrella fugaz",
      "Doji",
      "Vela larga roja"
    ],
    correct: 0
  },
  {
    id: 5,
    question: "¿Qué patrón de vela indica una posible reversión bajista?",
    options: [
      "Estrella fugaz",
      "Martillo",
      "Doji",
      "Vela larga verde"
    ],
    correct: 0
  },
  {
    id: 6,
    question: "¿Qué son los niveles de Fibonacci?",
    options: [
      "Niveles de soporte y resistencia basados en la secuencia de Fibonacci",
      "Indicadores de volumen",
      "Patrones de velas",
      "Medias móviles"
    ],
    correct: 0
  },
  {
    id: 7,
    question: "¿Cuál es el nivel de Fibonacci más importante?",
    options: [
      "61.8%",
      "23.6%",
      "38.2%",
      "50%"
    ],
    correct: 0
  },
  {
    id: 8,
    question: "¿Qué son los retrocesos de Fibonacci?",
    options: [
      "Niveles donde el precio puede encontrar soporte o resistencia durante una corrección",
      "Indicadores de volumen",
      "Patrones de velas",
      "Medias móviles"
    ],
    correct: 0
  },
  {
    id: 9,
    question: "¿Qué indica cuando el precio toca un nivel de Fibonacci?",
    options: [
      "Posible punto de reversión o continuación de la tendencia",
      "Que el mercado está en equilibrio",
      "Que el volumen es alto",
      "Que la tendencia ha terminado"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "¿Por qué son importantes los patrones de vela?",
    options: [
      "Porque indican cambios potenciales en las tendencias del mercado",
      "Porque son infalibles",
      "Porque son más precisos que otros indicadores",
      "Porque son más simples"
    ],
    correct: 0
  },
  {
    id: 11,
    question: "¿Qué son las medias móviles?",
    options: [
      "Indicadores que muestran el precio promedio en un período",
      "Líneas que conectan máximos y mínimos",
      "Volúmenes de operaciones",
      "Niveles de soporte y resistencia"
    ],
    correct: 0
  },
  {
    id: 12,
    question: "¿Qué indica una media móvil de 20 períodos?",
    options: [
      "El precio promedio de los últimos 20 períodos",
      "El volumen de las últimas 20 operaciones",
      "El máximo de los últimos 20 días",
      "El mínimo de los últimos 20 días"
    ],
    correct: 0
  }
];

export default function PuntoControlPractico2() {
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
    localStorage.setItem('practico_pc2_result', JSON.stringify(result));
    
    // Completar checkpoint en el sistema de progreso
    if (score >= 70) {
      completeCheckpoint('practical', 'nivel1', 'PC2', result);
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
            Punto de Control: Indicadores Técnicos y Análisis Fundamental
          </h1>
          <p className="text-gray-400">
            Evalúa tu comprensión de los módulos 5, 6, 7 y 8. Necesitas 70% para aprobar.
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
          checkpointTitle="Punto de Control 2: Indicadores Técnicos y Análisis Fundamental"
        />
      </div>
    </div>
  );
} 