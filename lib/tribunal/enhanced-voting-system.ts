// Sistema Mejorado de Votación Unánime del Tribunal Imperial
// Con notificaciones, seguimiento en tiempo real y gestión avanzada

import { CustomModule, ProposalStatus, VoteType, TribunalVote } from './types';

// Interfaz para notificaciones del sistema de votación
export interface VotingNotification {
  id: string;
  type: 'new_proposal' | 'vote_cast' | 'proposal_approved' | 'proposal_rejected' | 'deadline_approaching' | 'deadline_expired';
  proposalId: string;
  proposalTitle: string;
  recipientId: string;
  recipientLevel: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  metadata: {
    votingDeadline?: Date;
    votesRemaining?: number;
    totalVotes?: number;
    approvalPercentage?: number;
  };
}

// Interfaz para el estado de votación en tiempo real
export interface VotingState {
  proposalId: string;
  totalVotes: number;
  votesCast: number;
  votesRemaining: number;
  approvalPercentage: number;
  deadline: Date;
  isExpired: boolean;
  isApproved: boolean;
  isRejected: boolean;
  voters: {
    userId: string;
    userName: string;
    userLevel: number;
    vote: VoteType | null;
    timestamp: Date | null;
    comment: string | null;
  }[];
}

// Configuración del sistema de votación
export const VOTING_SYSTEM_CONFIG = {
  VOTING_DEADLINE_HOURS: 168, // 7 días
  REMINDER_HOURS: [24, 12, 6, 1], // Recordatorios antes del deadline
  AUTO_APPROVE_ON_UNANIMOUS: true,
  REQUIRE_COMMENTS_ON_REJECTION: true,
  ENABLE_REAL_TIME_UPDATES: true,
  NOTIFICATION_ENABLED: true,
  MAX_PROPOSAL_LENGTH: 30, // días
  MIN_VOTES_FOR_APPROVAL: 1, // Mínimo 1 voto (todos los maestros)
  ENABLE_VOTE_CHANGES: false, // No permitir cambios de voto
  ENABLE_ANONYMOUS_VOTING: false
};

// Clase principal del sistema de votación mejorado
export class EnhancedVotingSystem {
  
  private static votingStates: Map<string, VotingState> = new Map();
  private static notifications: Map<string, VotingNotification[]> = new Map();
  private static subscribers: Map<string, Set<(state: VotingState) => void>> = new Map();
  private static isInitialized = false;
  
  /**
   * Inicializa el sistema de votación mejorado
   */
  static initialize(): void {
    if (this.isInitialized) return;
    
    console.log('🗳️ Inicializando Sistema de Votación Mejorado del Tribunal Imperial');
    
    // Configurar procesamiento de deadlines
    this.setupDeadlineProcessor();
    
    // Configurar sistema de notificaciones
    this.setupNotificationSystem();
    
    // Cargar estados de votación existentes
    this.loadExistingVotingStates();
    
    this.isInitialized = true;
  }
  
