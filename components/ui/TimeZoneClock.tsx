'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TimeZoneClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(currentTime);

  const formattedDate = format(currentTime, 'EEEE, d MMMM yyyy', { locale: es });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      <div className="text-sm leading-tight">
        <div className="font-medium text-[rgb(var(--foreground))]">{formattedTime}</div>
        <div className="text-[rgb(var(--foreground))] opacity-80 capitalize">{formattedDate}</div>
      </div>
    </div>
  );
}
