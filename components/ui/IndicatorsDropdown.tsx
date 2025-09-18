'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, TrendingUp, Activity, BarChart3, LineChart } from 'lucide-react';

interface Indicator {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

interface IndicatorsDropdownProps {
  selectedIndicator: string | null;
  onIndicatorSelect: (indicator: string | null) => void;
  className?: string;
}

export default function IndicatorsDropdown({ 
  selectedIndicator, 
  onIndicatorSelect, 
  className = '' 
}: IndicatorsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lista de indicadores disponibles
  const indicators: Indicator[] = [
    {
      id: 'stochastic',
      name: 'Estocástico',
      category: 'Osciladores',
      description: 'Indicador de momentum que identifica niveles de sobrecompra y sobreventa',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'rsi',
      name: 'RSI (Relative Strength Index)',
      category: 'Osciladores',
      description: 'Mide la velocidad y magnitud de los cambios de precio',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'macd',
      name: 'MACD',
      category: 'Tendencia',
      description: 'Convergencia/divergencia de medias móviles',
      icon: <LineChart className="w-4 h-4" />
    },
    {
      id: 'bollinger',
      name: 'Bandas de Bollinger',
      category: 'Volatilidad',
      description: 'Bandas que indican la volatilidad del precio',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'moving_average',
      name: 'Media Móvil',
      category: 'Tendencia',
      description: 'Promedio de precios en un período específico',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'fibonacci',
      name: 'Retroceso de Fibonacci',
      category: 'Análisis Técnico',
      description: 'Niveles de soporte y resistencia basados en secuencia Fibonacci',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'volume',
      name: 'Volumen',
      category: 'Análisis Técnico',
      description: 'Cantidad de activos negociados en un período',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'support_resistance',
      name: 'Soporte y Resistencia',
      category: 'Análisis Técnico',
      description: 'Niveles clave donde el precio puede cambiar de dirección',
      icon: <LineChart className="w-4 h-4" />
    }
  ];

  // Filtrar indicadores por búsqueda
  const filteredIndicators = indicators.filter(indicator =>
    indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indicator.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indicator.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener el indicador seleccionado
  const selectedIndicatorData = indicators.find(ind => ind.id === selectedIndicator);

  const handleIndicatorSelect = (indicatorId: string) => {
    if (selectedIndicator === indicatorId) {
      onIndicatorSelect(null); // Deseleccionar si ya está seleccionado
    } else {
      onIndicatorSelect(indicatorId);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearIndicator = () => {
    onIndicatorSelect(null);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white hover:bg-[#3a3a3a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A8A8A]"
      >
        <div className="flex items-center gap-2">
          {selectedIndicatorData ? (
            <>
              {selectedIndicatorData.icon}
              <span className="text-sm">{selectedIndicatorData.name}</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Seleccionar Indicador</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Header con búsqueda */}
          <div className="p-3 border-b border-[#3a3a3a]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar indicadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8A8A8A]"
              />
            </div>
          </div>

          {/* Lista de indicadores */}
          <div className="max-h-64 overflow-y-auto">
            {filteredIndicators.length > 0 ? (
              filteredIndicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className={`p-3 hover:bg-[#2a2a2a] cursor-pointer transition-colors border-b border-[#2a2a2a] last:border-b-0 ${
                    selectedIndicator === indicator.id ? 'bg-[#2a2a2a] border-l-2 border-l-[#8A8A8A]' : ''
                  }`}
                  onClick={() => handleIndicatorSelect(indicator.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${selectedIndicator === indicator.id ? 'text-[#8A8A8A]' : 'text-gray-400'}`}>
                      {indicator.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          selectedIndicator === indicator.id ? 'text-[#8A8A8A]' : 'text-white'
                        }`}>
                          {indicator.name}
                        </h4>
                        {selectedIndicator === indicator.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearIndicator();
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{indicator.category}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {indicator.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">
                No se encontraron indicadores
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#3a3a3a] bg-[#1a1a1a]">
            <div className="text-xs text-gray-400 text-center">
              {filteredIndicators.length} indicadores disponibles
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
