'use client';

import { useSafeAuth } from '@/context/AuthContext-working';
import { useProgress } from '@/context/ProgressContext';
import { BarChart3, BookOpen, TrendingUp, CheckCircle, Clock, Target, Trophy } from 'lucide-react';

export default function ProgressPage() {
  const { userData } = useSafeAuth();
  const { progress } = useProgress();

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando progreso...</p>
        </div>
      </div>
    );
  }

  // Calcular estadísticas de progreso
  const theoreticalNivel1 = progress.theoretical?.nivel1 || { checkpoints: {}, results: {} };
  const theoreticalNivel2 = progress.theoretical?.nivel2 || { checkpoints: {}, results: {} };
  const practicalNivel1 = progress.practical?.nivel1 || { checkpoints: {}, results: {} };
  const practicalNivel2 = progress.practical?.nivel2 || { checkpoints: {}, results: {} };

  const theoreticalCheckpointsCompleted = Object.values(theoreticalNivel1.checkpoints).filter(Boolean).length + 
                                        Object.values(theoreticalNivel2.checkpoints).filter(Boolean).length;
  const practicalCheckpointsCompleted = Object.values(practicalNivel1.checkpoints).filter(Boolean).length + 
                                       Object.values(practicalNivel2.checkpoints).filter(Boolean).length;

  const totalCheckpoints = 8; // 4 teóricos + 4 prácticos
  const totalCompleted = theoreticalCheckpointsCompleted + practicalCheckpointsCompleted;
  const overallProgress = Math.round((totalCompleted / totalCheckpoints) * 100);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Progreso</h1>
          <p className="text-gray-400">Seguimiento de tu avance en el curso</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              Progreso General
            </h2>
            <span className="text-2xl font-bold text-yellow-500">{overallProgress}%</span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {totalCompleted} de {totalCheckpoints} puntos de control completados
          </p>
        </div>

        {/* Progress by Category */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Theoretical Progress */}
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold">Teórico</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Nivel 1</span>
                  <span className="text-sm font-medium">
                    {Object.values(theoreticalNivel1.checkpoints).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.values(theoreticalNivel1.checkpoints).filter(Boolean).length / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Nivel 2</span>
                  <span className="text-sm font-medium">
                    {Object.values(theoreticalNivel2.checkpoints).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.values(theoreticalNivel2.checkpoints).filter(Boolean).length / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Progress */}
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
              <h3 className="text-lg font-semibold">Práctico</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Nivel 1</span>
                  <span className="text-sm font-medium">
                    {Object.values(practicalNivel1.checkpoints).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.values(practicalNivel1.checkpoints).filter(Boolean).length / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Nivel 2</span>
                  <span className="text-sm font-medium">
                    {Object.values(practicalNivel2.checkpoints).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(Object.values(practicalNivel2.checkpoints).filter(Boolean).length / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1a] border border-[#232323] rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {totalCompleted === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Aún no has completado ningún punto de control. ¡Comienza tu aprendizaje!
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries({...theoreticalNivel1.checkpoints, ...theoreticalNivel2.checkpoints, ...practicalNivel1.checkpoints, ...practicalNivel2.checkpoints})
                  .filter(([_, completed]) => completed)
                  .map(([checkpoint, _]) => (
                    <div key={checkpoint} className="flex items-center p-3 bg-[#2a2a2a] rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm">Punto de Control {checkpoint} completado</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

