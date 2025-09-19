'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  BookOpen, 
  TrendingUp, 
  CheckCircle, 
  Cog, 
  Target, 
  Crown, 
  Network, 
  DollarSign, 
  Wrench, 
  Play, 
  Brain, 
  Shield, 
  BarChart3, 
  Lock, 
  Flag, 
  Medal, 
  User, 
  Clock, 
  Trophy, 
  ListChecks, 
  AlertTriangle, 
  Calendar, 
  LogOut, 
  Star,
  Bitcoin,
  RefreshCw
} from 'lucide-react';
import EnhancedCarousel from './components/EnhancedCarousel';
import ProgressRuler from './components/ProgressRuler';
import { useProgress } from '@/context/ProgressContext';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useSafeAuth } from '@/context/AuthContext';
import EnhancedModuloCarousel from './components/EnhancedModuloCarousel';
import DynamicCarousel from './components/DynamicCarousel';
import { useDynamicModules } from '@/hooks/useDynamicModules';
import TribunalContentInjector from '@/components/tribunal/TribunalContentInjector';

interface Module {
  id: string;
  title: string;
  path: string;
  icon: React.JSX.Element;
  description: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  level: 'nivel1' | 'nivel2';
  type: 'content' | 'checkpoint';
  moduleNumber: number;
}

interface Objective {
  id: string;
  title: string;
  type: 'nivel1' | 'nivel2' | 'checkpoints' | 'progress';
  category: 'theoretical' | 'practical' | 'general' | 'all';
  completed: boolean;
}

// Módulos Teóricos Base (4 módulos)
const theoreticalModulesBase: Module[] = [
  {
    id: '1',
    title: 'Introducción a la Lógica Económica',
    path: '/dashboard/iniciado/Teorico/1-introduccion-logica-economica',
    icon: <Brain />,
    description: 'Fundamentos de la lógica económica y toma de decisiones',
    isLocked: false,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 1
  },
  {
    id: '2',
    title: 'Fuerzas del Mercado',
    path: '/dashboard/iniciado/Teorico/2-fuerzas-mercado',
    icon: <TrendingUp />,
    description: 'Oferta, demanda y equilibrio del mercado',
    isLocked: false,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 2
  },
  {
    id: '3',
    title: 'Acción del Gobierno en los Mercados',
    path: '/dashboard/iniciado/Teorico/3-accion-gobierno-mercados',
    icon: <Shield />,
    description: 'Intervención gubernamental y regulaciones',
    isLocked: true,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 3
  },
  {
    id: '4',
    title: 'Competencia Perfecta',
    path: '/dashboard/iniciado/Teorico/4-competencia-perfecta',
    icon: <Target />,
    description: 'Análisis de mercados en competencia perfecta',
    isLocked: true,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 4
  }
];

// Módulos Teóricos Nivel 2 (4 módulos)
const theoreticalModulesNivel2: Module[] = [
  {
    id: '5',
    title: 'Monopolio y Oligopolio',
    path: '/dashboard/iniciado/Teorico/5-monopolio-oligopolio',
    icon: <Crown />,
    description: 'Análisis de mercados con poder de mercado concentrado',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 5
  },
  {
    id: '6',
    title: 'Tecnología Blockchain',
    path: '/dashboard/iniciado/Teorico/6-tecnologia-blockchain',
    icon: <Shield />,
    description: 'Fundamentos de la tecnología blockchain y criptomonedas',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 6
  },
  {
    id: '7',
    title: 'Criptomonedas',
    path: '/dashboard/iniciado/Teorico/7-criptomonedas',
    icon: <Bitcoin />,
    description: 'Análisis fundamental de criptomonedas y tokens',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 7
  },
  {
    id: '8',
    title: 'Operaciones con Criptomonedas',
    path: '/dashboard/iniciado/Teorico/8-operaciones-criptomonedas',
    icon: <TrendingUp />,
    description: 'Técnicas avanzadas de trading en criptomonedas',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 8
  }
];

// Puntos de Control Teóricos (4 puntos de control)
const theoreticalCheckpoints: Module[] = [
  {
    id: 'PC1',
    title: 'Punto de Control: Introducción a la Lógica Económica y Fuerzas del Mercado',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc1',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Introducción a la Lógica Económica" y "Fuerzas del Mercado"',
    isLocked: false,
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: 1
  },
  {
    id: 'PC2',
    title: 'Punto de Control: Acción del Gobierno en los Mercados y Competencia Perfecta',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc2',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Acción del Gobierno en los Mercados" y "Competencia Perfecta"',
    isLocked: true,
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: 2
  },
  {
    id: 'PC3',
    title: 'Punto de Control: Monopolio y Oligopolio y Tecnología Blockchain',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc3',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Monopolio y Oligopolio" y "Tecnología Blockchain"',
    isLocked: true,
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: 3
  },
  {
    id: 'PC4',
    title: 'Punto de Control: Criptomonedas y Operaciones con Criptomonedas',
    path: '/dashboard/iniciado/puntos-de-control/teorico/pc4',
    icon: <CheckCircle />,
    description: 'Punto de control: Evalúa los módulos "Criptomonedas" y "Operaciones con Criptomonedas"',
    isLocked: true,
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: 4
  }
];

