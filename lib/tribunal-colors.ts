/**
 * Sistema de colores para el Tribunal Imperial
 * Define los colores específicos para cada nivel de usuario
 */

export interface TribunalColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  button: {
    background: string;
    text: string;
    hover: string;
  };
  card: {
    background: string;
    border: string;
    shadow: string;
  };
}

export const TRIBUNAL_COLORS: Record<number, TribunalColorScheme> = {
  // Nivel 0: Fundador - Naranja
  0: {
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#c2410c',
    background: '#121212',
    text: '#fafafa',
    border: '#f97316',
    button: {
      background: '#f97316',
      text: '#fafafa',
      hover: '#ea580c'
    },
    card: {
      background: '#121212',
      border: '#f97316',
      shadow: '0 4px 6px -1px rgba(249, 115, 22, 0.1)'
    }
  },
  
  // Nivel 1: Iniciado - #fafafa puro
  1: {
    primary: '#fafafa',
    secondary: '#e5e5e5',
    accent: '#d4d4d4',
    background: '#121212',
    text: '#fafafa',
    border: '#fafafa',
    button: {
      background: '#fafafa',
      text: '#121212',
      hover: '#e5e5e5'
    },
    card: {
      background: '#121212',
      border: '#fafafa',
      shadow: '0 4px 6px -1px rgba(250, 250, 250, 0.1)'
    }
  },
  
  // Nivel 2: Acólito - Amarillo
  2: {
    primary: '#FFD447',
    secondary: '#FFC107',
    accent: '#FFB300',
    background: '#121212',
    text: '#fafafa',
    border: '#FFD447',
    button: {
      background: '#FFD447',
      text: '#121212',
      hover: '#FFC107'
    },
    card: {
      background: '#121212',
      border: '#FFD447',
      shadow: '0 4px 6px -1px rgba(255, 212, 71, 0.1)'
    }
  },
  
  // Nivel 3: Warrior - Verde
  3: {
    primary: '#4ade80',
    secondary: '#22c55e',
    accent: '#16a34a',
    background: '#121212',
    text: '#fafafa',
    border: '#4ade80',
    button: {
      background: '#4ade80',
      text: '#121212',
      hover: '#22c55e'
    },
    card: {
      background: '#121212',
      border: '#4ade80',
      shadow: '0 4px 6px -1px rgba(74, 222, 128, 0.1)'
    }
  },
  
  // Nivel 4: Lord - Azul
  4: {
    primary: '#60a5fa',
    secondary: '#3b82f6',
    accent: '#2563eb',
    background: '#121212',
    text: '#fafafa',
    border: '#60a5fa',
    button: {
      background: '#60a5fa',
      text: '#121212',
      hover: '#3b82f6'
    },
    card: {
      background: '#121212',
      border: '#60a5fa',
      shadow: '0 4px 6px -1px rgba(96, 165, 250, 0.1)'
    }
  },
  
  // Nivel 5: Darth - Rojo
  5: {
    primary: '#ec4d58',
    secondary: '#dc2626',
    accent: '#b91c1c',
    background: '#121212',
    text: '#fafafa',
    border: '#ec4d58',
    button: {
      background: '#ec4d58',
      text: '#fafafa',
      hover: '#dc2626'
    },
    card: {
      background: '#121212',
      border: '#ec4d58',
      shadow: '0 4px 6px -1px rgba(236, 77, 88, 0.1)'
    }
  },
  
  // Nivel 6: Maestro - Gris
  6: {
    primary: '#8a8a8a',
    secondary: '#6b7280',
    accent: '#4b5563',
    background: '#121212',
    text: '#fafafa',
    border: '#8a8a8a',
    button: {
      background: '#8a8a8a',
      text: '#121212',
      hover: '#6b7280'
    },
    card: {
      background: '#121212',
      border: '#8a8a8a',
      shadow: '0 4px 6px -1px rgba(138, 138, 138, 0.1)'
    }
  }
};

/**
 * Obtiene el esquema de colores para un nivel específico
 */
export function getTribunalColors(level: number): TribunalColorScheme {
  return TRIBUNAL_COLORS[level] || TRIBUNAL_COLORS[1]; // Fallback a Iniciado
}

/**
 * Obtiene el nombre del nivel
 */
export function getLevelName(level: number): string {
  const names: Record<number, string> = {
    0: 'Fundador',
    1: 'Iniciado',
    2: 'Acólito', 
    3: 'Warrior',
    4: 'Lord',
    5: 'Darth',
    6: 'Maestro'
  };
  return names[level] || 'Iniciado';
}

/**
 * Obtiene el emoji del nivel
 */
export function getLevelEmoji(level: number): string {
  const emojis: Record<number, string> = {
    0: '⭐',
    1: '👤',
    2: '🔮',
    3: '⚔️',
    4: '👑',
    5: '💀',
    6: '👨‍🏫'
  };
  return emojis[level] || '👤';
}

/**
 * Obtiene la descripción del nivel
 */
export function getLevelDescription(level: number): string {
  const descriptions: Record<number, string> = {
    0: 'Fundador del sistema, creador de la metodología',
    1: 'El primer paso en tu journey de trading',
    2: 'Desarrollando habilidades avanzadas',
    3: 'Dominando las técnicas de mercado',
    4: 'Liderando con conocimiento',
    5: 'Maestría en el arte del trading',
    6: 'Enseñando a la próxima generación'
  };
  return descriptions[level] || 'El primer paso en tu journey de trading';
}
