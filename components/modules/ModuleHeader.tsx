'use client';

import React from 'react';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

interface ModuleHeaderProps {
  title: string;
  description: string;
  authorName: string;
  authorLevel: number;
  category: 'theoretical' | 'practical';
  approvedAt?: Date;
  createdAt: Date;
  backHref: string;
  showBackButton?: boolean;
  className?: string;
}

const levelNames = {
  1: 'Iniciado',
  2: 'Acólito', 
  3: 'Warrior',
  4: 'Lord',
  5: 'Darth',
  6: 'Maestro'
};

const levelColors = {
  1: 'from-green-400 to-green-600',
  2: 'from-yellow-400 to-yellow-600',
  3: 'from-orange-400 to-orange-600',
  4: 'from-purple-400 to-purple-600',
  5: 'from-red-500 to-red-700',
  6: 'from-gray-500 to-gray-700'
};

export default function ModuleHeader({
  title,
  description,
  authorName,
  authorLevel,
  category,
  approvedAt,
  createdAt,
  backHref,
  showBackButton = true,
  className = ''
}: ModuleHeaderProps) {
  return (
    <div className={`bg-[#1a1a1a] border-b border-[#232323] sticky top-0 z-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <>
                <Link
                  href={backHref}
                  className="flex items-center space-x-2 text-[#FFD447] hover:text-[#FFC437] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Volver</span>
                </Link>
                <div className="h-6 w-px bg-[#333]" />
              </>
            )}
            
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white mb-1">{title}</h1>
              <p className="text-sm text-gray-400 mb-2">{description}</p>
              
              {/* Información del autor unificada */}
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <User size={14} />
                  <span>Por:</span>
                  <div className="flex items-center space-x-1">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${levelColors[authorLevel as keyof typeof levelColors]} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{authorLevel}</span>
                    </div>
                    <span className="text-gray-300 font-medium">{authorName}</span>
                    <span className="text-gray-500">•</span>
                    <span className={authorLevel === 5 ? 'text-[#ec4d58] font-semibold' : 'text-gray-400'}>
                      {levelNames[authorLevel as keyof typeof levelNames]}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>Aprobado: {new Date(approvedAt || createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#FFD447] bg-[#FFD447]/10 px-2 py-1 rounded-full flex items-center space-x-1">
              <Tag size={12} />
              <span>{category === 'theoretical' ? 'Teórico' : 'Práctico'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
