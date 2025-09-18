'use client';

import { useEffect } from 'react';

export default function TribunalContentInitializer() {
  useEffect(() => {
    // Verificar si ya existe contenido del Tribunal Imperial
    const existingContent = localStorage.getItem('tribunal_proposals');
    
    if (!existingContent) {
      // Generar contenido de prueba del Tribunal Imperial
      const tribunalContent = [
        {
          id: 'teorico-1',
          title: 'Introducción y la lógica económica',
          description: 'Comprende los principios básicos de la economía y cómo pensamos los humanos en términos de recursos escasos.',
          content: `
            <h2>Introducción a la Lógica Económica</h2>
            <p>La economía es el estudio de cómo las personas toman decisiones en condiciones de escasez. En este módulo exploraremos:</p>
            
            <h3>1. Los 10 Principios de la Microeconomía</h3>
            <ul>
              <li><strong>Principio 1:</strong> Las personas enfrentan disyuntivas</li>
              <li><strong>Principio 2:</strong> El costo de algo es aquello a lo que renuncias para obtenerlo</li>
              <li><strong>Principio 3:</strong> Las personas racionales piensan en términos marginales</li>
              <li><strong>Principio 4:</strong> Las personas responden a incentivos</li>
              <li><strong>Principio 5:</strong> El comercio puede mejorar el bienestar de todo el mundo</li>
              <li><strong>Principio 6:</strong> Los mercados normalmente constituyen un buen mecanismo para organizar la actividad económica</li>
              <li><strong>Principio 7:</strong> A veces el Estado puede mejorar los resultados del mercado</li>
              <li><strong>Principio 8:</strong> El nivel de vida de un país depende de su capacidad para producir bienes y servicios</li>
              <li><strong>Principio 9:</strong> Los precios suben cuando el gobierno imprime demasiado dinero</li>
              <li><strong>Principio 10:</strong> La sociedad enfrenta una disyuntiva de corto plazo entre inflación y desempleo</li>
            </ul>
            
            <h3>2. Escasez y Eficiencia</h3>
            <p>La escasez es el problema económico fundamental. Los recursos son limitados, pero las necesidades humanas son ilimitadas. Esto nos obliga a tomar decisiones sobre cómo asignar nuestros recursos de la manera más eficiente posible.</p>
            
            <h3>3. El Surgimiento de las Criptomonedas</h3>
            <p>Las criptomonedas representan una evolución natural en el sistema económico, ofreciendo:</p>
            <ul>
              <li>Descentralización del control monetario</li>
              <li>Transparencia en las transacciones</li>
              <li>Reducción de costos de transacción</li>
              <li>Acceso global a servicios financieros</li>
            </ul>
            
            <h3>4. Bitcoin y la Revolución Digital</h3>
            <p>Bitcoin no es solo una moneda digital, es un protocolo que permite:</p>
            <ul>
              <li>Transferencias de valor sin intermediarios</li>
              <li>Resistencia a la censura</li>
              <li>Escasez programática (solo 21 millones de bitcoins)</li>
              <li>Transparencia total de la oferta monetaria</li>
            </ul>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin: 1rem 0;">
              <p><strong>Reflexión:</strong> ¿Cómo crees que los principios económicos tradicionales se aplican al mundo de las criptomonedas? ¿Qué nuevos principios podrían surgir?</p>
            </div>
          `,
          category: 'theoretical',
          authorName: 'Tribunal Imperial',
          authorLevel: 6,
          targetLevels: [1, 2, 3, 4, 5, 6],
          status: 'approved',
          tags: ['economia', 'teoria', 'conceptos', 'bitcoin', 'criptomonedas'],
          difficulty: 'beginner',
          estimatedDuration: 45,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'teorico-2',
          title: 'Fuerzas del mercado',
          description: 'Explora la oferta, la demanda y cómo se forman los precios en los mercados libres.',
          content: `
            <h2>Fuerzas del Mercado</h2>
            <p>Los mercados son el lugar donde se encuentran la oferta y la demanda. En este módulo analizaremos:</p>
            
            <h3>1. La Ley de la Demanda</h3>
            <p>La cantidad demandada de un bien disminuye cuando su precio sube, manteniendo todo lo demás constante.</p>
            
            <h3>2. La Ley de la Oferta</h3>
            <p>La cantidad ofrecida de un bien aumenta cuando su precio sube, manteniendo todo lo demás constante.</p>
            
            <h3>3. Equilibrio del Mercado</h3>
            <p>El equilibrio se alcanza cuando la cantidad demandada es igual a la cantidad ofrecida.</p>
            
            <h3>4. Aplicación en Criptomonedas</h3>
            <p>Los mercados de criptomonedas funcionan bajo los mismos principios económicos, pero con características únicas:</p>
            <ul>
              <li>Volatilidad extrema</li>
              <li>Operación 24/7</li>
              <li>Alta liquidez en mercados principales</li>
              <li>Influencia de noticias y regulaciones</li>
            </ul>
          `,
          category: 'theoretical',
          authorName: 'Tribunal Imperial',
          authorLevel: 6,
          targetLevels: [1, 2, 3, 4, 5, 6],
          status: 'approved',
          tags: ['mercado', 'oferta', 'demanda', 'precios', 'equilibrio'],
          difficulty: 'beginner',
          estimatedDuration: 40,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      localStorage.setItem('tribunal_proposals', JSON.stringify(tribunalContent));
      console.log('✅ Contenido del Tribunal Imperial inicializado correctamente');
      console.log('📊 Módulos creados:', tribunalContent.length);
    }
  }, []);

  return null; // Este componente no renderiza nada
}

