'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useScroll } from '@/context/ScrollContext';

interface BackButtonProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function BackButton({ href = '/dashboard/iniciado', className = '', children }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { saveScrollPosition, getScrollPosition } = useScroll();

  const handleClick = () => {
    // Guardar la posición actual del scroll antes de navegar
    if (typeof window !== 'undefined') {
      const currentVerticalPosition = window.scrollY || document.documentElement.scrollTop;
      const currentPosition = getScrollPosition(pathname);
      
      // Buscar el carrusel
      const carousel = document.querySelector('.carousel-container > div') as HTMLDivElement;
      const carouselHorizontalPosition = carousel?.scrollLeft || 0;
      
      saveScrollPosition(pathname, currentVerticalPosition, carouselHorizontalPosition);
    }

    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center text-gray-400 hover:text-white transition-colors ${className}`}
    >
      <ArrowLeft className="mr-2" />
      {children || 'Volver'}
    </button>
  );
}