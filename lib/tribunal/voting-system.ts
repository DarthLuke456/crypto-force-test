// Sistema de Votación del TRIBUNAL IMPERIAL
// Sistema de votación donde solo el Maestro Supremo puede aprobar/rechazar

import { 
  TribunalProposal, 
  TribunalVote, 
  TribunalMember, 
  ProposalStatus,
  VoteType 
} from './types';
import { isSupremeMaestro, isTestingMaestro, canUserVoteByEmail, hasAbsoluteAuthority } from './permissions';

// Configuración del sistema de votación
export const VOTING_CONFIG = {
  REQUIRE_SUPREME_MAESTRO_APPROVAL: true, // Solo el Maestro Supremo puede aprobar
  ALLOW_TESTING_VOTES: true, // Permitir votos de testing temporal
  ALLOW_ABSTENTION: false, // No se permiten abstenciones
  VOTING_TIMEOUT_DAYS: 7, // 7 días para votar
  AUTO_EXPIRE_PROPOSALS: true, // Las propuestas expiran automáticamente
  REQUIRE_COMMENT_ON_REJECTION: true, // Comentario obligatorio al rechazar
  ALLOW_MULTIPLE_REVISIONS: true, // Se pueden reenviar propuestas rechazadas
  MAX_REVISION_ATTEMPTS: 3 // Máximo 3 intentos de revisión
};

// Clase principal del sistema de votación
export class TribunalVotingSystem {
  
  /**
   * Procesa un voto de un Maestro
   */
  static processVote(
    proposal: TribunalProposal,
    maestrosId: string,
    maestrosName: string,
    maestrosLevel: number,
    maestrosEmail: string,
    vote: VoteType,
    comment?: string
  ): {
    success: boolean;
    newStatus: ProposalStatus;
    message: string;
    updatedProposal: TribunalProposal;
  } {
    
    // Verificar si el usuario puede votar (por email)
    if (!canUserVoteByEmail(maestrosEmail)) {
      return {
        success: false,
        newStatus: proposal.status,
        message: 'No tienes permisos para votar en el Tribunal Imperial',
        updatedProposal: proposal
      };
    }
    
    // Verificar si es aprobación/rechazo (solo Darth Nihilus y Darth Luke)
    if ((vote === VoteType.APPROVE || vote === VoteType.REJECT) && !hasAbsoluteAuthority(maestrosEmail)) {
      return {
        success: false,
        newStatus: proposal.status,
        message: 'Solo Darth Nihilus y Darth Luke pueden aprobar o rechazar propuestas',
        updatedProposal: proposal
      };
    }
    
    // Verificar que la propuesta esté pendiente
    if (proposal.status !== ProposalStatus.PENDING) {
      return {
        success: false,
        newStatus: proposal.status,
        message: 'Esta propuesta ya no está pendiente de votación',
        updatedProposal: proposal
      };
    }
    
    // Verificar que no haya votado antes
    const existingVote = proposal.votes.find(v => v.maestrosId === maestrosId);
    if (existingVote) {
      return {
        success: false,
        newStatus: proposal.status,
        message: 'Ya has emitido tu voto en esta propuesta',
        updatedProposal: proposal
      };
    }
    
    // Verificar que el comentario sea obligatorio en caso de rechazo
    if (vote === VoteType.REJECT && VOTING_CONFIG.REQUIRE_COMMENT_ON_REJECTION && !comment) {
      return {
        success: false,
        newStatus: proposal.status,
        message: 'Debes proporcionar un comentario explicando el motivo del rechazo',
        updatedProposal: proposal
      };
    }
    
    // Crear el voto
    const newVote: TribunalVote = {
      id: `vote_${proposal.id}_${maestrosId}`,
      maestrosId,
      maestrosName,
      maestrosLevel,
      vote,
      comment,
      votedAt: new Date()
    };
    
    // Agregar el voto a la propuesta
    const updatedVotes = [...proposal.votes, newVote];
    const totalVotes = updatedVotes.length;
    
    // Calcular el nuevo estado de la propuesta
    const newStatus = this.calculateProposalStatus(updatedVotes, proposal.requiredVotes);
    
    // Crear la propuesta actualizada
    const updatedProposal: TribunalProposal = {
      ...proposal,
      votes: updatedVotes,
      totalVotes,
      status: newStatus,
      reviewedAt: newStatus !== ProposalStatus.PENDING ? new Date() : undefined,
      unanimousApproval: newStatus === ProposalStatus.APPROVED,
      rejectionReason: newStatus === ProposalStatus.REJECTED ? comment : undefined,
      rejectionAuthorId: newStatus === ProposalStatus.REJECTED ? maestrosId : undefined,
      rejectionAuthorName: newStatus === ProposalStatus.REJECTED ? maestrosName : undefined,
      rejectionDate: newStatus === ProposalStatus.REJECTED ? new Date() : undefined
    };
    
    return {
      success: true,
      newStatus,
      message: this.getVoteResultMessage(newStatus, vote),
      updatedProposal
    };
  }
  
