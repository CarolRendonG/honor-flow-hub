import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { mockProjects } from '@/data/mockData';
import { useState, useCallback, useEffect } from 'react';
import { Heart, X, Zap, MapPin, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDonations } from '@/contexts/DonationContext';

export default function Expedientes() {
  const { donatedProjectIds } = useDonations();
  const [cards, setCards] = useState(() => [...mockProjects].filter(p => !donatedProjectIds.has(p.id)).reverse());
  const [lastAction, setLastAction] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter out newly donated projects when returning to this page
  useEffect(() => {
    setCards(prev => prev.filter(p => !donatedProjectIds.has(p.id)));
  }, [donatedProjectIds]);

  const removeTop = useCallback((action: 'match' | 'skip' | 'super') => {
    if (action === 'super') {
      const topCard = cards[cards.length - 1];
      if (topCard) navigate(`/project/${topCard.id}`);
      return;
    }
    setLastAction(action === 'match' ? '💚 Match!' : '⏭️ Siguiente');
    setTimeout(() => {
      setCards(prev => prev.slice(0, -1));
      setLastAction(null);
    }, 400);
  }, [cards, navigate]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Match</h1>
        <p className="text-muted-foreground">Encuentra tu match social perfecto</p>
      </motion.div>

      <div className="relative h-[500px] flex items-center justify-center">
        <AnimatePresence>
          {cards.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold">¡Has visto todos los proyectos!</h3>
              <p className="text-muted-foreground text-sm mt-2">Vuelve pronto para nuevas causas</p>
              <button onClick={() => setCards([...mockProjects].reverse())} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
                Reiniciar
              </button>
            </motion.div>
          ) : (
            cards.map((project, i) => {
              const isTop = i === cards.length - 1;
              return (
                <SwipeCard
                  key={project.id}
                  project={project}
                  isTop={isTop}
                  index={cards.length - 1 - i}
                  onSwipe={removeTop}
                />
              );
            })
          )}
        </AnimatePresence>

        {lastAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-3xl font-bold text-primary pointer-events-none"
          >
            {lastAction}
          </motion.div>
        )}
      </div>

      {/* Action buttons */}
      {cards.length > 0 && (
        <div className="flex items-center justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeTop('skip')}
            className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-destructive/50 transition-colors"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeTop('super')}
            className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center glow-gold"
          >
            <Zap className="w-7 h-7 text-gold" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => removeTop('match')}
            className="w-14 h-14 rounded-full bg-primary/20 border border-primary flex items-center justify-center glow-green-sm"
          >
            <Heart className="w-6 h-6 text-primary" />
          </motion.button>
        </div>
      )}
    </div>
  );
}

function SwipeCard({ project, isTop, index, onSwipe }: {
  project: typeof mockProjects[0]; isTop: boolean; index: number;
  onSwipe: (a: 'match' | 'skip' | 'super') => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const pct = Math.round((project.raised / project.goal) * 100);

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: 10 - index,
        scale: 1 - index * 0.04,
        y: index * 8,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('match');
        else if (info.offset.x < -100) onSwipe('skip');
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1 - index * 0.04, opacity: 1 }}
      exit={{ x: 300, opacity: 0, rotate: 20 }}
      className="absolute w-full max-w-sm glass rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <div className="h-52 bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-8xl relative">
        {project.image}
        {/* Urgency bar */}
        <div className="absolute right-3 top-3 bottom-3 w-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={`w-full rounded-full transition-all ${
              project.urgency === 'critical' ? 'bg-destructive urgency-glow' :
              project.urgency === 'high' ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ height: project.urgency === 'critical' ? '100%' : project.urgency === 'high' ? '70%' : '40%' }}
          />
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{project.title}</h3>
          {project.verified && <BadgeCheck className="w-5 h-5 text-primary" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded-full bg-secondary">{project.category}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>
        </div>
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${project.raised.toLocaleString()}</span>
            <span>{pct}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
