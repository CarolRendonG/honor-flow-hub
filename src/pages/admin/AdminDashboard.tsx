import { motion } from 'framer-motion';
import { adminStats, mockProjects } from '@/data/mockData';
import { Shield, DollarSign, AlertTriangle, FileText, TrendingUp, Users, CheckCircle2, Clock, XCircle, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

const riskColors = { green: 'text-success', yellow: 'text-warning', red: 'text-destructive' };
const riskLabels = { green: 'Completo', yellow: 'Pendiente', red: 'Alerta PLD' };
const riskIcons = { green: CheckCircle2, yellow: Clock, red: AlertTriangle };

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> Panel Admin</h1>
        <p className="text-muted-foreground">Centro de control Cashed</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Movido', value: `$${(adminStats.totalMoved / 1e6).toFixed(1)}M`, icon: DollarSign, color: 'text-primary' },
          { label: 'Hoy', value: `$${(adminStats.todayMoved / 1e3).toFixed(0)}K`, icon: TrendingUp, color: 'text-accent' },
          { label: 'Donantes Totales', value: adminStats.totalDonors.toLocaleString(), icon: Users, color: 'text-info' },
          { label: 'Alertas PLD', value: adminStats.pldAlerts.toString(), icon: AlertTriangle, color: 'text-destructive' },
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

      {/* PLD Module */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6 border-destructive/20">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Módulo PLD / Anti-Lavado</h3>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Donación anónima $180,000 sin KYC</div>
              <div className="text-xs text-muted-foreground">Acumulado 6 meses: $520,000 · Requiere verificación</div>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-destructive/20 text-destructive font-medium">Urgente</span>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Donante frecuente cerca de umbral UMA</div>
              <div className="text-xs text-muted-foreground">Acumulado: $148,000 / $160,500 (92%)</div>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-warning/20 text-warning font-medium">Monitoreo</span>
          </div>
        </div>
      </motion.div>

      {/* CFDI */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-xl p-6">
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