// Módulos Prácticos Base
const practicalModulesBase: Module[] = [
  {
    id: '1',
    title: 'Introducción al Trading',
    path: '/dashboard/iniciado/Practico/1-introduccion-trading',
    icon: <Play />,
    description: 'Fundamentos del trading y mentalidad correcta',
    isLocked: false,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 1
  },
  {
    id: '2',
    title: 'Introducción al Análisis Técnico',
    path: '/dashboard/iniciado/Practico/2-introduccion-analisis-tecnico',
    icon: <TrendingUp />,
    description: 'Herramientas básicas del análisis técnico',
    isLocked: false,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 2
  },
  {
    id: '3',
    title: 'Patrones de Vela',
    path: '/dashboard/iniciado/Practico/3-patrones-vela',
    icon: <BookOpen />,
    description: 'Patrones de velas japonesas y su interpretación',
    isLocked: false,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 3
  },
  {
    id: '4',
    title: 'Fibonacci y Medias Móviles',
    path: '/dashboard/iniciado/Practico/4-fibonacci-medias',
    icon: <Target />,
    description: 'Niveles de Fibonacci y medias móviles',
    isLocked: false,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 4
  },
  {
    id: '5',
    title: 'Indicadores RSI y MACD',
    path: '/dashboard/iniciado/Practico/5-indicadores-rsi-macd',
    icon: <Wrench />,
    description: 'Osciladores y confirmación de señales',
    isLocked: true,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 5
  },
  {
    id: '6',
    title: 'Estocástico y Bandas de Bollinger',
    path: '/dashboard/iniciado/Practico/6-estocastico-bollinger',
    icon: <Cog />,
    description: 'Indicadores de sobrecompra y sobreventa',
    isLocked: true,
    level: 'nivel1',
    type: 'content',
    moduleNumber: 6
  },
  {
    id: '7',
    title: 'Análisis Fundamental 1',
    path: '/dashboard/iniciado/Practico/7-analisis-fundamental',
    icon: <Brain />,
    description: 'Análisis fundamental y factores que mueven el mercado',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 7
  },
  {
    id: '8',
    title: 'Análisis Fundamental 2',
    path: '/dashboard/iniciado/Practico/8-analisis-fundamental-2',
    icon: <Network />,
    description: 'Análisis fundamental avanzado',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 8
  },
  {
    id: '9',
    title: 'Gestión de Riesgo',
    path: '/dashboard/iniciado/Practico/9-gestion-riesgo',
    icon: <Shield />,
    description: 'Estrategias de gestión de riesgo y protección de capital',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 9
  },
  {
    id: '10',
    title: 'Plan de Trading',
    path: '/dashboard/iniciado/Practico/10-plan-trading',
    icon: <BarChart3 />,
    description: 'Desarrollo de un plan de trading personalizado',
    isLocked: true,
    level: 'nivel2',
    type: 'content',
    moduleNumber: 10
  }
];

