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
    question: "¿Qué es el RSI (Relative Strength Index)?",
    options: [
      "Un indicador de momentum que mide la velocidad y magnitud de los cambios de precio",
      "Un tipo de media móvil",
      "Un patrón de velas japonesas",
      "Un indicador de volumen"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "¿Qué valores del RSI indican sobreventa?",
    options: [
      "Por encima de 70",
      "Por debajo de 30",
      "Entre 40 y 60",
      "Por encima de 80"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "¿Qué valores del RSI indican sobrecompra?",
    options: [
      "Por encima de 70",
      "Por debajo de 30",
      "Entre 40 y 60",
      "Por debajo de 20"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "¿Qué es el MACD?",
    options: [
      "Un indicador de tendencia que combina dos medias móviles",
      "Un patrón de velas",
      "Un indicador de volumen",
      "Un nivel de soporte"
    ],
    correct: 0
  },
  {
    id: 5,
    question: "¿Qué componentes tiene el MACD?",
    options: [
      "Línea MACD, línea de señal e histograma",
      "Solo la línea MACD",
      "Solo el histograma",
      "Línea de tendencia y volumen"
    ],
    correct: 0
  },
  {
    id: 6,
    question: "¿Qué indica cuando el MACD cruza por encima de su línea de señal?",
    options: [
      "Señal de venta",
      "Señal de compra",
      "No indica nada",
      "El mercado está en equilibrio"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "¿Qué es el estocástico?",
    options: [
      "Un indicador de momentum que mide la posición del precio en relación a su rango",
      "Un tipo de media móvil",
      "Un patrón de velas",
      "Un indicador de volumen"
    ],
    correct: 0
  },
  {
    id: 8,
    question: "¿Qué valores del estocástico indican sobreventa?",
    options: [
      "Por encima de 80",
      "Por debajo de 20",
      "Entre 40 y 60",
      "Por encima de 90"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "¿Qué valores del estocástico indican sobrecompra?",
    options: [
      "Por encima de 80",
      "Por debajo de 20",
      "Entre 40 y 60",
      "Por debajo de 10"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "¿Qué son las Bandas de Bollinger?",
    options: [
      "Indicadores de volatilidad que muestran niveles de soporte y resistencia dinámicos",
      "Patrones de velas japonesas",
      "Medias móviles simples",
      "Indicadores de volumen"
    ],
    correct: 0
  },
  {
    id: 11,
    question: "¿Qué indica cuando el precio toca la banda superior de Bollinger?",
    options: [
      "Posible sobrecompra o resistencia",
      "Posible sobreventa o soporte",
      "Que el mercado está en equilibrio",
      "Que la tendencia ha terminado"
    ],
    correct: 0
  },
  {
    id: 12,
    question: "¿Qué indica cuando el precio toca la banda inferior de Bollinger?",
    options: [
      "Posible sobreventa o soporte",
      "Posible sobrecompra o resistencia",
      "Que el mercado está en equilibrio",
      "Que la tendencia ha terminado"
    ],
    correct: 0
  }
];

export default function PuntoControlPractico3() {
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
    localStorage.setItem('practico_pc3_result', JSON.stringify(result));
    
    // Completar checkpoint en el sistema de progreso
    if (score >= 70) {
      completeCheckpoint('practical', 'nivel2', 'PC3', result);
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
            Punto de Control: Indicadores RSI, MACD, Estocástico y Bandas de Bollinger
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
          checkpointTitle="Punto de Control 3: Indicadores RSI, MACD, Estocástico y Bandas de Bollinger"
        />
      </div>
    </div>
  );
} 