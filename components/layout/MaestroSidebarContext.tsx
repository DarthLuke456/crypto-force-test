'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface MaestroSidebarContextProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const MaestroSidebarContext = createContext<MaestroSidebarContextProps | undefined>(undefined);

export const MaestroSidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Inicia colapsado
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Persistir el estado en localStorage
    const savedState = localStorage.getItem('maestro-sidebar-expanded');
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState));
    }
  }, []);
  
  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      localStorage.setItem('maestro-sidebar-expanded', JSON.stringify(newState));
      return newState;
    });
  };
  
  // Evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8A8A8A]"></div>
        </div>
      </div>
    );
  }
  
  return (
    <MaestroSidebarContext.Provider value={{ 
      isExpanded, 
      toggleSidebar 
    }}>
      {children}
    </MaestroSidebarContext.Provider>
  );
};

export const useMaestroSidebar = () => {
  const context = useContext(MaestroSidebarContext);
  if (!context) {
    throw new Error("useMaestroSidebar debe usarse dentro de MaestroSidebarProvider");
  }
  return context;
};
