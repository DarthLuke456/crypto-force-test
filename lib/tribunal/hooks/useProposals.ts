'use client';

import { useState, useEffect } from 'react';
import { ContentBlock } from '../types';

// Definir la interfaz para localStorage (sin depender de types.ts)
export interface TribunalProposal {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical' | 'checkpoint' | 'edit_approved_content' | 'delete_approved_content';
  targetHierarchy: number;
  content: ContentBlock[];
  authorId: string;
  authorName: string;
  authorLevel: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  votes: {
    maestros: string[];
    approvals: string[];
    rejections: string[];
  };
  checkpointModules?: {
    module1: string;
    module2: string;
  };
  originalProposalId?: string; // Para solicitudes de edición/eliminación de contenido aprobado
}

const STORAGE_KEY = 'tribunal_proposals';

export function useProposals() {
  const [proposals, setProposals] = useState<TribunalProposal[]>([]);

  // Cargar propuestas desde localStorage
  const loadProposals = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir las fechas de string a Date y asegurar estructura de votos
        const proposalsWithDates = parsed.map((proposal: any) => ({
          ...proposal,
          createdAt: new Date(proposal.createdAt),
          updatedAt: new Date(proposal.updatedAt),
          submittedAt: proposal.submittedAt ? new Date(proposal.submittedAt) : undefined,
          approvedAt: proposal.approvedAt ? new Date(proposal.approvedAt) : undefined,
          rejectedAt: proposal.rejectedAt ? new Date(proposal.rejectedAt) : undefined,
          votes: proposal.votes || {
            maestros: [],
            approvals: [],
            rejections: [],
          },
        }));
        setProposals(proposalsWithDates);
      }
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  // Guardar propuestas en localStorage
  const saveProposals = (newProposals: TribunalProposal[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProposals));
    } catch (error) {
      console.error('Error saving proposals:', error);
    }
  };

  // Cargar propuestas al inicializar
  useEffect(() => {
    loadProposals();
  }, []);

  // Crear nueva propuesta
  const createProposal = (proposal: Omit<TribunalProposal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProposal: TribunalProposal = {
      ...proposal,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: {
        maestros: [],
        approvals: [],
        rejections: [],
      },
    };
    
    const updatedProposals = [...proposals, newProposal];
    setProposals(updatedProposals);
    saveProposals(updatedProposals);
    
    return newProposal;
  };

  // Actualizar propuesta existente
  const updateProposal = (id: string, updatedProposal: Partial<TribunalProposal>) => {
    const updatedProposals = proposals.map(proposal => 
      proposal.id === id 
        ? { 
            ...proposal, 
            ...updatedProposal, 
            updatedAt: new Date() 
          }
        : proposal
    );
    
    setProposals(updatedProposals);
    saveProposals(updatedProposals);
    
    return updatedProposals.find(p => p.id === id);
  };



  // Eliminar propuesta
  const deleteProposal = (id: string) => {
    const updatedProposals = proposals.filter(proposal => proposal.id !== id);
    setProposals(updatedProposals);
    saveProposals(updatedProposals);
  };

  // Limpiar todas las propuestas (para empezar de cero)
  const clearAllProposals = () => {
    setProposals([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Obtener propuestas por estado
  const getProposalsByStatus = (status: TribunalProposal['status']) => {
    return proposals.filter(proposal => proposal.status === status);
  };

  // Obtener propuestas por autor
  const getProposalsByAuthor = (authorId: string) => {
    return proposals.filter(proposal => proposal.authorId === authorId);
  };

  // Enviar propuesta para revisión
  const submitProposal = (id: string) => {
    updateProposal(id, {
      status: 'pending',
      submittedAt: new Date(),
    });
  };

  // Aprobar propuesta
  const approveProposal = (id: string, maestrosId: string, maestrosName: string) => {
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return;

    // Asegurar que la estructura de votos esté inicializada
    const currentVotes = proposal.votes || {
      maestros: [],
      approvals: [],
      rejections: [],
    };

    const updatedVotes = {
      ...currentVotes,
      maestros: [...(currentVotes.maestros || []), maestrosId],
      approvals: [...(currentVotes.approvals || []), maestrosId],
    };

    updateProposal(id, {
      votes: updatedVotes,
      status: 'approved',
      approvedAt: new Date(),
    });
  };

  // Rechazar propuesta
  const rejectProposal = (id: string, maestrosId: string, maestrosName: string, reason: string) => {
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return;

    // Asegurar que la estructura de votos esté inicializada
    const currentVotes = proposal.votes || {
      maestros: [],
      approvals: [],
      rejections: [],
    };

    const updatedVotes = {
      ...currentVotes,
      maestros: [...(currentVotes.maestros || []), maestrosId],
      rejections: [...(currentVotes.rejections || []), maestrosId],
    };

    updateProposal(id, {
      votes: updatedVotes,
      status: 'rejected',
      rejectedAt: new Date(),
      rejectionReason: reason,
    });
  };

  return {
    proposals,
    createProposal,
    updateProposal,
    deleteProposal,
    submitProposal,
    approveProposal,
    rejectProposal,
    getProposalsByStatus,
    getProposalsByAuthor,
    loadProposals,
    clearAllProposals,
  };
}
