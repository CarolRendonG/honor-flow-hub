import { motion } from 'framer-motion';
import { GraduationCap, Clock, QrCode, CheckCircle2, Circle } from 'lucide-react';

const missions = [
  { title: 'Desarrollo de Software POS', hours: 80, completed: 60, category: 'Ingeniería' },
  { title: 'Asesoría Legal Pro-Bono', hours: 40, completed: 40, category: 'Derecho' },
  { title: 'Marketing Social para ONGs', hours: 60, completed: 35, category: 'Mercadotecnia' },
  { title: 'Auditoría Contable Comunitaria', hours: 50, completed: 25, category: 'Contaduría' },
  { title: 'Diseño UX para Inclusión', hours: 40, completed: 20, category: 'Diseño' },
];

export default function ServicioSocial() {
  const totalHours = 480;
  const completed = 240;
  const pct = Math.round((completed / totalHours) * 100);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Servicio Social</h1>
        <p className="text-muted-foreground">Tu impacto profesional al servicio de la comunidad</p>
      </motion.div>

      {/* Student Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Carlos Mendoza Ríos</h3>
            <p className="text-sm text-muted-foreground">Ingeniería en Computación · UNAM</p>
            <p className="text-xs text-muted-foreground">Semestre 8 · Matrícula: 320456789</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Ring */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6 flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(220, 14%, 16%)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke="hsl(82, 100%, 36%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - pct / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 8px hsl(82, 100%, 36%, 0.4))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{completed}</span>
            <span className="text-xs text-muted-foreground">/ {totalHours} Horas</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{pct}% completado · Faltan {totalHours - completed} horas</p>
      </motion.div>

      {/* QR Scanner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-3 glow-green"
        >
          <QrCode className="w-6 h-6" />
          Escanear QR de Entrada/Salida
        </motion.button>
      </motion.div>

      {/* Missions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
        <h3 className="font-semibold text-lg">Misiones de Carrera</h3>
        {missions.map((m, i) => {
          const mPct = Math.round((m.completed / m.hours) * 100);
          const done = m.completed >= m.hours;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              {done ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate">{m.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">{m.completed}/{m.hours}h</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${done ? 'bg-primary' : 'bg-accent/60'}`} style={{ width: `${mPct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{m.category}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