// Generar puntos de control prácticos según el orden correcto
function buildPracticalModulesWithCheckpoints() {
  const result: Module[] = [];
  let pcCount = 1;
  
  // 1. Introducción al Trading
  result.push(practicalModulesBase[0]);
  
  // 2. Lección 1 - Introducción al Análisis Técnico
  result.push(practicalModulesBase[1]);
  
  // 3. Punto de Control 1
      result.push({
        id: `PC${pcCount}`,
    title: `Evaluación: ${practicalModulesBase[0].title} y ${practicalModulesBase[1].title}`,
        path: `/dashboard/iniciado/puntos-de-control/practico/pc${pcCount}`,
        icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${practicalModulesBase[0].title}" y "${practicalModulesBase[1].title}"`,
    isLocked: false,
        level: 'nivel1',
        type: 'checkpoint',
        moduleNumber: pcCount
      });
      pcCount++;
  
  // 4. Lección 2 - Patrones de Vela
  result.push(practicalModulesBase[2]);
  
  // 5. Lección 3 - Fibonacci y medias móviles
  result.push(practicalModulesBase[3]);
  
  // 6. Punto de Control 2
      result.push({
        id: `PC${pcCount}`,
    title: `Evaluación: ${practicalModulesBase[2].title} y ${practicalModulesBase[3].title}`,
        path: `/dashboard/iniciado/puntos-de-control/practico/pc${pcCount}`,
        icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${practicalModulesBase[2].title}" y "${practicalModulesBase[3].title}"`,
    isLocked: true,
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: pcCount
  });
  pcCount++;
  
  // 7. Lección 4 - Indicadores RSI y MACD
  result.push(practicalModulesBase[4]);
  
  // 8. Lección 5 - Estocástico y Bandas de Bollinger
  result.push(practicalModulesBase[5]);
  
  // 9. Punto de Control 3
  result.push({
    id: `PC${pcCount}`,
    title: `Evaluación: ${practicalModulesBase[4].title} y ${practicalModulesBase[5].title}`,
    path: `/dashboard/iniciado/puntos-de-control/practico/pc${pcCount}`,
    icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${practicalModulesBase[4].title}" y "${practicalModulesBase[5].title}"`,
    isLocked: true,
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: pcCount
  });
  pcCount++;
  
  // 10. Lección 6 - Análisis Fundamental 1
  result.push(practicalModulesBase[6]);
  
  // 11. Lección 7 - Análisis Fundamental 2
  result.push(practicalModulesBase[7]);
  
  // 12. Punto de Control 4
  result.push({
    id: `PC${pcCount}`,
    title: `Evaluación: ${practicalModulesBase[6].title} y ${practicalModulesBase[7].title}`,
    path: `/dashboard/iniciado/puntos-de-control/practico/pc${pcCount}`,
    icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${practicalModulesBase[6].title}" y "${practicalModulesBase[7].title}"`,
        isLocked: true,
        level: 'nivel2',
        type: 'checkpoint',
        moduleNumber: pcCount
      });
      pcCount++;
  
  // 13. Lección 8 - Gestión de Riesgo
  result.push(practicalModulesBase[8]);
  
  // 14. Lección 9 - Plan de Trading
  result.push(practicalModulesBase[9]);
  
  // 15. Punto de Control 5
  result.push({
    id: `PC${pcCount}`,
    title: `Evaluación: ${practicalModulesBase[8].title} y ${practicalModulesBase[9].title}`,
    path: `/dashboard/iniciado/puntos-de-control/practico/pc${pcCount}`,
    icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${practicalModulesBase[8].title}" y "${practicalModulesBase[9].title}"`,
    isLocked: true,
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: pcCount
  });
  
  return result;
}

// Generar módulos teóricos con puntos de control intercalados
function buildTheoreticalModulesWithCheckpoints() {
  const result: Module[] = [];
  let pcCount = 1;
  
  // 1. Introducción a la Lógica Económica
  result.push(theoreticalModulesBase[0]);
  
  // 2. Fuerzas del Mercado
  result.push(theoreticalModulesBase[1]);
  
  // 3. Punto de Control 1
  result.push({
    id: `PC${pcCount}`,
    title: `Evaluación: ${theoreticalModulesBase[0].title} y ${theoreticalModulesBase[1].title}`,
    path: `/dashboard/iniciado/puntos-de-control/teorico/pc${pcCount}`,
    icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${theoreticalModulesBase[0].title}" y "${theoreticalModulesBase[1].title}"`,
    isLocked: false,
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: pcCount
  });
  pcCount++;
  
  // 4. Acción del Gobierno en los Mercados
  result.push(theoreticalModulesBase[2]);
  
  // 5. Competencia Perfecta
  result.push(theoreticalModulesBase[3]);
  
  // 6. Punto de Control 2
  result.push({
    id: `PC${pcCount}`,
    title: `Evaluación: ${theoreticalModulesBase[2].title} y ${theoreticalModulesBase[3].title}`,
    path: `/dashboard/iniciado/puntos-de-control/teorico/pc${pcCount}`,
    icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${theoreticalModulesBase[2].title}" y "${theoreticalModulesBase[3].title}"`,
    isLocked: true,
    level: 'nivel1',
    type: 'checkpoint',
    moduleNumber: pcCount
  });
  pcCount++;
  
  // 7. Monopolio y Oligopolio
  result.push(theoreticalModulesNivel2[0]);
  
  // 8. Tecnología Blockchain
  result.push(theoreticalModulesNivel2[1]);
  
  // 9. Punto de Control 3
  result.push({
    id: `PC${pcCount}`,
    title: `Evaluación: ${theoreticalModulesNivel2[0].title} y ${theoreticalModulesNivel2[1].title}`,
    path: `/dashboard/iniciado/puntos-de-control/teorico/pc${pcCount}`,
    icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${theoreticalModulesNivel2[0].title}" y "${theoreticalModulesNivel2[1].title}"`,
    isLocked: true,
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: pcCount
  });
  pcCount++;
  
  // 10. Criptomonedas
  result.push(theoreticalModulesNivel2[2]);
  
  // 11. Operaciones con Criptomonedas
  result.push(theoreticalModulesNivel2[3]);
  
  // 12. Punto de Control 4
  result.push({
    id: `PC${pcCount}`,
    title: `Evaluación: ${theoreticalModulesNivel2[2].title} y ${theoreticalModulesNivel2[3].title}`,
    path: `/dashboard/iniciado/puntos-de-control/teorico/pc${pcCount}`,
    icon: <CheckCircle />,
    description: `Punto de control: Evalúa los módulos "${theoreticalModulesNivel2[2].title}" y "${theoreticalModulesNivel2[3].title}"`,
    isLocked: true,
    level: 'nivel2',
    type: 'checkpoint',
    moduleNumber: pcCount
  });
  
  return result;
}

