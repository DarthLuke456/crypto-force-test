'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showLogo?: boolean;
}

export default function LoadingSpinner({ 
  message = 'Cargando...', 
  size = 'md',
  showLogo = true 
}: LoadingSpinnerProps) {
  const pathname = usePathname();
  
  // Determinar el spinner según la ruta
  const getSpinnerClass = () => {
    if (pathname?.startsWith('/dashboard/iniciado')) return 'spinner-iniciado';
    if (pathname?.startsWith('/dashboard/acolito')) return 'spinner-acolito';
    if (pathname?.startsWith('/dashboard/warrior')) return 'spinner-warrior';
    if (pathname?.startsWith('/dashboard/lord')) return 'spinner-lord';
    if (pathname?.startsWith('/dashboard/darth')) return 'spinner-darth';
    if (pathname?.startsWith('/dashboard/maestro')) return 'spinner-maestro';
    if (pathname?.startsWith('/login/dashboard-selection')) return 'spinner-dashboard-selection';
    return 'spinner-darth'; // Por defecto
  };

  const sizeClasses = {
    sm: 'dashboard-spinner-sm',
    md: 'dashboard-spinner', 
    lg: 'dashboard-spinner-lg'
  };

  const logoSizes = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 }
  };

  return (
    <div className="text-center">
      {showLogo && (
        <div className="mb-4 opacity-0 scale-95 animate-[fadeInScale_800ms_ease-out_forwards]">
          <Image 
            src="/logo.png" 
            alt="Crypto Force" 
            width={logoSizes[size].width}
            height={logoSizes[size].height}
            className="mx-auto"
            priority 
          />
        </div>
      )}
      <div className={`${sizeClasses[size]} ${getSpinnerClass()} mx-auto mb-4`}></div>
      <p className="text-white/80 text-sm">{message}</p>
      
      <style jsx global>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.92); }
          55% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
