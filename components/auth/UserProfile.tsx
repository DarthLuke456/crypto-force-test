'use client';

import { useState, useEffect } from 'react';
import { useSafeAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function UserProfile() {
  const { user, userData, signOut } = useSafeAuth();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (userData?.nickname) {
      setDisplayName(userData.nickname);
    }
  }, [userData]);

  if (!user || !userData) {
    return <div>Debes iniciar sesión para ver tu perfil</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-crypto-dark/50 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold text-crypto-blue mb-4">Tu Perfil</h2>
      
      <div className="mb-4">
        <p className="text-crypto-light/80 mb-1">Email:</p>
        <p className="font-medium">{user.email}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-crypto-light/80 mb-1">Nombre de usuario:</p>
        <p className="font-medium">{displayName || 'No establecido'}</p>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}