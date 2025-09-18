export interface Module {
  id: string;
  title: string;
  path: string;
  icon?: React.JSX.Element;
  description: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  level: 'nivel1' | 'nivel2';
  type?: 'content' | 'checkpoint';
  moduleNumber?: number;
  requiredCheckpoint?: string; // ID del punto de control requerido
}
