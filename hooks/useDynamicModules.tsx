'use client';

import { useState, useEffect, useMemo } from 'react';
// No se necesitan importaciones de iconos ya que no se usan en este hook

interface Module {
  id: string;
  title: string;
  path: string;
  description: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  level: 'nivel1' | 'nivel2';
  type: 'content' | 'checkpoint';
  moduleNumber: number;
}

interface DynamicModulesResult {
  theoretical: Module[];
  practical: Module[];
  loading: boolean;
  refreshModules: () => void;
}

// Módulos teóricos dinámicos (8 módulos + 4 puntos de control)
const generateTheoreticalModules = (): Module[] => {
  const modules: Module[] = [];
  
  // Módulos de contenido teórico
  const theoreticalContent = [
    {
      id: '1',
      title: 'Introducción a la Lógica Económica',
      description: 'Fundamentos de la lógica económica y toma de decisiones',
      level: 'nivel1' as const,
      moduleNumber: 1
    },
    {
      id: '2', 
      title: 'Fuerzas del Mercado',
      description: 'Oferta, demanda y equilibrio del mercado',
      level: 'nivel1' as const,
      moduleNumber: 2
    },
    {
      id: '3',
      title: 'Acción del Gobierno en los Mercados',
      description: 'Intervención gubernamental y regulaciones',
      level: 'nivel1' as const,
      moduleNumber: 3
    },
    {
      id: '4',
      title: 'Competencia Perfecta',
      description: 'Análisis de mercados en competencia perfecta',
      level: 'nivel1' as const,
      moduleNumber: 4
    },
    {
      id: '5',
      title: 'Monopolio y Oligopolio',
      description: 'Análisis de mercados con poder de mercado concentrado',
      level: 'nivel2' as const,
      moduleNumber: 5
    },
    {
      id: '6',
      title: 'Tecnología Blockchain',
      description: 'Fundamentos de la tecnología blockchain y criptomonedas',
      level: 'nivel2' as const,
      moduleNumber: 6
    },
    {
      id: '7',
      title: 'Criptomonedas',
      description: 'Análisis fundamental de criptomonedas y tokens',
      level: 'nivel2' as const,
      moduleNumber: 7
    },
    {
      id: '8',
      title: 'Operaciones con Criptomonedas',
      description: 'Técnicas avanzadas de trading en criptomonedas',
      level: 'nivel2' as const,
      moduleNumber: 8
    }
  ];

  // Agregar módulos de contenido
  theoreticalContent.forEach((content, index) => {
    modules.push({
      ...content,
      path: `/dashboard/iniciado/Teorico/${content.moduleNumber}-${content.title.toLowerCase().replace(/\s+/g, '-')}`,
      isCompleted: false,
      isLocked: content.moduleNumber > 2, // Solo los primeros 2 están desbloqueados
      type: 'content' as const
    });

    // Agregar punto de control cada 2 módulos
    if ((index + 1) % 2 === 0) {
      const checkpointNumber = Math.floor((index + 1) / 2);
      const prevModule1 = theoreticalContent[index - 1];
      const prevModule2 = theoreticalContent[index];
      
      modules.push({
        id: `PC${checkpointNumber}`,
        title: `Punto de Control: ${prevModule1.title} y ${prevModule2.title}`,
        path: `/dashboard/iniciado/puntos-de-control/teorico/pc${checkpointNumber}`,
        description: `Punto de control: Evalúa los módulos "${prevModule1.title}" y "${prevModule2.title}"`,
        isCompleted: false,
        isLocked: checkpointNumber > 1, // Solo el primer PC está desbloqueado
        level: content.level,
        type: 'checkpoint' as const,
        moduleNumber: checkpointNumber
      });
    }
  });

  return modules;
};

// Módulos prácticos dinámicos (10 módulos + 5 puntos de control)
const generatePracticalModules = (): Module[] => {
  const modules: Module[] = [];
  
  // Módulos de contenido práctico
  const practicalContent = [
    {
      id: '1',
      title: 'Introducción al Trading',
      description: 'Fundamentos del trading y mentalidad correcta',
      level: 'nivel1' as const,
      moduleNumber: 1
    },
    {
      id: '2',
      title: 'Introducción al Análisis Técnico',
      description: 'Herramientas básicas del análisis técnico',
      level: 'nivel1' as const,
      moduleNumber: 2
    },
    {
      id: '3',
      title: 'Patrones de Vela',
      description: 'Patrones de velas japonesas y su interpretación',
      level: 'nivel1' as const,
      moduleNumber: 3
    },
    {
      id: '4',
      title: 'Fibonacci y Medias Móviles',
      description: 'Niveles de Fibonacci y medias móviles',
      level: 'nivel1' as const,
      moduleNumber: 4
    },
    {
      id: '5',
      title: 'Indicadores RSI y MACD',
      description: 'Osciladores y confirmación de señales',
      level: 'nivel1' as const,
      moduleNumber: 5
    },
    {
      id: '6',
      title: 'Estocástico y Bandas de Bollinger',
      description: 'Indicadores de sobrecompra y sobreventa',
      level: 'nivel1' as const,
      moduleNumber: 6
    },
    {
      id: '7',
      title: 'Análisis Fundamental 1',
      description: 'Análisis fundamental y factores que mueven el mercado',
      level: 'nivel2' as const,
      moduleNumber: 7
    },
    {
      id: '8',
      title: 'Análisis Fundamental 2',
      description: 'Análisis fundamental avanzado',
      level: 'nivel2' as const,
      moduleNumber: 8
    },
    {
      id: '9',
      title: 'Gestión de Riesgo',
      description: 'Estrategias de gestión de riesgo y protección de capital',
      level: 'nivel2' as const,
      moduleNumber: 9
    },
    {
      id: '10',
      title: 'Plan de Trading',
      description: 'Desarrollo de un plan de trading personalizado',
      level: 'nivel2' as const,
      moduleNumber: 10
    }
  ];

  // Agregar módulos de contenido
  practicalContent.forEach((content, index) => {
    modules.push({
      ...content,
      path: `/dashboard/iniciado/Practico/${content.moduleNumber}-${content.title.toLowerCase().replace(/\s+/g, '-')}`,
      isCompleted: false,
      isLocked: content.moduleNumber > 2, // Solo los primeros 2 están desbloqueados
      type: 'content' as const
    });

    // Agregar punto de control cada 2 módulos
    if ((index + 1) % 2 === 0) {
      const checkpointNumber = Math.floor((index + 1) / 2);
      const prevModule1 = practicalContent[index - 1];
      const prevModule2 = practicalContent[index];
      
      modules.push({
        id: `PC${checkpointNumber}`,
        title: `Punto de Control: ${prevModule1.title} y ${prevModule2.title}`,
        path: `/dashboard/iniciado/puntos-de-control/practico/pc${checkpointNumber}`,
        description: `Punto de control: Evalúa los módulos "${prevModule1.title}" y "${prevModule2.title}"`,
        isCompleted: false,
        isLocked: checkpointNumber > 1, // Solo el primer PC está desbloqueado
        level: content.level,
        type: 'checkpoint' as const,
        moduleNumber: checkpointNumber
      });
    }
  });

  return modules;
};

export function useDynamicModules(): DynamicModulesResult {
  const [loading, setLoading] = useState(true);

  // Generar módulos dinámicamente
  const theoretical = useMemo(() => generateTheoreticalModules(), []);
  const practical = useMemo(() => generatePracticalModules(), []);

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const refreshModules = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    theoretical,
    practical,
    loading,
    refreshModules
  };
}
