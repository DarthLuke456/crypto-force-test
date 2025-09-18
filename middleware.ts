import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware simplificado - solo para rutas específicas de maestro
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Solo aplicar middleware a rutas específicas de maestro
  if (pathname.startsWith('/api/maestro/users')) {
    // Aquí se pueden agregar verificaciones específicas si es necesario
    return NextResponse.next();
  }

  // Para todas las demás rutas, permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/maestro/users/:path*'
  ]
};