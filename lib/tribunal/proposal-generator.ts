// 🏛️ GENERADOR DE PROPUESTAS - TRIBUNAL IMPERIAL
// Genera propuestas para migración de contenido

import { CustomModule, TribunalProposal, ProposalStatus, VoteType } from './types';
import { IndexedModule } from './module-indexing';
import { ConversionResult } from './content-converter';

export interface MigrationProposal {
  id: string;
  title: string;
  description: string;
  modules: IndexedModule[];
  checkpoints: any[];
  category: 'migration' | 'new_content' | 'update';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number; // en minutos
  authorId: string;
  authorName: string;
  createdAt: Date;
  status: ProposalStatus;
}

export class ProposalGenerator {
  
  /**
   * Genera propuestas de migración para todos los módulos
   */
  static generateMigrationProposals(
    conversionResult: ConversionResult,
    authorId: string,
    authorName: string
  ): MigrationProposal[] {
    
    const proposals: MigrationProposal[] = [];
    
    if (!conversionResult.modules || conversionResult.modules.length === 0) {
      return proposals;
    }
    
    // Agrupar módulos por categoría
    const theoreticalModules = conversionResult.modules.filter(m => m.category === 'theoretical');
    const practicalModules = conversionResult.modules.filter(m => m.category === 'practical');
    
    // Crear propuesta para módulos teóricos
    if (theoreticalModules.length > 0) {
      const theoreticalProposal = this.createMigrationProposal(
        'migracion-modulos-teoricos',
        'Migración de Módulos Teóricos de Iniciado',
        'Migración completa de todos los módulos teóricos del carrusel de Iniciado al sistema Tribunal Imperial. Incluye 8 módulos de economía y criptomonedas.',
        theoreticalModules,
        conversionResult.checkpoints?.filter(c => c.category === 'theoretical') || [],
        'migration',
        'high',
        authorId,
        authorName
      );
      
      proposals.push(theoreticalProposal);
    }
    
    // Crear propuesta para módulos prácticos
    if (practicalModules.length > 0) {
      const practicalProposal = this.createMigrationProposal(
        'migracion-modulos-practicos',
        'Migración de Módulos Prácticos de Iniciado',
        'Migración completa de todos los módulos prácticos del carrusel de Iniciado al sistema Tribunal Imperial. Incluye 10 módulos de trading y análisis técnico.',
        practicalModules,
        conversionResult.checkpoints?.filter(c => c.category === 'practical') || [],
        'migration',
        'high',
        authorId,
        authorName
      );
      
      proposals.push(practicalProposal);
    }
    
    // Crear propuesta para checkpoints
    if (conversionResult.checkpoints && conversionResult.checkpoints.length > 0) {
      const checkpointProposal = this.createMigrationProposal(
        'migracion-puntos-control',
        'Migración de Puntos de Control',
        'Migración de todos los puntos de control del sistema de Iniciado al Tribunal Imperial. Incluye evaluaciones cada 2 módulos.',
        [],
        conversionResult.checkpoints,
        'migration',
        'medium',
        authorId,
        authorName
      );
      
      proposals.push(checkpointProposal);
    }
    
    return proposals;
  }
  
  /**
   * Crea una propuesta de migración individual
   */
  private static createMigrationProposal(
    id: string,
    title: string,
    description: string,
    modules: IndexedModule[],
    checkpoints: any[],
    category: 'migration' | 'new_content' | 'update',
    priority: 'low' | 'medium' | 'high' | 'critical',
    authorId: string,
    authorName: string
  ): MigrationProposal {
    
    const estimatedTime = this.calculateEstimatedTime(modules, checkpoints);
    
    return {
      id: id,
      title: title,
      description: description,
      modules: modules,
      checkpoints: checkpoints,
      category: category,
      priority: priority,
      estimatedTime: estimatedTime,
      authorId: authorId,
      authorName: authorName,
      createdAt: new Date(),
      status: ProposalStatus.PENDING
    };
  }
  
  /**
   * Calcula el tiempo estimado para la migración
   */
  private static calculateEstimatedTime(modules: IndexedModule[], checkpoints: any[]): number {
    const moduleTime = modules.reduce((total, module) => {
      return total + (module.estimatedDuration || 30);
    }, 0);
    
    const checkpointTime = checkpoints.length * 15; // 15 min por checkpoint
    
    return moduleTime + checkpointTime;
  }
  
  /**
   * Convierte una propuesta de migración a TribunalProposal
   */
  static convertToTribunalProposal(
    migrationProposal: MigrationProposal,
    requiredVotes: number
  ): TribunalProposal {
    
    // Crear un módulo virtual que contenga toda la información
    const virtualModule: CustomModule = {
      id: migrationProposal.id,
      title: migrationProposal.title,
      description: migrationProposal.description,
      authorId: migrationProposal.authorId,
      authorName: migrationProposal.authorName,
      authorLevel: 6, // Maestro
      targetLevels: [1], // Solo Iniciado por ahora
      category: 'mixed', // Contiene tanto teórico como práctico
      content: this.generateProposalContent(migrationProposal),
      isPublished: false,
      createdAt: migrationProposal.createdAt,
      updatedAt: migrationProposal.createdAt,
      tags: this.generateProposalTags(migrationProposal),
      difficulty: this.determineProposalDifficulty(migrationProposal),
      estimatedDuration: migrationProposal.estimatedTime,
      prerequisites: []
    };
    
    return {
      id: `proposal_${migrationProposal.id}`,
      module: virtualModule,
      status: migrationProposal.status,
      submittedAt: migrationProposal.createdAt,
      votes: [],
      totalVotes: 0,
      requiredVotes: requiredVotes,
      unanimousApproval: false
    };
  }
  