  /**
   * Crea una nueva propuesta y inicia el proceso de votación
   */
  static async createProposal(
    proposal: CustomModule,
    authorId: string,
    authorName: string,
    authorLevel: number
  ): Promise<{
    success: boolean;
    proposalId: string;
    votingState: VotingState;
    notifications: VotingNotification[];
  }> {
    
    try {
      const proposalId = proposal.id;
      
      // Check if the author is the temporary final authority (coeurdeluke.js@gmail.com or infocryptoforce@gmail.com)
      const isTemporaryAuthority = authorId === 'coeurdeluke.js@gmail.com' || 
                                  authorName === 'coeurdeluke.js@gmail.com' ||
                                  authorId === 'infocryptoforce@gmail.com' || 
                                  authorName === 'infocryptoforce@gmail.com';
      
      if (isTemporaryAuthority) {
        // Auto-approve for temporary authority - bypass voting system
        console.log('🔑 TEMPORARY AUTHORITY BYPASS: Proposal auto-approved in voting system for', authorId || authorName, '- Darth Nihilus has absolute authority');
        
        const autoApprovedState: VotingState = {
          proposalId,
          totalVotes: 1,
          votesCast: 1,
          votesRemaining: 0,
          approvalPercentage: 100,
          deadline: new Date(),
          isExpired: false,
          isApproved: true,
          isRejected: false,
          voters: [{
            userId: authorId,
            userName: authorName,
            userLevel: authorLevel,
            vote: VoteType.APPROVE,
            timestamp: new Date(),
            comment: 'Auto-approved by temporary final authority'
          }]
        };
        
        this.votingStates.set(proposalId, autoApprovedState);
        
        return {
          success: true,
          proposalId,
          votingState: autoApprovedState,
          notifications: []
        };
      }
      
      const deadline = new Date(Date.now() + VOTING_SYSTEM_CONFIG.VOTING_DEADLINE_HOURS * 60 * 60 * 1000);
      
      // Obtener lista de maestros (nivel 6)
      const maestros = await this.getMaestros();
      
      // Crear estado de votación
      const votingState: VotingState = {
        proposalId,
        totalVotes: maestros.length,
        votesCast: 0,
        votesRemaining: maestros.length,
        approvalPercentage: 0,
        deadline,
        isExpired: false,
        isApproved: false,
        isRejected: false,
        voters: maestros.map(maestro => ({
          userId: maestro.id,
          userName: maestro.name,
          userLevel: maestro.level,
          vote: null,
          timestamp: null,
          comment: null
        }))
      };
      
      // Guardar estado de votación
      this.votingStates.set(proposalId, votingState);
      
      // Crear notificaciones para todos los maestros
      const notifications = await this.createNotificationsForProposal(proposal, votingState);
      
      // Enviar notificaciones
      await this.sendNotifications(notifications);
      
      // Programar recordatorios
      this.scheduleReminders(proposalId, deadline);
      
      console.log(`📋 Nueva propuesta creada: ${proposal.title} (ID: ${proposalId})`);
      
      return {
        success: true,
        proposalId,
        votingState,
        notifications
      };
      
    } catch (error) {
      console.error('Error creando propuesta:', error);
      return {
        success: false,
        proposalId: '',
        votingState: {} as VotingState,
        notifications: []
      };
    }
  }
  
  /**
   * Emite un voto en una propuesta
   */
  static async castVote(
    proposalId: string,
    voterId: string,
    vote: VoteType,
    comment?: string
  ): Promise<{
    success: boolean;
    votingState: VotingState | null;
    notifications: VotingNotification[];
    isApproved: boolean;
    isRejected: boolean;
  }> {
    
    try {
      const votingState = this.votingStates.get(proposalId);
      if (!votingState) {
        throw new Error(`Estado de votación no encontrado para propuesta ${proposalId}`);
      }
      
      // Verificar si el votante puede votar
      const voter = votingState.voters.find(v => v.userId === voterId);
      if (!voter) {
        throw new Error(`Usuario ${voterId} no autorizado para votar en esta propuesta`);
      }
      
      // Verificar si ya votó
      if (voter.vote !== null && !VOTING_SYSTEM_CONFIG.ENABLE_VOTE_CHANGES) {
        throw new Error('El usuario ya ha emitido su voto y no se permiten cambios');
      }
      
      // Verificar deadline
      if (votingState.isExpired || new Date() > votingState.deadline) {
        throw new Error('El plazo de votación ha expirado');
      }
      
      // Validar comentario si es rechazo
      if (vote === VoteType.REJECT && VOTING_SYSTEM_CONFIG.REQUIRE_COMMENTS_ON_REJECTION) {
        if (!comment || comment.trim().length === 0) {
          throw new Error('Se requiere un comentario para rechazar una propuesta');
        }
      }
      
      // Actualizar voto
      const wasFirstVote = voter.vote === null;
      voter.vote = vote;
      voter.timestamp = new Date();
      voter.comment = comment || null;
      
      // Actualizar estadísticas
      if (wasFirstVote) {
        votingState.votesCast++;
        votingState.votesRemaining--;
      }
      
      // Calcular porcentaje de aprobación
      const approvedVotes = votingState.voters.filter(v => v.vote === VoteType.APPROVE).length;
      votingState.approvalPercentage = (approvedVotes / votingState.totalVotes) * 100;
      
      // Verificar si se alcanzó unanimidad
      const allVotesCast = votingState.votesCast === votingState.totalVotes;
      const allApproved = approvedVotes === votingState.totalVotes;
      const anyRejected = votingState.voters.some(v => v.vote === VoteType.REJECT);
      
      if (allVotesCast) {
        if (allApproved) {
          votingState.isApproved = true;
          await this.approveProposal(proposalId);
        } else if (anyRejected) {
          votingState.isRejected = true;
          await this.rejectProposal(proposalId);
        }
      }
      
      // Guardar estado actualizado
      this.votingStates.set(proposalId, votingState);
      
      // Notificar a suscriptores
      this.notifySubscribers(proposalId, votingState);
      
      // Crear notificaciones
      const notifications = await this.createNotificationsForVote(proposalId, voterId, vote, votingState);
      
      // Enviar notificaciones
      await this.sendNotifications(notifications);
      
      console.log(`🗳️ Voto emitido: ${vote} por ${voterId} en propuesta ${proposalId}`);
      
      return {
        success: true,
        votingState,
        notifications,
        isApproved: votingState.isApproved,
        isRejected: votingState.isRejected
      };
      
    } catch (error) {
      console.error('Error emitiendo voto:', error);
      return {
        success: false,
        votingState: null,
        notifications: [],
        isApproved: false,
        isRejected: false
      };
    }
  }
  
