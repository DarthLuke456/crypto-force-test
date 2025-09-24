import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Profile Diagnostic API - Starting diagnostic');
    
    const diagnostic: any = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
        supabaseServiceKey: supabaseServiceKey ? 'Present' : 'Missing',
        nodeEnv: process.env.NODE_ENV || 'Not set'
      },
      database: {
        connection: 'Testing...',
        tables: 'Testing...',
        permissions: 'Testing...'
      }
    };

    // Test database connection
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      console.log('✅ Diagnostic: Supabase client created');
      
      // Test basic query
      const { data, error } = await supabase
        .from('users')
        .select('email, nombre, apellido, nickname')
        .limit(1);
      
      if (error) {
        console.error('❌ Diagnostic: Database query error:', error);
        diagnostic.database.connection = `Error: ${error.message}`;
      } else {
        console.log('✅ Diagnostic: Database query successful');
        diagnostic.database.connection = 'Connected';
        diagnostic.database.tables = 'Users table accessible';
      }
    } catch (dbError) {
      console.error('❌ Diagnostic: Database connection error:', dbError);
      diagnostic.database.connection = `Connection Error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`;
    }

    // Test specific user data
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'coeurdeluke.js@gmail.com')
        .single();
      
      if (userError) {
        console.error('❌ Diagnostic: User query error:', userError);
        diagnostic.database.permissions = `User query error: ${userError.message}`;
      } else {
        console.log('✅ Diagnostic: User data retrieved');
        diagnostic.database.permissions = 'User data accessible';
        diagnostic.userData = userData;
      }
    } catch (userError) {
      console.error('❌ Diagnostic: User data error:', userError);
      diagnostic.database.permissions = `User data error: ${userError instanceof Error ? userError.message : 'Unknown error'}`;
    }

    console.log('🔍 Profile Diagnostic API - Diagnostic complete:', diagnostic);

    return NextResponse.json({
      success: true,
      message: 'Diagnostic completed',
      diagnostic
    });

  } catch (error) {
    console.error('❌ Profile Diagnostic API - Error:', error);
    return NextResponse.json({ 
      error: 'Diagnostic failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
