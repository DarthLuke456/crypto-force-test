// Script de prueba para verificar la generación de nicknames
// Ejecutar con: node test-nickname-generation.js

function generateNicknameFromEmail(email) {
  // Casos especiales conocidos
  if (email === 'coeurdeluke.js@gmail.com') return 'Darth Luke';
  
  // Extraer nombre del email (parte antes del @)
  const emailPart = email.split('@')[0];
  
  // Limpiar y formatear
  const cleanName = emailPart
    .replace(/[._-]/g, ' ') // Reemplazar puntos, guiones y guiones bajos con espacios
    .replace(/\d+/g, '') // Remover números
    .trim();
  
  // Capitalizar primera letra de cada palabra
  const formattedName = cleanName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return formattedName || emailPart;
}

// Casos de prueba
const testEmails = [
  'coeurdeluke.js@gmail.com',
  'juan.perez@example.com',
  'maria_garcia@test.com',
  'carlos123@domain.com',
  'ana-martinez@email.com',
  'pedro.rodriguez.lopez@company.com',
  'test@example.com',
  'user@domain.org'
];

console.log('🧪 Pruebas de generación de nicknames:');
console.log('=====================================');

testEmails.forEach(email => {
  const nickname = generateNicknameFromEmail(email);
  console.log(`${email} → "${nickname}"`);
});

console.log('\n✅ Pruebas completadas');
