interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export function shuffleQuestions(questions: Question[]): Question[] {
  // Crear una copia profunda de las preguntas
  const shuffledQuestions = questions.map(q => ({
    ...q,
    options: [...q.options]
  }));

  // Mezclar el orden de las preguntas
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }

  // Para cada pregunta, mezclar las opciones pero mantener track de la respuesta correcta
  shuffledQuestions.forEach((question, questionIndex) => {
    const originalCorrect = question.correct;
    const originalOptions = [...question.options];
    
    // Mezclar las opciones
    const shuffledOptions = [...question.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    // Actualizar las opciones
    question.options = shuffledOptions;
    
    // Encontrar la nueva posición de la respuesta correcta
    const correctAnswer = originalOptions[originalCorrect];
    const newCorrectIndex = shuffledOptions.findIndex(option => option === correctAnswer);
    question.correct = newCorrectIndex;
  });

  return shuffledQuestions;
} 