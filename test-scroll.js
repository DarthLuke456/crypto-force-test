// Script de prueba para verificar el localStorage
console.log('=== PRUEBA DE SCROLL POSITION ===');

// Verificar localStorage
const scrollPositions = localStorage.getItem('scrollPositions');
console.log('Scroll positions guardadas:', scrollPositions);

const activeTab = localStorage.getItem('dashboardActiveTab');
console.log('Tab activo:', activeTab);

// Simular guardar una posición
const testPosition = {
  '/dashboard/iniciado': {
    vertical: 500,
    horizontal: 300
  }
};

localStorage.setItem('scrollPositions', JSON.stringify(testPosition));
console.log('Posición de prueba guardada');

// Verificar que se guardó
const saved = localStorage.getItem('scrollPositions');
console.log('Posición guardada:', saved);

console.log('=== FIN DE PRUEBA ===');
