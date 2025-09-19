'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface LevelSelectorProps {
  selectedLevel: number;
  customLevelText: string;
  onLevelChange: (level: number) => void;
  onCustomTextChange: (text: string) => void;
  className?: string;
}

export default function LevelSelector({
  selectedLevel,
  customLevelText,
  onLevelChange,
  onCustomTextChange,
  className = ''
}: LevelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(selectedLevel === 0);

  const levels = [
    { value: 1, label: 'Nivel 1', emoji: '🌱' },
    { value: 2, label: 'Nivel 2', emoji: '⚡' },
    { value: 3, label: 'Nivel 3', emoji: '⚔️' },
    { value: 4, label: 'Nivel 4', emoji: '👑' },
    { value: 5, label: 'Nivel 5', emoji: '💀' },
    { value: 6, label: 'Nivel 6', emoji: '🧙' },
    { value: 0, label: 'Otro', emoji: '📝' }
  ];

  const handleLevelSelect = (level: number) => {
    onLevelChange(level);
    if (level === 0) {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
    setIsOpen(false);
  };

  const selectedLevelData = levels.find(l => l.value === selectedLevel) || levels[0];

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Nivel de la card:
      </label>
      
      <div className="space-y-3">
        {/* Selector de nivel */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-md text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedLevelData.emoji}</span>
              <span>{selectedLevelData.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-[#333] rounded-md shadow-lg">
              {levels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleLevelSelect(level.value)}
                  className="w-full px-3 py-2 text-left text-[#fafafa] hover:bg-[#3a3a3a] flex items-center space-x-2 first:rounded-t-md last:rounded-b-md"
                >
                  <span className="text-lg">{level.emoji}</span>
                  <span>{level.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input personalizado para "Otro" */}
        {showCustomInput && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Texto personalizado:
            </label>
            <input
              type="text"
              value={customLevelText}
              onChange={(e) => onCustomTextChange(e.target.value)}
              placeholder="Ej: Nivel Especial, VIP, etc."
              className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-md text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
