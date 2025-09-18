import React, { useState } from 'react';
import { Edit, Trash2, Users, AlertTriangle } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
import { useProposals } from '@/lib/tribunal/hooks/useProposals';
import EnhancedVotingSystem from './EnhancedVotingSystem';

interface ApprovedContentManagerProps {
  onEditApprovedContent: (proposal: any) => void;
}

export default function ApprovedContentManager({ onEditApprovedContent }: ApprovedContentManagerProps) {
  const { proposals, createProposal } = useProposals();
  const { userData } = useSafeAuth();
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);

  // Solo mostrar propuestas aprobadas
  const approvedProposals = proposals.filter(p => p.status === 'approved');

  // Obtener propuestas de gestión pendientes (para editar/eliminar contenido aprobado)
  const managementProposals = proposals.filter(p => 
    p.status === 'pending' && 
    (p.category === 'edit_approved_content' || p.category === 'delete_approved_content')
  );

  const handleRequestEdit = (proposal: any) => {
    if (!userData?.id) return;

    const editRequest = {
      title: `Solicitud de Edición: ${proposal.title}`,
      description: `Solicitud para editar el contenido aprobado "${proposal.title}"`,
      category: 'edit_approved_content' as const,
      targetHierarchy: proposal.targetHierarchy,
      authorId: userData.id,
      authorName: userData.nickname || userData.email,
      authorLevel: userData.user_level || 0,
      status: 'pending' as const,
      votes: {
        maestros: [],
        approvals: [],
        rejections: [],
      },
      content: [{
        id: Date.now().toString(),
        type: 'text' as const,
        content: `Se solicita editar el contenido aprobado con ID: ${proposal.id}`,
        order: 0,
        metadata: {},
      }],
      originalProposalId: proposal.id, // Referencia al contenido original
    };

    createProposal(editRequest);
    setShowEditModal(null);
  };

  const handleRequestDelete = (proposal: any) => {
    if (!userData?.id) return;

    const deleteRequest = {
      title: `Solicitud de Eliminación: ${proposal.title}`,
      description: `Solicitud para eliminar el contenido aprobado "${proposal.title}"`,
      category: 'delete_approved_content' as const,
      targetHierarchy: proposal.targetHierarchy,
      authorId: userData.id,
      authorName: userData.nickname || userData.email,
      authorLevel: userData.user_level || 0,
      status: 'pending' as const,
      votes: {
        maestros: [],
        approvals: [],
        rejections: [],
      },
      content: [{
        id: Date.now().toString() + '_delete',
        type: 'text' as const,
        content: `Se solicita eliminar el contenido aprobado con ID: ${proposal.id}`,
        order: 0,
        metadata: {},
      }],
      originalProposalId: proposal.id, // Referencia al contenido original
    };

    createProposal(deleteRequest);
    setShowDeleteModal(null);
  };

  if (approvedProposals.length === 0) {
    return (
      <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg p-6">
        <div className="text-center py-12">
          <Users size={64} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay contenido aprobado</h3>
          <p className="text-gray-500 mb-4">El contenido aprobado aparecerá aquí cuando sea votado por unanimidad</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contenido Aprobado */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Contenido Publicado en el Carrusel</h3>
        {approvedProposals.map((proposal) => (
          <div key={proposal.id} className="bg-[#121212] border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-white">{proposal.title}</h4>
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Publicado
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{proposal.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>Autor: {proposal.authorName}</span>
                  <span>Categoría: {proposal.category === 'theoretical' ? 'Teórico' : 'Práctico'}</span>
                  <span>Nivel: {proposal.targetHierarchy}</span>
                  <span>Aprobado: {proposal.approvedAt ? new Date(proposal.approvedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              
              {/* Botones para gestionar contenido aprobado */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEditModal(proposal.id)}
                  className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  title="Solicitar edición"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteModal(proposal.id)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Solicitar eliminación"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Solicitudes de Gestión Pendientes */}
      {managementProposals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Solicitudes de Gestión Pendientes</h3>
          {managementProposals.map((request) => (
            <div key={request.id} className="bg-[#121212] border border-yellow-500/30 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-xl font-semibold text-white">{request.title}</h4>
                    <span className="px-3 py-1 bg-yellow-500 text-black text-sm rounded-full font-medium">
                      {request.category === 'edit_approved_content' ? 'Solicitud de Edición' : 'Solicitud de Eliminación'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-lg">{request.description}</p>
                
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle size={20} className="text-orange-400" />
                    <h5 className="text-orange-400 font-medium">Advertencia Importante</h5>
                  </div>
                  <p className="text-orange-200 text-sm">
                    Esta solicitud afectará contenido que ya está disponible para los estudiantes en el carrusel. 
                    Se requiere <strong>unanimidad total</strong> de todos los Maestros para proceder.
                  </p>
                </div>

                {/* Sistema de votación para gestión */}
                <EnhancedVotingSystem 
                  proposal={request}
                  onVote={() => {}} // La lógica está dentro del componente
                  onEdit={() => {}} // No se puede editar una solicitud de gestión
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Solicitar Edición de Contenido</h3>
              <div className="space-y-4">
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-orange-200 text-sm">
                    ¿Estás seguro de que quieres solicitar la edición de este contenido? 
                    Esta acción requerirá la aprobación unánime de todos los Maestros del Tribunal.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const proposal = approvedProposals.find(p => p.id === showEditModal);
                      if (proposal) handleRequestEdit(proposal);
                    }}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Solicitar Edición
                  </button>
                  <button
                    onClick={() => setShowEditModal(null)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121212] border border-[#8a8a8a] rounded-lg shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Solicitar Eliminación de Contenido</h3>
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 text-sm">
                    ¿Estás seguro de que quieres solicitar la eliminación de este contenido? 
                    Esta acción es <strong>irreversible</strong> y requerirá la aprobación unánime de todos los Maestros del Tribunal.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const proposal = approvedProposals.find(p => p.id === showDeleteModal);
                      if (proposal) handleRequestDelete(proposal);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Solicitar Eliminación
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
