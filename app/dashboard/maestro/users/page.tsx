'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search,
  Eye,
  Edit,
  Save,
  X,
  Crown,
  Star,
  Phone,
  Building,
  Calendar,
  UserCheck,
  Shield,
  Mail,
  User,
  Hash,
  RefreshCw,
  Plus,
  UserPlus
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext-fixed';
import { supabase } from '@/lib/supabaseClient';
import { useEmergencyLock } from '@/hooks/useEmergencyLock';
import EmergencyLockButton from '@/components/EmergencyLockButton';
import { useProfileUpdateListener } from '@/hooks/useUserDataSync';
import Image from 'next/image';
import ProtectedUserFields, { canEditField } from '@/components/ProtectedUserFields';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  nickname: string;
  email: string;
  movil?: string;
  exchange?: string;
  user_level: number;
  referral_code?: string;
  referred_by?: string;
  referrer_nickname?: string;
  referrerInfo?: {
    nombre: string;
    apellido: string;
    nickname: string;
    email: string;
  };
  total_referrals?: number;
  created_at: string;
  updated_at?: string;
  uid?: string;
}

interface EditUserData {
  nombre: string;
  apellido: string;
  nickname: string;
  email: string;
  movil: string;
  exchange: string;
  user_level: number;
  referral_code: string;
  referred_by: string;
  total_referrals: number;
}

interface CreateUserData {
  nombre: string;
  apellido: string;
  nickname: string;
  email: string;
  movil: string;
  exchange: string;
  user_level: number;
  referred_by: string;
}

// Función para obtener la insignia según el nivel
const getBadgeImage = (userLevel: number): string => {
  switch (userLevel) {
    case 0: return '/images/insignias/6-founder.png';
    case 1: return '/images/insignias/1-iniciados.png';
    case 2: return '/images/insignias/2-acolitos.png';
    case 3: return '/images/insignias/3-warriors.png';
    case 4: return '/images/insignias/4-lords.png';
    case 5: return '/images/insignias/5-darths.png';
    case 6: return '/images/insignias/6-maestros.png';
    default: return '/images/insignias/1-iniciados.png';
  }
};

