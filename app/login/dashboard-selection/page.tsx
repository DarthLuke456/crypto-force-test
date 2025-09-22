'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Crown,
  Shield,
  Sword,
  Eye,
  Flame,
  Star,
  Zap,
  Lock,
  Unlock,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Edit,
  Key,
  Mail,
  Phone,
  Globe,
  Camera,
  MessageSquare,
  Share2
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-offline';
import { useAvatarStable as useAvatar } from '@/hooks/useAvatarStable';
import { getUserProfilePath, getLevelDisplayName, MAESTRO_AUTHORIZED_EMAILS } from '@/utils/dashboardUtils';
import FeedbackModalWithTabs from '@/components/feedback/FeedbackModalWithTabs';
import { useFeedbackPersistence } from '@/hooks/useFeedbackPersistence';

interface DashboardOption {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  path: string;
  level: number;
  emblem: string;
  philosophy: string;
  image: string;
  requirements: string;
  benefits: string[];
}

export default function DashboardSelectionPage() {
  const router = useRouter();
  const { user, userData, loading, isReady, logout } = useSafeAuth();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { avatar: userAvatar, changeAvatar, forceUpdate, reloadAvatar } = useAvatar();
  const { hasSavedData } = useFeedbackPersistence();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Debug del estado de la página - Solo una vez al montar
  useEffect(() => {
    if (userData && isReady) {
      console.log('✅ Dashboard Selection - Usuario listo:', {
        nickname: userData.nickname,
        email: userData.email,
        user_level: userData.user_level
      });
    }
  }, []); // Solo ejecutar una vez al montar

  // Reset isNavigating state when component mounts
  useEffect(() => {
    console.log('🔄 Dashboard Selection - Reseteando estado de navegación');
    setIsNavigating(false);
  }, []);

  // Timeout para evitar carga infinita - Solo si no hay datos del usuario
  useEffect(() => {
    // Solo ejecutar timeout si no hay datos del usuario
    if (!userData || !userData.email) {
      const timer = setTimeout(() => {
        console.log('⏰ [TIMEOUT] No se cargaron datos del usuario en 5 segundos');
        setLoadingTimeout(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      console.log('✅ Usuario ya cargado, saltando timeout');
      setLoadingTimeout(false);
    }
  }, [userData?.email]); // Depender del email del usuario

  // Prevenir bucles de redirección
  useEffect(() => {
    const currentAttempts = parseInt(sessionStorage.getItem('redirectAttempts') || '0');
    if (currentAttempts > 3) {
      console.error('🚫 Bucle de redirección detectado, deteniendo...');
      sessionStorage.removeItem('redirectAttempts');
      return;
    }
    setRedirectAttempts(currentAttempts);
  }, []);

  // Verificar si hay datos de feedback guardados y abrir modal automáticamente
  useEffect(() => {
    if (isReady && userData && hasSavedData()) {
      console.log('📝 Dashboard Selection - Datos de feedback encontrados, abriendo modal automáticamente');
      setIsFeedbackModalOpen(true);
    }
  }, []); // Solo ejecutar una vez al montar

  // Función para comprimir imagen con compresión más agresiva
  const compressImage = (file: File, maxWidth: number = 150, quality: number = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('🔍 compressImage - Iniciando compresión mejorada');
      console.log('🔍 compressImage - Archivo:', file.name, file.type, file.size);
      console.log('🔍 compressImage - Parámetros:', { maxWidth, quality });
      
      try {
        const canvas = document.createElement('canvas');
        console.log('🔍 compressImage - Canvas creado');
        
        const ctx = canvas.getContext('2d');
        console.log('🔍 compressImage - Context obtenido:', ctx ? 'Sí' : 'No');
        
        if (!ctx) {
          throw new Error('No se pudo obtener el contexto del canvas');
        }
        
        const img = new window.Image();
        console.log('🔍 compressImage - Imagen creada');

        img.onload = () => {
          try {
            console.log('🔍 compressImage - Imagen cargada exitosamente');
            console.log('🔍 compressImage - Dimensiones originales:', img.width, 'x', img.height);
            
            // Calcular nuevas dimensiones manteniendo la proporción
            let { width, height } = img;
            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
            } else {
              if (height > maxWidth) {
                width = (width * maxWidth) / height;
                height = maxWidth;
              }
            }

            // Asegurar que las dimensiones sean números enteros
            width = Math.floor(width);
            height = Math.floor(height);

            console.log('🔍 compressImage - Dimensiones calculadas:', width, 'x', height);
            
            canvas.width = width;
            canvas.height = height;
            console.log('🔍 compressImage - Canvas dimensionado');

            // Configurar contexto para mejor calidad de compresión
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height);
            console.log('🔍 compressImage - Imagen dibujada en canvas');

            // Función recursiva para comprimir hasta obtener un tamaño aceptable
            const compressToTargetSize = (targetSize: number, currentQuality: number): string => {
              const dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
              console.log(`🔍 compressImage - Intento con calidad ${currentQuality}, tamaño: ${dataUrl.length}`);
              
              if (dataUrl.length <= targetSize || currentQuality <= 0.1) {
                return dataUrl;
              }
              
              // Reducir calidad en 20% para el siguiente intento
              const newQuality = Math.max(0.1, currentQuality * 0.8);
              return compressToTargetSize(targetSize, newQuality);
            };
            
            // Comprimir a máximo 25KB (aproximadamente 18KB de imagen real)
            const compressedBase64 = compressToTargetSize(25000, quality);
            
            console.log('✅ compressImage - Compresión completada, tamaño final:', compressedBase64.length);
            console.log('✅ compressImage - Reducción de tamaño:', `${file.size} -> ${compressedBase64.length} bytes`);
            
            resolve(compressedBase64);
          } catch (error) {
            console.error('❌ compressImage - Error en onload:', error);
            reject(error);
          }
        };

        img.onerror = (error) => {
          console.error('❌ compressImage - Error al cargar imagen:', error);
          reject(new Error('Error al cargar la imagen'));
        };
        
        console.log('🔍 compressImage - Creando URL del archivo...');
        const objectURL = URL.createObjectURL(file);
        console.log('🔍 compressImage - URL creada:', objectURL);
        
        img.src = objectURL;
        console.log('🔍 compressImage - src asignado, esperando carga...');
        
      } catch (error) {
        console.error('❌ compressImage - Error en try/catch:', error);
        reject(error);
      }
    });
  };

  // Función para manejar el cambio de avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔍 handleAvatarChange ejecutado');
    const file = event.target.files?.[0];
    console.log('🔍 Archivo seleccionado:', file);
    
    if (!file) {
      console.log('❌ No hay archivo seleccionado');
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      console.log('❌ Tipo de archivo inválido:', file.type);
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 10MB para comprimir)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ Archivo muy grande:', file.size);
      alert('La imagen debe ser menor a 10MB');
      return;
    }

    console.log('✅ Archivo válido, comprimiendo imagen...');
    
    try {
      // Cerrar el menú inmediatamente para evitar interferencias
      setIsProfileMenuOpen(false);
      
      // Comprimir la imagen
      console.log('🔍 handleAvatarChange - Iniciando compresión...');
      const compressedBase64 = await compressImage(file, 150, 0.6);
      console.log('🔍 handleAvatarChange - Imagen comprimida exitosamente, longitud:', compressedBase64.length);
      
      console.log('🔍 handleAvatarChange - Llamando a changeAvatar...');
      await changeAvatar(compressedBase64);
        console.log('✅ handleAvatarChange - Avatar actualizado correctamente');
      
      // Forzar actualización inmediata sin esperar
      forceUpdate();
      console.log('🔄 Avatar sincronizado inmediatamente');
      
      // Recargar desde base de datos después de un breve delay para confirmar
        setTimeout(async () => {
          await reloadAvatar();
          forceUpdate();
        console.log('🔄 Avatar recargado desde base de datos y sincronizado');
      }, 1000);
      
        alert('Avatar actualizado correctamente');
    } catch (error) {
      console.error('❌ handleAvatarChange - Error completo:', error);
      console.error('❌ handleAvatarChange - Error message:', error instanceof Error ? error.message : 'Error desconocido');
      console.error('❌ handleAvatarChange - Error stack:', error instanceof Error ? error.stack : 'No stack');
      
      // Mostrar error más específico
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Formato de imagen no válido. Usa JPG, PNG o GIF.';
        } else if (error.message.includes('413')) {
          errorMessage = 'Imagen demasiado grande. Máximo 2MB.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(`Error al procesar la imagen: ${errorMessage}`);
    }
  };

  // Cerrar menú de perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileMenuOpen && !target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

              // REDIRECCIÓN AUTOMÁTICA DESHABILITADA TEMPORALMENTE
              /*
              useEffect(() => {
                if (isReady && userData) {
                  console.log('🚀 Dashboard Selection - Iniciando redirección automática...');
                  
                  // Determinar a qué dashboard redirigir
                  let targetDashboard = '/dashboard/maestro'; // Por defecto
                  
                  if (userData.user_level === 1) targetDashboard = '/dashboard/iniciado';
                  else if (userData.user_level === 2) targetDashboard = '/dashboard/acolito';
                  else if (userData.user_level === 3) targetDashboard = '/dashboard/warrior';
                  else if (userData.user_level === 4) targetDashboard = '/dashboard/lord';
                  else if (userData.user_level === 5) targetDashboard = '/dashboard/darth';
                  else if (userData.user_level === 6) targetDashboard = '/dashboard/maestro';
                  
                  console.log(`🎯 Dashboard Selection - Redirigiendo a: ${targetDashboard}`);
                  console.log(`👤 Usuario: ${userData.nickname} (Nivel: ${userData.user_level})`);
                  
                  // Redirección automática después de 2 segundos
                  setTimeout(() => {
                    console.log(`⏰ Dashboard Selection - Ejecutando redirección automática...`);
                    window.location.href = targetDashboard;
                  }, 2000);
                }
              }, [isReady, userData]);
              */



  const dashboardOptions: DashboardOption[] = [
    {
      id: 'iniciado',
      title: 'INICIADO',
      color: '#FAFAFA',
      icon: <Shield className="w-8 h-8" />,
      path: '/dashboard/iniciado',
      level: 1,
      emblem: '⚪',
      description: 'El primer paso en el camino del poder',
      philosophy: 'Apertura al conocimiento y primeros pasos en el trading',
      image: '/images/insignias/1-iniciados.png',
      requirements: 'Acceso básico a la plataforma',
      benefits: [
        'Acceso al contenido fundamental',
        'Evaluaciones de progreso',
        'Comunidad de iniciados'
      ]
    },
    {
      id: 'acolito',
      title: 'ACÓLITO',
      color: '#FFD447',
      icon: <Eye className="w-8 h-8" />,
      path: '/dashboard/acolito',
      level: 2,
      emblem: '🟡',
      description: 'Despertar de la sombra interior',
      philosophy: 'Iluminación de verdades ocultas y curiosidad por el poder',
      image: '/images/insignias/2-acolitos.png',
      requirements: 'Completar 70% del contenido de Iniciado',
      benefits: [
        'Contenido avanzado',
        'Herramientas de análisis',
        'Acceso a mentorías'
      ]
    },
    {
      id: 'warrior',
      title: 'WARRIOR',
      color: '#3ED598',
      icon: <Sword className="w-8 h-8" />,
      path: '/dashboard/warrior',
      level: 3,
      emblem: '🟢',
      description: 'Integración de disciplina y pasión',
      philosophy: 'Energía controlada y crecimiento en habilidad y conciencia',
      image: '/images/insignias/3-warriors.png',
      requirements: 'Completar 80% del contenido de Acólito',
      benefits: [
        'Estrategias avanzadas',
        'Acceso a operaciones reales',
        'Comunidad exclusiva'
      ]
    },
    {
      id: 'lord',
      title: 'LORD',
      color: '#4671D5',
      icon: <Crown className="w-8 h-8" />,
      path: '/dashboard/lord',
      level: 4,
      emblem: '🔵',
      description: 'Visión estratégica y patrones elevados',
      philosophy: 'Autoridad, planificación y percepción elevada',
      image: '/images/insignias/4-lords.png',
      requirements: 'Completar 90% del contenido de Warrior',
      benefits: [
        'Liderazgo de equipos',
        'Estrategias maestras',
        'Acceso VIP completo'
      ]
    },
    {
      id: 'darth',
      title: 'DARTH',
      color: '#EC4D58',
      icon: <Flame className="w-8 h-8" />,
      path: '/dashboard/darth',
      level: 5,
      emblem: '🔴',
      description: 'Transmutación de la sombra en poder',
      philosophy: 'Dominio de la energía destructiva y creativa',
      image: '/images/insignias/5-darths.png',
      requirements: 'Completar 95% del contenido de Lord',
      benefits: [
        'Poder máximo',
        'Control total',
        'Maestría absoluta'
      ]
    },
    {
      id: 'maestro',
      title: 'MAESTRO',
      color: '#8a8a8a', // Color estándar para maestros regulares
      icon: <Star className="w-8 h-8" />,
      path: '/dashboard/maestro',
      level: 6,
      emblem: '⚫',
      description: 'Integración plena del ser interior',
      philosophy: 'Equilibrio, control absoluto y presencia silenciosa',
      image: '/images/insignias/6-maestros.png',
      requirements: 'Acceso exclusivo para usuarios autorizados',
      benefits: [
        'Iluminación total',
        'Sabiduría infinita',
        'Transcendencia'
      ]
    }
  ];


  // Usar refs para estabilizar valores y evitar re-renders
  const userLevelRef = useRef<number>(1);
  const roleDisplayTextRef = useRef<string>('Iniciado');
  const roleColorRef = useRef<string>('#8a8a8a');
  const isInitializedRef = useRef<boolean>(false);

  // Función estable para calcular nivel de usuario
  const calculateUserLevel = useCallback(() => {
    if (!userData) {
      console.log('🔍 calculateUserLevel: No userData, returning 1');
      return 1;
    }
    
    console.log('🔍 calculateUserLevel: userData.email:', userData.email);
    console.log('🔍 calculateUserLevel: MAESTRO_AUTHORIZED_EMAILS:', MAESTRO_AUTHORIZED_EMAILS);
    console.log('🔍 calculateUserLevel: userData.user_level:', userData.user_level);
    
    // Para usuarios fundadores, asignar nivel 6 (Maestro) pero permitir acceso total
    if (userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim())) {
      console.log('✅ calculateUserLevel: Usuario fundador detectado, retornando nivel 6');
      return 6; // Nivel de Maestro (pero se mostrará como "Fundador")
    }
    
    console.log('🔍 calculateUserLevel: Usuario regular, retornando nivel:', userData.user_level || 1);
    return userData.user_level || 1;
  }, [userData]);

  // Función estable para calcular texto del rol
  const calculateRoleDisplayText = useCallback(() => {
    return getLevelDisplayName(userData);
  }, [userData]);

  // Función estable para calcular color del rol
  const calculateRoleColor = useCallback(() => {
    if (!userData) return '#8a8a8a';
    
    // Verificar si es Maestro Fundador
    const isMaestroFundador = userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim());
    
    if (isMaestroFundador) {
      return '#FF8C42'; // Color naranja para Maestros Fundadores
    }
    
    // Para otros maestros (nivel 6) que no sean fundadores
    const currentLevel = userLevelRef.current;
    if (currentLevel === 6) {
      return '#8a8a8a'; // Color gris para otros maestros
    }
    
    // Para otros niveles, usar el color de su nivel
    const option = dashboardOptions.find(o => o.level === currentLevel);
    return option?.color || '#8a8a8a';
  }, [userData]);

  // Actualizar refs solo cuando sea necesario
  useEffect(() => {
    if (userData && isReady) {
      const newUserLevel = calculateUserLevel();
      const newRoleDisplayText = calculateRoleDisplayText();
      const newRoleColor = calculateRoleColor();
      
      // Solo actualizar si los valores han cambiado
      if (newUserLevel !== userLevelRef.current || 
          newRoleDisplayText !== roleDisplayTextRef.current || 
          newRoleColor !== roleColorRef.current) {
        
        userLevelRef.current = newUserLevel;
        roleDisplayTextRef.current = newRoleDisplayText;
        roleColorRef.current = newRoleColor;
        
        console.log('✅ Valores estabilizados:', {
          userLevel: newUserLevel,
          roleDisplayText: newRoleDisplayText,
          roleColor: newRoleColor,
          userEmail: userData.email,
          isMaestroFundador: userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim())
        });
      }
      
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
      }
    }
  }, [userData, isReady, calculateUserLevel, calculateRoleDisplayText, calculateRoleColor]); // Depender de las funciones también

  // Valores estables que no causan re-renders
  const userLevel = userData ? calculateUserLevel() : 1;
  const roleDisplayText = userData ? calculateRoleDisplayText() : 'Iniciado';
  const getRoleColor = userData ? calculateRoleColor() : '#8a8a8a';

  // Debug simplificado del usuario - Solo una vez al montar
  useEffect(() => {
    if (userData && isReady) {
      console.log('🔍 Dashboard Selection - Usuario cargado:', {
        nickname: userData.nickname,
        email: userData.email,
        user_level: userData.user_level,
        calculatedLevel: userLevel,
        roleDisplayText: roleDisplayText
      });
    }
  }, [userData, isReady, userLevel, roleDisplayText]); // Depender de los valores relevantes

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      console.log('🚪 Cerrando sesión desde dashboard-selection...');
      
      // Usar la función de logout del AuthContext
      logout();
      
      // Redirigir al login
      console.log('🚪 Redirigiendo a signin...');
      window.location.href = '/login/signin';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para manejar el menú de perfil
  const handleProfileAction = (action: string) => {
    setIsProfileMenuOpen(false);
    
    switch (action) {
      case 'profile':
        // Redirigir al perfil del dashboard de nivel más alto
        console.log('🔍 handleProfileAction - userData recibido:', userData);
        console.log('🔍 handleProfileAction - userData.email:', userData?.email);
        console.log('🔍 handleProfileAction - userData.user_level:', userData?.user_level);
        console.log('🔍 handleProfileAction - MAESTRO_AUTHORIZED_EMAILS:', MAESTRO_AUTHORIZED_EMAILS);
        
        const profilePath = getUserProfilePath(userData);
        console.log('🔍 handleProfileAction - ProfilePath calculado:', profilePath);
        console.log('🔍 handleProfileAction - Redirigiendo a perfil:', profilePath);
        
        // Usar setTimeout para asegurar que la redirección se ejecute
        console.log('🔍 handleProfileAction - Ejecutando redirección en 100ms...');
        setTimeout(() => {
          console.log('🔍 handleProfileAction - Redirigiendo ahora a:', profilePath);
          window.location.href = profilePath;
        }, 100);
        break;
      case 'feedback':
        // Abrir modal de feedback
        setIsFeedbackModalOpen(true);
        break;
      case 'share':
        // Compartir código de invitación
        if (userData?.referral_code) {
          // Usar localhost para desarrollo
          const baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : window.location.origin;
          const shareUrl = `${baseUrl}/signup?ref=${userData.referral_code}`;
          const shareText = `¡Únete a Crypto Force! Usa mi código de invitación: ${userData.referral_code}\n\n${shareUrl}`;
          
          if (navigator.share) {
            navigator.share({
              title: 'Crypto Force - Invitación',
              text: shareText,
              url: shareUrl
            }).catch(console.error);
          } else {
            // Fallback: copiar al portapapeles
            navigator.clipboard.writeText(shareText).then(() => {
              alert('¡Código de invitación copiado al portapapeles!');
            }).catch(() => {
              // Fallback manual
              const textArea = document.createElement('textarea');
              textArea.value = shareText;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              alert('¡Código de invitación copiado al portapapeles!');
            });
          }
        } else {
          alert('No tienes un código de invitación disponible.');
        }
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };



  // Función estable para verificar acceso a roles
  const canAccessRole = useCallback((roleLevel: number) => {
    if (!userData) return false;
    
    const currentUserEmail = userData.email;
    
    // Verificar si es usuario fundador por email
    const isFundadorByEmail = currentUserEmail && MAESTRO_AUTHORIZED_EMAILS.includes(currentUserEmail.toLowerCase().trim());
    
    // Fundadores tienen acceso a TODOS los dashboards
    if (isFundadorByEmail) {
      console.log(`✅ ${getLevelDisplayName(userData)} accesible para usuario`);
      return true;
    }
    
    // Calcular nivel actual del usuario
    const currentUserLevel = userData.user_level || 1;
    
    // También verificar por nivel 6
    if (currentUserLevel === 6) {
      console.log(`✅ ${getLevelDisplayName(userData)} accesible para usuario`);
      return true;
    }
    
    // Otros usuarios solo pueden acceder a su nivel y niveles inferiores
    const hasAccess = roleLevel <= currentUserLevel;
    if (hasAccess) {
      console.log(`✅ ${getLevelDisplayName(userData)} accesible para usuario`);
    }
    return hasAccess;
  }, [userData]);

  // Mostrar error si hay bucle de redirección
  if (redirectAttempts > 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Bucle de Redirección Detectado</h2>
          <p className="text-gray-400 mb-6">
            Se ha detectado un bucle de redirección. Esto puede ser causado por problemas de autenticación.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = '/login/signin';
              }}
              className="w-full px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
            >
              Reiniciar Sesión
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('redirectAttempts');
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Intentar de Nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar loading si no hay datos del usuario
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white mt-4">Cargando tu perfil...</p>
          {loadingTimeout && (
            <div className="mt-4">
              <p className="text-red-400 mb-4">Error de carga - Recargando automáticamente...</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
              >
                Recargar Página
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Debug: Log user data
  console.log('🔍 [DASHBOARD-SELECTION] User data:', userData);
  console.log('🔍 [DASHBOARD-SELECTION] User email:', userData?.email);
  console.log('🔍 [DASHBOARD-SELECTION] User nickname:', userData?.nickname);

  // Bloquear solo datos de ejemplo específicos
  if (userData?.email === 'email@ejemplo.com' || userData?.nickname === 'Usuario') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-4">Datos de Ejemplo Detectados</h2>
          <p className="text-gray-400 mb-6">
            Se detectaron datos de ejemplo. Por favor, inicia sesión correctamente.
          </p>
          <button
            onClick={() => {
              window.location.href = '/login/signin';
            }}
            className="w-full px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está autorizado
  const authorizedEmails = ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'];
  const isAuthorized = userData?.email ? authorizedEmails.includes(userData.email.toLowerCase().trim()) : false;
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h2>
          <p className="text-gray-400 mb-6">
            No tienes acceso a esta página. Debes estar autenticado correctamente.
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Email detectado: {userData?.email || 'No disponible'}
          </p>
          <button
            onClick={() => {
              window.location.href = '/login/signin';
            }}
            className="w-full px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d43d48] transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Mini Navbar Profesional */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#2a2a2a]/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div>
                <span className="text-white font-semibold text-lg">Crypto Force - Trading Team</span>
                <p className="text-[#8a8a8a] text-xs">Criptomonedas e Inversiones</p>
              </div>
            </div>
            
            {/* Información del usuario y menú de perfil */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white text-sm font-medium">{userData?.nickname || 'Cargando...'}</span>
                <span className="text-[#8a8a8a] text-xs">{userData?.email || 'Cargando...'}</span>
              </div>
              
              {/* Botón directo de Editar Perfil */}
              <button
                onClick={() => {
                  console.log('🖱️ [DIRECT PROFILE] Click en Editar Perfil directo');
                  const profilePath = getUserProfilePath(userData);
                  console.log('🖱️ [DIRECT PROFILE] ProfilePath calculado:', profilePath);
                  console.log('🖱️ [DIRECT PROFILE] Redirigiendo a perfil:', profilePath);
                  window.location.href = profilePath;
                }}
                className="px-4 py-2 bg-[#ec4d58] hover:bg-[#d43d48] text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105 active:scale-95"
                title="Editar Perfil"
              >
                <Edit size={16} />
                <span>Editar Perfil</span>
              </button>
              
              {/* Botón directo de Maestro Dashboard */}
              <button
                onClick={() => {
                  console.log('🖱️ [DIRECT MAESTRO] Click en Maestro Dashboard directo');
                  console.log('🖱️ [DIRECT MAESTRO] Redirigiendo a /dashboard/maestro');
                  window.location.href = '/dashboard/maestro';
                }}
                className="px-4 py-2 bg-[#8a8a8a] hover:bg-[#6a6a6a] text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105 active:scale-95"
                title="Ir a Maestro Dashboard"
              >
                <User size={16} />
                <span>Maestro</span>
              </button>
              
              {/* Botón de perfil con menú desplegable */}
              <div className="relative profile-menu-container">
                <button
                  onClick={() => {
                    console.log('🖱️ [PROFILE MENU] Toggle profile menu, current state:', isProfileMenuOpen);
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }}
                  className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105 active:scale-95 border border-[#3a3a3a]"
                  title="Menú de perfil"
                >
                  {userAvatar ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-[#ec4d58] cursor-pointer hover:border-[#d43d48] transition-colors duration-200">
                      <Image
                        src={userAvatar}
                        alt="Avatar"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[#ec4d58] cursor-pointer hover:border-[#d43d48] transition-colors duration-200 flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                  <span className="hidden sm:inline">Perfil</span>
                  <ChevronDown 
                    size={12} 
                    className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Menú desplegable */}
                {isProfileMenuOpen && (() => {
                  console.log('🖱️ [PROFILE MENU] Rendering profile menu');
                  return (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Header del menú */}
                    <div className="px-4 py-3 border-b border-[#2a2a2a]">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <div 
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ec4d58] flex items-center justify-center cursor-pointer hover:border-[#d43d48] transition-all duration-200 hover:scale-105"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const input = document.getElementById('avatar-input-dashboard-selection') as HTMLInputElement;
                              if (input) {
                                input.click();
                              }
                            }}
                            title="Click para cambiar avatar"
                          >
                            {userAvatar ? (
                              <Image
                                src={userAvatar}
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#ec4d58] to-[#d43d48] flex items-center justify-center">
                                <User size={20} className="text-white" />
                              </div>
                            )}
                          </div>
                          
                          {/* Input oculto para seleccionar archivo */}
                          <input
                            id="avatar-input-dashboard-selection"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          
                          {/* Overlay con icono de cargar imagen - aparece en hover */}
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const input = document.getElementById('avatar-input-dashboard-selection') as HTMLInputElement;
                              if (input) {
                                console.log('🔍 Click en overlay, abriendo selector...');
                                input.click();
                              }
                            }}
                          >
                            <Camera size={16} className="text-white" />
                          </div>
                          
                          {/* Icono de cámara fijo */}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ec4d58] rounded-full flex items-center justify-center border border-[#1a1a1a] group-hover:bg-[#d43d48] transition-colors duration-200">
                            <Camera size={8} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{userData?.nickname || 'Cargando...'}</p>
                          <p className="text-[#8a8a8a] text-xs">{userData?.email || 'Cargando...'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-2">
                      <button
                        onClick={() => handleProfileAction('feedback')}
                        className="w-full px-4 py-3 text-left text-white hover:bg-[#2a2a2a] transition-colors duration-200 flex items-center gap-3"
                      >
                        <MessageSquare size={16} className="text-[#ec4d58]" />
                        <span className="text-sm">Enviar Feedback</span>
                      </button>
                      
                      <button
                        onClick={() => handleProfileAction('share')}
                        className="w-full px-4 py-3 text-left text-white hover:bg-[#2a2a2a] transition-colors duration-200 flex items-center gap-3"
                      >
                        <Share2 size={16} className="text-[#3ED598]" />
                        <span className="text-sm">Compartir Invitación</span>
                      </button>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-[#2a2a2a]"></div>

                    {/* Botón de Editar Perfil */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          console.log('🖱️ [PROFILE BUTTON] Click en Editar Perfil');
                          handleProfileAction('profile');
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-[#2a2a2a] transition-colors duration-200 flex items-center gap-3 rounded-lg"
                      >
                        <Edit size={16} className="text-[#8a8a8a]" />
                        <span className="text-sm">Editar Perfil</span>
                      </button>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-[#2a2a2a]"></div>

                    {/* Botón de logout */}
                    <div className="p-2">
                      <button
                        onClick={() => handleProfileAction('logout')}
                        className="w-full px-4 py-3 text-left text-[#ec4d58] hover:bg-[#2a2a2a] transition-colors duration-200 flex items-center gap-3 rounded-lg"
                      >
                        <LogOut size={16} />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-20 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Selecciona tu <span className="text-[#ec4d58]">Camino de Poder</span>
            </h1>
            <p className="text-[#8a8a8a] text-lg max-w-3xl mx-auto">
              Cada rango representa una etapa en tu evolución como trader y como individuo. 
              Elige sabiamente tu próximo paso en el camino hacia la maestría.
            </p>
          </div>

          {/* Información del usuario */}
          {userData && (
            <div className="bg-[#1e1e1e]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a] mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={
                      userData.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim())
                        ? '/images/insignias/6-founder.png'
                        : dashboardOptions.find(o => o.level === userLevel)?.image || ''
                    }
                    alt="Tu insignia actual"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-white text-xl font-semibold">{userData.nickname}</h3>
                  <p className="text-[#8a8a8a]">
                    Tu rol: <span className="font-semibold" style={{ color: getRoleColor }}>{roleDisplayText}</span>
                  </p>
                </div>
              </div>
              <p className="text-[#a0a0a0] text-center text-sm">
                {dashboardOptions.find(o => o.level === userLevel)?.philosophy}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Grid de roles */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardOptions.map((option) => {
              const isAccessible = canAccessRole(option.level);
              const isCurrentLevel = option.level === userLevel;
              
              // Determinar el color correcto para este rol
              const getOptionColor = () => {
                // Si es el nivel actual del usuario, usar el color dinámico
                if (isCurrentLevel) {
                  return getRoleColor;
                }
                // Si es maestro (nivel 6), verificar si es fundador
                if (option.level === 6) {
                  const isMaestroFundador = userData?.email && MAESTRO_AUTHORIZED_EMAILS.includes(userData.email.toLowerCase().trim());
                  return isMaestroFundador ? '#FF8C42' : '#8a8a8a';
                }
                // Para otros niveles, usar su color estándar
                return option.color;
              };
              
              const optionColor = getOptionColor();
              
              // Debug del renderizado de cada opción (simplificado)
              if (isAccessible) {
                console.log(`✅ ${option.title} accesible para usuario`);
              }
              
              return (
                <div
                  key={option.id}
                  className={`group relative overflow-hidden rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                    isCurrentLevel
                      ? 'shadow-lg'
                      : isAccessible
                      ? 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                      : 'border-[#1a1a1a] opacity-60'
                  } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  style={{
                    borderColor: isCurrentLevel ? optionColor : undefined,
                    boxShadow: isCurrentLevel ? `0 0 20px ${optionColor}20` : undefined
                  }}
                                    onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('🖱️ [CARD CLICK] Click en card:', {
                      title: option.title,
                      path: option.path,
                      isAccessible: isAccessible,
                      isNavigating: isNavigating,
                      userLevel: userLevel,
                      userEmail: userData?.email
                    });
                    
                    if (isAccessible && !isNavigating) {
                      console.log('✅ [CARD CLICK] Condiciones cumplidas, iniciando navegación');
                      setIsNavigating(true);
                      
                      // Incrementar contador de intentos de redirección
                      const currentAttempts = parseInt(sessionStorage.getItem('redirectAttempts') || '0');
                      sessionStorage.setItem('redirectAttempts', (currentAttempts + 1).toString());
                      
                      console.log('🚀 [NAVIGATION] Iniciando navegación a dashboard:', {
                        path: option.path,
                        title: option.title,
                        level: option.level,
                        userLevel: userLevel,
                        userEmail: userData?.email,
                        redirectAttempts: currentAttempts + 1
                      });
                      
                      // Guardar el dashboard actual en localStorage
                      if (typeof window !== 'undefined') {
                        const dashboardName = option.path.split('/').pop();
                        localStorage.setItem('currentDashboard', dashboardName || 'iniciado');
                        console.log('💾 [NAVIGATION] Dashboard guardado en localStorage:', dashboardName);
                      }
                      
                      console.log('🔄 [NAVIGATION] Redirigiendo...');
                      // Usar window.location.href para evitar problemas con router
                      setTimeout(() => {
                        console.log('🔄 [NAVIGATION] Ejecutando redirección a:', option.path);
                        window.location.href = option.path;
                      }, 100);
                      
                      // Reset isNavigating after a delay to allow for retry if needed
                      setTimeout(() => {
                        console.log('🔄 [NAVIGATION] Reseteando estado de navegación');
                        setIsNavigating(false);
                      }, 2000);
                    } else if (!isAccessible) {
                      console.warn('⚠️ [NAVIGATION] Acceso denegado a:', option.path);
                    } else if (isNavigating) {
                      console.log('⏳ [NAVIGATION] Ya navegando, ignorando click');
                    }
                  }}
                  onMouseEnter={() => setHoveredRole(option.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  {/* Fondo con gradiente */}
                  <div 
                    className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                    style={{ background: `linear-gradient(135deg, ${optionColor}20, ${optionColor}10)` }}
                  />
                  
                  {/* Contenido */}
                  <div className="relative p-6">
                    {/* Header del emblema */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 relative">
                        <Image
                          src={option.image}
                          alt={`Insignia ${option.title}`}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          onLoad={() => console.log(`✅ Imagen cargada exitosamente: ${option.image}`)}
                          onError={(e) => {
                            console.error(`❌ Error cargando imagen: ${option.image}`);
                            // Fallback a un emoji si la imagen falla
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        {/* Fallback emoji si la imagen falla */}
                        <div 
                          className="w-full h-full flex items-center justify-center text-2xl hidden"
                          style={{ display: 'none' }}
                        >
                          {option.emblem}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrentLevel && (
                          <div 
                            className="text-white text-xs px-2 py-1 rounded-full font-medium"
                            style={{ backgroundColor: optionColor }}
                          >
                            Actual
                          </div>
                        )}
                        {isAccessible ? (
                          <Unlock className="w-5 h-5 text-green-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-[#6a6a6a]" />
                        )}
                      </div>
                    </div>

                    {/* Título y descripción */}
                    <h3 className="text-white text-xl font-semibold mb-2">{option.title}</h3>
                    <p className="text-[#8a8a8a] text-sm mb-4">{option.description}</p>

                    {/* Filosofía */}
                    <div className="bg-[#1a1a1a]/50 rounded-lg p-3 border border-[#2a2a2a] mb-4">
                      <p className="text-[#a0a0a0] text-xs leading-relaxed">
                        {option.philosophy}
                      </p>
                    </div>

                    {/* Requisitos */}
                    <div className="mb-4">
                      <h4 className="text-[#8a8a8a] text-xs font-semibold mb-2">REQUISITOS</h4>
                      <p className="text-[#a0a0a0] text-xs">{option.requirements}</p>
                    </div>

                    {/* Beneficios */}
                    <div className="mb-4">
                      <h4 className="text-[#8a8a8a] text-xs font-semibold mb-2">BENEFICIOS</h4>
                      <ul className="space-y-1">
                        {option.benefits.map((benefit, index) => (
                          <li key={index} className="text-[#a0a0a0] text-xs flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: optionColor }}></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>



                    {/* Botón de acceso */}
                    {isAccessible ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          if (!isNavigating) {
                            setIsNavigating(true);
                          console.log(`🚀 Navegando a: ${option.path}`);
                            
                            setTimeout(() => {
                          window.location.href = option.path;
                            }, 100);
                            
                            // Reset isNavigating after a delay to allow for retry if needed
                            setTimeout(() => {
                              setIsNavigating(false);
                            }, 2000);
                          } else {
                            console.log('⏳ Ya navegando, ignorando click');
                          }
                        }}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                          isCurrentLevel
                            ? 'text-white'
                            : 'text-white'
                        }`}
                        style={{
                          backgroundColor: isCurrentLevel ? optionColor : optionColor + '20',
                          border: isCurrentLevel ? undefined : `1px solid ${optionColor}40`,
                          // Asegurar contraste adecuado para el texto
                          color: isCurrentLevel ? '#000000' : '#FFFFFF'
                        }}
                      >
                        {isCurrentLevel ? 'Acceder a mi Dashboard' : 'Acceder al Dashboard'}
                      </button>
                    ) : (
                      <div className="w-full py-2 px-4 rounded-lg font-medium text-sm bg-[#1a1a1a] text-[#6a6a6a] text-center">
                        Bloqueado
                      </div>
                    )}
                  </div>

                  {/* Borde de color sutil */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
                    style={{ backgroundColor: optionColor }}
                  />
                </div>
              );
            })}
          </div>

          {/* Mensaje para niveles superiores */}
          {userLevel < 6 && (
            <div className="text-center mt-8">
              <div className="bg-[#1e1a1a]/50 border border-[#2a2a2a] rounded-xl p-6 max-w-2xl mx-auto">
                <Zap className="w-8 h-8 text-[#ec4d58] mx-auto mb-3" />
                <h3 className="text-white text-lg font-semibold mb-2">El Camino Continúa</h3>
                <p className="text-[#8a8a8a] text-sm">
                  Cada nivel desbloquea nuevas capacidades y profundiza tu comprensión del trading. 
                  La disciplina y la práctica constante son las claves para ascender.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fondo con elementos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-[#2a2a2a] transform rotate-45 opacity-20"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-[#2a2a2a] transform -rotate-45 opacity-20"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-[#2a2a2a] transform rotate-12 opacity-20"></div>
        <div className="absolute bottom-40 right-1/4 w-28 h-28 border border-[#2a2a2a] transform -rotate-12 opacity-20"></div>
      </div>

      {/* Modal de Feedback */}
      <FeedbackModalWithTabs 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </div>
  );
}
