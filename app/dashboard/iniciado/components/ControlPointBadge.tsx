import React from 'react';
import { CheckCircle, XCircle, Hourglass, Lock } from 'lucide-react';

interface ControlPointBadgeProps {
  className?: string;
}

const ControlPointBadge: React.FC<ControlPointBadgeProps> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center ${className}`} title="Punto de Control">
      <CheckCircle className="text-base text-yellow-400" />
    </div>
  );
};

export default ControlPointBadge; 