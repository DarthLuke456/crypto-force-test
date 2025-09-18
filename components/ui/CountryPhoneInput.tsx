'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'CA', name: 'Canadá', dialCode: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japón', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nueva Zelanda', dialCode: '+64', flag: '🇳🇿' },
];

interface CountryPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CountryPhoneInput({ 
  value, 
  onChange, 
  placeholder = "Número de teléfono",
  className = ""
}: CountryPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Argentina es el primero ahora
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    
    // Actualizar el valor del input con el nuevo código de país
    const phoneNumber = value.replace(/^\+\d+\s*/, ''); // Remover código anterior
    onChange(country.dialCode + ' ' + phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Si el usuario empieza a escribir sin código de país, agregarlo
    if (!inputValue.startsWith('+')) {
      onChange(selectedCountry.dialCode + ' ' + inputValue);
    } else {
      onChange(inputValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        {/* Selector de país integrado */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 sm:gap-2 bg-[#2a2d36] border-r border-white/20 rounded-l-lg px-2 sm:px-3 py-2.5 sm:py-3 text-white/80 hover:text-white transition-colors min-w-[70px] sm:min-w-[80px] justify-center"
        >
          <span className="text-base sm:text-lg">{selectedCountry.flag}</span>
          <span className="text-xs sm:text-sm font-medium hidden xs:inline">{selectedCountry.dialCode}</span>
          <ChevronDown size={14} className={`sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Campo de teléfono */}
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#2a2d36] border border-white/20 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#ec4d58] focus:border-[#ec4d58] transition-all text-sm sm:text-base"
          placeholder={placeholder}
        />
        <Phone size={16} className="sm:w-5 sm:h-5 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-white/40" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-full sm:w-80 max-w-sm max-h-60 bg-[#2a2d36] border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden"
        >
          {/* Barra de búsqueda */}
          <div className="p-2 sm:p-3 border-b border-white/10">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar país..."
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-[#1e2028] border border-white/20 rounded text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ec4d58] focus:border-[#ec4d58]"
            />
          </div>

          {/* Lista de países */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-[#3a3d46] transition-colors text-left"
              >
                <span className="text-base sm:text-lg">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm sm:text-base truncate">{country.name}</div>
                  <div className="text-white/60 text-xs sm:text-sm">{country.dialCode}</div>
                </div>
                {selectedCountry.code === country.code && (
                  <div className="w-2 h-2 bg-[#ec4d58] rounded-full"></div>
                )}
              </button>
            ))}
            
            {filteredCountries.length === 0 && (
              <div className="px-3 sm:px-4 py-2 sm:py-3 text-white/60 text-center text-sm sm:text-base">
                No se encontraron países
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
