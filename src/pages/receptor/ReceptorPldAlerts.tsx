import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  AlertTriangle, Shield, Users, DollarSign, Search,
  CheckCircle2, Clock, XCircle, FileText, Scale, Building2, CreditCard, Banknote
} from 'lucide-react';
import {
  mockDonorFiles, mockComplianceDonations, UMA_VALUE_MXN, convertToUMA,
  getTierLabel, getPaymentMethodLabel, type ComplianceTier
} from '@/data/complianceData';

// Simulate: receptor's project receives donations from these donors
const RECEPTOR_PROJECT_IDS = ['p1', 'p3'];

const receptorDonations = mockComplianceDonations.filter(d =>
  RECEPTOR_PROJECT_IDS.includes(d.projectId)
);

const receptorDonorIds = [...new Set(receptorDonations.map(d => d.donorId))];

const receptorDonorFiles = mockDonorFiles.filter(f =>
  receptorDonorIds.includes(f.donorId)
);

const alertDonors = receptorDonorFiles.filter(f =>
  f.tier === 'kyc_required' || f.tier === 'sat_notice'
);

const tierBadge = (tier: ComplianceTier) => {
  const colors = {
    basic: 'bg-success/15 text-success',
    kyc_required: 'bg-warning/15 text-warning',
    sat_notice: 'bg-destructive/15 text-destructive',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[tier]}`}>{getTierLabel(tier)}</span>;
};

export default function ReceptorPldAlerts() {
  const [search, setSearch] = useState('');

  const filtered = alertDonors.filter(f =>
    f.donorName.toLowerCase().includes(search.toLowerCase())
  );

  const totalAlerts = alertDonors.length;
  const kycPending = alertDonors.filter(f => f.kycStatus === 'pending').length;
  const satRequired = alertDonors.filter(f => f.satNoticeRequired).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-warning" /> Alertas PLD — Mis Donantes
        </h1>
        <p className="text-muted-foreground">
          Donantes de tus proyectos que requieren atención por umbrales UMA · Valor UMA: ${UMA_VALUE_MXN} MXN
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Donantes con Alerta', value: totalAlerts, icon: Users, color: 'text-warning' },
          { label: 'KYC Pendiente', value: kycPending, icon: Clock, color: 'text-destructive' },
          { label: 'Aviso SAT Requerido', value: satRequired, icon: Scale, color: 'text-destructive' },
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

      {/* Info banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-xl p-4 border-warning/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <div className="font-medium text-sm">¿Por qué ves estas alertas?</div>
            <div className="text-xs text-muted-foreground mt-1">
              Como receptor, la LFPIORPI te obliga a conocer la situación de cumplimiento de tus donantes.
              Estos avisos te ayudan a verificar que los donantes de alto monto tengan su expediente en orden.
              <strong className="text-foreground"> No puedes dispersar fondos</strong> de donantes con KYC pendiente.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar donante..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {/* Alerts list */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-muted-foreground">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
          <p className="font-medium">Sin alertas PLD activas</p>
          <p className="text-xs mt-1">Todos tus donantes están dentro de los umbrales normales.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((donor, i) => {
            const donorDonations = receptorDonations.filter(d => d.donorId === donor.donorId);
            return (
              <motion.div key={donor.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`glass rounded-xl p-5 ${donor.tier === 'sat_notice' ? 'border-destructive/30' : 'border-warning/30'}`}>

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {donor.donorName}
                      {tierBadge(donor.tier)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{donor.email}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {donor.kycStatus === 'verified' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-success/15 text-success">
                        <CheckCircle2 className="w-3 h-3" /> KYC Verificado
                      </span>
                    ) : donor.kycStatus === 'pending' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-destructive/15 text-destructive">
                        <Clock className="w-3 h-3" /> KYC Pendiente
                      </span>
                    ) : donor.kycStatus === 'rejected' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-destructive/15 text-destructive">
                        <XCircle className="w-3 h-3" /> KYC Rechazado
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="p-2 rounded bg-secondary/50 text-sm">
                    <span className="text-xs text-muted-foreground block">Acumulado 6m</span>
                    <span className="font-medium">${donor.totalDonated6Months.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-secondary/50 text-sm">
                    <span className="text-xs text-muted-foreground block">En UMAs</span>
                    <span className="font-medium">{donor.totalDonatedUMA.toFixed(1)}</span>
                  </div>
                  <div className="p-2 rounded bg-secondary/50 text-sm">
                    <span className="text-xs text-muted-foreground block">Donaciones</span>
                    <span className="font-medium">{donorDonations.length}</span>
                  </div>
                </div>

                {/* Recent donations to your projects */}
                <div className="text-xs text-muted-foreground mb-2 font-medium">Donaciones a tus proyectos:</div>
                <div className="space-y-1.5">
                  {donorDonations.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-2 rounded bg-secondary/30 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{d.date}</span>
                        <span className="font-medium">${d.amount.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-muted-foreground text-xs">
                          {d.paymentMethod === 'transfer' ? <Building2 className="w-3 h-3" /> :
                           d.paymentMethod === 'cash' ? <Banknote className="w-3 h-3" /> :
                           <CreditCard className="w-3 h-3" />}
                          {getPaymentMethodLabel(d.paymentMethod)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{d.projectName}</span>
                    </div>
                  ))}
                </div>

                {/* Warnings */}
                {donor.kycStatus === 'pending' && (
                  <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-destructive">Acción requerida:</span>
                      <span className="text-muted-foreground"> Los fondos de este donante no pueden dispersarse hasta que complete su KYC.</span>
                    </div>
                  </div>
                )}
                {donor.satNoticeRequired && (
                  <div className="mt-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm flex items-start gap-2">
                    <Scale className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-warning">Aviso SAT pendiente:</span>
                      <span className="text-muted-foreground"> Este donante supera 3,210 UMA. Cashed gestiona el aviso al SPPLD.</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
