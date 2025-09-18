const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qtbplksozfropbubykud.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no encontrada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removeForeignKey() {
  try {
    console.log('🔍 Eliminando restricción de clave foránea feedback_user_id_fkey...');
    
    // Ejecutar SQL para eliminar la restricción
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: 'ALTER TABLE feedback DROP CONSTRAINT feedback_user_id_fkey;'
      });

    if (error) {
      console.error('❌ Error eliminando restricción:', error);
      return;
    }

    console.log('✅ Restricción de clave foránea eliminada exitosamente');
    console.log('📊 Resultado:', data);

    // Verificar que se eliminó
    console.log('🔍 Verificando que la restricción se eliminó...');
    const { data: checkData, error: checkError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            tc.constraint_name, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
          FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name='feedback' 
            AND kcu.column_name='user_id';
        `
      });

    if (checkError) {
      console.error('❌ Error verificando:', checkError);
      return;
    }

    console.log('🔍 Verificación final:', checkData);
    
    if (!checkData || checkData.length === 0) {
      console.log('✅ Restricción de clave foránea eliminada correctamente');
    } else {
      console.log('⚠️ Aún existen restricciones de clave foránea');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

removeForeignKey();
