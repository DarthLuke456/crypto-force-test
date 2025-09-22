// =====================================================
// UTILIDADES PARA DASHBOARDS Y REDIRECCIÓN
// =====================================================

export interface UserData {
  user_level?: number;
  email?: string;
  nickname?: string;
}

// Lista de emails autorizados para acceder a la dashboard de Maestro
export const MAESTRO_AUTHORIZED_EMAILS = [
  'infocryptoforce@gmail.com',
  'coeurdeluke.js@gmail.com'
];

// Mapeo de niveles a dashboards
export const LEVEL_TO_DASHBOARD = {
  0: '/dashboard/maestro', // Fundador tiene acceso a Maestro
  1: '/dashboard/iniciado',
  2: '/dashboard/acolito', 
  3: '/dashboard/warrior',
  4: '/dashboard/lord',
  5: '/dashboard/darth',
  6: '/dashboard/maestro'
} as const;

/**
 * Determina el dashboard de nivel más alto al que tiene acceso el usuario
 * @param userData - Datos del usuario
 * @returns Ruta del dashboard de nivel más alto
 */
export function getHighestLevelDashboard(userData: UserData | null): string {
  if (!userData) {
    console.log('🔍 getHighestLevelDashboard - No hay userData, retornando iniciado');
    return '/dashboard/iniciado';
  }

  // Verificar si es usuario fundador por email
  const isFundadorByEmail = userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim());
  
  if (isFundadorByEmail) {
    console.log('👑 getHighestLevelDashboard - Usuario fundador detectado, retornando maestro');
    return '/dashboard/maestro';
  }

  // Usar el nivel del usuario o 1 por defecto
  const userLevel = userData.user_level || 1;
  const dashboard = LEVEL_TO_DASHBOARD[userLevel as keyof typeof LEVEL_TO_DASHBOARD] || '/dashboard/iniciado';
  
  console.log('🔍 getHighestLevelDashboard - Usuario nivel', userLevel, 'retornando', dashboard);
  return dashboard;
}

/**
 * Obtiene la ruta del perfil para un dashboard específico
 * @param dashboardPath - Ruta del dashboard
 * @returns Ruta del perfil correspondiente
 */
export function getProfilePath(dashboardPath: string): string {
  // Si ya es una ruta de perfil, devolverla tal como está
  if (dashboardPath.includes('/perfil')) {
    return dashboardPath;
  }

  // Agregar /perfil al final de la ruta del dashboard
  const profilePath = `${dashboardPath}/perfil`;
  console.log('🔍 getProfilePath - Dashboard:', dashboardPath, 'Perfil:', profilePath);
  return profilePath;
}

/**
 * Obtiene la ruta del perfil basada en el nivel del usuario
 * @param userLevel - Nivel del usuario
 * @returns Ruta del perfil correspondiente
 */
export function getProfilePathByLevel(userLevel: number): string {
  const dashboard = LEVEL_TO_DASHBOARD[userLevel as keyof typeof LEVEL_TO_DASHBOARD] || '/dashboard/iniciado';
  const profilePath = `${dashboard}/perfil`;
  console.log('🔍 getProfilePathByLevel - Nivel:', userLevel, 'Perfil:', profilePath);
  return profilePath;
}

/**
 * Obtiene la ruta completa del perfil para el usuario
 * @param userData - Datos del usuario
 * @returns Ruta completa del perfil
 */
export function getUserProfilePath(userData: UserData | null): string {
  console.log('🔍 [getUserProfilePath] Iniciando función');
  console.log('🔍 [getUserProfilePath] userData recibido:', userData);
  
  if (!userData) {
    console.log('🔍 [getUserProfilePath] No hay userData, retornando iniciado/perfil');
    return '/dashboard/iniciado/perfil';
  }

  // Verificar si es usuario fundador por email
  const isFundadorByEmail = userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim());
  console.log('🔍 [getUserProfilePath] isFundadorByEmail:', isFundadorByEmail);
  console.log('🔍 [getUserProfilePath] userData.email:', userData.email);
  console.log('🔍 [getUserProfilePath] MAESTRO_AUTHORIZED_EMAILS:', MAESTRO_AUTHORIZED_EMAILS);
  
  if (isFundadorByEmail) {
    console.log('👑 [getUserProfilePath] Usuario fundador, retornando maestro/perfil');
    return '/dashboard/maestro/perfil';
  }

  // Usar el nivel del usuario o 1 por defecto
  const userLevel = userData.user_level || 1;
  console.log('🔍 [getUserProfilePath] userLevel:', userLevel);
  
  // Verificar si es nivel 0 (Fundador) - acceso directo a Maestro
  if (userLevel === 0) {
    console.log('👑 [getUserProfilePath] Usuario nivel 0 (Fundador), retornando maestro/perfil');
    return '/dashboard/maestro/perfil';
  }
  
  const profilePath = getProfilePathByLevel(userLevel);
  
  console.log('🔍 [getUserProfilePath] Usuario:', userData.nickname, 'Nivel:', userLevel, 'Perfil:', profilePath);
  return profilePath;
}

/**
 * Verifica si un usuario puede acceder a un nivel específico
 * @param userData - Datos del usuario
 * @param targetLevel - Nivel objetivo
 * @returns true si puede acceder, false si no
 */
export function canAccessLevel(userData: UserData | null, targetLevel: number): boolean {
  if (!userData) return false;

  // Verificar si es usuario fundador por email
  const isFundadorByEmail = userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim());
  
  // Fundadores tienen acceso a TODOS los niveles
  if (isFundadorByEmail) {
    console.log('👑 canAccessLevel - Usuario fundador detectado, acceso total');
    return true;
  }
  
  // También verificar por nivel 0 (Fundador) o 6 (Maestro)
  if (userData.user_level === 0 || userData.user_level === 6) {
    console.log('👑 canAccessLevel - Usuario nivel', userData.user_level, 'acceso total');
    return true;
  }
  
  // Otros usuarios solo pueden acceder a su nivel y niveles inferiores
  const userLevel = userData.user_level || 1;
  const canAccess = targetLevel <= userLevel;
  console.log('🔍 canAccessLevel - Usuario nivel', userLevel, 'target', targetLevel, 'acceso:', canAccess);
  return canAccess;
}

/**
 * Obtiene el nombre del nivel para mostrar
 * @param userData - Datos del usuario
 * @returns Nombre del nivel
 */
export function getLevelDisplayName(userData: UserData | null): string {
  if (!userData) return 'Iniciado';
  
  // Para usuarios fundadores específicos, mostrar "Fundador"
  if (userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim())) {
    return 'Fundador';
  }
  
  // Para otros usuarios, usar el nivel normal
  const level = userData.user_level || 1;
  const levelNames = {
    0: 'Fundador', // Nivel 0 para fundadores
    1: 'Iniciado',
    2: 'Acólito', 
    3: 'Warrior',
    4: 'Lord',
    5: 'Darth',
    6: 'Maestro'
  };
  
  return levelNames[level as keyof typeof levelNames] || 'Iniciado';
}
