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
  Hash
} from 'lucide-react';
import { useSafeAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

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

// Función para obtener la insignia según el nivel
const getBadgeImage = (userLevel: number): string => {
  switch (userLevel) {
    case 0: return '/images/insignias/6-founder.png'; // Fundador
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
    case 0: return 'text-orange-400 bg-orange-400/10 border-orange-400/20'; // Fundador - Orange
    case 1: return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 2: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 3: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 4: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 5: return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 6: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<EditUserData | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { user, userData, loading: authLoading, isReady } = useSafeAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Obtener el token de sesión
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No hay sesión activa');
        }
        
        const response = await fetch('/api/maestro/users', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Datos recibidos de la API de usuarios:', data);
          console.log('📈 Total usuarios recibidos:', data.users?.length || 0);
          
          if (data.success && data.users) {
            console.log('✅ Usuarios cargados exitosamente');
            console.log('👥 Desglose de usuarios por nivel:');
            const levelCounts = data.users.reduce((acc: Record<number, number>, user: User) => {
              acc[user.user_level] = (acc[user.user_level] || 0) + 1;
              return acc;
            }, {});
            console.log(levelCounts);
            
            console.log('🔍 Primeros 3 usuarios:');
            data.users.slice(0, 3).forEach((user: User, index: number) => {
              console.log(`${index + 1}. ${user.nombre} ${user.apellido} (${user.email}) - Nivel: ${user.user_level}`);
            });
            
            setAllUsers(data.users);
            setFilteredUsers(data.users);
          } else {
            console.error('❌ Error en la respuesta de la API:', data.error);
            setError(data.error || 'Error obteniendo usuarios');
          }
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: 'No se pudo leer la respuesta del servidor' };
          }
          console.error('Error en la respuesta de la API:', response.status, errorData);
          setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error de conexión al obtener usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  if (userData.user_level < 6) {
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
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Debug Info - Solo visible en desarrollo */}
        {process.env.NODE_ENV === 'development' && allUsers.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg mb-6">
            <h3 className="font-bold mb-2">🔍 Debug Info (Desarrollo)</h3>
            <p>Total usuarios cargados: <strong>{allUsers.length}</strong></p>
            <p>Usuario actual: <strong>{userData?.email}</strong> (Nivel: {userData?.user_level})</p>
            <p>Filtro de búsqueda: <strong>"{searchTerm}"</strong></p>
            <details className="mt-2">
              <summary className="cursor-pointer">Ver desglose por niveles</summary>
              <div className="mt-2 text-sm">
                {[1,2,3,4,5,6].map(level => (
                  <p key={level}>
                    Nivel {level} ({getLevelName(level)}): {allUsers.filter(u => u.user_level === level).length} usuarios
                  </p>
                ))}
              </div>
            </details>
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
        </div>
        
        {/* Card separada para Maestros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-[#2a2a2a] to-[#3a2a2a] p-2 sm:p-4 rounded-lg border border-amber-400/20">
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
                <p className="text-lg sm:text-2xl font-bold text-amber-400">
                  {allUsers.filter(u => u.user_level === 6).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios - Responsive */}
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="overflow-x-auto min-w-0">
            <table className="w-full min-w-[600px] sm:min-w-[800px]">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider min-w-[150px] sm:min-w-[200px]">
                    Usuario
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider min-w-[80px] sm:min-w-[120px]">
                    Nivel
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider min-w-[70px] sm:min-w-[100px]">
                    Referidos
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider min-w-[120px] sm:min-w-[150px]">
                    Contacto
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider min-w-[80px] sm:min-w-[100px]">
                    Fecha
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-[#a0a0a0] uppercase tracking-wider min-w-[80px] sm:min-w-[120px]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          <Image
                            src={getBadgeImage(user.user_level)}
                            alt={`${getLevelName(user.user_level)} badge`}
                            width={40}
                            height={40}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-2 sm:ml-4 min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-white truncate">
                            {user.nombre} {user.apellido}
                          </div>
                          <div className="text-xs sm:text-sm text-[#6a6a6a] truncate">
                            @{user.nickname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium border ${getLevelColor(user.user_level)}`}>
                        {getLevelName(user.user_level)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white">
                      {user.total_referrals || 0}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-white">
                        {user.movil ? (
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            <span className="truncate">{user.movil}</span>
                          </div>
                        ) : (
                          <span className="text-[#6a6a6a]">Sin teléfono</span>
                        )}
                      </div>
                      <div className="text-xs text-[#6a6a6a] truncate">
                        {user.exchange || 'Sin exchange'}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-[#6a6a6a]">
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1 sm:space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-[#ec4d58] hover:text-[#d93c47] transition-colors p-1"
                          title="Ver detalles"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => {
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
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                          title="Editar usuario"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(selectedUser.user_level)}`}>
                        {getLevelName(selectedUser.user_level)}
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
                        {selectedUser.movil || 'No proporcionado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Exchange</label>
                      <p className="text-white flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {selectedUser.exchange || 'No proporcionado'}
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
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Editar Usuario</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-[#6a6a6a] hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
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
                    
                    const response = await fetch('/api/maestro/users', {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                      },
                      body: JSON.stringify(requestData)
                    });
                    
                    console.log('📥 Respuesta recibida:', response.status, response.statusText);
                    
                    if (response.ok) {
                      const responseData = await response.json();
                      console.log('✅ Usuario actualizado exitosamente:', responseData);
                      setSuccess('Usuario actualizado correctamente');
                      setShowEditModal(false);
                      // Recargar la página para mostrar los cambios
                      window.location.reload();
                    } else {
                      const errorData = await response.json();
                      console.error('❌ Error en la respuesta:', errorData);
                      setError(errorData.error || 'Error actualizando usuario');
                    }
                  } catch (error) {
                    setError('Error de conexión');
                  } finally {
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
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Apellido</label>
                      <input
                        type="text"
                        value={editingUser.apellido}
                        onChange={(e) => setEditingUser({...editingUser, apellido: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Nickname</label>
                      <input
                        type="text"
                        value={editingUser.nickname}
                        onChange={(e) => setEditingUser({...editingUser, nickname: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Email</label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={editingUser.movil}
                        onChange={(e) => setEditingUser({...editingUser, movil: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Exchange</label>
                      <input
                        type="text"
                        value={editingUser.exchange}
                        onChange={(e) => setEditingUser({...editingUser, exchange: e.target.value})}
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Nivel de Usuario</label>
                      <select
                        value={editingUser.user_level}
                        onChange={(e) => setEditingUser({...editingUser, user_level: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      >
                        <option value={1}>Iniciado</option>
                        <option value={2}>Acólito</option>
                        <option value={3}>Warrior</option>
                        <option value={4}>Lord</option>
                        <option value={5}>Darth</option>
                        <option value={6}>Maestro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a0a0a0] mb-1">Total Referidos</label>
                      <input
                        type="number"
                        value={editingUser.total_referrals}
                        onChange={(e) => setEditingUser({...editingUser, total_referrals: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
                      />
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
                      disabled={saving}
                      className="px-6 py-2 bg-[#ec4d58] text-white rounded-lg hover:bg-[#d93c47] transition-colors disabled:opacity-50 flex items-center gap-2"
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
      </div>
    </div>
  );
}