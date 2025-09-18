import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    
    // Usar credenciales del servidor directamente
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Crear usuario en public.users
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        nombre: user.user_metadata.nombre || '',
        apellido: user.user_metadata.apellido || '',
        nickname: user.user_metadata.nickname || '',
        email: user.email,
        movil: user.user_metadata.movil || '',
        exchange: user.user_metadata.exchange || '',
        uid: user.id,
        codigo_referido: 'NUEVO',
        created_at: new Date().toISOString(),
        referral_code: `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        referred_by: null,
        user_level: 1,
        total_referrals: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
