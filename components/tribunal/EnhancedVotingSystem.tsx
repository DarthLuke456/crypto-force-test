'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Edit3, Crown, User } from 'lucide-react';
import { useProposals } from '@/lib/tribunal/hooks/useProposals';
import { useSafeAuth } from '@/context/AuthContext';
import { SystemUser, getVotingUsers } from '@/lib/tribunal/system-users';
import { isSupremeMaestro, isTestingMaestro, canUserVoteByEmail, hasAbsoluteAuthority } from '@/lib/tribunal/permissions';

interface EnhancedVotingSystemProps {
  proposal: any;
  onVote: (vote: 'approve' | 'reject') => void;
  onEdit?: (proposal: any) => void;
}

export default function EnhancedVotingSystem({ proposal, onVote, onEdit }: EnhancedVotingSystemProps) {
  const { userData } = useSafeAuth();
  const { approveProposal, rejectProposal } = useProposals();
  const [votingStatus, setVotingStatus] = useState<'idle' | 'voting' | 'success' | 'error'>('idle');
  const [maestrosSistema, setMaestrosSistema] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [localProposal, setLocalProposal] = useState(proposal || { id: 'default', status: 'pending', votes: { approvals: [], rejections: [] } });

  // Cargar usuarios del sistema desde la base de datos
  useEffect(() => {
    let isMounted = true;
    
    const loadSystemUsers = async () => {
      try {
        setLoading(true);
        const users = await getVotingUsers();
        
        if (isMounted) {
          // Asegurar que users es un array válido
          if (Array.isArray(users) && users.length > 0) {
            setMaestrosSistema(users);
          } else {
            setMaestrosSistema([]);
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar usuarios del sistema:', error);
        if (isMounted) {
          setMaestrosSistema([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSystemUsers();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Sincronizar propuesta local con la propuesta del padre
  useEffect(() => {
    if (proposal && typeof proposal === 'object') {
      setLocalProposal(proposal);
    } else {
      // Si no hay propuesta válida, crear una por defecto
      setLocalProposal({
        id: 'default',
        status: 'pending',
        votes: { approvals: [], rejections: [] }
      });
    }
  }, [proposal]);

  // Determinar el estado de votación de cada maestro
  const getMaestroVoteStatus = (maestroId: string) => {
    const approvals = localProposal.votes?.approvals || [];
    const rejections = localProposal.votes?.rejections || [];
    
    if (approvals.includes(maestroId)) {
      return { status: 'approved', icon: ThumbsUp, color: 'text-green-400', bgColor: 'bg-green-900/20' };
    } else if (rejections.includes(maestroId)) {
      return { status: 'rejected', icon: ThumbsDown, color: 'text-red-400', bgColor: 'bg-red-900/20' };
    } else {
      return { status: 'pending', icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-900/20' };
    }
  };

  // Calcular estadísticas de votación
  const totalMaestros = maestrosSistema.length;
  const totalApprovals = localProposal.votes?.approvals?.length || 0;
  const totalRejections = localProposal.votes?.rejections?.length || 0;
  const totalVotes = totalApprovals + totalRejections;
  const pendingVotes = totalMaestros - totalVotes;

  // Determinar si la propuesta está decidida
  const isUnanimous = totalVotes === totalMaestros;
  const isApproved = isUnanimous && totalApprovals === totalMaestros;
  const isRejected = isUnanimous && totalRejections === totalMaestros;

  // Manejar votación
  const handleVote = async (vote: 'approve' | 'reject') => {
    if (!userData?.id || !userData?.email) return;
    
    // Verificar permisos de votación
    if (!canUserVoteByEmail(userData.email)) {
      alert('No tienes permisos para votar en el Tribunal Imperial');
      return;
    }
    
    // Verificar si es aprobación/rechazo (solo Maestro Supremo)
    if ((vote === 'approve' || vote === 'reject') && !isSupremeMaestro(userData.email)) {
      alert('Solo el Maestro Supremo puede aprobar o rechazar propuestas');
      return;
    }
    
    setVotingStatus('voting');
    try {
      if (vote === 'approve') {
        await approveProposal(localProposal.id, userData.id, userData.nickname || userData.email);
        // Actualizar inmediatamente el estado visual de la propuesta
        const updatedProposal = { ...localProposal };
        if (updatedProposal.votes) {
          if (!updatedProposal.votes.approvals) updatedProposal.votes.approvals = [];
          updatedProposal.votes.approvals.push(userData.id);
        } else {
          updatedProposal.votes = { approvals: [userData.id], rejections: [] };
        }
        setLocalProposal(updatedProposal);
      } else {
        await rejectProposal(localProposal.id, userData.id, userData.nickname || userData.email, 'Rechazada por el usuario');
        // Actualizar inmediatamente el estado visual de la propuesta
        const updatedProposal = { ...localProposal };
        if (updatedProposal.votes) {
          if (!updatedProposal.votes.rejections) updatedProposal.votes.rejections = [];
          updatedProposal.votes.rejections.push(userData.id);
        } else {
          updatedProposal.votes = { approvals: [], rejections: [userData.id] };
        }
        setLocalProposal(updatedProposal);
      }
      
      // Forzar re-renderizado para mostrar el cambio visual inmediato
      setVotingStatus('success');
      setTimeout(() => setVotingStatus('idle'), 1000);
      
      // Llamar a onVote para notificar al componente padre
      onVote(vote);
    } catch (error) {
      console.error('Error al votar:', error);
      setVotingStatus('error');
      setTimeout(() => setVotingStatus('idle'), 3000);
    }
  };

  // Verificar si el usuario actual puede votar
  const canVote = userData?.email ? canUserVoteByEmail(userData.email) : false;
  const canApprove = userData?.email ? hasAbsoluteAuthority(userData.email) : false;
  const isTestingUser = userData?.email ? isTestingMaestro(userData.email) : false;
  const isSupremeUser = userData?.email ? isSupremeMaestro(userData.email) : false;
  const hasVoted = localProposal.votes?.approvals?.includes(userData?.id) ||
                   localProposal.votes?.rejections?.includes(userData?.id);

  return (
    <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-6">
      {/* Header con estadísticas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sistema de Votación del Tribunal</h3>
        
        {/* Indicador de carga */}
        {loading && (
          <div className="mb-4 p-4 bg-[#121212] border border-[#8a8a8a] rounded-lg text-center">
            <div className="text-yellow-400 mb-2">⏳ Cargando usuarios del sistema...</div>
            <div className="text-sm text-gray-400">Conectando con la base de datos</div>
          </div>
        )}
        
        {/* Estadísticas generales */}
        {!loading && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-[#121212] rounded-lg">
              <div className="text-2xl font-bold text-white">{totalMaestros}</div>
              <div className="text-xs text-gray-400">Total Maestros</div>
            </div>
            <div className="text-center p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{totalApprovals}</div>
              <div className="text-xs text-green-300">Aprobaciones</div>
            </div>
            <div className="text-center p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{totalRejections}</div>
              <div className="text-xs text-red-300">Rechazos</div>
            </div>
            <div className="text-center p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{pendingVotes}</div>
              <div className="text-xs text-yellow-300">Pendientes</div>
            </div>
          </div>
        )}

        {/* Estado de la propuesta */}
        {isUnanimous && (
          <div className={`p-4 rounded-lg border ${
            isApproved 
              ? 'bg-green-900/20 border-green-500/30 text-green-300' 
              : 'bg-red-900/20 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              {isApproved ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-medium">
                {isApproved ? 'Propuesta Aprobada por Darth Nihilus o Darth Luke' : 'Propuesta Rechazada por Darth Nihilus o Darth Luke'}
              </span>
            </div>
            <p className="text-center text-sm mt-1 opacity-80">
              {isApproved 
                ? 'El contenido será integrado automáticamente en los carruseles correspondientes'
                : 'La propuesta ha sido rechazada y no será integrada'
              }
            </p>
          </div>
        )}
      </div>

      {/* Lista de maestros y sus votos - INTERFAZ MINIMALISTA */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-300 mb-3">Estado de Votación por Maestro:</h4>
        
        {!loading && maestrosSistema.length > 0 ? (
          maestrosSistema.map((maestro) => {
            const voteStatus = getMaestroVoteStatus(maestro.id);
            const hasVoted = voteStatus.status !== 'pending';
            const isCurrentUser = userData?.id === maestro.id;
            
            return (
              <div key={maestro.id} className={`flex items-center justify-between p-3 rounded-lg border border-[#8a8a8a] ${
                hasVoted ? 'bg-[#121212]' : 'bg-[#121212]'
              }`}>
                <div className="flex items-center space-x-3">
                  {/* Icono de estado principal - Clock siempre visible */}
                  <div className={`p-2 rounded-full ${
                    hasVoted ? 'bg-[#8a8a8a]' : 'bg-yellow-900/20'
                  }`}>
                    <Clock 
                      size={16} 
                      className={hasVoted ? 'text-gray-400' : 'text-yellow-400'} 
                    />
                  </div>
                  
                  {/* Información del usuario */}
                  <div>
                    <div className="font-medium text-white">
                      {maestro.nickname}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-[#fafafa] text-[#121212] px-2 py-1 rounded-full">
                          Tú
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {maestro.email} • Nivel {maestro.level} • {maestro.role}
                    </div>
                  </div>
                </div>
                
                {/* Iconos de votación compactos - INTERFAZ MINIMALISTA */}
                <div className="flex items-center space-x-2">
                  {/* Indicador de tipo de usuario */}
        {isCurrentUser && (
          <div className="flex items-center space-x-1">
            {isSupremeUser && <Crown size={12} className="text-yellow-400" />}
            {isTestingUser && !isSupremeUser && <User size={12} className="text-blue-400" />}
          </div>
        )}
                  
                  {/* Pulgar hacia arriba - Solo Maestro Supremo puede aprobar */}
                  <button
                    onClick={() => handleVote('approve')}
                    disabled={votingStatus === 'voting' || hasVoted || !canApprove}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      voteStatus.status === 'approved' 
                        ? 'bg-green-900/20 text-green-400' 
                        : canApprove 
                          ? 'bg-[#8a8a8a] text-gray-400 hover:bg-[#8a8a8a] hover:text-gray-300'
                          : 'bg-[#222] text-gray-600 cursor-not-allowed'
                    } ${!hasVoted && canApprove ? 'cursor-pointer' : 'cursor-default'}`}
                    title={canApprove ? (hasVoted ? 'Ya votado' : 'Aprobar (Darth Nihilus/Darth Luke)') : 'Solo Darth Nihilus y Darth Luke pueden aprobar'}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  
                  {/* Pulgar hacia abajo - Solo Maestro Supremo puede rechazar */}
                  <button
                    onClick={() => handleVote('reject')}
                    disabled={votingStatus === 'voting' || hasVoted || !canApprove}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      voteStatus.status === 'rejected' 
                        ? 'bg-red-900/20 text-red-400' 
                        : canApprove 
                          ? 'bg-[#8a8a8a] text-gray-400 hover:bg-[#8a8a8a] hover:text-gray-300'
                          : 'bg-[#222] text-gray-600 cursor-not-allowed'
                    } ${!hasVoted && canApprove ? 'cursor-pointer' : 'cursor-default'}`}
                    title={canApprove ? (hasVoted ? 'Ya votado' : 'Rechazar (Darth Nihilus/Darth Luke)') : 'Solo Darth Nihilus y Darth Luke pueden rechazar'}
                  >
                    <ThumbsDown size={14} />
                  </button>
                  
                  {/* Estado textual compacto */}
                  <div className="text-xs text-gray-400 ml-2 min-w-[60px] text-right">
                    {voteStatus.status === 'approved' && 'Aprobado'}
                    {voteStatus.status === 'rejected' && 'Rechazado'}
                    {voteStatus.status === 'pending' && 'Pendiente'}
                  </div>
                </div>
              </div>
            );
          })
        ) : !loading && maestrosSistema.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-lg mb-2">⚠️ No se encontraron usuarios del sistema</div>
            <div className="text-sm">Verifica la conexión con la base de datos</div>
          </div>
        ) : null}
      </div>

      {/* Estado de la votación - Solo se muestra cuando se está votando */}
      {votingStatus === 'voting' && (
        <div className="mt-4 p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-center">
          <div className="text-yellow-400 text-sm">⏳ Procesando tu voto...</div>
        </div>
      )}
      
      {/* Feedback visual inmediato: Los pulgares cambian de color automáticamente */}
      {/* No se muestran mensajes de éxito - el cambio visual es suficiente */}

      {/* Botón de edición para propuestas pendientes */}
      {onEdit && localProposal.status === 'pending' && (
        <div className="mt-4 text-center">
          <button
            onClick={() => onEdit(localProposal)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Edit3 size={16} />
            <span>Editar Propuesta</span>
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg">
        <div className="text-xs text-gray-400 text-center">
          <p>• Darth Nihilus (infocryptoforce@gmail.com) - Autoridad Suprema</p>
          <p>• Darth Luke (coeurdeluke.js@gmail.com) - Autoridad Temporal</p>
          <p>• Ambos pueden aprobar/rechazar propuestas inmediatamente</p>
          <p>• Las propuestas aprobadas se integran automáticamente en los carruseles</p>
          <p>• Los usuarios se cargan dinámicamente desde la base de datos</p>
          <p>• Haz clic en los pulgares para votar directamente desde la lista</p>
          <p>• El feedback visual es inmediato: los pulgares cambian de color automáticamente</p>
        </div>
      </div>
    </div>
  );
}
