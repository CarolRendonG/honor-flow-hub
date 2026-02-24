import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/data/mockData';
import { Zap, Heart, Building2, Shield } from 'lucide-react';

const roles: { role: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { role: 'donor', label: 'Donante', desc: 'Explora y dona a proyectos sociales', icon: Heart },
  { role: 'receptor', label: 'Receptor', desc: 'Gestiona proyectos y recaudación', icon: Building2 },
  { role: 'admin', label: 'Admin Cashed', desc: 'Panel de administración y PLD', icon: Shield },
];

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(82,100%,36%,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(82,80%,42%,0.05),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center glow-green">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gradient-green mb-2">Cashed</h1>
        <p className="text-muted-foreground text-lg">Transparencia social que transforma</p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full px-4">
        {roles.map((r, i) => (
          <motion.button
            key={r.role}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => login(r.role)}
            className="glass p-6 rounded-2xl text-left group hover:border-primary/40 transition-all duration-300 hover:glow-green-sm cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
              <r.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{r.label}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-8 text-xs text-muted-foreground"
      >
        Demo con datos simulados · Selecciona un rol para comenzar
      </motion.p>
    </div>
  );
}
