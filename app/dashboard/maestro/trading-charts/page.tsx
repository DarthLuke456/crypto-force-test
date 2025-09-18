'use client';

import React, { useState } from 'react';
import { 
  LineChart, 
  BarChart3,
  TrendingUp,
  Activity,
  Settings,
  Info
} from 'lucide-react';
import TradingChart from './TradingChart';
import IndicatorsDropdown from '@/components/ui/IndicatorsDropdown';

export default function TradingChartsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

  const topCryptos = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'BNBUSDT', name: 'BNB', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'SOLUSDT', name: 'Solana', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'DOTUSDT', name: 'Polkadot', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'MATICUSDT', name: 'Polygon', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'LINKUSDT', name: 'Chainlink', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'UNIUSDT', name: 'Uniswap', price: 'Datos en tiempo real', change: 'Actualizando...' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', price: 'Datos en tiempo real', change: 'Actualizando...' }
  ];

  const timeframes = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1d' }
  ];

  return (
    <div className="w-full max-w-none min-w-0">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#8A8A8A] mb-2">
            Trading Charts
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400">
            Gráficos en tiempo real de las principales criptomonedas
          </p>
        </div>

        {/* Controles del gráfico - Completamente Responsive */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4 xl:gap-6">
            {/* Selector de criptomoneda */}
            <div className="w-full lg:w-auto">
              <label className="text-xs sm:text-sm text-gray-400 block mb-2">Criptomoneda</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full lg:w-auto bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#8A8A8A] text-sm sm:text-base"
              >
                {topCryptos.map((crypto) => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de timeframe - Completamente Responsive */}
            <div className="w-full lg:w-auto">
              <label className="text-xs sm:text-sm text-gray-400 block mb-2">Timeframe</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      timeframe === tf.value
                        ? 'bg-[#8A8A8A] text-white'
                        : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Indicadores */}
            <div className="w-full lg:w-auto">
              <label className="text-xs sm:text-sm text-gray-400 block mb-2">Indicadores</label>
              <IndicatorsDropdown
                selectedIndicator={selectedIndicator}
                onIndicatorSelect={setSelectedIndicator}
                className="w-full lg:w-48"
              />
            </div>

            {/* Información del precio - Completamente Responsive */}
            <div className="w-full lg:w-auto lg:ml-auto">
              {(() => {
                const crypto = topCryptos.find(c => c.symbol === selectedSymbol);
                return crypto ? (
                  <div className="text-left lg:text-right">
                    <div className="text-sm text-[#8A8A8A] mb-1">{crypto.price}</div>
                    <div className="text-xs text-gray-500">
                      {crypto.change}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>

        {/* Gráfico principal - Completamente Responsive */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-3 sm:p-4 lg:p-6">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2">
              {(() => {
                const crypto = topCryptos.find(c => c.symbol === selectedSymbol);
                return crypto ? `${crypto.name} (${selectedSymbol})` : selectedSymbol;
              })()}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Timeframe: {timeframe} | Datos en tiempo real desde Binance
            </p>
          </div>
          
          <TradingChart 
            symbol={selectedSymbol} 
            timeframe={timeframe}
            selectedIndicator={selectedIndicator}
          />
        </div>

        {/* Lista de criptomonedas - Completamente Responsive */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4">
            Top 10 Criptomonedas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {topCryptos.map((crypto) => (
              <button
                key={crypto.symbol}
                onClick={() => setSelectedSymbol(crypto.symbol)}
                className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left ${
                  selectedSymbol === crypto.symbol
                    ? 'border-[#8A8A8A] bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a]'
                    : 'border-[#3a3a3a] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] hover:border-[#4a4a4a] hover:scale-105'
                }`}
              >
                <div className="flex flex-col">
                  <div className="text-white font-medium text-sm sm:text-base mb-1">
                    {crypto.name}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">
                    {crypto.symbol}
                  </div>
                  <div className="text-[#8A8A8A] text-xs sm:text-sm">
                    {crypto.price}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {crypto.change}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
