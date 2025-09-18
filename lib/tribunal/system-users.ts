// Configuración centralizada de usuarios del sistema del Tribunal Imperial
// Este archivo se conecta a la base de datos real para obtener usuarios que pueden votar

import { supabase } from '@/lib/supabaseClient';

export interface SystemUser {
  id: string;
  nickname: string;
  email: string;
  level: number;
  role: string;
  description: string;
}

// Función para obtener usuarios reales de la base de datos
export const fetchSystemUsers = async (): Promise<SystemUser[]> => {
  try {
    console.log('🔍 Obteniendo usuarios del sistema desde la base de datos...');
    
    // Consultar usuarios con nivel 5 o superior (Darth y Maestros que pueden votar)
    const { data, error } = await supabase
      .from('users')
      .select('id, nickname, email, user_level')
      .gte('user_level', 5)
      .order('user_level', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener usuarios del sistema:', error);
      // Fallback a usuarios fundadores conocidos si hay error en la base de datos
      return getFallbackUsers();
    }

    if (data && data.length > 0) {
      console.log('✅ Usuarios obtenidos de la base de datos:', data);
      
      // Convertir datos de la base de datos al formato SystemUser
      const systemUsers: SystemUser[] = data.map(user => ({
        id: user.id,
        nickname: user.nickname || user.email?.split('@')[0] || 'Usuario',
        email: user.email,
        level: user.user_level,
        role: getUserRole(user.user_level),
        description: getUserDescription(user.user_level, user.nickname || user.email)
      }));

      return systemUsers;
    } else {
      console.log('⚠️ No se encontraron usuarios en la base de datos, usando fallback');
      return getFallbackUsers();
    }

  } catch (error) {
    console.error('❌ Error inesperado al obtener usuarios:', error);
    return getFallbackUsers();
  }
};

// Función para obtener usuarios que pueden votar (nivel 5 o superior)
export const getVotingUsers = async (): Promise<SystemUser[]> => {
  try {
    const users = await fetchSystemUsers();
    // Asegurar que siempre devolvemos un array válido
    return Array.isArray(users) ? users : getFallbackUsers();
  } catch (error) {
    console.error('❌ Error en getVotingUsers:', error);
    return getFallbackUsers();
  }
};

// Función para obtener el total de usuarios del sistema
export const getTotalSystemUsers = async (): Promise<number> => {
  const users = await fetchSystemUsers();
  return users.length;
};

// Función para obtener usuarios por nivel mínimo
export const getUsersByMinLevel = async (minLevel: number): Promise<SystemUser[]> => {
  const users = await fetchSystemUsers();
  return users.filter(user => user.level >= minLevel);
};

// Función para obtener usuarios por rol
export const getUsersByRole = async (role: string): Promise<SystemUser[]> => {
  const users = await fetchSystemUsers();
  return users.filter(user => user.role === role);
};

// Función para buscar usuario por email
export const getUserByEmail = async (email: string): Promise<SystemUser | undefined> => {
  const users = await fetchSystemUsers();
  return users.find(user => user.email === email);
};

// Función para obtener estadísticas de usuarios
export const getUserStats = async () => {
  const users = await fetchSystemUsers();
  const total = users.length;
  const fundadores = users.filter(u => u.level === 6).length;
  const maestros = users.filter(u => u.level === 6).length;
  const darths = users.filter(u => u.level === 5).length;
  const lords = users.filter(u => u.level === 4).length;
  
  return {
    total,
    fundadores,
    maestros,
    darths,
    lords,
    canVote: users.length
  };
};

// Funciones auxiliares para fallback y mapeo de roles
const getUserRole = (level: number): string => {
  switch (level) {
    case 6: return 'Fundador/Maestro';
    case 5: return 'Darth';
    case 4: return 'Lord';
    case 3: return 'Warrior';
    case 2: return 'Acólito';
    case 1: return 'Iniciado';
    default: return 'Usuario';
  }
};

const getUserDescription = (level: number, nickname: string): string => {
  switch (level) {
    case 6: return `${nickname} - Fundador/Maestro del sistema con acceso completo`;
    case 5: return `${nickname} - Darth del sistema con acceso de votación`;
    case 4: return `${nickname} - Lord del sistema con acceso limitado`;
    case 3: return `${nickname} - Warrior del sistema`;
    case 2: return `${nickname} - Acólito del sistema`;
    case 1: return `${nickname} - Iniciado del sistema`;
    default: return `${nickname} - Usuario del sistema`;
  }
};

// Usuarios de fallback solo para casos de emergencia
const getFallbackUsers = (): SystemUser[] => {
  return [
    {
      id: 'fundador1',
      nickname: 'Darth Luke',
      email: 'coeurdeluke.js@gmail.com',
      level: 6,
      role: 'Fundador/Maestro',
      description: 'Fundador principal del sistema Crypto Force'
    },
    {
      id: 'fundador2',
      nickname: 'Darth Nihilus',
      email: 'infocryptoforce@gmail.com',
      level: 6,
      role: 'Fundador/Maestro',
      description: 'Fundador secundario del sistema Crypto Force - Absolute Authority'
    }
  ];
};
