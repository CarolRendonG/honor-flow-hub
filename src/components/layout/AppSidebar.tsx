import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Search, Heart, Calendar, BookOpen, GraduationCap,
  Gift, Shield, FileText, TrendingUp, AlertTriangle, Receipt,
  FolderOpen, Upload, Banknote, LogOut, ChevronLeft, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const donorNav: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Explorar', url: '/explore', icon: Search },
  { title: 'Expedientes', url: '/expedientes', icon: Heart },
  { title: 'Eventos', url: '/events', icon: Calendar },
  { title: 'Servicio Social', url: '/servicio-social', icon: GraduationCap },
  { title: 'La Tesorería', url: '/tesoreria', icon: Gift },
  { title: 'Libro Blanco', url: '/libro-blanco', icon: BookOpen },
  { title: 'Marco Legal', url: '/legal', icon: FileText },
];

const receptorNav: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Mis Proyectos', url: '/my-projects', icon: FolderOpen },
  { title: 'Alertas PLD', url: '/receptor-pld', icon: AlertTriangle },
  { title: 'Subir Updates', url: '/updates', icon: Upload },
  { title: 'Dispersiones', url: '/dispersions', icon: Banknote },
];

const adminNav: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Cumplimiento', url: '/compliance', icon: Shield },
  { title: 'Revisión', url: '/review', icon: Shield },
  { title: 'Financiero', url: '/finance', icon: TrendingUp },
  { title: 'PLD', url: '/pld', icon: AlertTriangle },
  { title: 'Recibos', url: '/receipts', icon: Receipt },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navItems = user.role === 'donor' ? donorNav : user.role === 'receptor' ? receptorNav : adminNav;
  const roleLabel = user.role === 'donor' ? 'Donante' : user.role === 'receptor' ? 'Receptor' : 'Admin';

  return (
    <aside className={cn(
      "h-screen sticky top-0 flex flex-col glass-strong transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-green-sm">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-gradient-green">Cashed</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-green-sm mx-auto">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className={cn("text-muted-foreground hover:text-foreground transition-colors", collapsed && "mx-auto mt-2")}>
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{roleLabel}</div>
          <div className="text-sm font-medium truncate">{user.name}</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                active
                  ? "bg-primary/15 text-primary glow-green-sm font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Honor Points (donor only) */}
      {user.role === 'donor' && !collapsed && (
        <div className="p-4 mx-3 mb-2 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-xs text-muted-foreground">Honor Points</div>
          <div className="text-xl font-bold text-primary">{user.honorPoints.toLocaleString()}</div>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-border/50">
        <button onClick={logout} className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full",
          collapsed && "justify-center px-0"
        )}>
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
