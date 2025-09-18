'use client';

import React from 'react';
import { Crown, User, Calendar, Tag } from 'lucide-react';

interface ProposalHeaderProps {
  title: string;
  subtitle: string;
  author: string;
  authorLevel: number;
  category: 'theoretical' | 'practical' | 'checkpoint' | 'edit_approved_content' | 'delete_approved_content';
  targetHierarchy: number;
  createdAt?: string | Date;
  approvedAt?: string | Date;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  showAuthor?: boolean;
  showMetadata?: boolean;
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

const categoryNames = {
  theoretical: 'Teórico',
  practical: 'Práctico',
  checkpoint: 'Punto de Control',
  edit_approved_content: 'Editar Contenido Aprobado',
  delete_approved_content: 'Eliminar Contenido Aprobado'
};

const statusConfig = {
  draft: { color: 'bg-gray-500 text-white', label: 'Borrador' },
  pending: { color: 'bg-yellow-500 text-black', label: 'Pendiente' },
  approved: { color: 'bg-green-500 text-white', label: 'Aprobada' },
  rejected: { color: 'bg-red-500 text-white', label: 'Rechazada' }
};

export default function ProposalHeader({
  title,
  subtitle,
  author,
  authorLevel,
  category,
  targetHierarchy,
  createdAt,
  approvedAt,
  status,
  showAuthor = true,
  showMetadata = true,
  className = ''
}: ProposalHeaderProps) {
  return (
    <div className={`bg-[#121212] border border-[#8a8a8a] rounded-lg p-6 ${className}`}>
      {/* Header principal */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-lg text-gray-300 mb-3">{subtitle}</p>
          
          {/* Información del autor */}
          {showAuthor && (
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>Por: {author}</span>
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${levelColors[authorLevel as keyof typeof levelColors]} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{authorLevel}</span>
                </div>
                <span className="text-gray-300">{levelNames[authorLevel as keyof typeof levelNames]}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Badge de estado */}
        {status && (
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 text-sm rounded-full font-medium ${statusConfig[status].color}`}>
              {statusConfig[status].label}
            </span>
            {approvedAt && (
              <div className="text-xs text-gray-400">
                Aprobado: {new Date(approvedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Metadatos */}
      {showMetadata && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Tag size={16} className="text-gray-400" />
            <span className="text-gray-300">Categoría:</span>
            <span className="text-white">{categoryNames[category]}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Crown size={16} className="text-gray-400" />
            <span className="text-gray-300">Nivel:</span>
            <div className="flex items-center space-x-1">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${levelColors[targetHierarchy as keyof typeof levelColors]} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{targetHierarchy}</span>
              </div>
              <span className="text-white">{levelNames[targetHierarchy as keyof typeof levelNames]}</span>
            </div>
          </div>
          
          {createdAt && (
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-300">Creado:</span>
              <span className="text-white">{new Date(createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
