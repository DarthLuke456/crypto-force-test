import React from "react";
import { usePathname } from "next/navigation";

type SidebarToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  const pathname = usePathname();
  
  // Determinar el color basado en el dashboard actual
  const getToggleColor = () => {
    if (pathname?.startsWith('/dashboard/acolito')) {
      return '#FFD447'; // Amarillo para acólito
    }
    return '#ec4d58'; // Rojo para otros dashboards
  };
  
  const toggleColor = getToggleColor();
  
  return (
    <button
      onClick={onToggle}
      aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      className="bg-[#232323] border border-[#232323] rounded-full w-6 h-6 flex items-center justify-center mt-1 transition-all duration-300 ease-in-out"
      style={{outline: 'none', color: toggleColor}}
    >
      <svg
        className={`w-3.5 h-3.5 transition-all duration-500 ease-in-out ${collapsed ? 'rotate-0' : 'rotate-180'}`}
        fill="none"
        stroke={toggleColor}
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}