'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Botón Flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative w-14 h-14 bg-[#ec4d58] rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-pulse"
          title="¿Tienes algo que decirnos? Envía tu feedback"
        >
          <MessageCircle className="w-6 h-6 text-[#121212] mx-auto" />
          
          {/* Efecto de ondas */}
          <div className="absolute inset-0 rounded-full bg-[#ec4d58] opacity-20 animate-ping"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#121212] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            ¿Tienes algo que decirnos?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#121212]"></div>
          </div>
        </button>
      </div>

      {/* Modal de Feedback */}
      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
