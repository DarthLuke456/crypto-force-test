// Sistema de Auto-aprobación para Tribunal Imperial

export interface TribunalProposal {
  id: string;
  title: string;
  subtitle?: string;
  content: any[];
  authorEmail?: string;
  authorId: string;
  status: 'pending' | 'approved' | 'rejected';
  level?: number;
  category?: 'theoretical' | 'practical';
  createdAt: string | Date;
  approvedAt?: string | Date;
  rejectedAt?: string | Date;
  rejectionReason?: string;
  description?: string;
  targetHierarchy?: string;
  authorName?: string;
  authorLevel?: number;
  votes?: any[];
}

// Emails de usuarios fundadores que tienen auto-aprobación
const FOUNDER_EMAILS = [
  'coeurdeluke.js@gmail.com',
  'infocryptoforce@gmail.com'
];

// Función para verificar si un usuario es fundador
export function isFounderUser(email: string): boolean {
  return FOUNDER_EMAILS.includes(email.toLowerCase().trim());
}

// Función para procesar auto-aprobación
export function processAutoApproval(proposal: TribunalProposal): TribunalProposal {
  if (proposal.authorEmail && isFounderUser(proposal.authorEmail)) {
    return {
      ...proposal,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      level: proposal.level || 1,
      category: proposal.category || 'theoretical'
    };
  }
  
  return proposal;
}

// Función para verificar si una propuesta debe ser auto-aprobada
export function shouldAutoApprove(authorEmail: string): boolean {
  return isFounderUser(authorEmail);
}

// Función para obtener el nivel de auto-aprobación
export function getAutoApprovalLevel(email: string): number {
  if (email === 'coeurdeluke.js@gmail.com') return 0; // Maestro Fundador
  if (email === 'infocryptoforce@gmail.com') return 0; // Maestro Fundador
  return -1; // No es fundador
}

// Función para crear notificación de auto-aprobación
export function createAutoApprovalNotification(proposal: TribunalProposal) {
  return {
    type: 'auto_approval',
    message: `Propuesta "${proposal.title}" aprobada automáticamente por ser usuario fundador`,
    proposalId: proposal.id,
    timestamp: new Date().toISOString(),
    authorEmail: proposal.authorEmail
  };
}
