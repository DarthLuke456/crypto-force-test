'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DashboardSelectorProps {
  selectedDashboard: string;
  onDashboardChange: (dashboard: string) => void;
  className?: string;
}

export default function DashboardSelector({
  selectedDashboard,
  onDashboardChange,
  className = ''
}: DashboardSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dashboards = [
    { value: 'iniciado', label: 'Iniciado', color: '#fafafa' },
    { value: 'acolito', label: 'Acólito', color: '#fbbf24' },
    { value: 'warrior', label: 'Warrior', color: '#10b981' },
    { value: 'lord', label: 'Lord', color: '#3b82f6' },
    { value: 'darth', label: 'Darth', color: '#ec4d58' },
    { value: 'maestro', label: 'Maestro', color: '#8b5cf6' }
  ];

  const selectedDashboardData = dashboards.find(d => d.value === selectedDashboard) || dashboards[0];

  const handleDashboardSelect = (dashboard: string) => {
    onDashboardChange(dashboard);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Dashboard de destino:
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-md text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedDashboardData.color }}
            />
            <span>{selectedDashboardData.label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-[#333] rounded-md shadow-lg">
            {dashboards.map((dashboard) => (
              <button
                key={dashboard.value}
                type="button"
                onClick={() => handleDashboardSelect(dashboard.value)}
                className="w-full px-3 py-2 text-left text-[#fafafa] hover:bg-[#3a3a3a] flex items-center space-x-3 first:rounded-t-md last:rounded-b-md"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dashboard.color }}
                />
                <span>{dashboard.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