const practicalModules = buildPracticalModulesWithCheckpoints();

// Función para calcular progreso unificado
function calculateUnifiedProgress(theoreticalModules: Module[], practicalModules: Module[]) {
  const allModules = [...theoreticalModules, ...practicalModules];
  const totalModules = allModules.length;
  
  // Simular progreso real basado en localStorage o estado del usuario
  const getModuleProgress = (moduleId: string) => {
    const saved = localStorage.getItem(`module_${moduleId}_progress`);
    return saved ? JSON.parse(saved) : { isCompleted: false, progress: 0 };
  };
  
  // Calcular módulos completados basado en progreso real
  const completedModules = allModules.filter(m => {
    const progress = getModuleProgress(m.id);
    return progress.isCompleted || progress.progress >= 100;
  }).length;
  
  const totalCheckpoints = allModules.filter(m => m.id.startsWith('PC')).length;
  const completedCheckpoints = allModules.filter(m => {
    if (!m.id.startsWith('PC')) return false;
    const progress = getModuleProgress(m.id);
    return progress.isCompleted || progress.progress >= 100;
  }).length;
  
  // Calcular progreso por nivel
  const nivel1Modules = allModules.filter(m => m.level === 'nivel1');
  const nivel2Modules = allModules.filter(m => m.level === 'nivel2');
  
  const nivel1Completed = nivel1Modules.filter(m => {
    const progress = getModuleProgress(m.id);
    return progress.isCompleted || progress.progress >= 100;
  }).length;
  const nivel1Total = nivel1Modules.length;
  const nivel1Percentage = nivel1Total > 0 ? Math.round((nivel1Completed / nivel1Total) * 100) : 0;
  
  const nivel2Completed = nivel2Modules.filter(m => {
    const progress = getModuleProgress(m.id);
    return progress.isCompleted || progress.progress >= 100;
  }).length;
  const nivel2Total = nivel2Modules.length;
  const nivel2Percentage = nivel2Total > 0 ? Math.round((nivel2Completed / nivel2Total) * 100) : 0;
  
  // Verificar si puede acceder al nivel 2 (50% del nivel 1 completado)
  const canAccessNivel2 = nivel1Percentage >= 50;
  
  return {
    totalModules,
    completedModules,
    totalCheckpoints,
    completedCheckpoints,
    percentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
    nivel1Percentage,
    nivel2Percentage,
    canAccessNivel2,
    nivel1Completed,
    nivel1Total,
    nivel2Completed,
    nivel2Total
  };
}

// Objetivos a lograr - se define dentro del componente

