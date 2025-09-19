// Sistema de Permisos del TRIBUNAL IMPERIAL

import { TribunalPermissions, ProposalStatus, VoteType } from './types';

// Email del único Maestro con poder de aprobación (Darth Nihilus - Absolute Authority)
const SUPREME_MAESTRO_EMAIL = 'infocryptoforce@gmail.com';

// Email temporal para testing (coeurdeluke.js@gmail.com) - Temporary authority only
const TESTING_MAESTRO_EMAIL = 'coeurdeluke.js@gmail.com';

// Configuración de permisos por nivel de usuario
export const TRIBUNAL_PERMISSIONS = {
  // Nivel 0: Maestro Fundador
  0: {
    canCreateProposals: true,
    canVoteOnProposals: true,
    canRejectProposals: true,
    canApproveProposals: true,
    canViewAllProposals: true,
    canEditOwnProposals: true,
    canDeleteOwnProposals: true,
    canViewTribunalStats: true,
    canManageTribunalSettings: true,
  },
  
  // Nivel 1: Iniciado
  1: {
    canCreateProposals: false,
    canVoteOnProposals: false,
    canRejectProposals: false,
    canApproveProposals: false,
    canViewAllProposals: false,
    canEditOwnProposals: false,
    canDeleteOwnProposals: false,
    canViewTribunalStats: false,
    canManageTribunalSettings: false,
  },
  
  // Nivel 2: Acólito
  2: {
    canCreateProposals: false,
    canVoteOnProposals: false,
    canRejectProposals: false,
    canApproveProposals: false,
    canViewAllProposals: false,
    canEditOwnProposals: false,
    canDeleteOwnProposals: false,
    canViewTribunalStats: false,
    canManageTribunalSettings: false,
  },
  
  // Nivel 3: Warrior
  3: {
    canCreateProposals: false,
    canVoteOnProposals: false,
    canRejectProposals: false,
    canApproveProposals: false,
    canViewAllProposals: false,
    canEditOwnProposals: false,
    canDeleteOwnProposals: false,
    canViewTribunalStats: false,
    canManageTribunalSettings: false,
  },
  
  // Nivel 4: Lord
  4: {
    canCreateProposals: false,
    canVoteOnProposals: false,
    canRejectProposals: false,
    canApproveProposals: false,
    canViewAllProposals: false,
    canEditOwnProposals: false,
    canDeleteOwnProposals: false,
    canViewTribunalStats: false,
    canManageTribunalSettings: false,
  },
  
  // Nivel 5: Darth
  5: {
    canCreateProposals: true,
    canVoteOnProposals: false,
    canRejectProposals: false,
    canApproveProposals: false,
    canViewAllProposals: true,
    canEditOwnProposals: true,
    canDeleteOwnProposals: true,
    canViewTribunalStats: true,
    canManageTribunalSettings: false,
  },
  
  // Nivel 6: Maestro
  6: {
    canCreateProposals: true,
    canVoteOnProposals: true,
    canRejectProposals: true,
    canApproveProposals: true,
    canViewAllProposals: true,
    canEditOwnProposals: true,
    canDeleteOwnProposals: true,
    canViewTribunalStats: true,
    canManageTribunalSettings: true,
  },
};

// Función para obtener permisos del usuario
export function getUserTribunalPermissions(userLevel: number): TribunalPermissions {
  return TRIBUNAL_PERMISSIONS[userLevel as keyof typeof TRIBUNAL_PERMISSIONS] || TRIBUNAL_PERMISSIONS[1];
}

// Función para verificar si un usuario puede realizar una acción específica
export function canUserPerformAction(
  userLevel: number, 
  action: keyof TribunalPermissions
): boolean {
  const permissions = getUserTribunalPermissions(userLevel);
  return permissions[action];
}

// Función para verificar si un usuario puede votar en una propuesta
export function canUserVote(userLevel: number): boolean {
  return canUserPerformAction(userLevel, 'canVoteOnProposals');
}

// Función para verificar si un usuario puede crear propuestas
export function canUserCreateProposals(userLevel: number): boolean {
  return canUserPerformAction(userLevel, 'canCreateProposals');
}

// Función para verificar si un usuario puede aprobar propuestas
export function canUserApproveProposals(userLevel: number): boolean {
  return canUserPerformAction(userLevel, 'canApproveProposals');
}

// Función para verificar si un usuario puede rechazar propuestas
export function canUserRejectProposals(userLevel: number): boolean {
  return canUserPerformAction(userLevel, 'canRejectProposals');
}

// Función para verificar si un usuario puede ver estadísticas del tribunal
export function canUserViewTribunalStats(userLevel: number): boolean {
  return canUserPerformAction(userLevel, 'canViewTribunalStats');
}

// Función para verificar si un usuario puede gestionar configuraciones del tribunal
export function canUserManageTribunalSettings(userLevel: number): boolean {
  return canUserPerformAction(userLevel, 'canManageTribunalSettings');
}

// Función para verificar si un usuario puede editar una propuesta específica
export function canUserEditProposal(
  userLevel: number, 
  proposalAuthorId: string, 
  currentUserId: string
): boolean {
  // Solo pueden editar sus propias propuestas
  if (proposalAuthorId === currentUserId) {
    return canUserPerformAction(userLevel, 'canEditOwnProposals');
  }
  return false;
}

