'use client';

import { useRouter } from 'next/navigation';

export default function VerContenidoButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/iniciado/1-introduccion-economica/contenido/1');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-[#ec4d58] text-white px-4 py-2 rounded hover:bg-[#d63c49] transition"
    >
      Ver contenido
    </button>
  );
}
