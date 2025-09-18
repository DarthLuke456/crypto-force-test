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
    question: "¿Qué es la economía?",
    options: [
      "La ciencia que estudia cómo las sociedades utilizan recursos limitados para satisfacer necesidades ilimitadas",
      "El estudio de las empresas y sus ganancias",
      "La gestión del dinero personal",
      "El análisis de los precios de las acciones"
    ],
    correct: 0
  },
  {
    id: 2,
    question: "¿Cuál es la ley fundamental de la oferta?",
    options: [
      "A mayor precio, mayor cantidad ofrecida",
      "A menor precio, mayor cantidad ofrecida", 
      "El precio no afecta la oferta",
      "La oferta siempre es constante"
    ],
    correct: 0
  },
  {
    id: 3,
    question: "¿Qué representa la demanda en un mercado?",
    options: [
      "La cantidad de bienes que los productores quieren vender",
      "La cantidad de bienes que los consumidores están dispuestos a comprar",
      "El precio de equilibrio del mercado",
      "La competencia entre empresas"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "¿Qué sucede cuando la oferta aumenta?",
    options: [
      "El precio sube y la cantidad vendida baja",
      "El precio baja y la cantidad vendida sube",
      "El precio y la cantidad se mantienen igual",
      "Solo el precio cambia"
    ],
    correct: 1
  },
  {
    id: 5,
    question: "¿Qué es el precio de equilibrio?",
    options: [
      "El precio más alto que puede cobrar un vendedor",
      "El precio más bajo que puede pagar un comprador",
      "El precio donde la oferta iguala la demanda",
      "El precio promedio del mercado"
    ],
    correct: 2
  },
  {
    id: 6,
    question: "¿Cómo afecta un aumento en la demanda al precio?",
    options: [
      "El precio sube",
      "El precio baja",
      "El precio no cambia",
      "El precio fluctúa sin patrón"
    ],
    correct: 0
  },
  {
    id: 7,
    question: "¿Qué son los bienes sustitutos?",
    options: [
      "Bienes que se consumen juntos",
      "Bienes que pueden reemplazarse entre sí",
      "Bienes de lujo",
      "Bienes básicos"
    ],
    correct: 1
  },
  {
    id: 8,
    question: "¿Qué representa la elasticidad de la demanda?",
    options: [
      "La velocidad de cambio del precio",
      "La sensibilidad de la cantidad demandada ante cambios en el precio",
      "La cantidad total de bienes disponibles",
      "El tiempo que tarda en ajustarse el mercado"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "¿Qué es un mercado eficiente?",
    options: [
      "Un mercado con muchos vendedores",
      "Un mercado donde los precios reflejan toda la información disponible",
      "Un mercado con precios bajos",
      "Un mercado sin regulación"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "¿Cómo se determina el valor de un bien?",
    options: [
      "Solo por su costo de producción",
      "Solo por la demanda del consumidor",
      "Por la interacción entre oferta y demanda",
      "Por el gobierno"
    ],
    correct: 2
  },
  {
    id: 11,
    question: "¿Qué es la escasez en economía?",
    options: [
      "La falta total de un recurso",
      "La situación donde los recursos son limitados en relación a las necesidades",
      "El alto precio de un bien",
      "La baja calidad de un producto"
    ],
    correct: 1
  },
  {
    id: 12,
    question: "¿Qué representa el excedente del consumidor?",
    options: [
      "La diferencia entre lo que el consumidor está dispuesto a pagar y lo que realmente paga",
      "El dinero que sobra después de comprar",
      "La ganancia del vendedor",
      "El impuesto sobre las ventas"
    ],
    correct: 0
  }
];

export default function PuntoControl1() {
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
    localStorage.setItem('teorico_pc1_result', JSON.stringify(result));
    
    // Completar checkpoint en el sistema de progreso
    if (score >= 70) {
      completeCheckpoint('theoretical', 'nivel1', 'PC1', result);
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
            Punto de Control: Introducción a la Lógica Económica y Fuerzas del Mercado
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
          checkpointTitle="Punto de Control 1: Introducción a la Lógica Económica y Fuerzas del Mercado"
        />
      </div>
    </div>
  );
} 