// Función para calcular módulos desbloqueados basado en el progreso
function calculateUnlockedModules(modules: Module[], progress: any, courseType: 'theoretical' | 'practical') {
  // Función auxiliar para verificar si un checkpoint está completado
  const isCheckpointCompleted = (checkpointId: string, level: 'nivel1' | 'nivel2') => {
    const result = progress[courseType][level].checkpoints[checkpointId] || false;
    return result;
  };

  // Separar módulos por nivel para facilitar el cálculo
  return modules.map((module) => {
    let isLocked = module.isLocked || false;
    
    // Si es un módulo de contenido (no punto de control)
    if (module.type === 'content') {
      const moduleIndex = parseInt(module.id);
      
      if (courseType === 'theoretical') {
        // Lógica para módulos teóricos
        if (moduleIndex <= 2) {
          // Los primeros dos módulos siempre están desbloqueados
          isLocked = false;
        } else if (moduleIndex === 3 || moduleIndex === 4) {
          // Módulos 3 y 4 se desbloquean cuando PC1 está completado
          isLocked = !isCheckpointCompleted('PC1', 'nivel1');
        } else if (moduleIndex === 5 || moduleIndex === 6) {
          // Módulos 5 y 6 se desbloquean cuando PC2 está completado
          isLocked = !isCheckpointCompleted('PC2', 'nivel1');
        } else if (moduleIndex === 7 || moduleIndex === 8) {
          // Módulos 7 y 8 se desbloquean cuando PC3 está completado
          isLocked = !isCheckpointCompleted('PC3', 'nivel2');
        }
      } else {
        // Lógica para módulos prácticos
        if (moduleIndex <= 2) {
          // Los primeros dos módulos siempre están desbloqueados
          isLocked = false;
        } else if (moduleIndex === 3 || moduleIndex === 4) {
          // Módulos 3 y 4 se desbloquean cuando PC1 está completado
          isLocked = !isCheckpointCompleted('PC1', 'nivel1');
        } else if (moduleIndex === 5 || moduleIndex === 6) {
          // Módulos 5 y 6 se desbloquean cuando PC2 está completado
          isLocked = !isCheckpointCompleted('PC2', 'nivel1');
        } else if (moduleIndex === 7 || moduleIndex === 8) {
          // Módulos 7 y 8 se desbloquean cuando PC3 está completado
          isLocked = !isCheckpointCompleted('PC3', 'nivel1');
        } else if (moduleIndex === 9 || moduleIndex === 10) {
          // Módulos 9 y 10 se desbloquean cuando PC4 está completado
          isLocked = !isCheckpointCompleted('PC4', 'nivel2');
        }
      }
    } else {
      // Si es un punto de control
      const checkpointNumber = parseInt(module.id.replace('PC', ''));
      
      if (courseType === 'theoretical') {
        // Lógica para puntos de control teóricos
        if (checkpointNumber === 1) {
          // PC1 siempre está desbloqueado
          isLocked = false;
        } else if (checkpointNumber === 2) {
          // PC2 se desbloquea cuando PC1 está completado
          isLocked = !isCheckpointCompleted('PC1', 'nivel1');
        } else if (checkpointNumber === 3) {
          // PC3 se desbloquea cuando PC2 está completado
          isLocked = !isCheckpointCompleted('PC2', 'nivel1');
        } else if (checkpointNumber === 4) {
          // PC4 se desbloquea cuando PC3 está completado
          isLocked = !isCheckpointCompleted('PC3', 'nivel2');
        }
      } else {
        // Lógica para puntos de control prácticos
        if (checkpointNumber === 1) {
          // PC1 siempre está desbloqueado
          isLocked = false;
        } else if (checkpointNumber === 2) {
          // PC2 se desbloquea cuando PC1 está completado
          isLocked = !isCheckpointCompleted('PC1', 'nivel1');
        } else if (checkpointNumber === 3) {
          // PC3 se desbloquea cuando PC2 está completado
          isLocked = !isCheckpointCompleted('PC2', 'nivel1');
        } else if (checkpointNumber === 4) {
          // PC4 se desbloquea cuando PC3 está completado
          isLocked = !isCheckpointCompleted('PC3', 'nivel1');
        } else if (checkpointNumber === 5) {
          // PC5 se desbloquea cuando PC4 está completado
          isLocked = !isCheckpointCompleted('PC4', 'nivel2');
        }
      }
    }
    
    return {
      ...module,
      isLocked
    };
  });
}

