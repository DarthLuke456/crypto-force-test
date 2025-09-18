// 🏛️ ORQUESTADOR DE MIGRACIÓN - TRIBUNAL IMPERIAL
// Ejecuta todo el proceso de migración automáticamente

import { MigrationExtractor } from './migration-extractor';
import { ContentConverter } from './content-converter';
import { ProposalGenerator } from './proposal-generator';
import { ModuleIndexingSystem } from './module-indexing';

export interface MigrationResult {
  success: boolean;
  theoreticalModules: any[];
  practicalModules: any[];
  checkpoints: any[];
  proposals: any[];
  errors: string[];
  warnings: string[];
  stats: {
    totalModules: number;
    totalCheckpoints: number;
    totalProposals: number;
    estimatedTime: number;
  };
}

export class MigrationOrchestrator {
  
  /**
   * Ejecuta la migración completa de todos los módulos
   */
  static async executeFullMigration(
    authorId: string = 'system-tribunal-imperial',
    authorName: string = 'Sistema Tribunal Imperial'
  ): Promise<MigrationResult> {
    
    console.log('🏛️ Iniciando migración completa al Tribunal Imperial...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      // 1. Extraer módulos existentes
      console.log('📚 Extrayendo módulos teóricos...');
      const theoreticalModules = MigrationExtractor.extractTheoreticalModules();
      
      console.log('⚡ Extrayendo módulos prácticos...');
      const practicalModules = MigrationExtractor.extractPracticalModules();
      
      console.log(`✅ Extraídos ${theoreticalModules.length} módulos teóricos y ${practicalModules.length} módulos prácticos`);
      
      // 2. Convertir contenido al formato Tribunal Imperial
      console.log('🔄 Convirtiendo contenido...');
      const conversionResult = ContentConverter.convertAllModules(
        theoreticalModules,
        practicalModules,
        authorId,
        authorName
      );
      
      if (!conversionResult.success) {
        errors.push(...(conversionResult.errors || []));
        warnings.push(...(conversionResult.warnings || []));
      }
      
      // 3. Generar propuestas de migración
      console.log('📋 Generando propuestas...');
      const proposals = ProposalGenerator.generateMigrationProposals(
        conversionResult,
        authorId,
        authorName
      );
      
      // 4. Validar migración
      console.log('✅ Validando migración...');
      const validation = ContentConverter.validateConversion(conversionResult);
      
      if (!validation.isValid) {
        errors.push(...validation.issues);
        warnings.push(...validation.suggestions);
      }
      
      // 5. Calcular estadísticas
      const stats = this.calculateMigrationStats(
        conversionResult.modules || [],
        conversionResult.checkpoints || [],
        proposals
      );
      
      const result: MigrationResult = {
        success: errors.length === 0,
        theoreticalModules: conversionResult.modules?.filter(m => m.category === 'theoretical') || [],
        practicalModules: conversionResult.modules?.filter(m => m.category === 'practical') || [],
        checkpoints: conversionResult.checkpoints || [],
        proposals: proposals,
        errors,
        warnings,
        stats
      };
      
      console.log('🎉 Migración completada exitosamente!');
      console.log(`📊 Estadísticas:`, stats);
      
      if (warnings.length > 0) {
        console.log('⚠️ Advertencias:', warnings);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      errors.push(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      
      return {
        success: false,
        theoreticalModules: [],
        practicalModules: [],
        checkpoints: [],
        proposals: [],
        errors,
        warnings,
        stats: {
          totalModules: 0,
          totalCheckpoints: 0,
          totalProposals: 0,
          estimatedTime: 0
        }
      };
    }
  }
  
  /**
   * Ejecuta migración solo de módulos teóricos
   */
  static async executeTheoreticalMigration(
    authorId: string = 'system-tribunal-imperial',
    authorName: string = 'Sistema Tribunal Imperial'
  ): Promise<MigrationResult> {
    
    console.log('📚 Iniciando migración de módulos teóricos...');
    
    try {
      const theoreticalModules = MigrationExtractor.extractTheoreticalModules();
      const conversionResult = ContentConverter.convertAllModules(
        theoreticalModules,
        [], // Sin módulos prácticos
        authorId,
        authorName
      );
      
      const proposals = ProposalGenerator.generateMigrationProposals(
        conversionResult,
        authorId,
        authorName
      );
      
      const stats = this.calculateMigrationStats(
        conversionResult.modules || [],
        conversionResult.checkpoints || [],
        proposals
      );
      
      return {
        success: conversionResult.success,
        theoreticalModules: conversionResult.modules?.filter(m => m.category === 'theoretical') || [],
        practicalModules: [],
        checkpoints: conversionResult.checkpoints || [],
        proposals: proposals,
        errors: conversionResult.errors || [],
        warnings: conversionResult.warnings || [],
        stats
      };
      
    } catch (error) {
      console.error('❌ Error en migración teórica:', error);
      return {
        success: false,
        theoreticalModules: [],
        practicalModules: [],
        checkpoints: [],
        proposals: [],
        errors: [`Error en migración teórica: ${error instanceof Error ? error.message : 'Error desconocido'}`],
        warnings: [],
        stats: {
          totalModules: 0,
          totalCheckpoints: 0,
          totalProposals: 0,
          estimatedTime: 0
        }
      };
    }
  }
  
  /**
   * Ejecuta migración solo de módulos prácticos
   */
  static async executePracticalMigration(
    authorId: string = 'system-tribunal-imperial',
    authorName: string = 'Sistema Tribunal Imperial'
  ): Promise<MigrationResult> {
    
    console.log('⚡ Iniciando migración de módulos prácticos...');
    
    try {
      const practicalModules = MigrationExtractor.extractPracticalModules();
      const conversionResult = ContentConverter.convertAllModules(
        [], // Sin módulos teóricos
        practicalModules,
        authorId,
        authorName
      );
      
      const proposals = ProposalGenerator.generateMigrationProposals(
        conversionResult,
        authorId,
        authorName
      );
      
      const stats = this.calculateMigrationStats(
        conversionResult.modules || [],
        conversionResult.checkpoints || [],
        proposals
      );
      
      return {
        success: conversionResult.success,
        theoreticalModules: [],
        practicalModules: conversionResult.modules?.filter(m => m.category === 'practical') || [],
        checkpoints: conversionResult.checkpoints || [],
        proposals: proposals,
        errors: conversionResult.errors || [],
        warnings: conversionResult.warnings || [],
        stats
      };
      
    } catch (error) {
      console.error('❌ Error en migración práctica:', error);
      return {
        success: false,
        theoreticalModules: [],
        practicalModules: [],
        checkpoints: [],
        proposals: [],
        errors: [`Error en migración práctica: ${error instanceof Error ? error.message : 'Error desconocido'}`],
        warnings: [],
        stats: {
          totalModules: 0,
          totalCheckpoints: 0,
          totalProposals: 0,
          estimatedTime: 0
        }
      };
    }
  }
  
  /**
   * Calcula estadísticas de la migración
   */
  private static calculateMigrationStats(
    modules: any[],
    checkpoints: any[],
    proposals: any[]
  ) {
    const totalModules = modules.length;
    const totalCheckpoints = checkpoints.length;
    const totalProposals = proposals.length;
    
    const estimatedTime = modules.reduce((total, module) => {
      return total + (module.estimatedDuration || 30);
    }, 0) + (checkpoints.length * 15); // 15 min por checkpoint
    
    return {
      totalModules,
      totalCheckpoints,
      totalProposals,
      estimatedTime
    };
  }
  
  /**
   * Genera reporte de migración
   */
  static generateMigrationReport(result: MigrationResult): string {
    const report = `
# 🏛️ REPORTE DE MIGRACIÓN - TRIBUNAL IMPERIAL

## 📊 Resumen Ejecutivo
- **Estado**: ${result.success ? '✅ EXITOSA' : '❌ FALLIDA'}
- **Módulos Teóricos**: ${result.theoreticalModules.length}
- **Módulos Prácticos**: ${result.practicalModules.length}
- **Puntos de Control**: ${result.checkpoints.length}
- **Propuestas Generadas**: ${result.proposals.length}
- **Tiempo Estimado**: ${result.stats.estimatedTime} minutos

## 📚 Módulos Migrados

### Teóricos (${result.theoreticalModules.length})
${result.theoreticalModules.map(m => `- ${m.title} (${m.estimatedDuration} min)`).join('\n')}

### Prácticos (${result.practicalModules.length})
${result.practicalModules.map(m => `- ${m.title} (${m.estimatedDuration} min)`).join('\n')}

## 🎯 Puntos de Control (${result.checkpoints.length})
${result.checkpoints.map(c => `- ${c.title} (${c.category})`).join('\n')}

## 📋 Propuestas Generadas (${result.proposals.length})
${result.proposals.map(p => `- ${p.title} (${p.priority})`).join('\n')}

## ⚠️ Errores (${result.errors.length})
${result.errors.length > 0 ? result.errors.map(e => `- ${e}`).join('\n') : 'Ninguno'}

## 💡 Advertencias (${result.warnings.length})
${result.warnings.length > 0 ? result.warnings.map(w => `- ${w}`).join('\n') : 'Ninguna'}

## 🚀 Próximos Pasos
1. Revisar y aprobar las propuestas generadas
2. Configurar el sistema de votación
3. Activar el contenido migrado
4. Notificar a los usuarios sobre el nuevo contenido

---
*Generado automáticamente por el Sistema Tribunal Imperial*
*Fecha: ${new Date().toLocaleString()}*
    `.trim();
    
    return report;
  }
  
  /**
   * Guarda el resultado de la migración en localStorage
   */
  static saveMigrationResult(result: MigrationResult): void {
    try {
      const migrationData = {
        ...result,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      localStorage.setItem('tribunal-migration-result', JSON.stringify(migrationData));
      console.log('💾 Resultado de migración guardado en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar resultado de migración:', error);
    }
  }
  
  /**
   * Carga el resultado de la migración desde localStorage
   */
  static loadMigrationResult(): MigrationResult | null {
    try {
      const saved = localStorage.getItem('tribunal-migration-result');
      if (saved) {
        const migrationData = JSON.parse(saved);
        console.log('📂 Resultado de migración cargado desde localStorage');
        return migrationData;
      }
    } catch (error) {
      console.error('❌ Error al cargar resultado de migración:', error);
    }
    
    return null;
  }
}
