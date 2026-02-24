import { motion } from 'framer-motion';
import { mockEvents } from '@/data/mockData';
import { Timer, Gavel, Gamepad2, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';

function Countdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Finalizado'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return <span>{timeLeft}</span>;
}

export default function Events() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">La Arena de la Orden</h1>
        <p className="text-muted-foreground">Eventos, subastas y experiencias exclusivas</p>
      </motion.div>

      {/* Auctions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Gavel className="w-5 h-5 text-gold" /> Subastas de Honor</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {mockEvents.filter(e => e.type === 'auction').map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl overflow-hidden hover:border-gold/40 transition-all group"
            >
              <div className="h-40 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center text-7xl">
                {ev.image}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold">{ev.title}</h3>
                <p className="text-xs text-muted-foreground">{ev.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Puja actual</div>
                    <div className="font-bold text-lg text-gold">${ev.currentBid.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Timer className="w-3 h-3" /> Tiempo restante</div>
                    <div className="text-sm font-mono font-medium text-destructive"><Countdown endsAt={ev.endsAt} /></div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-lg bg-gold/20 text-gold font-semibold text-sm border border-gold/30 hover:bg-gold/30 transition-all"
                >
                  Pujar con Honor Points
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tournaments */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Gamepad2 className="w-5 h-5 text-info" /> Torneos Relámpago</h2>
        {mockEvents.filter(e => e.type === 'tournament').map(ev => (
          <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-info/15 flex items-center justify-center text-3xl">{ev.image}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{ev.title}</h3>
                <p className="text-xs text-muted-foreground">{ev.description}</p>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Timer className="w-3 h-3" /><Countdown endsAt={ev.endsAt} /></div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-lg bg-info/20 text-info font-medium text-sm border border-info/30">
                Registrar Equipo
              </motion.button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* The Order Lounge */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Crown className="w-5 h-5 text-gold" /> The Order Lounge</h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-xl overflow-hidden border-2 border-gold/30 bg-gradient-to-br from-card via-card to-gold/5 p-6 glow-gold">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(43,96%,56%,0.05),transparent_60%)]" />
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-gold" />
              <h3 className="font-bold text-lg text-gradient-gold">Acceso VIP Exclusivo</h3>
            </div>
            <p className="text-sm text-muted-foreground">Área privada para donantes recurrentes. Networking con líderes sociales, invitaciones a eventos exclusivos y mentoría personalizada.</p>
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/20">Donante Recurrente</span>
              <span className="px-3 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/20">+1,000 Honor Points</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2 px-6 py-2.5 rounded-lg bg-gold text-gold-foreground font-semibold text-sm glow-gold">
              Solicitar Acceso
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
