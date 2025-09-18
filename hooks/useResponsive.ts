'use client';

import { useState, useEffect } from 'react';

export function useResponsive() {
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Función para actualizar el tamaño de la ventana
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Establecer el tamaño inicial
    handleResize();
    setMounted(true);

    // Agregar el event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoints
  const isMobile = windowSize.width < 768; // md breakpoint
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024; // lg breakpoint
  const isDesktop = windowSize.width >= 1024;
  const isLargeDesktop = windowSize.width >= 1280; // xl breakpoint

  return {
    mounted,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
}