// Hook personalizado para manejar propuestas del TRIBUNAL IMPERIAL
// Incluye persistencia en localStorage y gestión de estado

import { useState, useEffect } from 'react';
import { ContentBlock } from './types';

// Interfaz para una propuesta del Tribunal Imperial
export interface TribunalProposal {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical';
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
    maestros: string[]; // IDs de maestros que han votado
    approvals: string[]; // IDs de maestros que aprobaron
    rejections: string[]; // IDs de maestros que rechazaron
  };
}

// Hook principal para manejar propuestas
export function useProposals() {
  const [proposals, setProposals] = useState<TribunalProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar propuestas desde localStorage al inicializar
  useEffect(() => {
    loadProposals();
  }, []);

  // Cargar propuestas desde localStorage
  const loadProposals = () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem('tribunal_proposals');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir fechas de string a Date
        const proposalsWithDates = parsed.map((proposal: any) => ({
          ...proposal,
          createdAt: new Date(proposal.createdAt),
          updatedAt: new Date(proposal.updatedAt),
          submittedAt: proposal.submittedAt ? new Date(proposal.submittedAt) : undefined,
          approvedAt: proposal.approvedAt ? new Date(proposal.approvedAt) : undefined,
          rejectedAt: proposal.rejectedAt ? new Date(proposal.rejectedAt) : undefined,
        }));
        setProposals(proposalsWithDates);
      }
    } catch (err) {
      setError('Error al cargar las propuestas');
      console.error('Error loading proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar propuestas en localStorage
  const saveProposals = (newProposals: TribunalProposal[]) => {
    try {
      localStorage.setItem('tribunal_proposals', JSON.stringify(newProposals));
    } catch (err) {
      setError('Error al guardar las propuestas');
      console.error('Error saving proposals:', err);
    }
  };

  // Crear una nueva propuesta
  const createProposal = (proposalData: Omit<TribunalProposal, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'votes'>) => {
    // Check if the author is the temporary final authority (coeurdeluke.js@gmail.com or infocryptoforce@gmail.com)
    const isTemporaryAuthority = proposalData.authorId === 'coeurdeluke.js@gmail.com' || 
                                proposalData.authorName === 'coeurdeluke.js@gmail.com' ||
                                proposalData.authorId === 'infocryptoforce@gmail.com' || 
                                proposalData.authorName === 'infocryptoforce@gmail.com';
    
    const newProposal: TribunalProposal = {
      ...proposalData,
      id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Auto-approve if created by temporary authority
      status: isTemporaryAuthority ? 'approved' : 'draft',
      votes: {
        maestros: isTemporaryAuthority ? [proposalData.authorId || proposalData.authorName || 'coeurdeluke.js@gmail.com'] : [],
        approvals: isTemporaryAuthority ? [proposalData.authorId || proposalData.authorName || 'coeurdeluke.js@gmail.com'] : [],
        rejections: []
      },
      // Add approval timestamp for temporary authority
      ...(isTemporaryAuthority && { approvedAt: new Date() })
    };

    const updatedProposals = [...proposals, newProposal];
    setProposals(updatedProposals);
    saveProposals(updatedProposals);
    
        // Log the bypass for transparency
        if (isTemporaryAuthority) {
          console.log('🔑 TEMPORARY AUTHORITY BYPASS: Proposal auto-approved for', proposalData.authorName || proposalData.authorId, '- Darth Nihilus has absolute authority');
        }
    
    return newProposal;
  };

  // Actualizar una propuesta existente
  const updateProposal = (id: string, updates: Partial<TribunalProposal>) => {
    const updatedProposals = proposals.map(proposal => 
      proposal.id === id 
        ? { ...proposal, ...updates, updatedAt: new Date() }
        : proposal
    );
    
    setProposals(updatedProposals);
    saveProposals(updatedProposals);
    
    return updatedProposals.find(p => p.id === id);
  };

  // Eliminar una propuesta
  const deleteProposal = (id: string) => {
    const updatedProposals = proposals.filter(proposal => proposal.id !== id);
    setProposals(updatedProposals);
    saveProposals(updatedProposals);
  };

  // Enviar propuesta para revisión
  const submitProposal = (id: string) => {
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return null;
    
    // Check if the author is the temporary final authority
    const isTemporaryAuthority = proposal.authorId === 'coeurdeluke.js@gmail.com' || 
                                proposal.authorName === 'coeurdeluke.js@gmail.com' ||
                                proposal.authorId === 'infocryptoforce@gmail.com' || 
                                proposal.authorName === 'infocryptoforce@gmail.com';
    
    if (isTemporaryAuthority) {
      // Auto-approve for temporary authority
        console.log('🔑 TEMPORARY AUTHORITY BYPASS: Proposal auto-approved on submission for', proposal.authorName || proposal.authorId, '- Darth Nihilus has absolute authority');
      return updateProposal(id, {
        status: 'approved',
        submittedAt: new Date(),
        approvedAt: new Date(),
        votes: {
          ...proposal.votes,
          maestros: [...(proposal.votes?.maestros || []), proposal.authorId || proposal.authorName || 'coeurdeluke.js@gmail.com'],
          approvals: [...(proposal.votes?.approvals || []), proposal.authorId || proposal.authorName || 'coeurdeluke.js@gmail.com']
        }
      });
    }
    
    return updateProposal(id, {
      status: 'pending',
      submittedAt: new Date()
    });
  };

  // Aprobar propuesta
  const approveProposal = (id: string, maestroId: string) => {
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return null;

    const updatedVotes = {
      ...proposal.votes,
      maestros: [...new Set([...proposal.votes.maestros, maestroId])],
      approvals: [...new Set([...proposal.votes.approvals, maestroId])]
    };

    // Verificar si todos los maestros han aprobado
    const allMaestrosApproved = updatedVotes.approvals.length >= 5; // Asumiendo 5 maestros

    return updateProposal(id, {
      status: allMaestrosApproved ? 'approved' : 'pending',
      votes: updatedVotes,
      approvedAt: allMaestrosApproved ? new Date() : undefined
    });
  };

  // Rechazar propuesta
  const rejectProposal = (id: string, maestroId: string, reason: string) => {
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return null;

    const updatedVotes = {
      ...proposal.votes,
      maestros: [...new Set([...proposal.votes.maestros, maestroId])],
      rejections: [...new Set([...proposal.votes.rejections, maestroId])]
    };

    return updateProposal(id, {
      status: 'rejected',
      votes: updatedVotes,
      rejectedAt: new Date(),
      rejectionReason: reason
    });
  };

  // Obtener propuestas por estado
  const getProposalsByStatus = (status: TribunalProposal['status']) => {
    return proposals.filter(proposal => proposal.status === status);
  };

  // Obtener propuestas por autor
  const getProposalsByAuthor = (authorId: string) => {
    return proposals.filter(proposal => proposal.authorId === authorId);
  };

  // Obtener propuestas por jerarquía objetivo
  const getProposalsByHierarchy = (hierarchy: number) => {
    return proposals.filter(proposal => proposal.targetHierarchy === hierarchy);
  };

  // Obtener estadísticas de propuestas
  const getProposalStats = () => {
    const total = proposals.length;
    const drafts = proposals.filter(p => p.status === 'draft').length;
    const pending = proposals.filter(p => p.status === 'pending').length;
    const approved = proposals.filter(p => p.status === 'approved').length;
    const rejected = proposals.filter(p => p.status === 'rejected').length;

    return {
      total,
      drafts,
      pending,
      approved,
      rejected
    };
  };

  // Limpiar propuestas antiguas (más de 30 días)
  const cleanupOldProposals = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const updatedProposals = proposals.filter(proposal => 
      proposal.updatedAt > thirtyDaysAgo || proposal.status === 'approved'
    );
    
    if (updatedProposals.length !== proposals.length) {
      setProposals(updatedProposals);
      saveProposals(updatedProposals);
    }
  };

  // Exportar propuestas
  const exportProposals = () => {
    const dataStr = JSON.stringify(proposals, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tribunal_proposals_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importar propuestas
  const importProposals = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const updatedProposals = [...proposals, ...imported];
        setProposals(updatedProposals);
        saveProposals(updatedProposals);
      } catch (err) {
        setError('Error al importar las propuestas');
        console.error('Error importing proposals:', err);
      }
    };
    reader.readAsText(file);
  };

  return {
    // Estado
    proposals,
    loading,
    error,
    
    // Acciones principales
    createProposal,
    updateProposal,
    deleteProposal,
    submitProposal,
    approveProposal,
    rejectProposal,
    
    // Consultas
    getProposalsByStatus,
    getProposalsByAuthor,
    getProposalsByHierarchy,
    getProposalStats,
    
    // Utilidades
    cleanupOldProposals,
    exportProposals,
    importProposals,
    loadProposals,
    
    // Limpiar error
    clearError: () => setError(null)
  };
}
