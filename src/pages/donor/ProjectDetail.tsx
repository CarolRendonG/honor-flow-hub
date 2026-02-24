import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { mockProjects } from '@/data/mockData';
import { BadgeCheck, MapPin, Users, ArrowLeft, Heart, RefreshCw, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id);
  const [showVerified, setShowVerified] = useState(false);
  const [donated, setDonated] = useState(false);
  const [amount, setAmount] = useState(1000);
  const [recurring, setRecurring] = useState(false);

  if (!project) return <div className="text-center py-20 text-muted-foreground">Proyecto no encontrado</div>;

  const pct = Math.round((project.raised / project.goal) * 100);
  const daysToGoal = Math.ceil(((project.goal - project.raised) / (project.raised / 180)));

  const handleDonate = () => {
    setDonated(true);
    setTimeout(() => setDonated(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a explorar
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-7xl">{project.image}</div>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{project.title}</h1>
                {project.verified && (
                  <button onClick={() => setShowVerified(!showVerified)} className="cursor-pointer">
                    <BadgeCheck className="w-6 h-6 text-primary" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.donors} donantes</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary">{project.category}</span>
          </div>

          {showVerified && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm">
              <strong className="text-primary">✅ Verificado por Cashed</strong>
              <p className="text-muted-foreground mt-1">Este proyecto ha pasado revisión documental, verificación de identidad del receptor, validación de cuenta bancaria y auditoría de uso de fondos.</p>
            </motion.div>
          )}

          <p className="text-muted-foreground">{project.description}</p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span><strong className="text-foreground">${project.raised.toLocaleString()}</strong> <span className="text-muted-foreground">de ${project.goal.toLocaleString()}</span></span>
              <span className="font-bold text-primary">{pct}%</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
            <p className="text-xs text-muted-foreground">📈 A este ritmo, este proyecto alcanzará su meta en <strong className="text-foreground">{daysToGoal} días</strong></p>
          </div>
        </div>
      </motion.div>

      {/* Donate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">💚 Hacer una Donación</h3>
        {donated ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-primary">¡Gracias por tu donación!</h3>
            <p className="text-muted-foreground text-sm mt-2">Tu recibo CFDI ha sido generado</p>
            <div className="mt-3 text-sm text-gold">+{Math.round(amount / 10)} Honor Points ganados ⭐</div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 5000, 10000].map(a => (
                <button key={a} onClick={() => setAmount(a)} className={`py-2 rounded-lg text-sm font-medium transition-all ${amount === a ? 'bg-primary text-primary-foreground glow-green-sm' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                  ${a.toLocaleString()}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} className="rounded border-border" />
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
              Donación recurrente mensual
            </label>
            {amount >= 160500 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning">
                ⚠️ Donación ≥ 1,605 UMA: Se requiere verificación KYC antes de confirmar.
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDonate}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-green hover:opacity-90 transition-all"
            >
              Donar ${amount.toLocaleString()} MXN
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Impact Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">🔍 Timeline de Impacto</h3>
        <div className="space-y-0">
          {project.updates.map((u, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  u.type === 'evidence' ? 'bg-primary glow-green-sm' :
                  u.type === 'executed' ? 'bg-accent' :
                  u.type === 'assigned' ? 'bg-info' : 'bg-muted-foreground'
                }`} />
                {i < project.updates.length - 1 && <div className="w-px h-12 bg-border" />}
              </div>
              <div className="pb-6">
                <div className="text-xs text-muted-foreground">{u.date}</div>
                <div className="font-medium text-sm">{u.title}</div>
                <div className="text-xs text-muted-foreground">{u.description}</div>
              </div>
            </div>
          ))}
          {project.updates.length === 0 && <p className="text-sm text-muted-foreground">Aún no hay actualizaciones</p>}
        </div>
      </motion.div>

      {/* Proof of Life */}
      {project.proofOfLife.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">📸 Pruebas de Vida</h3>
          <div className="grid grid-cols-3 gap-3">
            {project.proofOfLife.map((p, i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary flex items-center justify-center text-sm text-muted-foreground p-2 text-center hover:bg-muted transition-colors cursor-pointer">
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
