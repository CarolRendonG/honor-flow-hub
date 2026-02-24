import { motion } from 'framer-motion';
import { mockProjects } from '@/data/mockData';
import { TrendingUp, Users, CreditCard, Eye, Target, RefreshCw, ArrowUpRight, Upload, Banknote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const weeklyData = [
  { day: 'Lun', visits: 45, donations: 12 },
  { day: 'Mar', visits: 62, donations: 18 },
  { day: 'Mié', visits: 38, donations: 8 },
  { day: 'Jue', visits: 71, donations: 22 },
  { day: 'Vie', visits: 55, donations: 15 },
  { day: 'Sáb', visits: 30, donations: 6 },
  { day: 'Dom', visits: 25, donations: 4 },
];

const stats = [
  { label: 'Total Recaudado', value: '$623,000', icon: TrendingUp, color: 'text-primary' },
  { label: 'Donantes Únicos', value: '184', icon: Users, color: 'text-info' },
  { label: 'Ticket Promedio', value: '$3,385', icon: CreditCard, color: 'text-gold' },
  { label: 'Visitas a Página', value: '2,847', icon: Eye, color: 'text-accent' },
  { label: 'Conversión', value: '6.5%', icon: Target, color: 'text-primary' },
  { label: 'Recurrentes Activos', value: '34', icon: RefreshCw, color: 'text-success' },
];

export default function ReceptorDashboard() {
  const project = mockProjects[0];
  const pct = Math.round((project.raised / project.goal) * 100);
  const daysToGoal = 42;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Dashboard Receptor</h1>
        <p className="text-muted-foreground">{project.title}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress + Projection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Progreso de Meta</h3>
          <span className="text-sm font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden mb-3">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>
        <p className="text-sm text-muted-foreground">
          📈 A este ritmo llegas a tu meta en <strong className="text-foreground">{daysToGoal} días</strong>
        </p>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Actividad Semanal</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
            <XAxis dataKey="day" stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'hsl(220, 18%, 11%)', border: '1px solid hsl(220, 12%, 20%)', borderRadius: '8px', color: 'hsl(0, 0%, 95%)' }} />
            <Bar dataKey="visits" fill="hsl(220, 14%, 30%)" radius={[4, 4, 0, 0]} name="Visitas" />
            <Bar dataKey="donations" fill="hsl(82, 100%, 36%)" radius={[4, 4, 0, 0]} name="Donaciones" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass rounded-xl p-5 text-left hover:border-primary/30 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold">Subir Update</div>
            <div className="text-xs text-muted-foreground">Comparte avances del proyecto</div>
          </div>
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass rounded-xl p-5 text-left hover:border-gold/30 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
            <Banknote className="w-6 h-6 text-gold" />
          </div>
          <div>
            <div className="font-semibold">Solicitar Dispersión</div>
            <div className="text-xs text-muted-foreground">Retira fondos verificados</div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
