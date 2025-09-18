'use client';

import { useState, useEffect } from 'react';
import { ProposalStatus } from '@/lib/tribunal/types';

// Usar la interfaz del hook useProposals que es la que realmente se guarda
interface TribunalProposal {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical';
  targetHierarchy: number;
  content: any[];
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
}

export function useTribunalModules() {
  const [theoreticalModules, setTheoreticalModules] = useState<TribunalProposal[]>([]);
  const [practicalModules, setPracticalModules] = useState<TribunalProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApprovedModules = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener propuestas del localStorage
        const storedProposals = localStorage.getItem('tribunal_proposals');
        if (!storedProposals) {
          console.log('No hay propuestas en localStorage');
          setTheoreticalModules([]);
          setPracticalModules([]);
          setIsLoading(false);
          return;
        }

        const allProposals: TribunalProposal[] = JSON.parse(storedProposals);
        console.log('Propuestas cargadas del localStorage:', allProposals);
        
        // Filtrar solo las aprobadas
        const approvedProposals = allProposals.filter(
          proposal => {
            const isValid = proposal.status === ProposalStatus.APPROVED;
            if (!isValid) {
              console.log('Propuesta descartada:', {
                id: proposal.id,
                status: proposal.status
              });
            }
            return isValid;
          }
        );

        console.log('Propuestas aprobadas válidas:', approvedProposals);

        // Separar por categoría
        const theoretical = approvedProposals.filter(
          proposal => proposal.category === 'theoretical'
        );
        
        const practical = approvedProposals.filter(
          proposal => proposal.category === 'practical'
        );

        console.log('Módulos teóricos:', theoretical);
        console.log('Módulos prácticos:', practical);

        // Ordenar por fecha de aprobación (más reciente primero)
        const sortByApprovalDate = (a: TribunalProposal, b: TribunalProposal) => {
          const dateA = new Date(a.approvedAt || a.submittedAt || a.createdAt);
          const dateB = new Date(b.approvedAt || b.submittedAt || b.createdAt);
          return dateB.getTime() - dateA.getTime();
        };

        setTheoreticalModules(theoretical.sort(sortByApprovalDate));
        setPracticalModules(practical.sort(sortByApprovalDate));
        
      } catch (err) {
        console.error('Error al cargar módulos del Tribunal:', err);
        setError('Error al cargar los módulos aprobados');
        setTheoreticalModules([]);
        setPracticalModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Cargar módulos inicialmente
    loadApprovedModules();

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tribunal_proposals') {
        loadApprovedModules();
      }
    };

    // Escuchar cambios en el mismo tab
    const handleProposalUpdate = () => {
      loadApprovedModules();
    };

    // Agregar event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tribunal_proposal_updated', handleProposalUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tribunal_proposal_updated', handleProposalUpdate);
    };
  }, []);

  // Función para refrescar manualmente
  const refreshModules = () => {
    const event = new CustomEvent('tribunal_proposal_updated');
    window.dispatchEvent(event);
  };

  return {
    theoreticalModules,
    practicalModules,
    isLoading,
    error,
    refreshModules,
    totalModules: theoreticalModules.length + practicalModules.length
  };
}
