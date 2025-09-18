'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, EyeOff, Send } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface SingleQuestionViewProps {
  questions: Question[];
  answers: number[];
  onAnswer: (questionIndex: number, optionIndex: number) => void;
  onFinish: () => void;
  currentQuestion: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  showReview: boolean;
  onToggleReview: () => void;
  isFinished: boolean;
  onQuestionSelect: (questionIndex: number) => void;
}

export default function SingleQuestionView({
  questions,
  answers,
  onAnswer,
  onFinish,
  currentQuestion,
  onNavigate,
  showReview,
  onToggleReview,
  isFinished,
  onQuestionSelect
}: SingleQuestionViewProps) {
  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const isAnswered = selectedAnswer !== -1;
  const isCorrect = selectedAnswer === question.correct;

  // Auto-avanzar después de responder - SIMPLE Y DIRECTO
  useEffect(() => {
    if (isAnswered && currentQuestion < questions.length - 1) {
      console.log('Respuesta detectada, avanzando a siguiente pregunta...');
      
      // Avance directo después de 0.5 segundos
      const timer = setTimeout(() => {
        console.log('Avanzando a pregunta:', currentQuestion + 1);
        onQuestionSelect(currentQuestion + 1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAnswered, currentQuestion, questions.length, onQuestionSelect]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    console.log('Respuesta seleccionada:', optionIndex, 'para pregunta:', questionIndex);
    onAnswer(questionIndex, optionIndex);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con navegación simplificada */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1" /> {/* Espaciador izquierdo */}
        
        <div className="text-center flex-1">
          {/* Barra de progreso centrada */}
          <div className="flex gap-2 justify-center items-center">
            {questions.map((_, index) => {
              let dotColor = 'bg-gray-600'; // No respondida
              
              if (index === currentQuestion) {
                dotColor = 'bg-[#fafafa]'; // Pregunta actual - blanco
              } else if (answers[index] !== -1) {
                // Mostrar correcto/incorrecto en tiempo real
                dotColor = answers[index] === questions[index].correct 
                  ? 'bg-green-500' 
                  : 'bg-red-500';
              }
              
              return (
                <button
                  key={index}
                  onClick={() => onQuestionSelect(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${dotColor} hover:scale-110 cursor-pointer shadow-sm`}
                  title={`Ir a pregunta ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex-1" /> {/* Espaciador derecho */}
        
        {/* Solo mostrar botón de revisión al final */}
        {isFinished && (
          <button
            onClick={onToggleReview}
            className="flex items-center px-4 py-2 bg-[#ec4d58] hover:bg-[#d63d47] text-white rounded-lg transition-colors"
          >
            {showReview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showReview ? 'Ocultar' : 'Ver'} Respuestas
          </button>
        )}
      </div>

      {/* Pregunta actual - SIN TRANSICIONES COMPLEJAS */}
      <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Solo mostrar estado al final */}
            {isFinished && isAnswered && (
              <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                isCorrect 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Correcta
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1" />
                    Incorrecta
                  </>
                )}
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Opciones */}
        <div className="space-y-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = selectedAnswer === optionIndex;
            const isCorrectOption = optionIndex === question.correct;
            const showCorrectAnswer = showReview && isFinished && isAnswered;
            
            let optionStyle = "p-4 rounded-lg border transition-all duration-150 cursor-pointer";
            
            if (isSelected) {
              if (showCorrectAnswer) {
                optionStyle += isCorrectOption 
                  ? " bg-green-500/20 border-green-500/50 text-green-200" 
                  : " bg-red-500/20 border-red-500/50 text-red-200";
              } else {
                optionStyle += " bg-[#ec4d58] border-[#ec4d58] text-white";
              }
            } else if (showCorrectAnswer && isCorrectOption) {
              optionStyle += " bg-green-500/20 border-green-500/50 text-green-200";
            } else {
              optionStyle += " bg-[#232323] border-[#2a2a2a] text-gray-300";
              // Solo agregar hover si no está respondida
              if (!isAnswered) {
                optionStyle += " hover:bg-[#2a2a2a] hover:border-[#ec4d58]/50 hover:scale-[1.02]";
              }
            }

            return (
              <label
                key={optionIndex}
                className={`block ${optionStyle}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={optionIndex}
                  checked={isSelected}
                  onChange={() => handleAnswer(currentQuestion, optionIndex)}
                  disabled={isAnswered}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    isSelected 
                      ? 'border-[#ec4d58] bg-[#ec4d58]' 
                      : 'border-gray-500'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                  
                  {showCorrectAnswer && (
                    <div className="ml-3">
                      {isCorrectOption ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Botón estilizado de Enviar */}
      <div className="flex justify-center">
        <button
          onClick={onFinish}
          disabled={answers.includes(-1)}
          className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#ec4d58] to-[#d63d47] hover:from-[#d63d47] hover:to-[#c52d37] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
        >
          <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
          Enviar Evaluación
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
} 