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
    question: "¿Qué es una política fiscal expansiva?",
    options: [
      "Reducir el gasto público y aumentar impuestos",
      "Aumentar el gasto público y reducir impuestos",
      "Mantener el gasto público constante",
      "Solo aumentar los impuestos"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "¿Cómo afecta un aumento de impuestos a la demanda agregada?",
    options: [
      "La aumenta significativamente",
      "La reduce",
      "No tiene efecto",
      "Solo afecta a las empresas"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "¿Qué es la política monetaria?",
    options: [
      "Las decisiones del gobierno sobre impuestos",
      "Las decisiones del banco central sobre la oferta de dinero",
      "Las políticas comerciales",
      "Las regulaciones laborales"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "¿Qué sucede cuando el banco central baja las tasas de interés?",
    options: [
      "Aumenta el ahorro y reduce el consumo",
      "Reduce el ahorro y aumenta el consumo e inversión",
      "No tiene efecto en la economía",
      "Solo afecta a los bancos"
    ],
    correct: 1
  },
  {
    id: 5,
    question: "¿Qué es la competencia perfecta?",
    options: [
      "Un mercado con pocos vendedores",
      "Un mercado con muchos compradores y vendedores de productos idénticos",
      "Un mercado monopolizado",
      "Un mercado con barreras de entrada"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "¿Qué característica NO tiene la competencia perfecta?",
    options: [
      "Muchos compradores y vendedores",
      "Productos homogéneos",
      "Información perfecta",
      "Barreras de entrada significativas"
    ],
    correct: 3
  },
  {
    id: 7,
    question: "¿Qué es el precio de mercado en competencia perfecta?",
    options: [
      "El precio que fija el gobierno",
      "El precio que fija la empresa más grande",
      "El precio determinado por la oferta y demanda",
      "El precio más alto posible"
    ],
    correct: 2
  },
  {
    id: 8,
    question: "¿Por qué las empresas en competencia perfecta son tomadoras de precios?",
    options: [
      "Porque pueden fijar cualquier precio",
      "Porque no pueden influir en el precio de mercado",
      "Porque el gobierno les dice qué precio cobrar",
      "Porque quieren maximizar ganancias"
    ],
    correct: 1
  },
  {
    id: 9,
    question: "¿Qué es la eficiencia económica?",
    options: [
      "Producir al menor costo posible",
      "Producir la cantidad que maximiza el bienestar social",
      "Producir la mayor cantidad posible",
      "Producir con la mejor calidad"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "¿Cómo afecta la competencia perfecta a la innovación?",
    options: [
      "La estimula fuertemente",
      "La reduce porque no hay incentivos",
      "No tiene efecto",
      "Solo afecta a las empresas grandes"
    ],
    correct: 1
  },
  {
    id: 11,
    question: "¿Qué es un subsidio?",
    options: [
      "Un impuesto adicional",
      "Un pago del gobierno a productores o consumidores",
      "Una regulación del mercado",
      "Una barrera comercial"
    ],
    correct: 1
  },
  {
    id: 12,
    question: "¿Qué efecto tiene un subsidio en el precio de mercado?",
    options: [
      "Lo aumenta",
      "Lo reduce",
      "No tiene efecto",
      "Lo mantiene constante"
    ],
    correct: 1
  }
];

export default function PuntoControl2() {
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
    localStorage.setItem('teorico_pc2_result', JSON.stringify(result));
    
    // Completar checkpoint en el sistema de progreso
    if (score >= 70) {
      completeCheckpoint('theoretical', 'nivel1', 'PC2', result);
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
            Punto de Control: Acción del Gobierno en los Mercados y Competencia Perfecta
          </h1>
          <p className="text-gray-400">
            Evalúa tu comprensión de los módulos 3 y 4. Necesitas 70% para aprobar.
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
          checkpointTitle="Punto de Control 2: Acción del Gobierno y Competencia Perfecta"
        />
      </div>
    </div>
  );
} 