// Función para verificar si un usuario puede eliminar una propuesta específica
export function canUserDeleteProposal(
  userLevel: number, 
  proposalAuthorId: string, 
  currentUserId: string
): boolean {
  // Solo pueden eliminar sus propias propuestas
  if (proposalAuthorId === currentUserId) {
    return canUserPerformAction(userLevel, 'canDeleteOwnProposals');
  }
  return false;
}

// Función para verificar si un usuario puede ver todas las propuestas
export function canUserViewAllProposals(userLevel: number): boolean {
  return canUserPerformAction(userLevel, 'canViewAllProposals');
}

// Función para verificar si un usuario puede acceder al tribunal imperial
export function canUserAccessTribunal(userLevel: number): boolean {
  // Solo Maestros Fundadores (0), Darths (5) y Maestros (6) pueden acceder
  return userLevel === 0 || userLevel >= 5;
}

// Función para verificar si un usuario es miembro del tribunal
export function isUserTribunalMember(userLevel: number): boolean {
  // Solo Maestros son miembros del tribunal
  return userLevel === 6;
}

// Función para verificar si un usuario puede ser notificado sobre propuestas
export function canUserReceiveProposalNotifications(userLevel: number): boolean {
  // Solo Maestros reciben notificaciones sobre propuestas
  return userLevel === 6;
}

// Función para verificar si un usuario puede ver el historial completo del tribunal
export function canUserViewTribunalHistory(userLevel: number): boolean {
  // Solo Maestros pueden ver el historial completo
  return userLevel === 6;
}

// Función para verificar si un usuario puede exportar reportes del tribunal
export function canUserExportTribunalReports(userLevel: number): boolean {
  // Solo Maestros pueden exportar reportes
  return userLevel === 6;
}

// Función para verificar si un usuario puede gestionar otros usuarios del tribunal
export function canUserManageTribunalUsers(userLevel: number): boolean {
  // Solo Maestros pueden gestionar usuarios del tribunal
  return userLevel === 6;
}

// Función para verificar si un usuario puede ver logs de auditoría
export function canUserViewAuditLogs(userLevel: number): boolean {
  // Solo Maestros pueden ver logs de auditoría
  return userLevel === 6;
}

// Función para verificar si un usuario puede crear plantillas de contenido
export function canUserCreateContentTemplates(userLevel: number): boolean {
  // Solo Darths y Maestros pueden crear plantillas
  return userLevel >= 5;
}

// Función para verificar si un usuario puede usar plantillas de contenido
export function canUserUseContentTemplates(userLevel: number): boolean {
  // Solo Darths y Maestros pueden usar plantillas
  return userLevel >= 5;
}

// Función para verificar si un usuario puede ver contenido aprobado
export function canUserViewApprovedContent(userLevel: number): boolean {
  // Todos los usuarios pueden ver contenido aprobado
  return userLevel >= 1;
}

// Función para verificar si un usuario puede ver contenido rechazado
export function canUserViewRejectedContent(userLevel: number): boolean {
  // Solo Darths y Maestros pueden ver contenido rechazado
  return userLevel >= 5;
}

// Función para verificar si un usuario puede comentar en propuestas
export function canUserCommentOnProposals(userLevel: number): boolean {
  // Solo Maestros pueden comentar en propuestas
  return userLevel === 6;
}

// Función para verificar si un usuario puede solicitar revisión de propuestas rechazadas
export function canUserRequestProposalRevision(userLevel: number): boolean {
  // Solo Darths y Maestros pueden solicitar revisiones
  return userLevel >= 5;
}

// Función para verificar si un usuario es el Maestro Supremo (único que puede aprobar)
export function isSupremeMaestro(userEmail: string): boolean {
  return userEmail === SUPREME_MAESTRO_EMAIL;
}

// Función para verificar si un usuario es el Maestro de Testing (puede votar temporalmente)
export function isTestingMaestro(userEmail: string): boolean {
  return userEmail === TESTING_MAESTRO_EMAIL;
}

// Función para verificar si un usuario puede aprobar propuestas (solo el Maestro Supremo)
export function canUserApproveProposalsByEmail(userEmail: string): boolean {
  return isSupremeMaestro(userEmail);
}

// Función para verificar si un usuario puede votar en propuestas (Maestro Supremo + Testing temporal)
export function canUserVoteByEmail(userEmail: string): boolean {
  return isSupremeMaestro(userEmail) || isTestingMaestro(userEmail);
}

// Función para verificar si un usuario puede rechazar propuestas (solo el Maestro Supremo)
export function canUserRejectProposalsByEmail(userEmail: string): boolean {
  return isSupremeMaestro(userEmail);
}

// Función para verificar si un usuario tiene autoridad absoluta (Darth Nihilus - Absolute Authority, Darth Luke - Temporary)
export function hasAbsoluteAuthority(userEmail: string): boolean {
  return isSupremeMaestro(userEmail) || isTestingMaestro(userEmail);
}

// Función para verificar si un usuario puede gestionar contenido aprobado
export function canUserManageApprovedContent(userEmail: string): boolean {
  return hasAbsoluteAuthority(userEmail);
}

// Función para verificar si un usuario puede editar cualquier propuesta
export function canUserEditAnyProposal(userEmail: string): boolean {
  return hasAbsoluteAuthority(userEmail);
}

// Función para verificar si un usuario puede eliminar cualquier propuesta
export function canUserDeleteAnyProposal(userEmail: string): boolean {
  return hasAbsoluteAuthority(userEmail);
}

// Función para verificar si un usuario puede aprobar/rechazar cualquier propuesta
export function canUserApproveRejectAnyProposal(userEmail: string): boolean {
  return hasAbsoluteAuthority(userEmail);
}
