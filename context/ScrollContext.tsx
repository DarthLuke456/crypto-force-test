'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScrollPosition {
  [key: string]: {
    vertical: number;
    horizontal?: number;
  };
}

interface ScrollContextType {
  scrollPositions: ScrollPosition;
  saveScrollPosition: (path: string, vertical: number, horizontal?: number) => void;
  getScrollPosition: (path: string) => { vertical: number; horizontal: number };
  clearScrollPosition: (path: string) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollPositions, setScrollPositions] = useState<ScrollPosition>({});

  useEffect(() => {
    // Cargar posiciones guardadas desde localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scrollPositions');
      if (saved) {
        try {
          setScrollPositions(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading scroll positions:', e);
        }
      }
    }
  }, []);

  const saveScrollPosition = (path: string, vertical: number, horizontal?: number) => {
    setScrollPositions(prev => {
      const newPositions = { 
        ...prev, 
        [path]: { 
          vertical, 
          horizontal: horizontal !== undefined ? horizontal : prev[path]?.horizontal || 0 
        } 
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('scrollPositions', JSON.stringify(newPositions));
      }
      return newPositions;
    });
  };

  const getScrollPosition = (path: string): { vertical: number; horizontal: number } => {
    const position = scrollPositions[path];
    return {
      vertical: position?.vertical || 0,
      horizontal: position?.horizontal || 0
    };
  };

  const clearScrollPosition = (path: string) => {
    setScrollPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[path];
      if (typeof window !== 'undefined') {
        localStorage.setItem('scrollPositions', JSON.stringify(newPositions));
      }
      return newPositions;
    });
  };

  return (
    <ScrollContext.Provider value={{
      scrollPositions,
      saveScrollPosition,
      getScrollPosition,
      clearScrollPosition
    }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}
