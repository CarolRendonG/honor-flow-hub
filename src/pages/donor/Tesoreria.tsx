import { motion } from 'framer-motion';
import { mockPartners } from '@/data/mockData';
import { Gift, QrCode, Timer, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function Tesoreria() {
  const [activeQR, setActiveQR] = useState<string | null>(null);
  const [qrTimer, setQrTimer] = useState(120);

  const redeemCoupon = (couponId: string) => {
    setActiveQR(couponId);
    setQrTimer(120);
    const t = setInterval(() => {
      setQrTimer(prev => {
        if (prev <= 1) { clearInterval(t); setActiveQR(null); return 120; }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">La Tesorería</h1>
        <p className="text-muted-foreground">Alianzas comerciales y recompensas exclusivas</p>
      </motion.div>

      {/* Partners */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-gold" /> Socios Oficiales</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {mockPartners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5 border-gold/20 hover:border-gold/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-3xl">
                  {partner.logo}
                </div>
                <h3 className="font-bold text-lg">{partner.name}</h3>
              </div>
              <div className="space-y-3">
                {partner.coupons.map(coupon => (
                  <div key={coupon.id} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{coupon.title}</div>
                        <div className="text-xs text-muted-foreground">{coupon.description}</div>
                      </div>
                      <span className="text-xs font-medium text-gold whitespace-nowrap">{coupon.pointsCost} pts</span>
                    </div>
                    {activeQR === coupon.id ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-2">
                        <div className="w-32 h-32 mx-auto rounded-xl bg-foreground/90 flex items-center justify-center">
                          <QrCode className="w-20 h-20 text-background" />
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm text-destructive">
                          <Timer className="w-3 h-3" />
                          {Math.floor(qrTimer / 60)}:{String(qrTimer % 60).padStart(2, '0')}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => redeemCoupon(coupon.id)}
                        className="w-full py-2 rounded-lg bg-gold/15 text-gold text-sm font-medium border border-gold/20 hover:bg-gold/25 transition-all flex items-center justify-center gap-2"
                      >
                        <Gift className="w-4 h-4" /> Canjear Puntos de Honor
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
