'use client';

import { useState } from 'react';

export default function UpdateReferralCodesPage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/update-referral-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Error ejecutando actualización' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Actualizar Códigos de Referido</h1>
        
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nuevo Formato: CRYPTOFORCE-NICKNAME</h2>
          <p className="text-gray-300 mb-4">
            Este script actualizará todos los códigos de referido al nuevo formato:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>Darth Luke → CRYPTOFORCE-DARTHLUKE</li>
            <li>John Doe → CRYPTOFORCE-JOHNDOE</li>
            <li>Usuario123 → CRYPTOFORCE-USUARIO123</li>
          </ul>
          
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-[#ec4d58] hover:bg-[#d43d48] disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {isUpdating ? 'Actualizando...' : 'Ejecutar Actualización'}
          </button>
        </div>
        
        {result && (
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Resultado:</h3>
            <pre className="bg-[#0f0f0f] p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
