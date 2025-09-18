// 🏛️ HOOK PARA MÓDULOS DEL TRIBUNAL IMPERIAL
// Gestiona la carga y estado de los módulos migrados

import { useState, useEffect, useCallback } from 'react';

export interface TribunalModule {
  id: string;
  title: string;
  description: string;
  category: 'theoretical' | 'practical' | 'checkpoint';
  order: number;
  displayNumber: number;
  isLocked: boolean;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  path: string;
  checkpointNumber?: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TribunalModulesState {
  theoretical: TribunalModule[];
  practical: TribunalModule[];
  checkpoints: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useTribunalModules() {
  const [state, setState] = useState<TribunalModulesState>({
    theoretical: [],
    practical: [],
    checkpoints: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  // Cargar módulos del Tribunal Imperial
  const loadModules = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Cargar datos del Tribunal Imperial desde localStorage o generar datos de prueba
      let mockTheoreticalModules: TribunalModule[] = [];
      
      // Intentar cargar desde localStorage primero
      const storedProposals = localStorage.getItem('tribunal_proposals');
      if (storedProposals) {
        const allProposals = JSON.parse(storedProposals);
        const approvedContent = allProposals.filter((proposal: any) => 
          proposal.status === 'approved' && 
          proposal.targetLevels && 
          proposal.targetLevels.includes(1)
        );
        
        if (approvedContent.length > 0) {
          mockTheoreticalModules = approvedContent.map((content: any, index: number) => ({
            id: content.id,
            title: content.title,
            description: content.description || 'Contenido especial del Tribunal Imperial',
            category: 'theoretical' as const,
            order: index + 1,
            displayNumber: index + 1,
            isLocked: index > 1, // Solo los primeros 2 están desbloqueados
            estimatedDuration: 45,
            difficulty: 'beginner' as const,
            tags: content.tags || ['tribunal', 'imperial'],
            path: content.id,
            checkpointNumber: undefined,
            authorName: content.authorName || 'Tribunal Imperial',
            createdAt: content.createdAt || new Date().toISOString(),
            updatedAt: content.updatedAt || new Date().toISOString()
          }));
        }
      }
      
      // Si no hay contenido en localStorage, usar datos de prueba
      if (mockTheoreticalModules.length === 0) {
        mockTheoreticalModules = [
        {
          id: 'teorico-1',
          title: 'Introducción y la lógica económica',
          description: 'Comprende los principios básicos de la economía y cómo pensamos los humanos en términos de recursos escasos.',
          category: 'theoretical',
          order: 1,
          displayNumber: 1,
          isLocked: false,
          estimatedDuration: 45,
          difficulty: 'beginner',
          tags: ['economia', 'teoria', 'conceptos'],
          path: '1-introduccion-logica-economica',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'teorico-2',
          title: 'Fuerzas del mercado',
          description: 'Explora la oferta, la demanda y cómo se forman los precios en los mercados libres.',
          category: 'theoretical',
          order: 2,
          displayNumber: 2,
          isLocked: false,
          estimatedDuration: 40,
          difficulty: 'beginner',
          tags: ['economia', 'mercado', 'oferta-demanda'],
          path: '2-fuerzas-del-mercado',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'teorico-3',
          title: 'Acción del gobierno en los mercados',
          description: 'Descubre cómo los gobiernos intervienen en los mercados y qué consecuencias generan estas acciones.',
          category: 'theoretical',
          order: 3,
          displayNumber: 3,
          isLocked: true,
          estimatedDuration: 50,
          difficulty: 'intermediate',
          tags: ['gobierno', 'regulacion', 'intervencion'],
          path: '3-accion-gobierno-mercados',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'teorico-4',
          title: 'Competencia perfecta',
          description: 'Estudia el modelo ideal de competencia perfecta y sus implicancias en la eficiencia económica.',
          category: 'theoretical',
          order: 4,
          displayNumber: 4,
          isLocked: true,
          estimatedDuration: 35,
          difficulty: 'intermediate',
          tags: ['competencia', 'eficiencia', 'modelo'],
          path: '4-competencia-perfecta',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      }

      let mockPracticalModules: TribunalModule[] = [];

      // Si no hay contenido en localStorage, usar datos de prueba para prácticos también
      if (mockPracticalModules.length === 0) {
        mockPracticalModules = [
        {
          id: 'practico-1',
          title: 'Introducción al Trading',
          description: 'Aprende los conceptos básicos del trading y cómo funciona el mercado financiero.',
          category: 'practical',
          order: 1,
          displayNumber: 1,
          isLocked: false,
          estimatedDuration: 60,
          difficulty: 'beginner',
          tags: ['trading', 'basico', 'introduccion'],
          path: '1-introduccion-trading',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'practico-2',
          title: 'Introducción al Análisis Técnico',
          description: 'Descubre los fundamentos del análisis técnico y su importancia en el trading.',
          category: 'practical',
          order: 2,
          displayNumber: 2,
          isLocked: false,
          estimatedDuration: 55,
          difficulty: 'beginner',
          tags: ['analisis-tecnico', 'graficos', 'trading'],
          path: '2-introduccion-analisis-tecnico',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'practico-3',
          title: 'Patrones de vela',
          description: 'Identifica y utiliza los patrones de velas japonesas para anticipar movimientos.',
          category: 'practical',
          order: 3,
          displayNumber: 3,
          isLocked: true,
          estimatedDuration: 45,
          difficulty: 'intermediate',
          tags: ['velas-japonesas', 'patrones', 'analisis'],
          path: '3-patrones-vela',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'practico-4',
          title: 'Fibonacci y medias móviles',
          description: 'Aplica Fibonacci y medias móviles para encontrar zonas clave de soporte y resistencia.',
          category: 'practical',
          order: 4,
          displayNumber: 4,
          isLocked: true,
          estimatedDuration: 50,
          difficulty: 'intermediate',
          tags: ['fibonacci', 'medias-moviles', 'soporte-resistencia'],
          path: '4-fibonacci-medias',
          authorName: 'Sistema Tribunal Imperial',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      }

      const mockCheckpoints = [
        {
          id: 'checkpoint-teorico-1',
          title: 'Punto de Control 1: Evaluación de Módulos 1 y 2',
          description: 'Evalúa los módulos "Introducción y la lógica económica" y "Fuerzas del mercado"',
          category: 'theoretical',
          checkpointNumber: 1,
          order: 2,
          isLocked: false,
          relatedModules: ['teorico-1', 'teorico-2']
        },
        {
          id: 'checkpoint-practico-1',
          title: 'Punto de Control 1: Evaluación de Módulos 1 y 2',
          description: 'Evalúa los módulos "Introducción al Trading" y "Introducción al Análisis Técnico"',
          category: 'practical',
          checkpointNumber: 1,
          order: 2,
          isLocked: false,
          relatedModules: ['practico-1', 'practico-2']
        }
      ];

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState({
        theoretical: mockTheoreticalModules,
        practical: mockPracticalModules,
        checkpoints: mockCheckpoints,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error('Error al cargar módulos del Tribunal Imperial:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los módulos del Tribunal Imperial'
      }));
    }
  }, []);

  // Cargar módulos al montar el componente
  useEffect(() => {
    loadModules();
  }, [loadModules]);

  // Función para refrescar módulos
  const refreshModules = useCallback(() => {
    loadModules();
  }, [loadModules]);

  // Función para obtener módulos por categoría
  const getModulesByCategory = useCallback((category: 'theoretical' | 'practical') => {
    return state[category];
  }, [state]);

  // Función para obtener un módulo específico
  const getModuleById = useCallback((id: string) => {
    const allModules = [...state.theoretical, ...state.practical];
    return allModules.find(module => module.id === id);
  }, [state.theoretical, state.practical]);

  // Función para verificar si un módulo está desbloqueado
  const isModuleUnlocked = useCallback((moduleId: string) => {
    const module = getModuleById(moduleId);
    if (!module) return false;
    
    // Si no está bloqueado por configuración, verificar prerrequisitos
    if (!module.isLocked) return true;
    
    // Verificar si el módulo anterior está completado
    // En producción, esto vendría de la base de datos de progreso del usuario
    const previousModule = state.theoretical.concat(state.practical)
      .find(m => m.order === module.order - 1);
    
    if (previousModule) {
      // Simular verificación de progreso
      return module.order <= 2; // Solo los primeros 2 módulos están desbloqueados
    }
    
    return true;
  }, [getModuleById, state.theoretical, state.practical]);

  // Función para obtener estadísticas
  const getStats = useCallback(() => {
    const totalModules = state.theoretical.length + state.practical.length;
    const unlockedModules = state.theoretical.concat(state.practical)
      .filter(module => isModuleUnlocked(module.id)).length;
    const totalDuration = state.theoretical.concat(state.practical)
      .reduce((total, module) => total + module.estimatedDuration, 0);

    return {
      totalModules,
      unlockedModules,
      lockedModules: totalModules - unlockedModules,
      totalDuration,
      theoreticalCount: state.theoretical.length,
      practicalCount: state.practical.length,
      checkpointCount: state.checkpoints.length
    };
  }, [state, isModuleUnlocked]);

  return {
    ...state,
    loadModules,
    refreshModules,
    getModulesByCategory,
    getModuleById,
    isModuleUnlocked,
    getStats
  };
}
