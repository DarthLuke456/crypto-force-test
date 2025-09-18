'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SidebarContextProps {
  isOpen: boolean;
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Forzar sidebar expandida por defecto
    setIsOpen(true);
    localStorage.setItem('sidebar-expanded', 'true');
  }, []);
  
  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      // Opcional: Guardar en localStorage
      localStorage.setItem('sidebar-expanded', JSON.stringify(newState));
      return newState;
    });
  };
  
  // Evitar hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#fafafa]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58]"></div>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarContext.Provider value={{ 
      isOpen, 
      isExpanded: isOpen,
      toggleSidebar 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe usarse dentro de SidebarProvider");
  }
  return context;
};