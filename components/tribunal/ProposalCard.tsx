'use client';

import { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Vote
} from 'lucide-react';
import { TribunalProposal, VoteType } from '@/lib/tribunal/types';
import { TribunalVotingSystem } from '@/lib/tribunal/voting-system';
import { canUserVote, canUserEditProposal, canUserDeleteProposal } from '@/lib/tribunal/permissions';

interface ProposalCardProps {
  proposal: TribunalProposal;
  currentUserId: string;
  currentUserLevel: number;
  onVote?: (proposalId: string, vote: VoteType, comment?: string) => void;
  onEdit?: (proposalId: string) => void;
  onDelete?: (proposalId: string) => void;
  onView?: (proposalId: string) => void;
}

export default function ProposalCard({
  proposal,
  currentUserId,
  currentUserLevel,
  onVote,
  onEdit,
  onDelete,
  onView
}: ProposalCardProps) {
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voteType, setVoteType] = useState<VoteType | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar permisos del usuario
  const canVote = canUserVote(currentUserLevel);
  const canEdit = canUserEditProposal(currentUserLevel, proposal.module.authorId, currentUserId);
  const canDelete = canUserDeleteProposal(currentUserLevel, proposal.module.authorId, currentUserId);
  const canView = true; // Todos pueden ver las propuestas

  // Obtener progreso de votación
  const votingProgress = TribunalVotingSystem.getProposalVotingProgress(proposal);

  // Verificar si el usuario ya votó
  const userVote = proposal.votes.find(v => v.maestrosId === currentUserId);
  const hasVoted = !!userVote;

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'rejected':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'expired':
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  // Obtener icono del estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'expired':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  // Obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'pending':
        return 'Pendiente';
      case 'expired':
        return 'Expirada';
      default:
        return 'Desconocido';
    }
  };

  // Manejar envío del voto
  const handleVoteSubmit = async () => {
    if (!voteType || !onVote) return;

    setIsSubmitting(true);
    try {
      await onVote(proposal.id, voteType, comment);
      setShowVoteModal(false);
      setVoteType(null);
      setComment('');
    } catch (error) {
      console.error('Error al procesar el voto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener color de la dificultad
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-900/20';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'advanced':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-6 hover:border-[#fafafa] transition-all duration-200">
      {/* Header de la propuesta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{proposal.module.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{proposal.module.description}</p>
          
          {/* Metadatos */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(proposal.module.difficulty)}`}>
              {proposal.module.difficulty === 'beginner' ? 'Principiante' :
               proposal.module.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
            </span>
            
            <span className="px-3 py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-900/20">
              {proposal.module.category === 'theoretical' ? 'Teórico' :
               proposal.module.category === 'practical' ? 'Práctico' : 'Mixto'}
            </span>
            
            <span className="px-3 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-900/20">
              {proposal.module.estimatedDuration} min
            </span>
          </div>
        </div>
        
        {/* Estado de la propuesta */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(proposal.status)}`}>
          {getStatusIcon(proposal.status)}
          <span>{getStatusText(proposal.status)}</span>
        </div>
      </div>

      {/* Información del autor */}
      <div className="flex items-center justify-between mb-4 p-3 bg-[#121212] rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#fafafa] to-[#8a8a8a] rounded-full flex items-center justify-center">
            <span className="text-[#121212] font-bold text-sm">
              {proposal.module.authorLevel === 5 ? 'D' : 'M'}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{proposal.module.authorName}</p>
            <p className="text-gray-400 text-sm">
              {proposal.module.authorLevel === 5 ? 'Darth' : 'Maestro'}
            </p>
          </div>
        </div>
        
        <div className="text-right text-sm text-gray-400">
          <p>Enviada: {proposal.submittedAt.toLocaleDateString('es-ES')}</p>
          <p>Niveles objetivo: {proposal.module.targetLevels.join(', ')}</p>
        </div>
      </div>

      {/* Progreso de votación */}
      {proposal.status === 'pending' && (
        <div className="mb-4 p-4 bg-[#121212] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Progreso de Votación</span>
            <span className="text-gray-400 text-sm">
              {votingProgress.totalVotes} / {votingProgress.requiredVotes} votos
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-[#8a8a8a] rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-[#fafafa] to-[#8a8a8a] h-2 rounded-full transition-all duration-300"
              style={{ width: `${votingProgress.progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Votos: {votingProgress.approveVotes} aprobados, {votingProgress.rejectVotes} rechazados</span>
            <span>Restantes: {votingProgress.remainingVotes}</span>
          </div>
          
          {votingProgress.estimatedCompletion !== 'Indefinido' && (
            <p className="text-xs text-gray-400 mt-1">
              Estimado: {votingProgress.estimatedCompletion}
            </p>
          )}
        </div>
      )}

      {/* Votos realizados */}
      {proposal.votes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Votos del Tribunal</h4>
          <div className="space-y-2">
            {proposal.votes.map((vote) => (
              <div key={vote.id} className="flex items-center justify-between p-2 bg-[#121212] rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">{vote.maestrosName}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    vote.vote === 'approve' ? 'text-green-400 bg-green-900/20' :
                    vote.vote === 'reject' ? 'text-red-400 bg-red-900/20' :
                    'text-gray-400 bg-gray-900/20'
                  }`}>
                    {vote.vote === 'approve' ? 'Aprobado' :
                     vote.vote === 'reject' ? 'Rechazado' : 'Abstención'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {vote.votedAt.toLocaleDateString('es-ES')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Razón de rechazo */}
      {proposal.status === 'rejected' && proposal.rejectionReason && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h4 className="text-red-400 font-medium mb-2">Motivo del Rechazo</h4>
          <p className="text-red-300 text-sm">{proposal.rejectionReason}</p>
          <p className="text-red-400 text-xs mt-2">
            Rechazado por {proposal.rejectionAuthorName} el {proposal.rejectionDate?.toLocaleDateString('es-ES')}
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between pt-4 border-t border-[#8a8a8a]">
        <div className="flex space-x-2">
          {canView && (
            <button
              onClick={() => onView?.(proposal.id)}
              className="flex items-center space-x-2 px-3 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#444] transition-colors"
            >
              <Eye size={16} />
              <span>Ver</span>
            </button>
          )}
          
          {canEdit && proposal.status === 'pending' && (
            <button
              onClick={() => onEdit?.(proposal.id)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              <span>Editar</span>
            </button>
          )}
          
          {canDelete && proposal.status === 'pending' && (
            <button
              onClick={() => onDelete?.(proposal.id)}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span>Eliminar</span>
            </button>
          )}
        </div>
        
        {/* Botón de votación */}
        {canVote && proposal.status === 'pending' && !hasVoted && (
          <button
            onClick={() => setShowVoteModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#fafafa] text-[#121212] rounded-lg font-semibold hover:bg-[#8a8a8a] transition-colors"
          >
            <Vote size={16} />
            <span>Emitir Voto</span>
          </button>
        )}
        
        {/* Estado del voto del usuario */}
        {hasVoted && (
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            userVote.vote === 'approve' ? 'bg-green-900/20 text-green-400' :
            userVote.vote === 'reject' ? 'bg-red-900/20 text-red-400' :
            'bg-gray-900/20 text-gray-400'
          }`}>
            <span className="text-sm font-medium">
              {userVote.vote === 'approve' ? 'Votaste: Aprobar' :
               userVote.vote === 'reject' ? 'Votaste: Rechazar' : 'Votaste: Abstención'}
            </span>
          </div>
        )}
      </div>

      {/* Modal de votación */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Emitir Voto</h3>
            
            <div className="space-y-4">
              {/* Opciones de voto */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="vote"
                    value="approve"
                    checked={voteType === 'approve'}
                    onChange={(e) => setVoteType(e.target.value as VoteType)}
                    className="text-[#fafafa]"
                  />
                  <span className="text-white">Aprobar</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="vote"
                    value="reject"
                    checked={voteType === 'reject'}
                    onChange={(e) => setVoteType(e.target.value as VoteType)}
                    className="text-[#fafafa]"
                  />
                  <span className="text-white">Rechazar</span>
                </label>
              </div>
              
              {/* Comentario (obligatorio para rechazo) */}
              {voteType === 'reject' && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Comentario (Obligatorio)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Explica el motivo del rechazo..."
                    className="w-full p-3 bg-[#121212] border border-[#8a8a8a] rounded-lg text-white placeholder-gray-400 focus:border-[#fafafa] outline-none"
                    rows={3}
                  />
                </div>
              )}
              
              {/* Botones */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowVoteModal(false)}
                  className="flex-1 px-4 py-2 bg-[#8a8a8a] text-white rounded-lg hover:bg-[#444] transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleVoteSubmit}
                  disabled={!voteType || (voteType === 'reject' && !comment.trim()) || isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#fafafa] text-[#121212] rounded-lg font-semibold hover:bg-[#8a8a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Voto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
