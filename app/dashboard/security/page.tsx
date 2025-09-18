'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Eye, 
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  AlertCircle
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'LOCK' | 'UNLOCK' | 'ATTEMPT' | 'FAILED_ATTEMPT' | 'UNAUTHORIZED_ACCESS';
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolved: boolean;
}

interface SecurityStats {
  totalEvents: number;
  last24h: {
    total: number;
    locks: number;
    unlocks: number;
    failedAttempts: number;
    unauthorizedAccess: number;
  };
  last7d: {
    total: number;
    locks: number;
    unlocks: number;
    failedAttempts: number;
    unauthorizedAccess: number;
  };
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export default function SecurityDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    fetchSecurityData();
  }, [selectedTimeRange]);

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true);
      
      // Simular datos de seguridad (en producción, esto vendría de la API)
      const mockEvents: SecurityEvent[] = [
        {
          id: 'evt_1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          eventType: 'LOCK',
          userId: 'coeurdeluke.js@gmail.com',
          userEmail: 'coeurdeluke.js@gmail.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: { reason: 'Mantenimiento del sistema' },
          severity: 'HIGH',
          resolved: true
        },
        {
          id: 'evt_2',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          eventType: 'FAILED_ATTEMPT',
          userId: 'unknown@example.com',
          userEmail: 'unknown@example.com',
          ipAddress: '192.168.1.200',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: { reason: 'Email no autorizado' },
          severity: 'CRITICAL',
          resolved: false
        }
      ];

      const mockStats: SecurityStats = {
        totalEvents: 150,
        last24h: {
          total: 12,
          locks: 2,
          unlocks: 1,
          failedAttempts: 3,
          unauthorizedAccess: 1
        },
        last7d: {
          total: 45,
          locks: 5,
          unlocks: 4,
          failedAttempts: 8,
          unauthorizedAccess: 2
        },
        severity: {
          critical: 3,
          high: 8,
          medium: 12,
          low: 22
        }
      };

      setEvents(mockEvents);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'LOCK': return <Lock className="w-4 h-4 text-red-400" />;
      case 'UNLOCK': return <Unlock className="w-4 h-4 text-green-400" />;
      case 'FAILED_ATTEMPT': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'UNAUTHORIZED_ACCESS': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec4d58] mx-auto mb-4"></div>
          <p className="text-white">Cargando datos de seguridad...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#ec4d58]" />
              Dashboard de Seguridad
            </h1>
            <p className="text-[#a0a0a0]">Monitoreo y análisis de eventos de seguridad</p>
          </div>
          
          <div className="mt-4 lg:mt-0">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as '24h' | '7d' | '30d')}
              className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-[#4a4a4a] focus:border-[#ec4d58] focus:outline-none"
            >
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
          </div>
        </div>

        {/* Estadísticas principales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#a0a0a0] text-sm">Eventos Totales</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#a0a0a0] text-sm">Últimas 24h</p>
                  <p className="text-2xl font-bold text-white">{stats.last24h.total}</p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#a0a0a0] text-sm">Intentos Fallidos</p>
                  <p className="text-2xl font-bold text-red-400">{stats.last24h.failedAttempts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div className="bg-[#2a2a2a] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#a0a0a0] text-sm">Accesos No Autorizados</p>
                  <p className="text-2xl font-bold text-red-400">{stats.last24h.unauthorizedAccess}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        )}

        {/* Eventos recientes */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Eventos Recientes
          </h2>
          
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#1a1a1a] rounded-lg p-4 border border-[#4a4a4a]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getEventTypeIcon(event.eventType)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">
                          {event.eventType.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                      </div>
                      <p className="text-sm text-[#a0a0a0]">
                        Usuario: {event.userEmail}
                      </p>
                      <p className="text-sm text-[#a0a0a0]">
                        IP: {event.ipAddress}
                      </p>
                      <p className="text-sm text-[#a0a0a0]">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.resolved 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {event.resolved ? 'Resuelto' : 'Pendiente'}
                    </span>
                  </div>
                </div>
                
                {event.details && (
                  <div className="mt-3 p-3 bg-[#0a0a0a] rounded border border-[#333]">
                    <p className="text-xs text-[#6a6a6a] mb-1">Detalles:</p>
                    <pre className="text-xs text-[#a0a0a0] whitespace-pre-wrap">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de severidad */}
        {stats && (
          <div className="bg-[#2a2a2a] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Resumen por Severidad</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{stats.severity.critical}</div>
                <div className="text-sm text-[#a0a0a0]">Crítico</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">{stats.severity.high}</div>
                <div className="text-sm text-[#a0a0a0]">Alto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.severity.medium}</div>
                <div className="text-sm text-[#a0a0a0]">Medio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.severity.low}</div>
                <div className="text-sm text-[#a0a0a0]">Bajo</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