  /**
   * Genera el contenido de la propuesta
   */
  private static generateProposalContent(migrationProposal: MigrationProposal): any[] {
    const content = [];
    
    // Agregar información general
    content.push({
      id: 'proposal-info',
      type: 'text',
      content: `# ${migrationProposal.title}\n\n${migrationProposal.description}`,
      order: 0,
      metadata: {
        fontSize: '2xl',
        isBold: true,
        alignment: 'center'
      }
    });
    
    // Agregar estadísticas
    const stats = this.generateProposalStats(migrationProposal);
    content.push({
      id: 'proposal-stats',
      type: 'text',
      content: `## Estadísticas de la Migración\n\n${stats}`,
      order: 1,
      metadata: {
        fontSize: 'lg',
        isBold: true,
        alignment: 'left'
      }
    });
    
    // Agregar lista de módulos
    if (migrationProposal.modules.length > 0) {
      const modulesList = migrationProposal.modules
        .map(m => `- **${m.title}** (${m.category}) - ${m.estimatedDuration} min`)
        .join('\n');
      
      content.push({
        id: 'proposal-modules',
        type: 'text',
        content: `## Módulos Incluidos\n\n${modulesList}`,
        order: 2,
        metadata: {
          fontSize: 'base',
          alignment: 'left'
        }
      });
    }
    
    // Agregar lista de checkpoints
    if (migrationProposal.checkpoints.length > 0) {
      const checkpointsList = migrationProposal.checkpoints
        .map(c => `- **Punto de Control ${c.checkpointNumber}** (${c.category})`)
        .join('\n');
      
      content.push({
        id: 'proposal-checkpoints',
        type: 'text',
        content: `## Puntos de Control Incluidos\n\n${checkpointsList}`,
        order: 3,
        metadata: {
          fontSize: 'base',
          alignment: 'left'
        }
      });
    }
    
    return content;
  }
  
  /**
   * Genera estadísticas de la propuesta
   */
  private static generateProposalStats(migrationProposal: MigrationProposal): string {
    const moduleCount = migrationProposal.modules.length;
    const checkpointCount = migrationProposal.checkpoints.length;
    const totalTime = migrationProposal.estimatedTime;
    
    const theoreticalCount = migrationProposal.modules.filter(m => m.category === 'theoretical').length;
    const practicalCount = migrationProposal.modules.filter(m => m.category === 'practical').length;
    
    return `
- **Total de módulos:** ${moduleCount}
  - Teóricos: ${theoreticalCount}
  - Prácticos: ${practicalCount}
- **Puntos de control:** ${checkpointCount}
- **Tiempo estimado:** ${totalTime} minutos
- **Prioridad:** ${migrationProposal.priority.toUpperCase()}
- **Categoría:** ${migrationProposal.category}
    `.trim();
  }
  
  /**
   * Genera tags para la propuesta
   */
  private static generateProposalTags(migrationProposal: MigrationProposal): string[] {
    const tags = ['migracion', migrationProposal.category];
    
    if (migrationProposal.modules.some(m => m.category === 'theoretical')) {
      tags.push('teorico');
    }
    
    if (migrationProposal.modules.some(m => m.category === 'practical')) {
      tags.push('practico');
    }
    
    if (migrationProposal.checkpoints.length > 0) {
      tags.push('checkpoints');
    }
    
    tags.push(migrationProposal.priority);
    
    return [...new Set(tags)];
  }
  
  /**
   * Determina la dificultad de la propuesta
   */
  private static determineProposalDifficulty(migrationProposal: MigrationProposal): 'beginner' | 'intermediate' | 'advanced' {
    if (migrationProposal.modules.length <= 5) return 'beginner';
    if (migrationProposal.modules.length <= 15) return 'intermediate';
    return 'advanced';
  }
  
  /**
   * Valida una propuesta de migración
   */
  static validateMigrationProposal(proposal: MigrationProposal): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!proposal.title || proposal.title.trim() === '') {
      issues.push('La propuesta debe tener un título');
    }
    
    if (!proposal.description || proposal.description.trim() === '') {
      issues.push('La propuesta debe tener una descripción');
    }
    
    if (proposal.modules.length === 0 && proposal.checkpoints.length === 0) {
      issues.push('La propuesta debe incluir al menos un módulo o checkpoint');
    }
    
    if (proposal.estimatedTime <= 0) {
      issues.push('El tiempo estimado debe ser mayor a 0');
    }
    
    if (proposal.modules.length > 20) {
      suggestions.push('Considerar dividir la propuesta en propuestas más pequeñas');
    }
    
    if (proposal.estimatedTime > 480) { // 8 horas
      suggestions.push('El tiempo estimado es muy alto, considerar dividir la propuesta');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}