  /**
   * Calcula el estado de la propuesta basado en los votos
   */
  private static calculateProposalStatus(
    votes: TribunalVote[], 
    requiredVotes: number
  ): ProposalStatus {
    
    // Contar votos por tipo
    const approveVotes = votes.filter(v => v.vote === VoteType.APPROVE).length;
    const rejectVotes = votes.filter(v => v.vote === VoteType.REJECT).length;
    const abstainVotes = votes.filter(v => v.vote === VoteType.ABSTAIN).length;
    
    // En el nuevo sistema, solo el Maestro Supremo puede aprobar/rechazar
    // Si hay una aprobación del Maestro Supremo, se aprueba inmediatamente
    if (approveVotes > 0) {
      return ProposalStatus.APPROVED;
    }
    
    // Si hay un rechazo del Maestro Supremo, se rechaza inmediatamente
    if (rejectVotes > 0) {
      return ProposalStatus.REJECTED;
    }
    
    // Si no hay votos de aprobación/rechazo, permanece pendiente
    return ProposalStatus.PENDING;
  }
  
  /**
   * Obtiene el mensaje del resultado del voto
   */
  private static getVoteResultMessage(status: ProposalStatus, vote: VoteType): string {
    switch (status) {
      case ProposalStatus.APPROVED:
        return '¡Propuesta aprobada por Darth Nihilus o Darth Luke!';
      case ProposalStatus.REJECTED:
        if (vote === VoteType.REJECT) {
          return 'Tu voto de rechazo ha sido registrado. La propuesta ha sido rechazada.';
        }
        return 'La propuesta ha sido rechazada por Darth Nihilus o Darth Luke.';
      case ProposalStatus.PENDING:
        return 'Tu voto ha sido registrado. La propuesta sigue pendiente de más votos.';
      default:
        return 'Tu voto ha sido procesado.';
    }
  }
  
  /**
   * Verifica si una propuesta ha expirado
   */
  static checkProposalExpiration(proposal: TribunalProposal): boolean {
    if (!VOTING_CONFIG.AUTO_EXPIRE_PROPOSALS) {
      return false;
    }
    
    const daysSinceSubmission = this.getDaysDifference(proposal.submittedAt, new Date());
    return daysSinceSubmission > VOTING_CONFIG.VOTING_TIMEOUT_DAYS;
  }
  
  /**
   * Marca una propuesta como expirada
   */
  static expireProposal(proposal: TribunalProposal): TribunalProposal {
    return {
      ...proposal,
      status: ProposalStatus.EXPIRED,
      reviewedAt: new Date()
    };
  }
  
  /**
   * Obtiene las propuestas que requieren el voto de un Maestro específico
   */
  static getProposalsRequiringVote(
    proposals: TribunalProposal[],
    maestrosId: string
  ): TribunalProposal[] {
    return proposals.filter(proposal => {
      // Solo propuestas pendientes
      if (proposal.status !== ProposalStatus.PENDING) return false;
      
      // Verificar que no haya votado ya
      const hasVoted = proposal.votes.some(v => v.maestrosId === maestrosId);
      return !hasVoted;
    });
  }
  
  /**
   * Obtiene las propuestas que un Maestro ha votado
   */
  static getProposalsVotedBy(
    proposals: TribunalProposal[],
    maestrosId: string
  ): TribunalProposal[] {
    return proposals.filter(proposal => {
      const hasVoted = proposal.votes.some(v => v.maestrosId === maestrosId);
      return hasVoted;
    });
  }
  
  /**
   * Obtiene estadísticas de votación de un Maestro
   */
  static getMaestrosVotingStats(
    proposals: TribunalProposal[],
    maestrosId: string
  ): {
    totalVotes: number;
    approvedVotes: number;
    rejectedVotes: number;
    pendingVotes: number;
    approvalRate: number;
  } {
    const votedProposals = this.getProposalsVotedBy(proposals, maestrosId);
    
    const totalVotes = votedProposals.length;
    const approvedVotes = votedProposals.filter(p => p.status === ProposalStatus.APPROVED).length;
    const rejectedVotes = votedProposals.filter(p => p.status === ProposalStatus.REJECTED).length;
    const pendingVotes = votedProposals.filter(p => p.status === ProposalStatus.PENDING).length;
    
    const approvalRate = totalVotes > 0 ? (approvedVotes / totalVotes) * 100 : 0;
    
    return {
      totalVotes,
      approvedVotes,
      rejectedVotes,
      pendingVotes,
      approvalRate: Math.round(approvalRate * 100) / 100
    };
  }
  