  /**
   * Suscribe a actualizaciones de votación en tiempo real
   */
  static subscribeToVoting(
    proposalId: string,
    callback: (state: VotingState) => void
  ): () => void {
    
    if (!this.subscribers.has(proposalId)) {
      this.subscribers.set(proposalId, new Set());
    }
    
    const subscribers = this.subscribers.get(proposalId)!;
    subscribers.add(callback);
    
    // Enviar estado actual inmediatamente
    const currentState = this.votingStates.get(proposalId);
    if (currentState) {
      callback(currentState);
    }
    
    // Retornar función de desuscripción
    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(proposalId);
      }
    };
  }
  
  /**
   * Obtiene el estado de votación de una propuesta
   */
  static getVotingState(proposalId: string): VotingState | null {
    return this.votingStates.get(proposalId) || null;
  }
  
  /**
   * Obtiene todas las notificaciones de un usuario
   */
  static getUserNotifications(userId: string): VotingNotification[] {
    return this.notifications.get(userId) || [];
  }
  
  /**
   * Marca una notificación como leída
   */
  static markNotificationAsRead(notificationId: string, userId: string): void {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const notification = userNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
    }
  }
  
  /**
   * Aprueba una propuesta
   */
  private static async approveProposal(proposalId: string): Promise<void> {
    try {
      // Actualizar estado de la propuesta en localStorage
      const storedProposals = localStorage.getItem('tribunal_proposals');
      if (storedProposals) {
        const allProposals = JSON.parse(storedProposals);
        const proposalIndex = allProposals.findIndex((p: any) => p.id === proposalId);
        
        if (proposalIndex !== -1) {
          allProposals[proposalIndex].status = ProposalStatus.APPROVED;
          allProposals[proposalIndex].approvedAt = new Date().toISOString();
          
          localStorage.setItem('tribunal_proposals', JSON.stringify(allProposals));
          
          // Disparar evento de actualización
          window.dispatchEvent(new CustomEvent('tribunal_proposal_updated'));
        }
      }
      
      console.log(`✅ Propuesta aprobada: ${proposalId}`);
      
    } catch (error) {
      console.error('Error aprobando propuesta:', error);
    }
  }
  
  /**
   * Rechaza una propuesta
   */
  private static async rejectProposal(proposalId: string): Promise<void> {
    try {
      // Actualizar estado de la propuesta en localStorage
      const storedProposals = localStorage.getItem('tribunal_proposals');
      if (storedProposals) {
        const allProposals = JSON.parse(storedProposals);
        const proposalIndex = allProposals.findIndex((p: any) => p.id === proposalId);
        
        if (proposalIndex !== -1) {
          allProposals[proposalIndex].status = ProposalStatus.REJECTED;
          allProposals[proposalIndex].rejectedAt = new Date().toISOString();
          
          localStorage.setItem('tribunal_proposals', JSON.stringify(allProposals));
          
          // Disparar evento de actualización
          window.dispatchEvent(new CustomEvent('tribunal_proposal_updated'));
        }
      }
      
      console.log(`❌ Propuesta rechazada: ${proposalId}`);
      
    } catch (error) {
      console.error('Error rechazando propuesta:', error);
    }
  }
  
  /**
   * Crea notificaciones para una nueva propuesta
   */
  private static async createNotificationsForProposal(
    proposal: CustomModule,
    votingState: VotingState
  ): Promise<VotingNotification[]> {
    
    const notifications: VotingNotification[] = [];
    
    for (const voter of votingState.voters) {
      const notification: VotingNotification = {
        id: `notif_${proposal.id}_${voter.userId}_${Date.now()}`,
        type: 'new_proposal',
        proposalId: proposal.id,
        proposalTitle: proposal.title,
        recipientId: voter.userId,
        recipientLevel: voter.userLevel,
        message: `Nueva propuesta para votar: "${proposal.title}"`,
        timestamp: new Date(),
        isRead: false,
        priority: 'high',
        actionRequired: true,
        metadata: {
          votingDeadline: votingState.deadline,
          votesRemaining: votingState.votesRemaining,
          totalVotes: votingState.totalVotes,
          approvalPercentage: votingState.approvalPercentage
        }
      };
      
      notifications.push(notification);
    }
    
    return notifications;
  }
  
  /**
   * Crea notificaciones para un voto emitido
   */
  private static async createNotificationsForVote(
    proposalId: string,
    voterId: string,
    vote: VoteType,
    votingState: VotingState
  ): Promise<VotingNotification[]> {
    
    const notifications: VotingNotification[] = [];
    const voter = votingState.voters.find(v => v.userId === voterId);
    
    if (!voter) return notifications;
    
    // Notificar a otros votantes sobre el progreso
    for (const otherVoter of votingState.voters) {
      if (otherVoter.userId !== voterId) {
        const notification: VotingNotification = {
          id: `notif_vote_${proposalId}_${otherVoter.userId}_${Date.now()}`,
          type: 'vote_cast',
          proposalId,
          proposalTitle: '', // Se llenará con el título real
          recipientId: otherVoter.userId,
          recipientLevel: otherVoter.userLevel,
          message: `${voter.userName} ha emitido su voto. ${votingState.votesRemaining} votos restantes.`,
          timestamp: new Date(),
          isRead: false,
          priority: 'medium',
          actionRequired: otherVoter.vote === null,
          metadata: {
            votingDeadline: votingState.deadline,
            votesRemaining: votingState.votesRemaining,
            totalVotes: votingState.totalVotes,
            approvalPercentage: votingState.approvalPercentage
          }
        };
        
        notifications.push(notification);
      }
    }
    
    return notifications;
  }
  
  /**
   * Envía notificaciones
   */
  private static async sendNotifications(notifications: VotingNotification[]): Promise<void> {
    for (const notification of notifications) {
      // Agregar a la lista de notificaciones del usuario
      if (!this.notifications.has(notification.recipientId)) {
        this.notifications.set(notification.recipientId, []);
      }
      
      const userNotifications = this.notifications.get(notification.recipientId)!;
      userNotifications.push(notification);
      
      // Mantener solo las últimas 100 notificaciones por usuario
      if (userNotifications.length > 100) {
        userNotifications.splice(0, userNotifications.length - 100);
      }
      
      // Enviar notificación del navegador si está disponible
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.message, {
          icon: '/images/insignias/6-maestros.png',
          tag: notification.proposalId
        });
      }
    }
  }
  
  /**
   * Programa recordatorios para una propuesta
   */
  private static scheduleReminders(proposalId: string, deadline: Date): void {
    for (const hours of VOTING_SYSTEM_CONFIG.REMINDER_HOURS) {
      const reminderTime = new Date(deadline.getTime() - hours * 60 * 60 * 1000);
      
      if (reminderTime > new Date()) {
        setTimeout(() => {
          this.sendReminderNotification(proposalId, hours);
        }, reminderTime.getTime() - Date.now());
      }
    }
  }
  
  /**
   * Envía notificación de recordatorio
   */
  private static async sendReminderNotification(proposalId: string, hoursRemaining: number): Promise<void> {
    const votingState = this.votingStates.get(proposalId);
    if (!votingState || votingState.isExpired) return;
    
    const pendingVoters = votingState.voters.filter(v => v.vote === null);
    
    for (const voter of pendingVoters) {
      const notification: VotingNotification = {
        id: `reminder_${proposalId}_${voter.userId}_${Date.now()}`,
        type: 'deadline_approaching',
        proposalId,
        proposalTitle: '', // Se llenará con el título real
        recipientId: voter.userId,
        recipientLevel: voter.userLevel,
        message: `Recordatorio: ${hoursRemaining} horas restantes para votar en la propuesta.`,
        timestamp: new Date(),
        isRead: false,
        priority: hoursRemaining <= 1 ? 'critical' : 'high',
        actionRequired: true,
        metadata: {
          votingDeadline: votingState.deadline,
          votesRemaining: votingState.votesRemaining,
          totalVotes: votingState.totalVotes,
          approvalPercentage: votingState.approvalPercentage
        }
      };
      
      await this.sendNotifications([notification]);
    }
  }
  
  /**
   * Configura el procesador de deadlines
   */
  private static setupDeadlineProcessor(): void {
    setInterval(() => {
      this.checkExpiredProposals();
    }, 60000); // Verificar cada minuto
  }
  
  /**
   * Verifica propuestas expiradas
   */
  private static checkExpiredProposals(): void {
    const now = new Date();
    
    for (const [proposalId, votingState] of this.votingStates) {
      if (!votingState.isExpired && now > votingState.deadline) {
        votingState.isExpired = true;
        
        // Si no se alcanzó unanimidad, rechazar
        if (!votingState.isApproved && !votingState.isRejected) {
          votingState.isRejected = true;
          this.rejectProposal(proposalId);
        }
        
        // Notificar expiración
        this.sendExpirationNotifications(proposalId, votingState);
      }
    }
  }
  
  /**
   * Envía notificaciones de expiración
   */
  private static async sendExpirationNotifications(proposalId: string, votingState: VotingState): Promise<void> {
    const notifications: VotingNotification[] = [];
    
    for (const voter of votingState.voters) {
      const notification: VotingNotification = {
        id: `expired_${proposalId}_${voter.userId}_${Date.now()}`,
        type: 'deadline_expired',
        proposalId,
        proposalTitle: '', // Se llenará con el título real
        recipientId: voter.userId,
        recipientLevel: voter.userLevel,
        message: `El plazo de votación ha expirado para la propuesta.`,
        timestamp: new Date(),
        isRead: false,
        priority: 'medium',
        actionRequired: false,
        metadata: {
          votingDeadline: votingState.deadline,
          votesRemaining: votingState.votesRemaining,
          totalVotes: votingState.totalVotes,
          approvalPercentage: votingState.approvalPercentage
        }
      };
      
      notifications.push(notification);
    }
    
    await this.sendNotifications(notifications);
  }
  
  /**
   * Configura el sistema de notificaciones
   */
  private static setupNotificationSystem(): void {
    // Solicitar permisos de notificación
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
  
  /**
   * Carga estados de votación existentes
   */
  private static loadExistingVotingStates(): void {
    // Implementar carga desde localStorage o base de datos
    console.log('📊 Cargando estados de votación existentes...');
  }
  
  /**
   * Notifica a suscriptores sobre cambios
   */
  private static notifySubscribers(proposalId: string, votingState: VotingState): void {
    const subscribers = this.subscribers.get(proposalId);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(votingState);
        } catch (error) {
          console.error('Error notificando suscriptor:', error);
        }
      });
    }
  }
  
  /**
   * Obtiene lista de maestros
   */
  private static async getMaestros(): Promise<Array<{ id: string; name: string; level: number }>> {
    // Implementar obtención de maestros desde la base de datos
    // Por ahora, retornar lista de ejemplo
    return [
      { id: 'maestro1', name: 'Maestro 1', level: 6 },
      { id: 'maestro2', name: 'Maestro 2', level: 6 },
      { id: 'maestro3', name: 'Maestro 3', level: 6 }
    ];
  }
  
  /**
   * Obtiene estadísticas del sistema de votación
   */
  static getVotingStats(): {
    activeProposals: number;
    totalVotes: number;
    pendingVotes: number;
    approvedProposals: number;
    rejectedProposals: number;
    expiredProposals: number;
  } {
    let activeProposals = 0;
    let totalVotes = 0;
    let pendingVotes = 0;
    let approvedProposals = 0;
    let rejectedProposals = 0;
    let expiredProposals = 0;
    
    for (const votingState of this.votingStates.values()) {
      if (!votingState.isExpired && !votingState.isApproved && !votingState.isRejected) {
        activeProposals++;
      }
      
      totalVotes += votingState.votesCast;
      pendingVotes += votingState.votesRemaining;
      
      if (votingState.isApproved) approvedProposals++;
      if (votingState.isRejected) rejectedProposals++;
      if (votingState.isExpired) expiredProposals++;
    }
    
    return {
      activeProposals,
      totalVotes,
      pendingVotes,
      approvedProposals,
      rejectedProposals,
      expiredProposals
    };
  }
}
