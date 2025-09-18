'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useScroll } from '@/context/ScrollContext';

export function useScrollPosition() {
  const pathname = usePathname();
  const { saveScrollPosition, getScrollPosition } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  // Restaurar posición al cargar la página
  useEffect(() => {
    const savedPosition = getScrollPosition(pathname);
    if (containerRef.current) {
      if (savedPosition.vertical > 0) {
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = savedPosition.vertical;
          }
        }, 100);
      }
    }
  }, [pathname, getScrollPosition]);

  // Guardar posición al hacer scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentPosition = getScrollPosition(pathname);
      saveScrollPosition(pathname, container.scrollTop, currentPosition.horizontal);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pathname, saveScrollPosition, getScrollPosition]);

  return containerRef;
}

export function useCarouselPosition() {
  const pathname = usePathname();
  const { saveScrollPosition, getScrollPosition } = useScroll();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Restaurar posición del carrusel al cargar la página
  useEffect(() => {
    const savedPosition = getScrollPosition(pathname);
    if (savedPosition.horizontal > 0 && carouselRef.current) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft = savedPosition.horizontal;
        }
      }, 100);
    }
  }, [pathname, getScrollPosition]);

  // Guardar posición del carrusel al hacer scroll
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const currentPosition = getScrollPosition(pathname);
      saveScrollPosition(pathname, currentPosition.vertical, carousel.scrollLeft);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [pathname, saveScrollPosition, getScrollPosition]);

  return carouselRef;
}
