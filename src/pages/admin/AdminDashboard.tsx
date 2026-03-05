import { motion, AnimatePresence } from 'framer-motion';
import { adminStats, mockProjects } from '@/data/mockData';
import { Shield, DollarSign, AlertTriangle, FileText, TrendingUp, Users, CheckCircle2, Clock, XCircle, Eye, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';

const pieData = [
  { name: 'Educación', value: 35, color: 'hsl(82, 100%, 36%)' },
  { name: 'Salud', value: 25, color: 'hsl(217, 91%, 60%)' },
  { name: 'Medio Ambiente', value: 20, color: 'hsl(142, 76%, 36%)' },
  { name: 'Alimentación', value: 12, color: 'hsl(43, 96%, 56%)' },
  { name: 'Otros', value: 8, color: 'hsl(220, 14%, 40%)' },
];

const pendingReview = [
  { id: 'r1', project: 'Centro de Salud Chiapas', status: 'pending', docs: 4, totalDocs: 6, risk: 'yellow' as const },
  { id: 'r2', project: 'Huerto Urbano CDMX', status: 'pending', docs: 6, totalDocs: 6, risk: 'green' as const },
  { id: 'r3', project: 'Donación anónima $180,000', status: 'alert', docs: 2, totalDocs: 6, risk: 'red' as const },
];

const pldNotifications = [
  { id: 'n1', title: 'Donación anónima $180,000 sin KYC', detail: 'Acumulado 6 meses: $520,000 · Requiere verificación', level: 'urgent' as const },
  { id: 'n2', title: 'Donante frecuente cerca de umbral UMA', detail: 'Acumulado: $148,000 / $160,500 (92%)', level: 'warning' as const },
];

const riskColors = { green: 'text-success', yellow: 'text-warning', red: 'text-destructive' };
const riskLabels = { green: 'Completo', yellow: 'Pendiente', red: 'Alerta PLD' };
const riskIcons = { green: CheckCircle2, yellow: Clock, red: AlertTriangle };

export default function AdminDashboard() {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with PLD notifications bell */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> Panel Admin</h1>
          <p className="text-muted-foreground">Centro de control Cashed</p>
        </div>
        {/* PLD Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 rounded-xl glass hover:bg-destructive/10 transition-all"
          >
            <AlertTriangle className="w-5 h-5 text-destructive" />
            {adminStats.pldAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
                {adminStats.pldAlerts}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 glass-strong rounded-xl border border-border/50 shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-border/50 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-semibold">Alertas PLD / Anti-Lavado</span>
                </div>
                <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                  {pldNotifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-lg ${n.level === 'urgent' ? 'bg-destructive/10 border border-destructive/20' : 'bg-warning/10 border border-warning/20'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${n.level === 'urgent' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                          {n.level === 'urgent' ? 'Urgente' : 'Monitoreo'}
                        </span>
                      </div>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{n.detail}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stats - 3 cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Movido', value: `$${(adminStats.totalMoved / 1e6).toFixed(1)}M`, icon: DollarSign, color: 'text-primary' },
          { label: 'Hoy', value: `$${(adminStats.todayMoved / 1e3).toFixed(0)}K`, icon: TrendingUp, color: 'text-accent' },
          { label: 'Donantes Totales', value: adminStats.totalDonors.toLocaleString(), icon: Users, color: 'text-info' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Review Queue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Cola de Revisión</h3>
          <div className="space-y-3">
            {pendingReview.map(item => {
              const RiskIcon = riskIcons[item.risk];
              return (
                <div key={item.id} className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RiskIcon className={`w-5 h-5 ${riskColors[item.risk]}`} />
                    <div>
                      <div className="font-medium text-sm">{item.project}</div>
                      <div className="text-xs text-muted-foreground">{item.docs}/{item.totalDocs} documentos</div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${riskColors[item.risk]}`}>{riskLabels[item.risk]}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-all">Aprobar</button>
            <button className="flex-1 py-2 rounded-lg bg-warning/15 text-warning text-sm font-medium hover:bg-warning/25 transition-all">Solicitar Corrección</button>
            <button className="flex-1 py-2 rounded-lg bg-destructive/15 text-destructive text-sm font-medium hover:bg-destructive/25 transition-all">Rechazar</button>
          </div>
        </motion.div>

        {/* Distribution Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(220, 18%, 11%)', border: '1px solid hsl(220, 12%, 20%)', borderRadius: '8px', color: 'hsl(0, 0%, 95%)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map(d => (
              <span key={d.name} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CFDI */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Recibos CFDI</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{adminStats.receiptsGenerated} recibos generados</span>
          <button className="px-4 py-1.5 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-all">
            Descargar Listado
          </button>
        </div>
      </motion.div>
    </div>
  );
}
