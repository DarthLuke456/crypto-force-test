'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { CustomModule } from '@/lib/tribunal/types';

export default function TribunalContentPage() {
  const params = useParams();
  const [content, setContent] = useState<CustomModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      // Obtener contenido del Tribunal Imperial desde localStorage
      const storedProposals = localStorage.getItem('tribunal_proposals');
      if (storedProposals) {
        const allProposals = JSON.parse(storedProposals);
        const tribunalContent = allProposals.find((proposal: any) => 
          proposal.id === params.id && proposal.status === 'approved'
        );
        
        if (tribunalContent) {
          setContent(tribunalContent);
        }
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white">Cargando contenido del Tribunal Imperial...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Contenido no encontrado</h1>
          <p className="text-gray-400 mb-6">El contenido del Tribunal Imperial que buscas no está disponible.</p>
          <Link
            href="/dashboard/iniciado"
            className="inline-flex items-center px-4 py-2 bg-[#ec4d58] hover:bg-[#d43d48] text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/iniciado"
            className="inline-flex items-center text-[#ec4d58] hover:text-[#d43d48] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-[#ec4d58]" />
            <span className="text-sm text-gray-400 uppercase tracking-wide">Tribunal Imperial</span>
          </div>
          
          <h1 className="text-4xl font-bold text-[#fafafa] mb-4">{content.title}</h1>
          
          {content.description && (
            <p className="text-xl text-gray-300 mb-6">{content.description}</p>
          )}
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Por: {content.authorName || 'Darth Luke'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Creado: {new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a1a] border border-[#232323] rounded-xl p-8">
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-[#fafafa] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.content || content.description || 'Contenido no disponible.' }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#ec4d58]/10 to-[#ec4d58]/5 border border-[#ec4d58]/30 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-[#fafafa] mb-2">Contenido del Tribunal Imperial</h3>
            <p className="text-gray-400 text-sm">
              Este contenido ha sido aprobado y publicado por el Tribunal Imperial para enriquecer tu experiencia de aprendizaje.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

