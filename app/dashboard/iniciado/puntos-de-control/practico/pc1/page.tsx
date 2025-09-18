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
    question: "¿Qué es el trading?",
    options: [
      "Comprar y vender activos financieros para obtener ganancias",
      "Solo comprar acciones",
      "Invertir en bienes raíces",
      "Ahorrar dinero en el banco"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "¿Cuál es la mentalidad correcta para un trader?",
    options: [
      "Buscar ganancias rápidas sin importar el riesgo",
      "Mantener disciplina, gestión de riesgo y paciencia",
      "Seguir las emociones del mercado",
      "Operar sin un plan definido"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "¿Qué es el análisis técnico?",
    options: [
      "Estudiar los reportes financieros de las empresas",
      "Analizar patrones de precios y volúmenes para predecir movimientos",
      "Leer noticias económicas",
      "Consultar horóscopos"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "¿Qué representa una vela verde en un gráfico?",
    options: [
      "El precio cerró más alto que abrió",
      "El precio cerró más bajo que abrió",
      "No hubo movimiento en el precio",
      "El volumen fue alto"
    ],
    correct: 0
  },
  {
    id: 5,
    question: "¿Qué es el cuerpo de una vela japonesa?",
    options: [
      "La línea que conecta el máximo y mínimo",
      "La parte rectangular entre el precio de apertura y cierre",
      "Solo la sombra superior",
      "El volumen de operaciones"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "¿Qué patrón de vela indica una posible reversión alcista?",
    options: [
      "Doji",
      "Martillo",
      "Estrella fugaz",
      "Vela larga roja"
    ],
    correct: 1
  },
  {
    id: 7,
    question: "¿Qué son los niveles de soporte y resistencia?",
    options: [
      "Niveles de precio donde la oferta y demanda se encuentran",
      "Indicadores de volumen",
      "Patrones de velas",
      "Medias móviles"
    ],
    correct: 0
  },
  {
    id: 8,
    question: "¿Qué es el soporte?",
    options: [
      "Nivel donde la demanda es fuerte y evita que el precio baje más",
      "Nivel donde la oferta es fuerte y evita que el precio suba más",
      "Un indicador de volumen",
      "Un patrón de velas"
    ],
    correct: 0
  },
  {
    id: 9,
    question: "¿Qué es la resistencia?",
    options: [
      "Nivel donde la oferta es fuerte y evita que el precio suba más",
      "Nivel donde la demanda es fuerte y evita que el precio baje más",
      "Un indicador de volumen",
      "Un patrón de velas"
    ],
    correct: 0
  },
  {
    id: 10,
    question: "¿Qué es el análisis fundamental?",
    options: [
      "Evaluar factores económicos, políticos y sociales que afectan el precio",
      "Analizar solo patrones de precios en gráficos",
      "Solo estudiar indicadores técnicos",
      "Analizar el volumen de operaciones"
    ],
    correct: 0
  },
  {
    id: 11,
    question: "¿Por qué funciona el análisis técnico?",
    options: [
      "Porque es popular y muchos operadores lo usan",
      "Porque es infalible",
      "Porque es más preciso que el fundamental",
      "Porque es más simple"
    ],
    correct: 0
  },
  {
    id: 12,
    question: "¿Qué información proporciona una vela japonesa?",
    options: [
      "Precio de apertura, cierre, máximo y mínimo del período",
      "Solo el precio de cierre",
      "Solo el volumen",
      "Solo la tendencia"
    ],
    correct: 0
  }
];

export default function PuntoControlPractico1() {
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
    localStorage.setItem('practico_pc1_result', JSON.stringify(result));
    
    // Completar checkpoint en el sistema de progreso
    if (score >= 70) {
      completeCheckpoint('practical', 'nivel1', 'PC1', result);
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
            Punto de Control: Introducción al Trading y Análisis Técnico
          </h1>
          <p className="text-gray-400">
            Evalúa tu comprensión de los módulos 1 y 2. Necesitas 70% para aprobar.
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
          checkpointTitle="Punto de Control 1: Introducción al Trading y Análisis Técnico"
        />
      </div>
    </div>
  );
} 