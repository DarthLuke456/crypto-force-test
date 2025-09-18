import { Home, User, Settings, BookOpen, BarChart3, MessageCircle, LogOut, Award, Users, TrendingUp, Layers, Star, HelpCircle, Calendar, UserPlus, LineChart, Crown, Shield, FileText, CheckCircle, XCircle, Clock, Compass, MessageSquare } from 'lucide-react';

export const sidebarItems = [
  {
    label: 'Inicio',
    href: '/dashboard/iniciado',
    icon: Home
  },
  {
    label: 'Módulos',
    href: '/dashboard/iniciado/modules',
    icon: BookOpen
  },
  {
    label: 'Progreso',
    href: '/dashboard/iniciado/progress',
    icon: BarChart3
  },
  {
    label: 'Gráfico',
    href: '/dashboard/iniciado/trading',
    icon: LineChart
  },
  {
    label: 'Compartí',
    href: '/dashboard/iniciado/invitation-code',
    icon: UserPlus
  },
  {
    label: 'Niveles',
    href: '/login/dashboard-selection',
    icon: Compass,
    isCompass: true
  },
  {
    label: 'Feedback',
    href: '#',
    icon: MessageSquare,
    isFeedback: true
  },
  {
    label: 'Ajustes',
    href: '/dashboard/iniciado/settings',
    icon: Settings
  }
];

export const sidebarItemsAcolito = [
  { label: "Inicio", href: "/dashboard/acolito", icon: Home },
  { label: "Explora la Academia", href: "/dashboard/academia", icon: BookOpen },
  { label: "Convertirse en Acólito", href: "/dashboard/acolito/convertirse", icon: Award },
  { label: "Eventos abiertos", href: "/dashboard/acolito/eventos", icon: Calendar },
  { label: "Niveles", href: "/login/dashboard-selection", icon: Compass, isCompass: true },
  { label: "Feedback", href: "#", icon: MessageSquare, isFeedback: true },
  { label: "Ajustes", href: "/dashboard/acolito/ajustes", icon: Settings }
];

// Items para Warriors (Nivel 3)
export const sidebarItemsWarrior = [
  { label: "Inicio", href: "/dashboard/warrior", icon: Home },
  { label: "Análisis", href: "/dashboard/warrior/analytics", icon: BarChart3 },
  { label: "Usuarios", href: "/dashboard/warrior/students", icon: Users },
  { label: "Contenido", href: "/dashboard/warrior/courses", icon: BookOpen },
  { label: "Gráfico", href: "/dashboard/warrior/trading", icon: TrendingUp },
  { label: "Niveles", href: "/login/dashboard-selection", icon: Compass, isCompass: true },
  { label: "Feedback", href: "#", icon: MessageSquare, isFeedback: true },
  { label: "Ajustes", href: "/dashboard/warrior/settings", icon: Settings }
];

// Items para Lords (Nivel 4)
export const sidebarItemsLord = [
  { label: "Inicio", href: "/dashboard/lord", icon: Home },
  { label: "Análisis", href: "/dashboard/lord/analytics", icon: BarChart3 },
  { label: "Usuarios", href: "/dashboard/lord/students", icon: Users },
  { label: "Contenido", href: "/dashboard/lord/courses", icon: BookOpen },
  { label: "Gráfico", href: "/dashboard/lord/trading", icon: TrendingUp },
  { label: "Niveles", href: "/login/dashboard-selection", icon: Compass, isCompass: true },
  { label: "Feedback", href: "#", icon: MessageSquare, isFeedback: true },
  { label: "Ajustes", href: "/dashboard/lord/settings", icon: Settings }
];

// Items para Darths (Nivel 5)
export const sidebarItemsDarth = [
  { label: "Inicio", href: "/dashboard/darth", icon: Home },
  { label: "Contenido", href: "/dashboard/darth/courses", icon: BookOpen },
  { label: "TRIBUNAL IMPERIAL", href: "/dashboard/tribunal-imperial", icon: Crown },
  { label: "Mis Propuestas", href: "/dashboard/tribunal-imperial/propuestas", icon: FileText },
  { label: "Estadísticas", href: "/dashboard/darth/stats", icon: BarChart3 },
  { label: "Niveles", href: "/login/dashboard-selection", icon: Compass, isCompass: true },
  { label: "Feedback", href: "#", icon: MessageSquare, isFeedback: true },
  { label: "Ajustes", href: "/dashboard/darth/settings", icon: Settings }
];

// Items para Maestros (Nivel 6)
export const sidebarItemsMaestro = [
  { label: "Inicio", href: "/dashboard/maestro", icon: Home },
  { label: "Analytics", href: "/dashboard/maestro/analytics", icon: BarChart3 },
  { label: "Usuarios", href: "/dashboard/maestro/users", icon: Users },
  { label: "Contenido", href: "/dashboard/maestro/courses", icon: BookOpen },
  { label: "Gráfico", href: "/dashboard/maestro/trading", icon: TrendingUp },
  { label: "Compartir", href: "/dashboard/maestro/invitation-code", icon: UserPlus },
  { label: "Niveles", href: "/login/dashboard-selection", icon: Compass, isCompass: true },
  { label: "Feedback", href: "#", icon: MessageSquare, isFeedback: true },
  { label: "Ajustes", href: "/dashboard/maestro/settings", icon: Settings }
];