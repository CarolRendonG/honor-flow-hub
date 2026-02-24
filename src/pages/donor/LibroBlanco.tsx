import { motion } from 'framer-motion';
import { mockProjects } from '@/data/mockData';
import { BookOpen, Hash, Check, Clock, ArrowRight, Camera, FileText } from 'lucide-react';

const steps = [
  { label: 'Donación Recibida', icon: Check, status: 'done' as const },
  { label: 'Asignada a Proyecto', icon: FileText, status: 'done' as const },
  { label: 'Recurso Ejecutado', icon: ArrowRight, status: 'done' as const },
  { label: 'Evidencia Subida', icon: Camera, status: 'current' as const },
];

export default function LibroBlanco() {
  const project = mockProjects[0];
  const mockHash = '0x7f3a...b8c2d9e1f4a5';
  const mockTxHash = '0xabc123def456789012345678901234567890abcdef';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> Libro Blanco</h1>
        <p className="text-muted-foreground">Transparencia blockchain simulada · Rastreo en tiempo real</p>
      </motion.div>

      {/* Transaction card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{project.title}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary font-mono">{project.category}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Hash className="w-3 h-3" />
          <span className="font-mono">{mockTxHash}</span>
        </div>

        {/* Stepper */}
        <div className="space-y-0 ml-2">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'done'
                    ? 'bg-primary/20 border-2 border-primary glow-green-sm'
                    : 'bg-gold/20 border-2 border-gold animate-glow-pulse'
                }`}>
                  {step.status === 'done' ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <Clock className="w-5 h-5 text-gold" />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-12 ${step.status === 'done' ? 'bg-primary/40' : 'bg-border'}`} />
                )}
              </div>
              <div className="pb-8">
                <div className={`font-medium text-sm ${step.status === 'current' ? 'text-gold' : ''}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-mono">Hash: {mockHash}</div>
                {step.status === 'done' && <div className="text-xs text-primary mt-0.5">✓ Verificado</div>}
                {step.status === 'current' && <div className="text-xs text-gold mt-0.5">⏳ En progreso</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Evidence Gallery */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">📸 Galería de Evidencia Final</h3>
        <div className="grid grid-cols-3 gap-3">
          {project.proofOfLife.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="aspect-square rounded-lg bg-secondary flex items-center justify-center text-sm text-muted-foreground p-2 text-center cursor-pointer hover:border-primary/30 border border-transparent transition-all"
            >
              {p}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-3">Resumen de Trazabilidad</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="stat-number text-primary">4</div>
            <div className="text-xs text-muted-foreground">Transacciones</div>
          </div>
          <div>
            <div className="stat-number text-primary">3</div>
            <div className="text-xs text-muted-foreground">Verificadas</div>
          </div>
          <div>
            <div className="stat-number text-gold">98%</div>
            <div className="text-xs text-muted-foreground">Transparencia</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
