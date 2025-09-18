import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug Feedback Auth - Iniciando debug...');
    
    // Crear cliente de Supabase con clave anónima para verificar token
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Debug Feedback Auth - Token recibido, longitud:', token.length);
    
    // Verificar el token con Supabase
    const { data: { user }, error: userAuthError } = await supabaseAnon.auth.getUser(token);
    
    if (userAuthError || !user) {
      console.error('❌ Debug Feedback Auth - Error de autenticación:', userAuthError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userAuthError?.message },
        { status: 401 }
      );
    }

    console.log('✅ Debug Feedback Auth - Usuario autenticado:');
    console.log('  - ID:', user.id);
    console.log('  - Email:', user.email);
    console.log('  - Tipo de ID:', typeof user.id);
    
    // Crear cliente de servicio para consultar datos
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar usuario en tabla users con diferentes métodos
    console.log('🔍 Debug Feedback Auth - Buscando usuario en tabla users...');
    
    // Método 1: Búsqueda por ID exacto
    const { data: userById, error: errorById } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    console.log('🔍 Debug Feedback Auth - Búsqueda por ID:');
    console.log('  - Data:', userById);
    console.log('  - Error:', errorById);
    
    // Método 2: Búsqueda por email
    const { data: userByEmail, error: errorByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    console.log('🔍 Debug Feedback Auth - Búsqueda por email:');
    console.log('  - Data:', userByEmail);
    console.log('  - Error:', errorByEmail);
    
    // Método 3: Listar todos los usuarios para comparar
    const { data: allUsers, error: errorAllUsers } = await supabase
      .from('users')
      .select('id, email, user_level')
      .limit(10);
    
    console.log('🔍 Debug Feedback Auth - Todos los usuarios:');
    console.log('  - Data:', allUsers);
    console.log('  - Error:', errorAllUsers);

    return NextResponse.json({
      success: true,
      authenticatedUser: {
        id: user.id,
        email: user.email,
        idType: typeof user.id
      },
      searchResults: {
        byId: {
          data: userById,
          error: errorById
        },
        byEmail: {
          data: userByEmail,
          error: errorByEmail
        },
        allUsers: {
          data: allUsers,
          error: errorAllUsers
        }
      }
    });

  } catch (error) {
    console.error('❌ Error en debug feedback auth:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
