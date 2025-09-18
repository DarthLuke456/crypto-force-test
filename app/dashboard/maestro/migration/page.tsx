'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Upload, 
  BookOpen, 
  Zap, 
  Clock,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';
import { MigrationOrchestrator, MigrationResult } from '@/lib/tribunal/migration-orchestrator';

export default function MigrationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [selectedMigration, setSelectedMigration] = useState<'full' | 'theoretical' | 'practical'>('full');
  const [authorId, setAuthorId] = useState('system-tribunal-imperial');
  const [authorName, setAuthorName] = useState('Sistema Tribunal Imperial');

  // Cargar resultado previo al montar
  useEffect(() => {
    const saved = MigrationOrchestrator.loadMigrationResult();
    if (saved) {
      setMigrationResult(saved);
    }
  }, []);

  // Ejecutar migración
  const executeMigration = async () => {
    setIsRunning(true);
    
    try {
      let result: MigrationResult;
      
      switch (selectedMigration) {
        case 'theoretical':
          result = await MigrationOrchestrator.executeTheoreticalMigration(authorId, authorName);
          break;
        case 'practical':
          result = await MigrationOrchestrator.executePracticalMigration(authorId, authorName);
          break;
        default:
          result = await MigrationOrchestrator.executeFullMigration(authorId, authorName);
      }
      
      setMigrationResult(result);
      MigrationOrchestrator.saveMigrationResult(result);
      
    } catch (error) {
      console.error('Error ejecutando migración:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Generar reporte
  const generateReport = () => {
    if (!migrationResult) return;
    
    const report = MigrationOrchestrator.generateMigrationReport(migrationResult);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#fafafa] mb-2">
            🏛️ Migración al Tribunal Imperial
          </h1>
          <p className="text-gray-400">
            Migra el contenido existente de los carruseles de Iniciado al sistema Tribunal Imperial
          </p>
        </div>

        {/* Configuración */}
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-[#fafafa] mb-4">Configuración</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Migración
              </label>
              <select
                value={selectedMigration}
                onChange={(e) => setSelectedMigration(e.target.value as any)}
                className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:ring-2 focus:ring-[#ec4d58] focus:border-transparent"
              >
                <option value="full">Migración Completa</option>
                <option value="theoretical">Solo Módulos Teóricos</option>
                <option value="practical">Solo Módulos Prácticos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID del Autor
              </label>
              <input
                type="text"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:ring-2 focus:ring-[#ec4d58] focus:border-transparent"
                placeholder="system-tribunal-imperial"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Autor
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:ring-2 focus:ring-[#ec4d58] focus:border-transparent"
                placeholder="Sistema Tribunal Imperial"
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={executeMigration}
            disabled={isRunning}
            className="flex items-center space-x-2 px-6 py-3 bg-[#ec4d58] hover:bg-[#d63d47] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>{isRunning ? 'Ejecutando...' : 'Ejecutar Migración'}</span>
          </button>

          {migrationResult && (
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Reporte</span>
            </button>
          )}
        </div>

        {/* Resultado de la Migración */}
        {migrationResult && (
          <div className="space-y-6">
            {/* Resumen */}
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#fafafa] mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Resumen de la Migración
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-[#ec4d58]" />
                    <span className="text-sm font-medium text-gray-300">Teóricos</span>
                  </div>
                  <div className="text-2xl font-bold text-[#fafafa]">
                    {migrationResult.theoreticalModules.length}
                  </div>
                </div>
                
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-300">Prácticos</span>
                  </div>
                  <div className="text-2xl font-bold text-[#fafafa]">
                    {migrationResult.practicalModules.length}
                  </div>
                </div>
                
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-300">Checkpoints</span>
                  </div>
                  <div className="text-2xl font-bold text-[#fafafa]">
                    {migrationResult.checkpoints.length}
                  </div>
                </div>
                
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-300">Tiempo Est.</span>
                  </div>
                  <div className="text-2xl font-bold text-[#fafafa]">
                    {migrationResult.stats.estimatedTime}m
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                {migrationResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-medium ${
                  migrationResult.success ? 'text-green-500' : 'text-red-500'
                }`}>
                  {migrationResult.success ? 'Migración Exitosa' : 'Migración Fallida'}
                </span>
              </div>
            </div>

            {/* Módulos Migrados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teóricos */}
              {migrationResult.theoreticalModules.length > 0 && (
                <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#fafafa] mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-[#ec4d58]" />
                    Módulos Teóricos ({migrationResult.theoreticalModules.length})
                  </h3>
                  <div className="space-y-2">
                    {migrationResult.theoreticalModules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                        <div>
                          <div className="font-medium text-[#fafafa]">{module.title}</div>
                          <div className="text-sm text-gray-400">{module.estimatedDuration} min</div>
                        </div>
                        <div className="text-xs text-gray-500">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prácticos */}
              {migrationResult.practicalModules.length > 0 && (
                <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#fafafa] mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-500" />
                    Módulos Prácticos ({migrationResult.practicalModules.length})
                  </h3>
                  <div className="space-y-2">
                    {migrationResult.practicalModules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                        <div>
                          <div className="font-medium text-[#fafafa]">{module.title}</div>
                          <div className="text-sm text-gray-400">{module.estimatedDuration} min</div>
                        </div>
                        <div className="text-xs text-gray-500">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Errores y Advertencias */}
            {(migrationResult.errors.length > 0 || migrationResult.warnings.length > 0) && (
              <div className="space-y-4">
                {migrationResult.errors.length > 0 && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Errores ({migrationResult.errors.length})
                    </h3>
                    <div className="space-y-2">
                      {migrationResult.errors.map((error, index) => (
                        <div key={index} className="text-red-300 text-sm">
                          • {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {migrationResult.warnings.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Advertencias ({migrationResult.warnings.length})
                    </h3>
                    <div className="space-y-2">
                      {migrationResult.warnings.map((warning, index) => (
                        <div key={index} className="text-yellow-300 text-sm">
                          • {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
