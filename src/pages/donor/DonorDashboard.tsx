import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { mockDonations, mockProjects, donationsByMonth } from '@/data/mockData';
import { TrendingUp, Users, Star, Target, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString()}</span>;
}

const stats = [
  { label: 'Total Donado', value: 48500, prefix: '$', icon: TrendingUp, color: 'text-primary' },
  { label: 'Proyectos Apoyados', value: 5, prefix: '', icon: Target, color: 'text-info' },
  { label: 'Honor Points', value: 2450, prefix: '', icon: Star, color: 'text-gold' },
  { label: 'Donantes Referidos', value: 12, prefix: '', icon: Users, color: 'text-accent' },
];

export default function DonorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Bienvenido, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground">Tu impacto social en tiempo real</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-4 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="stat-number">
              <AnimatedNumber value={s.value} prefix={s.prefix} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Donaciones por Mes</h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-primary">
            <ArrowUpRight className="w-4 h-4" />
            +42.8%
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={donationsByMonth}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(82, 100%, 36%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(82, 100%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
            <XAxis dataKey="month" stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'hsl(220, 18%, 11%)', border: '1px solid hsl(220, 12%, 20%)', borderRadius: '8px', color: 'hsl(0, 0%, 95%)' }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Donado']}
            />
            <Area type="monotone" dataKey="amount" stroke="hsl(82, 100%, 36%)" strokeWidth={2} fill="url(#greenGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Projection + Recent */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-3">📊 Proyección de Impacto</h3>
          <p className="text-sm text-muted-foreground mb-4">Si mantienes tu ritmo actual de donación:</p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">En 3 meses</span>
              <span className="font-medium text-primary">$93,500 impactados</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">En 6 meses</span>
              <span className="font-medium text-primary">$138,500 impactados</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Honor Points proyectados</span>
              <span className="font-medium text-gold">4,850 pts</span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary">
            🏆 Estás a 550 pts de "Defensor Oro"
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-3">Donaciones Recientes</h3>
          <div className="space-y-3">
            {mockDonations.slice(0, 5).map(d => {
              const project = mockProjects.find(p => p.id === d.projectId);
              return (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{project?.image}</span>
                    <div>
                      <div className="font-medium truncate max-w-[180px]">{project?.title}</div>
                      <div className="text-xs text-muted-foreground">{d.date}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-primary">${d.amount.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
