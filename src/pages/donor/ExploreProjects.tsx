import { motion } from 'framer-motion';
import { mockProjects, categories } from '@/data/mockData';
import { useState } from 'react';
import { Search, Filter, BadgeCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExploreProjects() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = mockProjects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todas' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Explorar Proyectos</h1>
        <p className="text-muted-foreground">Descubre causas que transforman México</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar proyectos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                category === c
                  ? 'bg-primary text-primary-foreground glow-green-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const pct = Math.round((p.raised / p.goal) * 100);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/project/${p.id}`} className="block glass rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
                {/* Image placeholder */}
                <div className="h-36 bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-5xl">
                  {p.image}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-tight">{p.title}</h3>
                    {p.verified && (
                      <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {p.location}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">${p.raised.toLocaleString()} recaudado</span>
                      <span className="font-medium text-primary">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.06 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{p.donors} donantes</span>
                    <span className={`font-medium ${p.urgency === 'critical' ? 'text-destructive' : p.urgency === 'high' ? 'text-warning' : 'text-muted-foreground'}`}>
                      {p.urgency === 'critical' ? '🔴 Urgente' : p.urgency === 'high' ? '🟡 Alta' : '🟢 Normal'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
