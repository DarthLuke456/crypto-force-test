'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function FixReferralCodesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [checkResult, setCheckResult] = useState<any>(null);

  const handleCheckReferralCodes = async () => {
    setIsChecking(true);
    setCheckResult(null);

    try {
      const response = await fetch('/api/admin/check-referral-codes', {
        method: 'GET',
      });

      const data = await response.json();
      setCheckResult(data);
    } catch (error) {
      setCheckResult({
        success: false,
        error: 'Error verificando códigos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleFixReferralCodes = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/fix-referral-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Error ejecutando la corrección',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-6">
      <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Corregir Códigos de Referido</h1>
          <p className="text-[#a0a0a0]">Actualizar códigos de referido en la base de datos</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCheckReferralCodes}
              disabled={isChecking}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                isChecking
                  ? 'bg-[#6a6a6a] cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white flex items-center justify-center gap-2`}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar Estado'
              )}
            </button>

            <button
              onClick={handleFixReferralCodes}
              disabled={isLoading}
              className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-[#6a6a6a] cursor-not-allowed'
                  : 'bg-[#ec4d58] hover:bg-[#d93c47]'
              } text-white flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Corrigiendo...
                </>
              ) : (
                'Corregir Códigos'
              )}
            </button>
          </div>

          {checkResult && (
            <div className={`p-4 rounded-lg ${
              checkResult.success 
                ? 'bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-400' 
                : 'bg-[#ec4d58] bg-opacity-20 border border-[#ec4d58] text-[#ec4d58]'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Estado de Códigos de Referido
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Total usuarios:</strong> {checkResult.totalUsers}</p>
                <p><strong>Códigos únicos:</strong> {checkResult.uniqueCodes}</p>
                <p><strong>Duplicados encontrados:</strong> {checkResult.duplicateCount}</p>
                
                {checkResult.duplicates && checkResult.duplicates.length > 0 && (
                  <div>
                    <p className="font-medium text-[#ec4d58]">Códigos duplicados:</p>
                    <ul className="list-disc list-inside ml-4">
                      {checkResult.duplicates.map((code: string, index: number) => (
                        <li key={index}>{code}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {checkResult.users && checkResult.users.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Usuarios con códigos CRYPTOFORCE_:</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {checkResult.users.map((user: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded text-xs">
                          <span className="text-white">{user.email}</span>
                          <span className="text-[#ec4d58] font-mono">{user.referral_code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-lg ${
              result.success 
                ? 'bg-green-600 bg-opacity-20 border border-green-600 text-green-400' 
                : 'bg-[#ec4d58] bg-opacity-20 border border-[#ec4d58] text-[#ec4d58]'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {result.success ? 'Corrección Exitosa' : 'Error en la Corrección'}
                </span>
              </div>
              
              {result.message && (
                <p className="mb-4">{result.message}</p>
              )}
              
              {result.error && (
                <p className="mb-4 text-[#ec4d58]">{result.error}</p>
              )}
              
              {result.details && (
                <p className="mb-4 text-sm opacity-75">{result.details}</p>
              )}
              
              {result.results && result.results.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Resultados:</h3>
                  <ul className="space-y-1 text-sm">
                    {result.results.map((item: string, index: number) => (
                      <li key={index} className="opacity-75">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.finalUsers && result.finalUsers.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Usuarios con códigos CRYPTOFORCE_:</h3>
                  <div className="space-y-2 text-sm">
                    {result.finalUsers.map((user: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded">
                        <span className="text-white">{user.email}</span>
                        <span className="text-[#ec4d58] font-mono">{user.referral_code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => window.location.href = '/admin/update-referral-codes'}
            className="text-[#ec4d58] hover:text-[#d93c47] transition-colors font-medium"
          >
            ← Volver a Actualizar Códigos
          </button>
        </div>
      </div>
    </div>
  );
}