  /**
   * Obtiene el progreso de votación de una propuesta
   */
  static getProposalVotingProgress(proposal: TribunalProposal): {
    totalVotes: number;
    requiredVotes: number;
    approveVotes: number;
    rejectVotes: number;
    abstainVotes: number;
    progressPercentage: number;
    remainingVotes: number;
    estimatedCompletion: string;
  } {
    const totalVotes = proposal.votes.length;
    const requiredVotes = proposal.requiredVotes;
    const approveVotes = proposal.votes.filter(v => v.vote === VoteType.APPROVE).length;
    const rejectVotes = proposal.votes.filter(v => v.vote === VoteType.REJECT).length;
    const abstainVotes = proposal.votes.filter(v => v.vote === VoteType.ABSTAIN).length;
    
    const progressPercentage = (totalVotes / requiredVotes) * 100;
    const remainingVotes = requiredVotes - totalVotes;
    
    // Estimar tiempo de completado basado en votos por día
    const averageVotesPerDay = this.calculateAverageVotesPerDay(proposal);
    const estimatedDays = remainingVotes / averageVotesPerDay;
    
    let estimatedCompletion = 'Indefinido';
    if (averageVotesPerDay > 0) {
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + estimatedDays);
      estimatedCompletion = completionDate.toLocaleDateString('es-ES');
    }
    
    return {
      totalVotes,
      requiredVotes,
      approveVotes,
      rejectVotes,
      abstainVotes,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      remainingVotes,
      estimatedCompletion
    };
  }
  
  /**
   * Calcula el promedio de votos por día
   */
  private static calculateAverageVotesPerDay(proposal: TribunalProposal): number {
    if (proposal.votes.length === 0) return 0;
    
    const firstVote = proposal.votes[0].votedAt;
    const lastVote = proposal.votes[proposal.votes.length - 1].votedAt;
    const daysDifference = this.getDaysDifference(firstVote, lastVote);
    
    if (daysDifference === 0) return proposal.votes.length;
    
    return proposal.votes.length / daysDifference;
  }
  
  /**
   * Calcula la diferencia en días entre dos fechas
   */
  private static getDaysDifference(date1: Date, date2: Date): number {
    const timeDiff = date2.getTime() - date1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  /**
   * Verifica si una propuesta puede ser reenviada después de ser rechazada
   */
  static canProposalBeResubmitted(proposal: TribunalProposal): boolean {
    if (!VOTING_CONFIG.ALLOW_MULTIPLE_REVISIONS) {
      return false;
    }
    
    if (proposal.status !== ProposalStatus.REJECTED) {
      return false;
    }
    
    // Contar intentos previos de revisión
    const revisionAttempts = this.countRevisionAttempts(proposal);
    
    return revisionAttempts < VOTING_CONFIG.MAX_REVISION_ATTEMPTS;
  }
  
  /**
   * Cuenta los intentos de revisión de una propuesta
   */
  private static countRevisionAttempts(proposal: TribunalProposal): number {
    // Esta función necesitaría acceso al historial de la propuesta
    // Por ahora retornamos 0
    return 0;
  }
  
  /**
   * Obtiene el resumen de votación para el dashboard
   */
  static getVotingSummary(proposals: TribunalProposal[]): {
    totalProposals: number;
    pendingProposals: number;
    approvedProposals: number;
    rejectedProposals: number;
    expiredProposals: number;
    averageVotingTime: number; // en días
    totalVotes: number;
    unanimousApprovals: number;
  } {
    const totalProposals = proposals.length;
    const pendingProposals = proposals.filter(p => p.status === ProposalStatus.PENDING).length;
    const approvedProposals = proposals.filter(p => p.status === ProposalStatus.APPROVED).length;
    const rejectedProposals = proposals.filter(p => p.status === ProposalStatus.REJECTED).length;
          const expiredProposals = proposals.filter(p => p.status === ProposalStatus.EXPIRED).length;
    
    const totalVotes = proposals.reduce((sum, p) => sum + p.totalVotes, 0);
    const unanimousApprovals = proposals.filter(p => p.unanimousApproval).length;
    
    // Calcular tiempo promedio de votación
    const completedProposals = proposals.filter(p => p.status !== ProposalStatus.PENDING);
    const totalVotingTime = completedProposals.reduce((sum, p) => {
      if (p.reviewedAt) {
        return sum + this.getDaysDifference(p.submittedAt, p.reviewedAt);
      }
      return sum;
    }, 0);
    
    const averageVotingTime = completedProposals.length > 0 
      ? totalVotingTime / completedProposals.length 
      : 0;
    
    return {
      totalProposals,
      pendingProposals,
      approvedProposals,
      rejectedProposals,
      expiredProposals,
      averageVotingTime: Math.round(averageVotingTime * 100) / 100,
      totalVotes,
      unanimousApprovals
    };
  }
}
