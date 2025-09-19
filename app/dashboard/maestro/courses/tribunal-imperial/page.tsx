'use client';

import { useState, useEffect } from 'react';
import { Crown, FileText, CheckCircle, XCircle, Clock, Users, BarChart3, Plus, Eye, Save, Edit, Trash2, ArrowLeft, HelpCircle, ExternalLink, X } from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
import { canUserAccessTribunal, hasAbsoluteAuthority } from '@/lib/tribunal/permissions';
import ContentEditor from '@/components/tribunal/ContentEditor';
import NotionEditor from '@/components/tribunal/NotionEditor';
import ProposalHeader from '@/components/tribunal/ProposalHeader';
import BackButton from '@/components/ui/BackButton';
import MinimalContentCreator from '@/components/tribunal/MinimalContentCreator';
import { ContentBlock } from '@/lib/tribunal/types';
import { useProposals, TribunalProposal } from '@/lib/tribunal/hooks/useProposals';
import EnhancedVotingSystem from '@/components/tribunal/EnhancedVotingSystem';
import { processAutoApproval, isFounderUser, createAutoApprovalNotification } from '@/lib/tribunal/auto-approval';

interface TribunalStats {
  propuestasPendientes: number;
  propuestasAprobadas: number;
  propuestasRechazadas: number;
}

