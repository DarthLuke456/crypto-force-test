export default function TestStyles() {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#ec4d58] mb-8">Test de Estilos</h1>
        
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#232323]">
            <h2 className="text-2xl font-bold text-[#ec4d58] mb-4">Colores del Tema Oscuro</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#121212] p-4 rounded">Fondo Principal: #121212</div>
              <div className="bg-[#1a1a1a] p-4 rounded">Fondo Secundario: #1a1a1a</div>
              <div className="bg-[#232323] p-4 rounded">Fondo Terciario: #232323</div>
              <div className="bg-[#ec4d58] p-4 rounded text-white">Acento: #ec4d58</div>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#232323]">
            <h2 className="text-2xl font-bold text-[#ec4d58] mb-4">Texto</h2>
            <p className="text-white mb-2">Texto blanco normal</p>
            <p className="text-gray-300 mb-2">Texto gris claro</p>
            <p className="text-[#ec4d58] mb-2">Texto acento rojo</p>
          </div>
          
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#232323]">
            <h2 className="text-2xl font-bold text-[#ec4d58] mb-4">Botones</h2>
            <div className="space-x-4">
              <button className="bg-[#ec4d58] hover:bg-[#d63d47] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Botón Principal
              </button>
              <button className="bg-[#232323] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Botón Secundario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 