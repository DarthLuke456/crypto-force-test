// Sistema de Navegación Inteligente para Tribunal Imperial

export interface ContentLocation {
  dashboard: string;
  level: number;
  category: 'theoretical' | 'practical';
  carouselId: string;
  cardId: string;
  scrollPosition?: {
    vertical: number;
    horizontal: number;
  };
}

// Función para generar URL de navegación inteligente
export function generateSmartNavigationUrl(location: ContentLocation): string {
  const baseUrl = `/dashboard/${location.dashboard}`;
  const params = new URLSearchParams({
    scrollTo: location.carouselId,
    cardId: location.cardId,
    level: location.level.toString(),
    category: location.category
  });
  
  return `${baseUrl}?${params.toString()}`;
}

// Función para navegar a contenido específico
export function navigateToContent(location: ContentLocation) {
  const url = generateSmartNavigationUrl(location);
  
  // Navegar a la página
  window.location.href = url;
  
  // Después de la navegación, hacer scroll inteligente
  setTimeout(() => {
    scrollToContentCard(location);
  }, 1000);
}

// Función para hacer scroll inteligente a una card específica
export function scrollToContentCard(location: ContentLocation) {
  // 1. Scroll vertical hasta el carrusel
  const carouselElement = document.getElementById(location.carouselId);
  if (carouselElement) {
    carouselElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // 2. Scroll horizontal dentro del carrusel hasta la card específica
    setTimeout(() => {
      const cardElement = document.getElementById(location.cardId);
      if (cardElement) {
        const carouselContainer = carouselElement.querySelector('.carousel-container');
        if (carouselContainer) {
          const cardRect = cardElement.getBoundingClientRect();
          const carouselRect = carouselContainer.getBoundingClientRect();
          const scrollLeft = cardRect.left - carouselRect.left + carouselContainer.scrollLeft;
          
          carouselContainer.scrollTo({
            left: scrollLeft - 20, // 20px de margen
            behavior: 'smooth'
          });
        }
        
        // 3. Resaltar la card temporalmente
        highlightContentCard(cardElement);
      }
    }, 500);
  }
}

// Función para resaltar una card temporalmente
function highlightContentCard(cardElement: HTMLElement) {
  const originalBorder = cardElement.style.border;
  const originalBoxShadow = cardElement.style.boxShadow;
  
  // Aplicar resaltado
  cardElement.style.border = '2px solid #ec4d58';
  cardElement.style.boxShadow = '0 0 20px rgba(236, 77, 88, 0.5)';
  cardElement.style.transition = 'all 0.3s ease';
  
  // Remover resaltado después de 3 segundos
  setTimeout(() => {
    cardElement.style.border = originalBorder;
    cardElement.style.boxShadow = originalBoxShadow;
  }, 3000);
}

// Función para crear botón de acceso directo
export function createDirectAccessButton(location: ContentLocation, buttonText: string = 'Ver en Dashboard') {
  return {
    text: buttonText,
    onClick: () => navigateToContent(location),
    className: 'px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors text-sm font-medium'
  };
}

// Función para procesar parámetros de URL y hacer scroll automático
export function processUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTo = urlParams.get('scrollTo');
  const cardId = urlParams.get('cardId');
  const level = urlParams.get('level');
  const category = urlParams.get('category');
  
  if (scrollTo && cardId && level && category) {
    const location: ContentLocation = {
      dashboard: window.location.pathname.split('/')[2] || 'iniciado',
      level: parseInt(level),
      category: category as 'theoretical' | 'practical',
      carouselId: scrollTo,
      cardId: cardId
    };
    
    // Hacer scroll después de que la página cargue
    setTimeout(() => {
      scrollToContentCard(location);
    }, 2000);
  }
}

// Hook para usar en componentes React
export function useSmartNavigation() {
  const navigateToContent = (location: ContentLocation) => {
    const url = generateSmartNavigationUrl(location);
    window.location.href = url;
  };
  
  const createDirectAccessButton = (location: ContentLocation, buttonText?: string) => {
    return {
      text: buttonText || 'Ver en Dashboard',
      onClick: () => navigateToContent(location),
      className: 'px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors text-sm font-medium'
    };
  };
  
  return {
    navigateToContent,
    createDirectAccessButton
  };
}