// Componente para mostrar la lista de propuestas
function ProposalsList({ onEditProposal }: { onEditProposal: (proposal: any) => void }) {
  const { proposals, deleteProposal, submitProposal, createProposal, clearAllProposals } = useProposals();
  const { userData } = useSafeAuth();

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta propuesta?')) {
      deleteProposal(id);
    }
  };

  const handleSubmit = (id: string) => {
    if (confirm('¿Estás seguro de que quieres enviar esta propuesta para revisión?')) {
      submitProposal(id);
    }
  };

  if (proposals.length === 0) {
    return (
      <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
        <div className="text-center py-12">
          <FileText size={64} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay propuestas</h3>
          <p className="text-gray-500 mb-4">Crea tu primera propuesta para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="space-y-4">
          <ProposalHeader
            title={proposal.title}
            subtitle={proposal.description}
            author={proposal.authorName || 'No especificado'}
            authorLevel={proposal.authorLevel || 6}
            category={proposal.category}
            targetHierarchy={proposal.targetHierarchy}
            createdAt={proposal.createdAt}
            status={proposal.status}
            showAuthor={true}
            showMetadata={true}
          />
          
          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-2">
            {/* Botones para el autor de la propuesta */}
            {proposal.authorId === userData?.id && (
              <>
                {/* Editar propuesta (solo si no está aprobada) */}
                {proposal.status !== 'approved' && (
                  <button
                    onClick={() => onEditProposal(proposal)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Editar propuesta"
                  >
                    <Edit size={16} />
                  </button>
                )}
                
                {/* Eliminar propuesta (solo si es borrador o pendiente) */}
                {(proposal.status === 'draft' || proposal.status === 'pending') && (
                  <button
                    onClick={() => handleDelete(proposal.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            )}
            
            {/* Botones para propuestas en borrador */}
            {proposal.status === 'draft' && (
              <>
                <button
                  onClick={() => handleSubmit(proposal.id)}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Enviar para revisión"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDelete(proposal.id)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


// Componente para mostrar propuestas aprobadas
function ApprovedProposals() {
  const { proposals } = useProposals();
  const approvedProposals = proposals.filter(p => p.status === 'approved');
  
  if (approvedProposals.length === 0) {
    return (
      <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
        <div className="text-center py-12">
          <CheckCircle size={64} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay propuestas aprobadas</h3>
          <p className="text-gray-500 mb-4">Las propuestas aprobadas aparecerán aquí una vez que sean aprobadas por Darth Nihilus o Darth Luke</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {approvedProposals.map((proposal) => (
        <div key={proposal.id} className="space-y-4">
          <ProposalHeader
            title={proposal.title}
            subtitle={proposal.description}
            author={proposal.authorName || 'No especificado'}
            authorLevel={proposal.authorLevel || 6}
            category={proposal.category}
            targetHierarchy={proposal.targetHierarchy}
            createdAt={proposal.createdAt}
            approvedAt={proposal.approvedAt}
            status="approved"
            showAuthor={true}
            showMetadata={true}
            className="border-green-500"
          />
            
            {proposal.content && Array.isArray(proposal.content) && proposal.content.length > 0 && (
              <div className="bg-[#121212] border border-[#444] rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Contenido Aprobado:</h4>
              <div className="space-y-4">
                {proposal.content.map((block, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <div className="flex-1">
                        <div className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">Tipo:</span> {block.type}
                        </div>
                        {block.type === 'image' ? (
                          <div className="mt-2">
                            {block.content && block.content.startsWith('data:image') ? (
                              <img 
                                src={block.content} 
                                alt="Imagen de la propuesta"
                                className="max-w-full h-auto rounded-lg border border-[#444]"
                                style={{
                                  maxHeight: '300px',
                                  objectFit: 'contain'
                                }}
                              />
                            ) : (
                              <div className="text-red-400 text-xs">
                                ❌ Imagen no disponible o corrupta
                              </div>
                            )}
                          </div>
                        ) : block.type === 'text' ? (
                            <div className="bg-[#121212] p-3 rounded border border-[#333]">
                            {block.content}
                          </div>
                        ) : (
                            <div className="bg-[#121212] p-3 rounded border border-[#333]">
                            {block.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
            
            {/* Botón de Acceso Directo */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const location = {
                    dashboard: 'iniciado',
                    level: proposal.targetHierarchy || 1,
                    category: proposal.category || 'theoretical',
                    carouselId: `tribunal-carousel-${proposal.category || 'theoretical'}`,
                    cardId: `content-card-${proposal.id}`
                  };
                  const url = `/dashboard/iniciado?scrollTo=${location.carouselId}&cardId=${location.cardId}&level=${location.level}&category=${location.category}`;
                  window.location.href = url;
                }}
                className="px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors text-sm font-medium"
              >
                Ver en Dashboard
              </button>
            </div>
            
            <div className="text-center text-sm text-green-400 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <p className="font-medium">✅ Esta propuesta ha sido aprobada por Darth Nihilus o Darth Luke</p>
              <p className="mt-1">El contenido será integrado automáticamente en los carruseles correspondientes</p>
            </div>
        </div>
      ))}
    </div>
  );
}

// Componente para mostrar propuestas rechazadas
function RejectedProposals() {
  const { proposals } = useProposals();
  const rejectedProposals = proposals.filter(p => p.status === 'rejected');
  
  if (rejectedProposals.length === 0) {
    return (
      <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
        <div className="text-center py-12">
          <XCircle size={64} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay propuestas rechazadas</h3>
          <p className="text-gray-500 mb-4">Las propuestas rechazadas aparecerán aquí una vez que sean votadas negativamente</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {rejectedProposals.map((proposal) => (
        <div key={proposal.id} className="space-y-4">
          <ProposalHeader
            title={proposal.title}
            subtitle={proposal.description}
            author={proposal.authorName || 'No especificado'}
            authorLevel={proposal.authorLevel || 6}
            category={proposal.category}
            targetHierarchy={proposal.targetHierarchy}
            createdAt={proposal.createdAt}
            status="rejected"
            showAuthor={true}
            showMetadata={true}
            className="border-red-500"
          />
            
            {proposal.content && Array.isArray(proposal.content) && proposal.content.length > 0 && (
              <div className="bg-[#121212] border border-[#444] rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Contenido Rechazado:</h4>
              <div className="space-y-4">
                {proposal.content.map((block, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <div className="flex-1">
                        <div className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">Tipo:</span> {block.type}
                        </div>
                        {block.type === 'image' ? (
                          <div className="mt-2">
                            {block.content && block.content.startsWith('data:image') ? (
                              <img 
                                src={block.content} 
                                alt="Imagen de la propuesta"
                                className="max-w-full h-auto rounded-lg border border-[#444]"
                                style={{
                                  maxHeight: '300px',
                                  objectFit: 'contain'
                                }}
                              />
                            ) : (
                              <div className="text-red-400 text-xs">
                                ❌ Imagen no disponible o corrupta
                              </div>
                            )}
                          </div>
                        ) : block.type === 'text' ? (
                            <div className="bg-[#121212] p-3 rounded border border-[#333]">
                            {block.content}
                          </div>
                        ) : (
                            <div className="bg-[#121212] p-3 rounded border border-[#333]">
                            {block.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-300 mb-2">Motivo del Rechazo:</h4>
              <p className="text-red-200">{proposal.rejectionReason || 'No se proporcionó motivo'}</p>
            </div>
            
            <div className="text-center text-sm text-red-400">
              <p className="font-medium">❌ Esta propuesta ha sido rechazada</p>
              <p className="mt-1">El autor puede revisar el motivo y crear una nueva versión</p>
            </div>
        </div>
      ))}
    </div>
  );
}

export default function TribunalImperialPage() {
  const { userData, loading, isReady } = useSafeAuth();
  const { proposals, createProposal, updateProposal } = useProposals();
  const [activeTab, setActiveTab] = useState<'overview' | 'propuestas' | 'aprobados' | 'rechazados' | 'gestion'>('overview');
  const [editingProposal, setEditingProposal] = useState<any | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showMinimalCreator, setShowMinimalCreator] = useState(false);

  // Convert ContentBlock back to Block format for editing
  const convertContentBlockToBlock = (contentBlock: any): any => {
    const baseBlock = {
      id: contentBlock.id,
      order: contentBlock.order,
      metadata: contentBlock.metadata || {}
    };

    // Check metadata for special types
    if (contentBlock.metadata?.isHeading) {
      return {
        ...baseBlock,
        type: 'heading',
        content: contentBlock.content
      };
    }
    
    if (contentBlock.metadata?.isSubheading) {
      return {
        ...baseBlock,
        type: 'subheading',
        content: contentBlock.content
      };
    }
    
    if (contentBlock.metadata?.isList) {
      return {
        ...baseBlock,
        type: 'list',
        content: contentBlock.content
      };
    }

    // Map other types directly
    const typeMapping: { [key: string]: string } = {
      'text': 'text',
      'image': 'image',
      'video': 'video',
      'link': 'link',
      'code': 'code',
      'quote': 'quote',
      'divider': 'divider',
      'checklist': 'checklist'
    };

    return {
      ...baseBlock,
      type: typeMapping[contentBlock.type] || 'text',
      content: contentBlock.content
    };
  };

  // Handle editing proposal
  const handleEditProposal = (proposal: any) => {
    if (!userData?.email || !hasAbsoluteAuthority(userData.email)) {
      alert('Solo Darth Nihilus y Darth Luke pueden editar contenido.');
      return;
    }

    // Convert content blocks to editor blocks
    const editorBlocks = Array.isArray(proposal.content) 
      ? proposal.content.map(convertContentBlockToBlock)
      : [];

    setEditingProposal(proposal);
    setIsEditingMode(true);
    setActiveTab('gestion');
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingProposal(null);
    setIsEditingMode(false);
  };

  // Handle updating proposal
  const handleUpdateProposal = (blocks: any[], metadata: any) => {
    if (!editingProposal) return;

    try {
      // Update the proposal with new content
      updateProposal(editingProposal.id, {
        title: metadata.title,
        description: metadata.description,
        content: blocks,
        category: metadata.category,
        targetHierarchy: metadata.targetHierarchy,
        updatedAt: new Date()
      });

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
      successMessage.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span class="font-medium">¡Contenido actualizado exitosamente!</span>
      `;
      document.body.appendChild(successMessage);

      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.parentNode.removeChild(successMessage);
        }
      }, 3000);

      // Exit editing mode
      handleCancelEdit();
    } catch (error) {
      console.error('Error al actualizar:', error);
      
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
      errorMessage.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span class="font-medium">Error al actualizar el contenido</span>
      `;
      document.body.appendChild(errorMessage);

      setTimeout(() => {
        if (errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage);
        }
      }, 3000);
    }
  };

  // Update existing proposals with correct author names
  useEffect(() => {
    if (proposals.length > 0) {
      const updatedProposals = proposals.map(proposal => {
        // Update author names based on authorId or email patterns
        let updatedAuthorName = proposal.authorName;
        
        // Check if this is a proposal that should have "Darth Nihilus" as author
        // This is a temporary fix for existing data
        if (proposal.authorName === 'Tribunal Imperial' || proposal.authorName === 'No especificado') {
          updatedAuthorName = 'Darth Nihilus';
        }
        
        // If the author name needs updating, update the proposal
        if (updatedAuthorName !== proposal.authorName) {
          updateProposal(proposal.id, { authorName: updatedAuthorName });
        }
        
        return proposal;
      });
    }
  }, [proposals, updateProposal]);

  // Calcular estadísticas reales basadas en las propuestas
  const pendingCount = proposals.filter(p => p.status === 'pending').length;
  const approvedCount = proposals.filter(p => p.status === 'approved').length;
  const rejectedCount = proposals.filter(p => p.status === 'rejected').length;
  
  const stats: TribunalStats = {
    propuestasPendientes: pendingCount,
    propuestasAprobadas: approvedCount,
    propuestasRechazadas: rejectedCount
  };

  // Logs de diagnóstico

  // SOLUCIÓN SIMPLIFICADA - Mostrar siempre el contenido
  // Solo verificar si hay datos del usuario, pero no bloquear el acceso
  if (!isReady || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white mt-4">Cargando Tribunal Imperial...</p>
        </div>
      </div>
    );
  }

  // Verificación simplificada de acceso
  if (isReady && userData) {
    const authorizedEmails = ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'];
    const isAuthorized = authorizedEmails.includes(userData.email.toLowerCase().trim());
    
    if (!isAuthorized) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
            <p className="text-[#a0a0a0] mb-6">No tienes acceso al Tribunal Imperial</p>
            <p className="text-[#6a6a6a] text-sm">Tu email: {userData.email}</p>
          </div>
        </div>
      );
    }
  }

  const handleSaveProposal = async (content: any[], metadata?: { level: number; customLevelText: string; targetDashboard: string }) => {
    
    // Crear propuesta que coincida con la interfaz TribunalProposal
    const proposal = {
      id: `proposal-${Date.now()}`,
      title: content.find((b: any) => b.type === 'title')?.content || 'Sin título',
      description: content.find((b: any) => b.type === 'subtitle')?.content || 'Sin subtítulo',
      category: 'theoretical' as const,
      targetHierarchy: metadata?.level || 1,
      content: content,
      authorId: userData?.id || '',
      authorName: userData?.nickname || userData?.email || 'Usuario',
      authorLevel: userData?.user_level || 1,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: {
        maestros: [],
        approvals: [],
        rejections: []
      }
    };
    
    // Verificar si debe ser auto-aprobada
    const authorEmail = userData?.email || '';
    if (authorEmail && isFounderUser(authorEmail)) {
      try {
        // Guardar en la base de datos
        const response = await fetch('/api/tribunal/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: proposal.title,
            subtitle: proposal.description,
            content: proposal.content,
            level: proposal.targetHierarchy,
            category: proposal.category,
            is_published: true, // Auto-publicar para fundadores
            created_by: authorEmail // Usar email en lugar de ID
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          // Crear inyección de contenido
          const injectionResponse = await fetch('/api/tribunal/inject', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contentId: result.id,
              targetLevel: proposal.targetHierarchy,
              targetDashboard: metadata?.targetDashboard || 'iniciado',
              injectionPosition: 'carousel',
              isActive: true
            })
          });

          if (injectionResponse.ok) {
          } else {
            console.error('❌ Error creando inyección:', await injectionResponse.text());
          }
          
          alert('Propuesta creada y aprobada automáticamente por ser usuario fundador. El contenido ya está disponible en el dashboard.');
          setActiveTab('aprobados');
        } else {
          console.error('❌ Error guardando en base de datos:', await response.text());
          alert('Error guardando el contenido. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('❌ Error en auto-aprobación:', error);
        alert('Error procesando la propuesta. Inténtalo de nuevo.');
      }
    } else {
      createProposal(proposal);
    alert('Propuesta guardada exitosamente. Será enviada al Tribunal para votación.');
    setActiveTab('propuestas');
    }
  };

  const handleProposalCreated = (proposal: TribunalProposal) => {
    alert('Propuesta creada exitosamente. Ahora puedes verla en la sección de Propuestas.');
    setActiveTab('propuestas');
  };

  const handlePreviewContent = (content: ContentBlock[]) => {
    // La vista previa se maneja internamente en el ContentEditor
  };




  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header del Tribunal Imperial */}
      <div className="bg-[#121212] border-b border-[#333] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-[#fafafa] rounded-lg">
              <Crown size={24} className="text-[#121212]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#fafafa]">Tribunal Imperial</h1>
              <p className="text-gray-400 text-sm">Sistema de Creación y Aprobación de Contenido</p>
            </div>
          </div>
          
          {/* Botón de navegación */}
          <div className="flex items-center space-x-4">
            <BackButton href="/dashboard/maestro/courses" />
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <div className="bg-[#121212] border-b border-[#333] p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Vista General', icon: <BarChart3 size={18} /> },
              { id: 'propuestas', label: 'Propuestas', icon: <FileText size={18} /> },
              { id: 'aprobados', label: 'Aprobados', icon: <CheckCircle size={18} /> },
              { id: 'rechazados', label: 'Rechazados', icon: <XCircle size={18} /> },
              { id: 'gestion', label: 'Gestión', icon: <Edit size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                    ? 'bg-[#fafafa] text-[#121212]'
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
          </div>
          
          {/* Botón de Creación */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowMinimalCreator(true)}
              className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#fafafa] to-[#e0e0e0] text-black font-semibold rounded-xl hover:from-[#f0f0f0] hover:to-[#d0d0d0] transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Crear Contenido</span>
              <span className="sm:hidden">Crear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-6">
        {/* TAB: Vista General */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Estadísticas del Tribunal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Propuestas Pendientes</p>
                    <p className="text-2xl font-bold text-[#fafafa]">{stats.propuestasPendientes}</p>
                  </div>
                  <Clock size={24} className="text-gray-400" />
                </div>
              </div>

              <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Aprobadas</p>
                    <p className="text-2xl font-bold text-green-400">{stats.propuestasAprobadas}</p>
                  </div>
                  <CheckCircle size={24} className="text-green-400" />
                </div>
              </div>

              <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Rechazadas</p>
                    <p className="text-2xl font-bold text-red-400">{stats.propuestasRechazadas}</p>
                  </div>
                  <XCircle size={24} className="text-red-400" />
                </div>
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-6">¿Cómo Funciona el Tribunal Imperial?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#fafafa] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText size={20} className="text-[#121212]" />
                  </div>
                  <h3 className="font-medium text-white mb-2">1. Creación de Propuestas</h3>
                  <p className="text-gray-400 text-sm">Darths y Maestros crean contenido educativo usando el editor visual</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#fafafa] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users size={20} className="text-[#121212]" />
                  </div>
                  <h3 className="font-medium text-white mb-2">2. Aprobación del Maestro Supremo</h3>
                  <p className="text-gray-400 text-sm">Solo el Maestro Supremo puede aprobar o rechazar propuestas</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#fafafa] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={20} className="text-[#121212]" />
                  </div>
                  <h3 className="font-medium text-white mb-2">3. Despliegue Automático</h3>
                  <p className="text-gray-400 text-sm">Una vez aprobado, se genera automáticamente el carrousel en las dashboards</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB: Propuestas */}
        {activeTab === 'propuestas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Propuestas Pendientes</h2>
            </div>
            
            <ProposalsList onEditProposal={handleEditProposal} />
          </div>
        )}



        {/* TAB: Aprobados */}
        {activeTab === 'aprobados' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#fafafa]">Contenido Aprobado</h2>
              <div className="text-sm text-gray-400">
                Propuestas que han sido aprobadas por Darth Nihilus o Darth Luke
              </div>
            </div>
            
            <ApprovedProposals />
          </div>
        )}

        {/* TAB: Rechazados */}
        {activeTab === 'rechazados' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#fafafa]">Contenido Rechazado</h2>
              <div className="text-sm text-gray-400">
                Propuestas que han sido rechazadas por al menos un Maestro
              </div>
            </div>
            
            <RejectedProposals />
          </div>
        )}

        {/* TAB: Gestión de Contenido Aprobado */}
        {activeTab === 'gestion' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#fafafa]">
                {isEditingMode ? 'Editando Contenido' : 'Gestión de Contenido Publicado'}
              </h2>
              <div className="text-sm text-gray-400">
                {isEditingMode 
                  ? 'Modo edición activo - Solo Darth Nihilus y Darth Luke'
                  : 'Gestión directa de contenido aprobado - Solo Darth Nihilus y Darth Luke'
                }
              </div>
            </div>
            
            <div className="bg-[#121212] border border-[#333] rounded-lg p-6">
              <div className="space-y-6">
                {/* Editing Mode Interface */}
                {isEditingMode && editingProposal ? (
                  <div className="space-y-6">
                    {/* Editing Header */}
                    <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Edit size={24} className="text-orange-400" />
                          <div>
                            <h3 className="text-lg font-semibold text-orange-300">Editando: {editingProposal.title}</h3>
                            <p className="text-sm text-orange-200">Modifica el contenido usando el editor visual</p>
                          </div>
                        </div>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <ArrowLeft size={16} />
                          <span>Cancelar Edición</span>
                        </button>
                      </div>
                    </div>

                    {/* Editor for Editing */}
                    <div className="bg-[#121212] rounded-lg p-4">
                      <NotionEditor
                        initialBlocks={Array.isArray(editingProposal.content) 
                          ? editingProposal.content.map(convertContentBlockToBlock)
                          : []
                        }
                        isEditing={true}
                        onUpdate={handleUpdateProposal}
                        onBlocksChange={(blocks) => {
                          console.log('Bloques del editor de edición:', blocks);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Información de Autoridad */}
                    <div className="bg-[#121212] border border-[#fafafa]/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Crown size={24} className="text-[#fafafa]" />
                        <h3 className="text-lg font-semibold text-[#fafafa]">Sistema de Autoridad</h3>
                      </div>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p><span className="text-[#fafafa] font-medium">Darth Nihilus</span> (infocryptoforce@gmail.com) - Autoridad Suprema</p>
                        <p><span className="text-blue-400 font-medium">Darth Luke</span> (coeurdeluke.js@gmail.com) - Autoridad Temporal</p>
                        <p className="text-gray-400 text-xs mt-2">Ambos tienen poder absoluto para aprobar, rechazar, editar y eliminar cualquier contenido.</p>
                      </div>
                    </div>

                {/* Contenido Aprobado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contenido Publicado</h3>
                  {proposals.filter(p => p.status === 'approved').length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle size={48} className="text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No hay contenido aprobado disponible</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {proposals.filter(p => p.status === 'approved').map((proposal: any) => (
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
                                <span>Por: {proposal.authorName}</span>
                                <span>Categoría: {proposal.category === 'theoretical' ? 'Teórico' : 'Práctico'}</span>
                                <span>Nivel: {proposal.targetHierarchy}</span>
                                <span>Aprobado: {proposal.approvedAt ? new Date(proposal.approvedAt).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                            
                           {/* Acciones de gestión - Solo Darth Nihilus y Darth Luke */}
                           {userData?.email && hasAbsoluteAuthority(userData.email) ? (
                             <div className="flex items-center space-x-2">
                               <button
                                 onClick={() => handleEditProposal(proposal)}
                                 className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                 title="Editar contenido (Solo Darth Nihilus y Darth Luke)"
                               >
                                 <Edit size={16} />
                               </button>
                               <button
                                 onClick={() => {
                                   if (confirm('¿Estás seguro de que quieres eliminar este contenido? Esta acción es irreversible.')) {
                                     // Implementar eliminación directa
                                     console.log('Eliminando contenido:', proposal.id);
                                   }
                                 }}
                                 className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                 title="Eliminar contenido (Solo Darth Nihilus y Darth Luke)"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           ) : (
                             <div className="flex items-center space-x-2">
                               <div className="p-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed" title="Solo Darth Nihilus y Darth Luke pueden gestionar contenido">
                                 <Edit size={16} />
                               </div>
                               <div className="p-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed" title="Solo Darth Nihilus y Darth Luke pueden gestionar contenido">
                                 <Trash2 size={16} />
                               </div>
          </div>
        )}
      </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Guía de Uso */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#444] rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <HelpCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Guía Completa del Creador de Contenido</h3>
                    <p className="text-sm text-gray-400">Instrucciones detalladas para crear contenido</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-all duration-200"
                >
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#121212] border border-[#444] rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#fafafa] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#121212] text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#fafafa] mb-1">Crear Contenido</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Haz clic en cualquier área vacía del editor para agregar nuevos bloques de contenido. 
                        Aparecerá un menú con opciones de tipos de bloque (título, texto, imagen, video, etc.).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#121212] border border-[#444] rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-1">Editar Bloques</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Selecciona cualquier bloque haciendo clic en él para ver las opciones de edición. 
                        Aparecerá una barra de herramientas con botones para cambiar el tipo, duplicar, eliminar o mover el bloque.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#121212] border border-[#444] rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-1">Guardar Propuesta</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Cuando selecciones un bloque, aparecerá una barra flotante en la parte inferior con el botón dorado "Guardar". 
                        Haz clic para abrir el modal de configuración donde podrás definir la categoría y nivel del contenido.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#121212] border border-[#444] rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-1">Reorganizar Contenido</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Arrastra y suelta los bloques para reorganizar el orden del contenido. 
                        Cada bloque tiene un indicador de arrastre que aparece al pasar el cursor sobre él.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#121212] border border-[#444] rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">5</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-orange-400 mb-1">Requisitos Importantes</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        <strong>Obligatorio:</strong> Debes incluir al menos un bloque de "Título" y uno de "Subtítulo" con contenido. 
                        El título se usará como nombre de la propuesta y el subtítulo como descripción.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-6 py-2 bg-[#fafafa] text-[#121212] rounded-lg font-medium hover:bg-[#8a8a8a] transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Creador Minimalista */}
      {showMinimalCreator && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-7xl max-h-[90vh] bg-[#0a0a0a] rounded-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a] flex-shrink-0">
              <h2 className="text-xl font-semibold">Creador de Contenido</h2>
              <button
                onClick={() => setShowMinimalCreator(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <MinimalContentCreator
                onSave={handleSaveProposal}
                onPreview={(content) => {
                  console.log('Vista previa:', content);
                  // Aquí se puede implementar la vista previa
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