// Función para obtener el color según el nivel
const getLevelColor = (userLevel: number): string => {
  switch (userLevel) {
    case 0: return 'text-orange-400 bg-orange-400/10 border-orange-400/20'; // Maestro Fundador - Orange
    case 1: return 'text-[#121212] bg-[#fafafa] border-[#fafafa]'; // Iniciado - White background, dark text
    case 2: return 'text-blue-400 bg-blue-400/10 border-blue-400/20'; // Acólito - Blue
    case 3: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'; // Warrior - Yellow
    case 4: return 'text-purple-400 bg-purple-400/10 border-purple-400/20'; // Lord - Purple
    case 5: return 'text-red-400 bg-red-400/10 border-red-400/20'; // Darth - Red
    case 6: return 'text-[#fafafa] bg-[#8a8a8a] border-[#8a8a8a]'; // Maestro - Gray background, white text
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

// Función para obtener el nombre del nivel
const getLevelName = (userLevel: number): string => {
  switch (userLevel) {
    case 0: return 'Fundador';
    case 1: return 'Iniciado';
    case 2: return 'Acólito';
    case 3: return 'Warrior';
    case 4: return 'Lord';
    case 5: return 'Darth';
    case 6: return 'Maestro';
    default: return 'Desconocido';
  }
};

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<EditUserData | null>(null);
  const [creatingUser, setCreatingUser] = useState<CreateUserData>({
    nombre: '',
    apellido: '',
    nickname: '',
    email: '',
    movil: '',
    exchange: '',
    user_level: 1,
    referred_by: ''
  });
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hook de bloqueo de emergencia
  const { lockState } = useEmergencyLock();

  // Función para reintentar la carga de usuarios
  const handleRetry = () => {
    console.log('🔄 [USERS] Manual retry triggered');
    setRetryCount(prev => prev + 1);
    setError(null);
    fetchUsers();
  };

  // Función para cargar usuarios
  const fetchUsers = async () => {
    try {
      console.log('🔍 [USERS] ===== INICIO FETCH USUARIOS =====');
      console.log('🔍 [USERS] UserData:', userData);
      console.log('🔍 [USERS] User level:', userData?.user_level);
      console.log('🔍 [USERS] User email:', userData?.email);
      
      setLoading(true);
      setError(null); // Clear any previous errors
      
      // Obtener el token de sesión (sin timeout)
      console.log('🔍 [USERS] Obteniendo sesión actual...');
      let { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔍 [USERS] Sesión actual:', session ? 'Presente' : 'Ausente');
      console.log('🔍 [USERS] Session user:', session?.user?.email);
      console.log('🔍 [USERS] Session error:', sessionError);
      
      if (!session?.access_token) {
        console.log('⚠️ [USERS] No hay token, intentando refrescar sesión...');
        const refreshPromise = supabase.auth.refreshSession();
        const refreshTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Refresh timeout')), 10000)
        );
        
        const { data: { session: refreshedSession }, error: refreshError } = await Promise.race([refreshPromise, refreshTimeoutPromise]) as any;
        console.log('🔍 [USERS] Refresh result:', refreshedSession ? 'Exitoso' : 'Fallido');
        console.log('🔍 [USERS] Refresh error:', refreshError);
        
        if (!refreshedSession?.access_token) {
          console.log('❌ [USERS] No se pudo refrescar la sesión');
          throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
        }
        
        session = refreshedSession;
        console.log('✅ [USERS] Sesión refrescada exitosamente');
      }
      
      console.log('🔍 [USERS] Token presente:', !!session?.access_token);
      console.log('🔍 [USERS] Token length:', session?.access_token?.length || 0);
      
      // Crear AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      console.log('🔍 [USERS] Enviando request a API...');
      // Agregar timestamp para evitar cache
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/maestro/users?t=${timestamp}&r=${randomId}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Request-ID': randomId
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('🔍 [USERS] Response status:', response.status);
      console.log('🔍 [USERS] Response ok:', response.ok);
      
      if (response.ok) {
        console.log('✅ [USERS] Response exitosa, parseando JSON...');
        const data = await response.json();
        console.log('📊 [USERS] Datos recibidos de la API de usuarios:', data);
        console.log('📈 [USERS] Total usuarios recibidos:', data.users?.length || 0);
        
        // TRACKEAR FRANCISCO ESPECÍFICAMENTE
        if (data.users && Array.isArray(data.users)) {
          const francisco = data.users.find((user: User) => user.email === 'infocryptoforce@gmail.com');
          if (francisco) {
            console.log('🔍 [FRANCISCO TRACKING] Datos de Francisco desde API:');
            console.log('🔍 [FRANCISCO TRACKING] - ID:', francisco.id);
            console.log('🔍 [FRANCISCO TRACKING] - Email:', francisco.email);
            console.log('🔍 [FRANCISCO TRACKING] - Nombre:', francisco.nombre);
            console.log('🔍 [FRANCISCO TRACKING] - Apellido:', francisco.apellido);
            console.log('🔍 [FRANCISCO TRACKING] - Nickname:', francisco.nickname);
            console.log('🔍 [FRANCISCO TRACKING] - User Level:', francisco.user_level);
            console.log('🔍 [FRANCISCO TRACKING] - Referral Code:', francisco.referral_code);
            console.log('🔍 [FRANCISCO TRACKING] - Referred By:', francisco.referred_by);
            console.log('🔍 [FRANCISCO TRACKING] - Updated At:', francisco.updated_at);
          } else {
            console.log('❌ [FRANCISCO TRACKING] Francisco NO encontrado en los datos de la API!');
          }
        }
        
        if (data.users && Array.isArray(data.users)) {
          console.log('✅ Usuarios cargados exitosamente');
          
          // Calcular estadísticas
          const levelCounts = data.users.reduce((acc: Record<number, number>, user: User) => {
            acc[user.user_level] = (acc[user.user_level] || 0) + 1;
            return acc;
          }, {});
          console.log('👥 Desglose de usuarios por nivel:', levelCounts);
          
          setAllUsers(data.users);
          setFilteredUsers(data.users);
          setSuccess(`Se cargaron ${data.users.length} usuarios exitosamente`);
          
          // FORZAR RE-RENDER para evitar cache
          setTimeout(() => {
            setAllUsers([...data.users]);
            setFilteredUsers([...data.users]);
          }, 100);
        } else {
          console.error('❌ Error en la respuesta de la API:', data);
          setError(data.error || 'Error al cargar usuarios: respuesta inválida');
        }
      } else {
        console.error('❌ [USERS] Error HTTP:', response.status, response.statusText);
        
        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ [USERS] Error data:', errorData);
        } catch (jsonError) {
          console.error('❌ [USERS] Error parseando JSON de error:', jsonError);
          errorData = { error: `Error ${response.status}: ${response.statusText}` };
        }
        
        if (response.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        } else if (response.status === 403) {
          setError('No tienes permisos para acceder a esta información.');
        } else {
          setError(`${errorData.error || `Error ${response.status}: ${response.statusText}`} (Intento ${retryCount + 1})`);
        }
      }
    } catch (error) {
      console.error('❌ [USERS] Error en fetchUsers:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError(`La solicitud tardó demasiado. Por favor, intenta nuevamente. (Intento ${retryCount + 1})`);
        } else if (error.message.includes('timeout')) {
          setError(`Tiempo de espera agotado. Por favor, intenta nuevamente. (Intento ${retryCount + 1})`);
        } else if (error.message.includes('sesión')) {
          setError('Problema de autenticación. Por favor, inicia sesión nuevamente.');
        } else {
          setError(`Error de conexión: ${error.message} (Intento ${retryCount + 1})`);
        }
      } else {
        setError(`Error de conexión al cargar usuarios (Intento ${retryCount + 1})`);
      }
    } finally {
      setLoading(false);
      console.log('🔍 [USERS] ===== FIN FETCH USUARIOS =====');
    }
  };

  // Listener para actualizaciones de perfil
  useProfileUpdateListener((eventData) => {
    console.log('🔄 Users Page - Perfil actualizado recibido:', eventData);
    // Recargar la lista de usuarios cuando se actualiza un perfil
    fetchUsers();
  });

  // Función para limpiar mensajes después de un tiempo
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000); // Limpiar después de 5 segundos
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000); // Limpiar después de 8 segundos
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  const { user, userData, loading: authLoading, isReady } = useSafeAuth();

  useEffect(() => {
    if (isReady && user && userData) {
      console.log('🔄 [USERS] useEffect triggered - calling fetchUsers');
      fetchUsers();
    }
  }, [isReady, user, userData?.id]); // Add userData.id as dependency

  useEffect(() => {
    if (searchTerm) {
      const filtered = allUsers.filter(user => 
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(allUsers);
    }
  }, [searchTerm, allUsers]);

  // Función para crear usuario
  const handleCreateUser = async () => {
    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await fetch('/api/maestro/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          action: 'create_user',
          userData: creatingUser
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuccess(result.message || 'Usuario creado correctamente');
        setShowCreateModal(false);
        setCreatingUser({
          nombre: '',
          apellido: '',
          nickname: '',
          email: '',
          movil: '',
          exchange: '',
          user_level: 1,
          referred_by: ''
        });
        
        // Refrescar la lista de usuarios
        const fetchUsers = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) return;
            
            const response = await fetch('/api/maestro/users', {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.users) {
                setAllUsers(data.users);
                setFilteredUsers(data.users);
              }
            }
          } catch (error) {
            console.error('Error refreshing users:', error);
          }
        };
        
        await fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error creando usuario');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    console.log('🗑️ Frontend - Iniciando eliminación de usuario:', userToDelete);
    
    setDeleting(true);
    setError(null); // Clear any previous errors
    setSuccess(null); // Clear any previous success messages
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }
      
      console.log('🗑️ Frontend - Token de sesión obtenido:', session?.access_token ? 'Sí' : 'No');
      console.log('🗑️ Frontend - Enviando request a /api/maestro/users');
      
      const requestBody = {
        action: 'delete_user',
        userId: userToDelete.id
      };
      
      console.log('🗑️ Frontend - Request body:', requestBody);
      
      const response = await fetch('/api/maestro/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('🗑️ Frontend - Response status:', response.status);
      console.log('🗑️ Frontend - Response ok:', response.ok);
      
      if (response.ok) {
        const result = await response.json();
        setSuccess(result.message || 'Usuario eliminado correctamente');
        
        // Cerrar el modal inmediatamente después del éxito
        setShowDeleteModal(false);
        setUserToDelete(null);
        
        // Refrescar la lista de usuarios sin recargar la página
        const fetchUsers = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) return;
            
            const response = await fetch('/api/maestro/users', {
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.users) {
                setAllUsers(data.users);
                setFilteredUsers(data.users);
              }
            }
          } catch (error) {
            console.error('Error refreshing users:', error);
          }
        };
        
        await fetchUsers();
      } else {
        console.error('🗑️ Frontend - Error en la respuesta:', response.status, response.statusText);
        let errorData;
        try {
          errorData = await response.json();
          console.error('🗑️ Frontend - Error data:', errorData);
        } catch (e) {
          console.error('🗑️ Frontend - Error parsing response:', e);
          errorData = { error: 'Error de conexión con el servidor' };
        }
        setError(errorData.error || 'Error eliminando usuario');
        // Cerrar el modal también en caso de error para que el usuario vea el mensaje de error
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (error) {
      setError('Error de conexión');
      // Cerrar el modal también en caso de error de conexión
      setShowDeleteModal(false);
      setUserToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  // Renderizado condicional basado en autenticación
  if (!isReady || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
          <p className="text-[#a0a0a0] mb-6">Debes estar autenticado para acceder a esta página</p>
          <button
            onClick={() => window.location.href = '/login/signin'}
            className="px-6 py-3 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d93c47] transition-colors"
          >
            🔐 Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Verificar si es usuario fundador por email
  const isFundadorByEmail = userData.email && ['infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com'].includes(userData.email.toLowerCase().trim());
  
  if (userData.user_level !== 0 && userData.user_level !== 6 && !isFundadorByEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h1>
          <p className="text-[#a0a0a0] mb-6">Solo los Maestros pueden acceder a esta página</p>
          <p className="text-[#6a6a6a] text-sm">Tu nivel actual: {userData.user_level}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h1>
            <p className="text-[#a0a0a0]">Administra y supervisa todos los usuarios del sistema</p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Botón de emergencia */}
            <EmergencyLockButton 
              userEmail={userData?.email || ''} 
              onLockChange={(isLocked) => {
                if (isLocked) {
                  setSuccess('Sistema bloqueado - Solo lectura disponible');
                } else {
                  setSuccess('Sistema desbloqueado - Funciones completas restauradas');
                }
              }}
            />
            
            {/* Botón de crear usuario */}
            <button
              onClick={async () => {
                console.log('🔄 [MANUAL REFRESH] Forzando actualización de usuarios...');
                await fetchUsers();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={lockState.isLocked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                lockState.isLocked
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ec4d58] text-white hover:bg-[#d93c47]'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              {lockState.isLocked ? 'Sistema Bloqueado' : 'Crear Usuario'}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-[#2a2a2a] p-4 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6a6a6a] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre, apellido, nickname o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handleRetry}
              disabled={loading}
              className="ml-4 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Reintentando...' : 'Reintentar'}
            </button>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-400 hover:text-green-300 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}


        {/* Estadísticas generales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-[#2a2a2a] p-2 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#ec4d58] mr-2 sm:mr-3" />
              <div>
                <p className="text-xs sm:text-sm text-[#a0a0a0]">Total Usuarios</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{allUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] p-2 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <Image
                src="/images/insignias/1-iniciados.png"
                alt="Iniciados"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full"
              />
              <div>
                <p className="text-xs sm:text-sm text-[#a0a0a0]">Iniciados</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {allUsers.filter(u => u.user_level === 1).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] p-2 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <Image
                src="/images/insignias/2-acolitos.png"
                alt="Acólitos"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full"
              />
              <div>
                <p className="text-xs sm:text-sm text-[#a0a0a0]">Acólitos</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {allUsers.filter(u => u.user_level === 2).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] p-2 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <Image
                src="/images/insignias/3-warriors.png"
                alt="Warriors"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full"
              />
              <div>
                <p className="text-xs sm:text-sm text-[#a0a0a0]">Warriors</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {allUsers.filter(u => u.user_level === 3).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] p-2 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <Image
                src="/images/insignias/4-lords.png"
                alt="Lords"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full"
              />
              <div>
                <p className="text-xs sm:text-sm text-[#a0a0a0]">Lords</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {allUsers.filter(u => u.user_level === 4).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] p-2 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <Image
                src="/images/insignias/5-darths.png"
                alt="Darths"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full"
              />
              <div>
                <p className="text-xs sm:text-sm text-[#a0a0a0]">Darths</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {allUsers.filter(u => u.user_level === 5).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] p-2 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <Image
                src="/images/insignias/6-maestros.png"
                alt="Maestros"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full"
              />
              <div>
                <p className="text-xs sm:text-sm text-[#a0a0a0]">Maestros</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {allUsers.filter(u => u.user_level === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios - Responsive */}
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider w-[20%]">
                    Usuario
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider w-[12%]">
                    Nivel
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider w-[8%]">
                    Ref.
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider w-[15%]">
                    Referido por
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider w-[20%]">
                    Contacto
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider w-[10%]">
                    Fecha
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider w-[15%]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filteredUsers.map((user) => {
                  // Check if user is a founding master
                  const isFoundingMaster = user.email === 'coeurdeluke.js@gmail.com' || user.email === 'infocryptoforce@gmail.com';
                  
                  return (
                    <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-2 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <Image
                              src={getBadgeImage(user.user_level)}
                              alt={`${getLevelName(user.user_level)} badge`}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-2 min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                              {user.nombre} {user.apellido}
                            </div>
                            <div className="text-xs text-[#6a6a6a] truncate">
                              @{user.nickname}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          isFoundingMaster && user.user_level === 0 
                            ? 'text-[#FF8C42] bg-[#FF8C42]/10 border-[#FF8C42]/20' 
                            : getLevelColor(user.user_level)
                        }`}>
                          {getLevelName(user.user_level)}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-xs text-white text-center">
                        {user.total_referrals || 0}
                      </td>
                      <td className="px-2 py-3 text-xs text-[#6a6a6a] truncate">
                        {user.referrerInfo?.nickname || 'Sin referidor'}
                      </td>
                      <td className="px-2 py-3">
                        <div className="text-xs text-white">
                          {user.movil && user.movil.trim() !== '' ? (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.movil}</span>
                            </div>
                          ) : (
                            <span className="text-[#6a6a6a]">Sin teléfono</span>
                          )}
                        </div>
                        <div className="text-xs text-[#6a6a6a] truncate">
                          {user.exchange && user.exchange.trim() !== '' ? user.exchange : 'Sin exchange'}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-xs text-[#6a6a6a]">
                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-[#ec4d58] hover:text-[#d93c47] transition-colors p-1"
                            title="Ver detalles"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (!lockState.isLocked) {
                                console.log('🔍 Abriendo modal de edición para usuario:', user);
                                console.log('🔍 Datos del usuario:', {
                                  nombre: user.nombre,
                                  apellido: user.apellido,
                                  nickname: user.nickname,
                                  email: user.email,
                                  user_level: user.user_level
                                });
                                
                                setSelectedUser(user);
                                setEditingUser({
                                  nombre: user.nombre || '',
                                  apellido: user.apellido || '',
                                  nickname: user.nickname || '',
                                  email: user.email || '',
                                  movil: user.movil || '',
                                  exchange: user.exchange || '',
                                  user_level: user.user_level || 1,
                                  referral_code: user.referral_code || '',
                                  referred_by: user.referred_by || '',
                                  total_referrals: user.total_referrals || 0
                                });
                                setShowEditModal(true);
                              }
                            }}
                            disabled={lockState.isLocked}
                            className={`transition-colors p-1 ${
                              lockState.isLocked
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-blue-400 hover:text-blue-300'
                            }`}
                            title={lockState.isLocked ? 'Sistema bloqueado' : 'Editar usuario'}
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (!lockState.isLocked) {
                                console.log('🗑️ Frontend - Usuario seleccionado para eliminar:', user);
                                console.log('🗑️ Frontend - ID del usuario:', user.id);
                                setUserToDelete(user);
                                setShowDeleteModal(true);
                              }
                            }}
                            disabled={lockState.isLocked}
                            className={`transition-colors p-1 ${
                              lockState.isLocked
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-red-400 hover:text-red-300'
                            }`}
                            title={lockState.isLocked ? 'Sistema bloqueado' : 'Eliminar usuario'}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
            <p className="text-[#a0a0a0]">Cargando usuarios...</p>
          </div>
        )}

        {/* Sin usuarios */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-[#6a6a6a] mx-auto mb-4" />
            <p className="text-[#a0a0a0] text-lg">No se encontraron usuarios</p>
            {searchTerm && (
              <p className="text-[#6a6a6a] text-sm mt-2">
                Intenta con otros términos de búsqueda
              </p>
            )}
          </div>
        )}

        {/* Modal de detalles del usuario */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-[#2a2a2a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Detalles del Usuario</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-[#6a6a6a] hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Mostrar protección para usuarios fundadores */}
                  <ProtectedUserFields 
                    email={selectedUser.email}
                    userLevel={selectedUser.user_level}
                    referralCode={selectedUser.referral_code || ''}
                    nickname={selectedUser.nickname}
                  />
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <Image
                      src={getBadgeImage(selectedUser.user_level)}
                      alt={`${getLevelName(selectedUser.user_level)} badge`}
                      width={60}
                      height={60}
                      className="h-15 w-15 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedUser.nombre} {selectedUser.apellido}
                      </h3>
                      <p className="text-[#a0a0a0]">@{selectedUser.nickname}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        (selectedUser.email === 'coeurdeluke.js@gmail.com' || selectedUser.email === 'infocryptoforce@gmail.com') && selectedUser.user_level === 0
                          ? 'text-[#FF8C42] bg-[#FF8C42]/10 border-[#FF8C42]/20'
                          : getLevelColor(selectedUser.user_level)
                      }`}>
                        {getLevelName(selectedUser.user_level)}
                        {(selectedUser.email === 'coeurdeluke.js@gmail.com' || selectedUser.email === 'infocryptoforce@gmail.com') && selectedUser.user_level === 0 && (
                          <span className="ml-1 text-[#FF8C42]">⭐</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Email</label>
                      <p className="text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Teléfono</label>
                      <p className="text-white flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedUser.movil && selectedUser.movil.trim() !== '' ? selectedUser.movil : 'No proporcionado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Exchange</label>
                      <p className="text-white flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {selectedUser.exchange && selectedUser.exchange.trim() !== '' ? selectedUser.exchange : 'No proporcionado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Código de Referido</label>
                      <p className="text-white flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        {selectedUser.referral_code || 'No generado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Total Referidos</label>
                      <p className="text-white flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {selectedUser.total_referrals || 0}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Referido Por</label>
                      <p className="text-white flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {selectedUser.referred_by ? (
                          <span className="text-[#FF8C42] font-medium">
                            {(() => {
                              const referrer = allUsers.find(u => u.id === selectedUser.referred_by);
                              return referrer ? `${referrer.nombre} ${referrer.apellido} (@${referrer.nickname})` : 'Usuario no encontrado';
                            })()}
                          </span>
                        ) : (
                          <span className="text-[#6a6a6a]">Sin referidor</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Fecha de Registro</label>
                      <p className="text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(selectedUser.created_at).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-[#2a2a2a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Editar Usuario
                    {lockState.isLocked && (
                      <span className="ml-2 text-red-400 text-sm">(Sistema Bloqueado)</span>
                    )}
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-[#6a6a6a] hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {lockState.isLocked && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      <span className="font-medium">Sistema Bloqueado</span>
                    </div>
                    <p className="text-sm mt-1">
                      La edición de usuarios está deshabilitada temporalmente por seguridad.
                    </p>
                  </div>
                )}
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (lockState.isLocked) {
                    setError('El sistema está bloqueado. No se pueden realizar cambios.');
                    return;
                  }
                  setSaving(true);
                  try {
                    // Obtener el token de sesión
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session?.access_token) {
                      throw new Error('No hay sesión activa');
                    }
                    
                    const requestData = {
                      action: 'update_user',
                      userId: selectedUser?.id,
                      userData: editingUser
                    };
                    
                    console.log('📤 Enviando datos de actualización:');
                    console.log('- UserId:', selectedUser?.id);
                    console.log('- UserData:', editingUser);
                    console.log('- RequestData:', requestData);
                    console.log('- Session token length:', session?.access_token?.length);
                    
                    // Crear AbortController para timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => {
                      console.log('⏰ Timeout alcanzado, cancelando request...');
                      controller.abort();
                    }, 10000); // 10 second timeout
                    
                    const response = await fetch('/api/maestro/users', {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token}`
                      },
                      body: JSON.stringify(requestData),
                      signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    console.log('📥 Respuesta recibida:', response.status, response.statusText);
                    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
                    
                    if (response.ok) {
                      const responseData = await response.json();
                      console.log('✅ Usuario actualizado exitosamente:', responseData);
                      setSuccess('Usuario actualizado correctamente');
                      setShowEditModal(false);
                      // Refrescar la lista de usuarios sin recargar la página
                      await fetchUsers();
                    } else {
                      const errorData = await response.json();
                      console.error('❌ Error en la respuesta:', errorData);
                      setError(errorData.error || 'Error actualizando usuario');
                    }
                  } catch (error) {
                    console.error('❌ Error en la actualización:', error);
                    let errorMessage = 'Error desconocido';
                    
                    if (error instanceof Error) {
                      if (error.name === 'AbortError') {
                        errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.';
                      } else {
                        errorMessage = error.message;
                      }
                    }
                    
                    setError(`Error de conexión: ${errorMessage}`);
                  } finally {
                    console.log('🔄 Finalizando proceso de guardado...');
                    setSaving(false);
                  }
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Nombre</label>
                      <input
                        type="text"
                        value={editingUser.nombre}
                        onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Apellido</label>
                      <input
                        type="text"
                        value={editingUser.apellido}
                        onChange={(e) => setEditingUser({...editingUser, apellido: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Nickname</label>
                      <input
                        type="text"
                        value={editingUser.nickname}
                        onChange={(e) => setEditingUser({...editingUser, nickname: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Email</label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={editingUser.movil}
                        onChange={(e) => setEditingUser({...editingUser, movil: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Exchange</label>
                      <input
                        type="text"
                        value={editingUser.exchange}
                        onChange={(e) => setEditingUser({...editingUser, exchange: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">
                        Nivel de Usuario
                        {!canEditField(editingUser.email, 'user_level', userData?.email) && (
                          <span className="text-orange-400 ml-2">🔒 Protegido</span>
                        )}
                      </label>
                      <select
                        value={editingUser.user_level}
                        onChange={(e) => setEditingUser({...editingUser, user_level: parseInt(e.target.value)})}
                        disabled={lockState.isLocked || !canEditField(editingUser.email, 'user_level', userData?.email)}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked || !canEditField(editingUser.email, 'user_level', userData?.email)
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      >
                        {/* Solo mostrar "Fundador" si el usuario ya es fundador */}
                        {editingUser.user_level === 0 && (
                          <option value={0}>Fundador ⭐</option>
                        )}
                        <option value={1}>Iniciado</option>
                        <option value={2}>Acólito</option>
                        <option value={3}>Warrior</option>
                        <option value={4}>Lord</option>
                        <option value={5}>Darth</option>
                        <option value={6}>Maestro</option>
                      </select>
                      {!canEditField(editingUser.email, 'user_level', userData?.email) && (
                        <p className="text-xs text-orange-400 mt-1">
                          {editingUser.email === userData?.email 
                            ? '🔒 No puedes modificar tu propio nivel de usuario'
                            : '🔒 Campo protegido para usuarios fundadores'
                          }
                        </p>
                      )}
                      {(editingUser.email === 'coeurdeluke.js@gmail.com' || editingUser.email === 'infocryptoforce@gmail.com') && editingUser.user_level === 0 && (
                        <p className="text-xs text-[#FF8C42] mt-1">⭐ Fundador</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">
                        Total Referidos
                        <span className="text-orange-400 ml-2">🔒 No Editable</span>
                      </label>
                      <input
                        type="number"
                        value={editingUser.total_referrals}
                        disabled={true}
                        className="w-full px-3 py-2 rounded-lg border bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed focus:outline-none"
                      />
                      <p className="text-xs text-orange-400 mt-1">🔒 Este campo es calculado automáticamente por el sistema</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-[#a0a0a0] hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving || lockState.isLocked}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        lockState.isLocked
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-[#ec4d58] text-white hover:bg-[#d93c47] disabled:opacity-50'
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de creación de usuario */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-[#2a2a2a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Crear Nuevo Usuario
                    {lockState.isLocked && (
                      <span className="ml-2 text-red-400 text-sm">(Sistema Bloqueado)</span>
                    )}
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-[#6a6a6a] hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {lockState.isLocked && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      <span className="font-medium">Sistema Bloqueado</span>
                    </div>
                    <p className="text-sm mt-1">
                      La creación de usuarios está deshabilitada temporalmente por seguridad.
                    </p>
                  </div>
                )}
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (lockState.isLocked) {
                    setError('El sistema está bloqueado. No se pueden crear usuarios.');
                    return;
                  }
                  await handleCreateUser();
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={creatingUser.nombre}
                        onChange={(e) => setCreatingUser({...creatingUser, nombre: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Apellido *</label>
                      <input
                        type="text"
                        value={creatingUser.apellido}
                        onChange={(e) => setCreatingUser({...creatingUser, apellido: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Nickname *</label>
                      <input
                        type="text"
                        value={creatingUser.nickname}
                        onChange={(e) => setCreatingUser({...creatingUser, nickname: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Email *</label>
                      <input
                        type="email"
                        value={creatingUser.email}
                        onChange={(e) => setCreatingUser({...creatingUser, email: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={creatingUser.movil}
                        onChange={(e) => setCreatingUser({...creatingUser, movil: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Exchange</label>
                      <input
                        type="text"
                        value={creatingUser.exchange}
                        onChange={(e) => setCreatingUser({...creatingUser, exchange: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Nivel de Usuario *</label>
                      <select
                        value={creatingUser.user_level}
                        onChange={(e) => setCreatingUser({...creatingUser, user_level: parseInt(e.target.value)})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                        required
                      >
                        <option value={1}>Iniciado</option>
                        <option value={2}>Acólito</option>
                        <option value={3}>Warrior</option>
                        <option value={4}>Lord</option>
                        <option value={5}>Darth</option>
                        <option value={6}>Maestro (Regular)</option>
                      </select>
                      <p className="text-xs text-[#6a6a6a] mt-1">
                        Nota: Los Maestros (coeurdeluke.js@gmail.com e infocryptoforce@gmail.com) tienen color naranja especial
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Referido por (ID)</label>
                      <input
                        type="text"
                        value={creatingUser.referred_by}
                        onChange={(e) => setCreatingUser({...creatingUser, referred_by: e.target.value})}
                        disabled={lockState.isLocked}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                          lockState.isLocked
                            ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
                            : 'bg-[#1a1a1a] text-white border-[#4a4a4a] focus:border-[#ec4d58]'
                        }`}
                        placeholder="ID del usuario que refirió"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg">
                    <h3 className="text-sm font-medium text-[#a0a0a0] mb-2">Información del Sistema</h3>
                    <div className="text-xs text-[#6a6a6a] space-y-1">
                      <p>• Se generará automáticamente un código de referido único</p>
                      <p>• El usuario se creará con 0 referidos</p>
                      <p>• La fecha de creación será la actual</p>
                      <p>• El usuario podrá iniciar sesión inmediatamente</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-[#a0a0a0] hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={creating || lockState.isLocked}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        lockState.isLocked
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-[#ec4d58] text-white hover:bg-[#d93c47] disabled:opacity-50'
                      }`}
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Crear Usuario
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2a2a2a] rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {deleting ? 'Eliminando usuario...' : '¿Eliminar usuario?'}
                  </h3>
                  {!deleting && (
                    <>
                      <p className="text-sm text-[#a0a0a0] mb-4">
                        Esta acción no se puede deshacer. Se eliminará permanentemente el usuario:
                      </p>
                      <div className="bg-[#1a1a1a] rounded-lg p-3 mb-4">
                        <p className="text-white font-medium">
                          {userToDelete.nombre} {userToDelete.apellido}
                        </p>
                        <p className="text-[#6a6a6a] text-sm">
                          @{userToDelete.nickname} • {userToDelete.email}
                        </p>
                      </div>
                    </>
                  )}
                  {deleting && (
                    <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center mb-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ec4d58]"></div>
                      </div>
                      <p className="text-[#a0a0a0] text-sm">
                        Eliminando usuario y actualizando lista...
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      if (!deleting) {
                        setShowDeleteModal(false);
                        setUserToDelete(null);
                      }
                    }}
                    className={`px-4 py-2 transition-colors ${
                      deleting 
                        ? 'text-[#6a6a6a] cursor-not-allowed' 
                        : 'text-[#a0a0a0] hover:text-white'
                    }`}
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={deleting}
                    className="px-4 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d93c47] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}