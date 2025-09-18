'use client';
import { useResponsive } from '@/hooks/useResponsive';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  mobilePriority?: boolean; // Mostrar en vista móvil compacta
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveTable({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = ''
}: ResponsiveTableProps) {
  const { isMobile, isTablet } = useResponsive();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Filtrar columnas para móvil (solo las de alta prioridad)
  const mobileColumns = columns.filter(col => col.mobilePriority !== false);
  const desktopColumns = columns;

  // Función de ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Datos ordenados
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Toggle de fila expandida en móvil
  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <div className={`bg-[#1a1a1a] rounded-lg border border-[#333] ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec4d58]"></div>
          <span className="ml-3 text-[#a0a0a0]">Cargando...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-[#1a1a1a] rounded-lg border border-[#333] p-8 text-center ${className}`}>
        <p className="text-[#a0a0a0]">{emptyMessage}</p>
      </div>
    );
  }

  // Vista móvil - Cards
  if (isMobile) {
    return (
      <div className={`space-y-3 ${className}`}>
        {sortedData.map((row, index) => {
          const isExpanded = expandedRows.has(index);
          const primaryColumns = mobileColumns.slice(0, 2); // Solo 2 columnas principales
          const secondaryColumns = mobileColumns.slice(2);

          return (
            <div
              key={index}
              className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden"
            >
              {/* Contenido principal */}
              <div 
                className="p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200"
                onClick={() => toggleRow(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {primaryColumns.map((column) => (
                      <div key={column.key} className="flex justify-between items-center py-1">
                        <span className="text-[#a0a0a0] text-sm font-medium">
                          {column.label}:
                        </span>
                        <span className="text-white text-sm">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(row);
                        }}
                        className="p-2 text-[#ec4d58] hover:bg-[#ec4d58] hover:text-white rounded-lg transition-colors duration-200"
                        aria-label="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row);
                        }}
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="p-2">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#a0a0a0]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#a0a0a0]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido expandible */}
              {isExpanded && secondaryColumns.length > 0 && (
                <div className="border-t border-[#333] p-4 bg-[#0f0f0f]">
                  {secondaryColumns.map((column) => (
                    <div key={column.key} className="flex justify-between items-center py-2">
                      <span className="text-[#a0a0a0] text-sm font-medium">
                        {column.label}:
                      </span>
                      <span className="text-white text-sm">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Vista desktop/tablet - Tabla tradicional
  return (
    <div className={`bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0f0f0f] border-b border-[#333]">
            <tr>
              {desktopColumns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-4 py-3 text-left text-sm font-medium text-[#a0a0a0]
                    ${column.sortable ? 'cursor-pointer hover:text-white transition-colors duration-200' : ''}
                  `}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${
                            sortField === column.key && sortDirection === 'asc' 
                              ? 'text-[#ec4d58]' 
                              : 'text-[#666]'
                          }`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${
                            sortField === column.key && sortDirection === 'desc' 
                              ? 'text-[#ec4d58]' 
                              : 'text-[#666]'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-left text-sm font-medium text-[#a0a0a0]">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={`
                  hover:bg-[#2a2a2a] transition-colors duration-200
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {desktopColumns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-white">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="p-2 text-[#ec4d58] hover:bg-[#ec4d58] hover:text-white rounded-lg transition-colors duration-200"
                          aria-label="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