export default function IniciadoDashboard() {
  const { userData } = useSafeAuth();
  const scrollRef = useScrollPosition();
  
  // Estado persistente para el tab activo
  const [activeTab, setActiveTab] = useState<'theoretical' | 'practical'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardActiveTab');
      return saved === 'practical' ? 'practical' : 'theoretical';
    }
    return 'theoretical';
  });
  
  const { progress } = useProgress();
  
  // Hook para módulos dinámicos
  const { 
    theoretical: dynamicTheoretical, 
    practical: dynamicPractical, 
    loading: dynamicModulesLoading,
    refreshModules 
  } = useDynamicModules();

  // Módulos dinámicos

  // Objetivos a lograr
  const objectives: Objective[] = [
  { id: 'obj1', title: 'Completar Nivel 1 Teórico', type: 'nivel1', category: 'theoretical', completed: false },
  { id: 'obj2', title: 'Completar Nivel 1 Práctico', type: 'nivel1', category: 'practical', completed: false },
  { id: 'obj3', title: 'Superar 2 Puntos de Control Teóricos', type: 'checkpoints', category: 'theoretical', completed: false },
  { id: 'obj4', title: 'Superar 2 Puntos de Control Prácticos', type: 'checkpoints', category: 'practical', completed: false },
  { id: 'obj5', title: 'Alcanzar 50% del curso completo', type: 'progress', category: 'general', completed: false },
  { id: 'obj6', title: 'Completar Nivel 2 Teórico', type: 'nivel2', category: 'theoretical', completed: false },
  { id: 'obj7', title: 'Completar Nivel 2 Práctico', type: 'nivel2', category: 'practical', completed: false },
  { id: 'obj8', title: 'Superar todos los Puntos de Control', type: 'checkpoints', category: 'all', completed: false }
];

  // Función para calcular el estado de los objetivos basado en el progreso real
  const calculateObjectivesStatus = () => {
    const objectivesWithStatus = objectives.map((objective: Objective) => {
      let completed = false;
      
      switch (objective.type) {
        case 'nivel1':
          if (objective.category === 'theoretical') {
            const nivel1Checkpoints = Object.values(progress.theoretical.nivel1.checkpoints).filter(Boolean).length;
            const totalNivel1Checkpoints = Object.keys(progress.theoretical.nivel1.checkpoints).length;
            completed = nivel1Checkpoints === totalNivel1Checkpoints && totalNivel1Checkpoints > 0;
          } else if (objective.category === 'practical') {
            const nivel1Checkpoints = Object.values(progress.practical.nivel1.checkpoints).filter(Boolean).length;
            const totalNivel1Checkpoints = Object.keys(progress.practical.nivel1.checkpoints).length;
            completed = nivel1Checkpoints === totalNivel1Checkpoints && totalNivel1Checkpoints > 0;
          }
          break;
          
        case 'nivel2':
          if (objective.category === 'theoretical') {
            const nivel2Checkpoints = Object.values(progress.theoretical.nivel2.checkpoints).filter(Boolean).length;
            const totalNivel2Checkpoints = Object.keys(progress.theoretical.nivel2.checkpoints).length;
            completed = nivel2Checkpoints === totalNivel2Checkpoints && totalNivel2Checkpoints > 0;
          } else if (objective.category === 'practical') {
            const nivel2Checkpoints = Object.values(progress.practical.nivel2.checkpoints).filter(Boolean).length;
            const totalNivel2Checkpoints = Object.keys(progress.practical.nivel2.checkpoints).length;
            completed = nivel2Checkpoints === totalNivel2Checkpoints && totalNivel2Checkpoints > 0;
          }
          break;
          
        case 'checkpoints':
          if (objective.category === 'theoretical') {
            const theoreticalCheckpoints = Object.values(progress.theoretical.nivel1.checkpoints).filter(Boolean).length + 
                                         Object.values(progress.theoretical.nivel2.checkpoints).filter(Boolean).length;
            completed = theoreticalCheckpoints >= 2;
          } else if (objective.category === 'practical') {
            const practicalCheckpoints = Object.values(progress.practical.nivel1.checkpoints).filter(Boolean).length + 
                                       Object.values(progress.practical.nivel2.checkpoints).filter(Boolean).length;
            completed = practicalCheckpoints >= 2;
          } else if (objective.category === 'all') {
            const allCheckpoints = Object.values(progress.theoretical.nivel1.checkpoints).filter(Boolean).length + 
                                 Object.values(progress.theoretical.nivel2.checkpoints).filter(Boolean).length +
                                 Object.values(progress.practical.nivel1.checkpoints).filter(Boolean).length + 
                                 Object.values(progress.practical.nivel2.checkpoints).filter(Boolean).length;
            const totalCheckpoints = Object.keys(progress.theoretical.nivel1.checkpoints).length + 
                                   Object.keys(progress.theoretical.nivel2.checkpoints).length +
                                   Object.keys(progress.practical.nivel1.checkpoints).length + 
                                   Object.keys(progress.practical.nivel2.checkpoints).length;
            completed = allCheckpoints === totalCheckpoints && totalCheckpoints > 0;
          }
          break;
          
        case 'progress':
          if (objective.category === 'general') {
            const theoreticalProgress = Object.values(progress.theoretical.nivel1.checkpoints).filter(Boolean).length + 
                                      Object.values(progress.theoretical.nivel2.checkpoints).filter(Boolean).length;
            const practicalProgress = Object.values(progress.practical.nivel1.checkpoints).filter(Boolean).length + 
                                    Object.values(progress.practical.nivel2.checkpoints).filter(Boolean).length;
            const totalCheckpoints = Object.keys(progress.theoretical.nivel1.checkpoints).length + 
                                   Object.keys(progress.theoretical.nivel2.checkpoints).length +
                                   Object.keys(progress.practical.nivel1.checkpoints).length + 
                                   Object.keys(progress.practical.nivel2.checkpoints).length;
            const totalProgress = theoreticalProgress + practicalProgress;
            const percentage = (totalProgress / totalCheckpoints) * 100;
            completed = percentage >= 50;
          }
          break;
      }
      
      return {
        ...objective,
        completed
      };
    });
    
    return objectivesWithStatus;
  };

  // Función para marcar un módulo como completado
  const markModuleAsCompleted = (moduleId: string) => {
    const moduleProgress = {
      isCompleted: true,
      progress: 100,
      timestamp: Date.now()
    };
    localStorage.setItem(`module_${moduleId}_progress`, JSON.stringify(moduleProgress));
  };

  // Función para verificar si un módulo está completado
  const isModuleCompleted = (moduleId: string) => {
    const saved = localStorage.getItem(`module_${moduleId}_progress`);
    if (saved) {
      const moduleProgress = JSON.parse(saved);
      return moduleProgress.isCompleted || moduleProgress.progress >= 100;
    }
    return false;
  };

  // Marcar automáticamente los módulos como completados cuando se visitan
  useEffect(() => {
    const currentPath = window.location.pathname;
    const moduleMatch = currentPath.match(/\/(\d+)-/);
    
    if (moduleMatch) {
      const moduleId = moduleMatch[1];
      if (!isModuleCompleted(moduleId)) {
        markModuleAsCompleted(moduleId);
      }
    }
  }, []);

  // Carousel content
  const carouselContent = [
    {
      type: 'image' as const,
      content: '/images/insignias/1-iniciados.png',
      duration: 2500
    },
    {
      type: 'title' as const,
      content: 'INICIADO',
      duration: 2500
    },
    {
      type: 'subtitle' as const,
      content: 'Has dado el primer paso hacia el dominio.',
      duration: 2500
    },
    {
      type: 'description' as const,
      content: 'Este espacio es tu punto de partida. Aquí accederás a las enseñanzas fundamentales, tu bitácora de evolución, misiones introductorias, mentorías y recursos esenciales para templar tu mente. Todo está dispuesto para quien observa con atención y actúa con propósito.',
      duration: 11000 // Aumentado de 8s a 11s
    },
    {
      type: 'quote' as const,
      content: 'En cada sombra hay un principio. En cada decisión, una transformación.',
      duration: 3000
    },
    {
      type: 'philosophy' as const,
      content: 'Iniciado no es un título, sino una oportunidad. Una etapa donde se forja la voluntad, se entrena la percepción y se aprende a dominar el caos interior. Aquí no buscamos obediencia ciega, sino claridad interior. El poder no se recibe: se construye. Y si estás dispuesto, este será solo el primero de muchos umbrales que cruzarás.',
      duration: 13000 // Aumentado de 10s a 13s
    }
  ];

  // Obtener todos los módulos según el tab activo
  const getAllModules = () => {
    if (activeTab === 'theoretical') {
      const allTheoreticalModules = buildTheoreticalModulesWithCheckpoints();
      return calculateUnlockedModules(allTheoreticalModules, progress, 'theoretical');
    } else if (activeTab === 'practical') {
      return calculateUnlockedModules(practicalModules, progress, 'practical');
    }
    return [];
  };

  const allModules = getAllModules();

  // Función para cambiar tab y guardar en localStorage
  const handleTabChange = (tab: 'theoretical' | 'practical') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardActiveTab', tab);
    }
  };

  // Get user data from profile
  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
      if (saved) {
      const profileData = JSON.parse(saved);
      // setUserData(profileData); // This line was removed from the new_code, so it's removed here.
    }
  }, []);

  // Actualizar objetivos basado en el progreso

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen bg-[#0f0f0f] text-white overflow-y-auto scrollbar-iniciado"
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .objectives-grid > div {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }
        
        .objectives-grid > div:nth-child(1) { animation-delay: 0.1s; }
        .objectives-grid > div:nth-child(2) { animation-delay: 0.2s; }
        .objectives-grid > div:nth-child(3) { animation-delay: 0.3s; }
        .objectives-grid > div:nth-child(4) { animation-delay: 0.4s; }
        .objectives-grid > div:nth-child(5) { animation-delay: 0.5s; }
        .objectives-grid > div:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 pb-24 md:pb-8 transition-all duration-300">
        {/* Welcome Message */}
        <div className="w-full max-w-4xl mx-auto mb-6 md:mb-8 text-center px-4 md:px-0">
          <h2 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">
            Te damos la bienvenida{userData?.nickname ? (
              <>
                <span className="text-[#fafafa]">, </span>
                <span className="text-[#fafafa] font-medium">{userData.nickname}</span>
              </>
            ) : ''}
          </h2>
        </div>

        {/* Carousel Component */}
        <EnhancedCarousel content={carouselContent} dotsColor="#fafafa" />


        {/* Video introductorio */}
        <div className="w-full flex justify-center mb-8 px-2 md:px-0">
          <div className="w-full max-w-4xl">
            <video className="rounded-xl shadow-lg w-full h-64 md:h-80 object-cover" controls>
                              <source src="/videos/intro.mp4" type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 px-2 md:px-0">
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-1 md:p-2 w-full max-w-md">
            <button
              onClick={() => handleTabChange('theoretical')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base w-1/2 ${
                activeTab === 'theoretical'
                  ? 'bg-[#fafafa] text-[#121212] shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <BookOpen className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Teórico</span>
              <span className="sm:hidden">Teórico</span>
            </button>
            <button
              onClick={() => handleTabChange('practical')}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-sm md:text-base w-1/2 ${
                activeTab === 'practical'
                  ? 'bg-[#fafafa] text-[#121212] shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
              }`}
            >
              <TrendingUp className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Práctico</span>
              <span className="sm:hidden">Práctico</span>
            </button>
          </div>
        </div>

        {/* Progress Ruler - Barra de Progreso General */}
        <div className="w-full max-w-4xl mx-auto mb-8 px-2 md:px-0">
          <ProgressRuler courseType={activeTab as 'theoretical' | 'practical'} />
        </div>

        {/* Mini-lista de objetivos */}
        <div className="w-full flex justify-center mb-8 px-2 md:px-0">
          <div className="w-full max-w-4xl">
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#fafafa] mb-4 flex items-center">
                <Target className="mr-2" />
                Objetivos a Lograr
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 objectives-grid">
                {calculateObjectivesStatus().slice(0, 6).map((objective: Objective, index: number) => (
                  <div 
                    key={objective.id} 
                    className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-[#232323] transition-all duration-300 ease-out transform hover:scale-[1.02] hover:bg-[#2a2a2a]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      objective.completed ? 'bg-[#ec4d58] shadow-md' : 'bg-gray-600'
                    }`}>
                      {objective.completed ? (
                        <CheckCircle className="text-white text-sm" />
                      ) : (
                        <Flag className="text-gray-400 text-sm" />
                      )}
                    </div>
                    <span className={`text-sm transition-all duration-300 ${objective.completed ? 'text-[#ec4d58] line-through' : 'text-gray-300'}`}>
                      {objective.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tribunal Imperial Carousel - Carrusel Principal */}
        {!tribunalLoading && (
          <div className="mb-8 md:mb-12 px-2 md:px-0">
            <DynamicTribunalCarousel
              modules={activeTab === 'theoretical' ? tribunalTheoretical : tribunalPractical}
              checkpoints={tribunalCheckpoints.filter(cp => cp.category === activeTab)}
              title={activeTab === 'theoretical' ? 'Módulos Teóricos del Tribunal Imperial' : 'Módulos Prácticos del Tribunal Imperial'}
              category={activeTab as 'theoretical' | 'practical'}
            />
          </div>
        )}

        {/* Tribunal Imperial - Sistema de Inyección de Contenido */}
        <div className="mb-8 md:mb-12 px-2 md:px-0">
          <TribunalContentInjector
            targetLevel={1} // Iniciado
            targetDashboard="iniciado"
            category={activeTab as 'theoretical' | 'practical'}
            onContentClick={(content) => {
              console.log('Contenido seleccionado:', content);
              // Aquí se puede implementar navegación específica
            }}
          />
        </div>


              {/* Carrusel Teórico Dinámico */}
              {activeTab === 'theoretical' && dynamicTheoretical.length > 0 && (
                <div className="mb-8">
                  <DynamicCarousel
                    modules={dynamicTheoretical}
                    title="Módulos Teóricos Dinámicos"
                  />
                </div>
              )}

              {/* Carrusel Práctico Dinámico */}
              {activeTab === 'practical' && dynamicPractical.length > 0 && (
                <div className="mb-8">
                  <DynamicCarousel
                    modules={dynamicPractical}
                    title="Módulos Prácticos Dinámicos"
                  />
                </div>
              )}
            </div>
          </div>
        )}


        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 md:mb-12">
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[#fafafa] mb-4 flex items-center">
              <TrendingUp className="mr-3" />
              Próximos Pasos
            </h3>
            <p className="text-gray-300 mb-4">
              Continúa tu aprendizaje con los módulos disponibles. Cada módulo te acerca más a convertirte en un trader profesional.
            </p>
            <Link
              href="/dashboard/iniciado/cursos"
              className="inline-flex items-center px-4 py-2 bg-[#fafafa] hover:bg-[#e5e5e5] text-[#121212] rounded-lg transition-colors"
            >
              Ver Todos los Módulos

            </Link>
          </div>

          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[#fafafa] mb-4 flex items-center">
              <AlertTriangle className="mr-3" />
              Puntos de Control
            </h3>
            <p className="text-gray-300 mb-4">
              Cada 2 módulos encontrarás un punto de control para evaluar tu progreso y consolidar tu aprendizaje.
            </p>
            <div className="text-yellow-400 text-sm space-y-1">
              <div>⏰ Duración: 8 minutos máximo</div>
              <div>🔄 Cooldown: 1 hora entre intentos</div>
              <div>📝 Formato: 12 preguntas de opción múltiple</div>
              <div>✅ Aprobación: 70% mínimo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}