'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface DarthSidebarContextProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const DarthSidebarContext = createContext<DarthSidebarContextProps | undefined>(undefined);

export const DarthSidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Inicia colapsado
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Persistir el estado en localStorage
    const savedState = localStorage.getItem('darth-sidebar-expanded');
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState));
    }
  }, []);
  
  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const newState = !prev;
      localStorage.setItem('darth-sidebar-expanded', JSON.stringify(newState));
      return newState;
    });
  };
  
  // Evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58]"></div>
        </div>
      </div>
    );
  }
  
  return (
    <DarthSidebarContext.Provider value={{ 
      isExpanded, 
      toggleSidebar 
    }}>
      {children}
    </DarthSidebarContext.Provider>
  );
};

export const useDarthSidebar = () => {
  const context = useContext(DarthSidebarContext);
  if (!context) {
    throw new Error("useDarthSidebar debe usarse dentro de DarthSidebarProvider");
  }
  return context;
};
