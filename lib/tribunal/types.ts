// Tipos para el TRIBUNAL IMPERIAL

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'link' | 'code' | 'quote' | 'divider' | 'checklist' | 'carousel';
  content: any;
  order: number;
  metadata?: {
    width?: string;
    height?: string;
    alignment?: 'left' | 'center' | 'right';
    textWrap?: 'left' | 'right' | 'none';
    caption?: string;
    alt?: string;
    url?: string;
    language?: string;
    text?: string;
    author?: string;
    fileName?: string;
    fileType?: string;
    fontSize?: string;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderlined?: boolean;
    showResizeMenu?: boolean;
    showCustomValues?: boolean;
  };
}

export interface CustomModule {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorLevel: number; // 5 = Darth, 6 = Maestro
  targetLevels: number[]; // [1,2,3,4,5,6] - niveles que pueden verlo
  category: 'theoretical' | 'practical' | 'mixed' | 'checkpoint';
  content: ContentBlock[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // en minutos
  prerequisites: string[];
}

export interface TribunalProposal {
  id: string;
  module: CustomModule;
  status: ProposalStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  votes: TribunalVote[];
  totalVotes: number;
  requiredVotes: number; // Total de Maestros activos
  unanimousApproval: boolean;
  rejectionReason?: string;
  rejectionAuthorId?: string;
  rejectionAuthorName?: string;
  rejectionDate?: Date;
}

export interface TribunalVote {
  id: string;
  maestrosId: string;
  maestrosName: string;
  maestrosLevel: number;
  vote: VoteType;
  comment?: string;
  votedAt: Date;
}

export interface TribunalStats {
  propuestasPendientes: number;
  propuestasAprobadas: number;
  propuestasRechazadas: number;
  maestrosActivos: number;
  propuestasEnRevision: number;
  tiempoPromedioAprobacion: number; // en horas
}

export interface TribunalMember {
  id: string;
  name: string;
  email: string;
  level: number; // Solo Maestros (nivel 6)
  isActive: boolean;
  joinedAt: Date;
  lastActiveAt: Date;
  totalVotes: number;
  approvedVotes: number;
  rejectedVotes: number;
  reputation: number; // Puntuación basada en decisiones
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  structure: ContentBlock[];
  category: 'theoretical' | 'practical' | 'mixed' | 'checkpoint';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  tags: string[];
  usageCount: number;
  createdAt: Date;
  createdBy: string;
}

export interface TribunalNotification {
  id: string;
  recipientId: string;
  type: 'proposal_submitted' | 'vote_required' | 'proposal_approved' | 'proposal_rejected' | 'comment_added';
  title: string;
  message: string;
  proposalId?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface TribunalSettings {
  requireUnanimousApproval: boolean; // true = todos deben aprobar
  allowAbstention: boolean; // true = pueden abstenerse
  autoExpireProposals: boolean; // true = propuestas expiran automáticamente
  proposalExpirationDays: number; // días para expirar
  requireCommentOnRejection: boolean; // true = comentario obligatorio al rechazar
  minVotesForApproval: number; // mínimo de votos para aprobar
  allowMultipleRevisions: boolean; // true = pueden reenviar propuestas rechazadas
  maxRevisionAttempts: number; // máximo de intentos de revisión
}

// Enums para estados y tipos
export enum ProposalStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum VoteType {
  APPROVE = 'approve',
  REJECT = 'reject',
  ABSTAIN = 'abstain'
}

export enum ContentCategory {
  THEORETICAL = 'theoretical',
  PRACTICAL = 'practical',
  MIXED = 'mixed',
  CHECKPOINT = 'checkpoint'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

// Tipos para el sistema de permisos
export interface TribunalPermissions {
  canCreateProposals: boolean;
  canVoteOnProposals: boolean;
  canRejectProposals: boolean;
  canApproveProposals: boolean;
  canViewAllProposals: boolean;
  canEditOwnProposals: boolean;
  canDeleteOwnProposals: boolean;
  canViewTribunalStats: boolean;
  canManageTribunalSettings: boolean;
}

// Tipos para el sistema de auditoría
export interface TribunalAuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userLevel: number;
  targetId?: string;
  targetType?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Tipos para el sistema de reportes
export interface TribunalReport {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any;
  generatedAt: Date;
  generatedBy: string;
  format: 'json' | 'csv' | 'pdf';
}
