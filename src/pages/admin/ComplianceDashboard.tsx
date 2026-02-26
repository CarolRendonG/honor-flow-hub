import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Shield, Users, AlertTriangle, FileText, DollarSign, Download,
  CheckCircle2, Clock, XCircle, Eye, ChevronRight, Search,
  Scale, Building2, CreditCard, Banknote, ArrowUpRight
} from 'lucide-react';
import {
  mockDonorFiles, mockComplianceDonations, mockSatNotices, complianceStats,
  UMA_VALUE_MXN, convertToUMA, classifyDonor, getTierLabel, getTierColor,
  getPaymentMethodLabel, type ComplianceTier, type DonorFile
} from '@/data/complianceData';

const tierBadge = (tier: ComplianceTier) => {
  const colors = {
    basic: 'bg-success/15 text-success',
    kyc_required: 'bg-warning/15 text-warning',
    sat_notice: 'bg-destructive/15 text-destructive',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[tier]}`}>{getTierLabel(tier)}</span>;
};

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'files' | 'sat'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'overview' as const, label: 'Resumen', icon: Shield },
    { id: 'donations' as const, label: 'Donaciones', icon: DollarSign },
    { id: 'files' as const, label: 'Expedientes', icon: FileText },
    { id: 'sat' as const, label: 'Avisos SAT', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" /> Cumplimiento Legal (LFPIORPI)
        </h1>
        <p className="text-muted-foreground">Sistema de Prevención de Lavado de Dinero · UMA vigente: ${UMA_VALUE_MXN} MXN</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-secondary/50">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === t.id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'donations' && <DonationsTab search={searchQuery} setSearch={setSearchQuery} />}
      {activeTab === 'files' && <FilesTab search={searchQuery} setSearch={setSearchQuery} />}
      {activeTab === 'sat' && <SatTab />}
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { label: 'Donaciones del Mes', value: `$${(complianceStats.totalDonationsMonth / 1e3).toFixed(0)}K`, icon: DollarSign, color: 'text-primary' },
    { label: 'Donantes Identificados', value: complianceStats.identifiedDonors.toString(), icon: Users, color: 'text-info' },
    { label: 'Sobre Umbral UMA', value: complianceStats.donorsAboveThreshold.toString(), icon: AlertTriangle, color: 'text-warning' },
    { label: 'Avisos SAT Pendientes', value: complianceStats.pendingSatNotices.toString(), icon: Scale, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* UMA Thresholds Reference */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Scale className="w-4 h-4 text-primary" /> Umbrales UMA Vigentes</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { range: '< 1,605 UMA', mxn: `< $${(1605 * UMA_VALUE_MXN / 1e3).toFixed(0)}K`, action: 'Expediente básico', color: 'border-success/30 bg-success/5' },
            { range: '1,605 – 3,209 UMA', mxn: `$${(1605 * UMA_VALUE_MXN / 1e3).toFixed(0)}K – $${(3209 * UMA_VALUE_MXN / 1e3).toFixed(0)}K`, action: 'KYC obligatorio (INE, CURP/RFC, domicilio)', color: 'border-warning/30 bg-warning/5' },
            { range: '≥ 3,210 UMA', mxn: `≥ $${(3210 * UMA_VALUE_MXN / 1e3).toFixed(0)}K`, action: 'KYC + Aviso al SAT (SPPLD)', color: 'border-destructive/30 bg-destructive/5' },
          ].map(t => (
            <div key={t.range} className={`p-4 rounded-lg border ${t.color}`}>
              <div className="font-medium text-sm">{t.range}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.mxn} MXN</div>
              <div className="text-xs text-muted-foreground mt-2">{t.action}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KYC Status Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Estado de Expedientes</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-success/10 text-center">
            <div className="text-2xl font-bold text-success">{complianceStats.kycVerified}</div>
            <div className="text-xs text-muted-foreground">Verificados</div>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 text-center">
            <div className="text-2xl font-bold text-warning">{complianceStats.kycPending}</div>
            <div className="text-xs text-muted-foreground">Pendientes</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary text-center">
            <div className="text-2xl font-bold">{complianceStats.totalDonorFiles}</div>
            <div className="text-xs text-muted-foreground">Total Expedientes</div>
          </div>
        </div>
      </motion.div>

      {/* Retention Notice */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-4 border-info/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-info mt-0.5" />
          <div>
            <div className="font-medium text-sm">Conservación de Información</div>
            <div className="text-xs text-muted-foreground mt-1">
              Todos los expedientes, donaciones y documentos se conservan por un mínimo de <strong className="text-foreground">10 años</strong> conforme a la LFPIORPI.
              Los registros están protegidos con encriptación y cada acceso queda registrado en la bitácora de auditoría.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DonationsTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const filtered = mockComplianceDonations.filter(d =>
    d.donorName.toLowerCase().includes(search.toLowerCase()) ||
    d.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar donante o proyecto..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Exportar
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 text-muted-foreground font-medium">Fecha</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Donante</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Monto MXN</th>
                <th className="text-right p-3 text-muted-foreground font-medium">UMAs</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Método</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Proyecto</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 text-muted-foreground">{d.date}</td>
                  <td className="p-3 font-medium">{d.donorName}</td>
                  <td className="p-3 text-right font-medium">${d.amount.toLocaleString()}</td>
                  <td className="p-3 text-right text-muted-foreground">{d.amountUMA.toFixed(1)}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      {d.paymentMethod === 'transfer' ? <Building2 className="w-3 h-3" /> :
                       d.paymentMethod === 'cash' ? <Banknote className="w-3 h-3" /> :
                       <CreditCard className="w-3 h-3" />}
                      {getPaymentMethodLabel(d.paymentMethod)}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{d.projectName}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {d.requiresSatNotice && <span className="px-1.5 py-0.5 rounded text-xs bg-destructive/15 text-destructive">SAT</span>}
                      {d.requiresKyc && <span className="px-1.5 py-0.5 rounded text-xs bg-warning/15 text-warning">KYC</span>}
                      {d.receiptId && <span className="px-1.5 py-0.5 rounded text-xs bg-success/15 text-success">{d.receiptId}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilesTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const [selectedFile, setSelectedFile] = useState<DonorFile | null>(null);
  const filtered = mockDonorFiles.filter(f =>
    f.donorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar donante..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* File List */}
        <div className="space-y-3">
          {filtered.map(f => (
            <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setSelectedFile(f)}
              className={`glass rounded-xl p-4 cursor-pointer transition-all hover:border-primary/30 ${selectedFile?.id === f.id ? 'border-primary/50 bg-primary/5' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{f.donorName}</div>
                {tierBadge(f.tier)}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Acumulado 6m: ${f.totalDonated6Months.toLocaleString()} ({f.totalDonatedUMA.toFixed(1)} UMA)</span>
                <span className="flex items-center gap-1">
                  {f.kycStatus === 'verified' ? <CheckCircle2 className="w-3 h-3 text-success" /> :
                   f.kycStatus === 'pending' ? <Clock className="w-3 h-3 text-warning" /> :
                   f.kycStatus === 'rejected' ? <XCircle className="w-3 h-3 text-destructive" /> : null}
                  {f.kycStatus === 'not_required' ? 'Sin KYC' : f.kycStatus.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Retención hasta: {f.retentionUntil}</div>
            </motion.div>
          ))}
        </div>

        {/* File Detail */}
        {selectedFile ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{selectedFile.donorName}</h3>
              <button className="px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-all flex items-center gap-1">
                <Download className="w-3 h-3" /> PDF
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 rounded bg-secondary/50"><span className="text-xs text-muted-foreground block">Email</span>{selectedFile.email}</div>
              <div className="p-2 rounded bg-secondary/50"><span className="text-xs text-muted-foreground block">Clasificación</span>{getTierLabel(selectedFile.tier)}</div>
              <div className="p-2 rounded bg-secondary/50"><span className="text-xs text-muted-foreground block">Total 6 meses</span>${selectedFile.totalDonated6Months.toLocaleString()}</div>
              <div className="p-2 rounded bg-secondary/50"><span className="text-xs text-muted-foreground block">En UMAs</span>{selectedFile.totalDonatedUMA.toFixed(2)}</div>
            </div>

            {selectedFile.documents.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2">Documentos</h4>
                <div className="space-y-2">
                  {selectedFile.documents.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-2 rounded bg-secondary/50 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{d.uploadedAt}</span>
                        {d.verified ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Clock className="w-4 h-4 text-warning" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 text-sm text-warning text-center">
                Sin documentos cargados
              </div>
            )}

            {selectedFile.satNoticeRequired && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                <div className="flex items-center gap-2 text-destructive font-medium">
                  <AlertTriangle className="w-4 h-4" /> Sujeto a Aviso SAT
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Este donante supera el umbral de 3,210 UMA. Se requiere reporte mensual al SPPLD.
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="glass rounded-xl p-6 flex items-center justify-center text-muted-foreground text-sm">
            Selecciona un expediente para ver detalles
          </div>
        )}
      </div>
    </div>
  );
}

function SatTab() {
  const now = new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-destructive" /> Avisos al SAT (SPPLD)</h3>
        <button className="px-4 py-2 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Exportar Reporte Mensual
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4 border-warning/20">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <div className="font-medium text-sm">Fecha Límite de Reporte</div>
            <div className="text-xs text-muted-foreground mt-1">
              Los avisos deben presentarse a más tardar el <strong className="text-foreground">día 17 del mes siguiente</strong> al que se realizó la operación.
              Próxima fecha límite: <strong className="text-warning">17 de Marzo 2025</strong>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {mockSatNotices.map(notice => {
          const deadline = new Date(notice.deadline);
          const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isUrgent = daysLeft <= 5 && notice.status === 'pending';

          return (
            <motion.div key={notice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-xl p-5 ${isUrgent ? 'border-destructive/30' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium">{notice.donorName}</div>
                  <div className="text-xs text-muted-foreground">Período: {notice.period}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  notice.status === 'submitted' ? 'bg-success/15 text-success' :
                  notice.status === 'generated' ? 'bg-info/15 text-info' :
                  'bg-warning/15 text-warning'
                }`}>
                  {notice.status === 'submitted' ? 'Presentado' : notice.status === 'generated' ? 'Generado' : 'Pendiente'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                <div className="p-2 rounded bg-secondary/50">
                  <span className="text-xs text-muted-foreground block">Monto Total</span>
                  <span className="font-medium">${notice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded bg-secondary/50">
                  <span className="text-xs text-muted-foreground block">En UMAs</span>
                  <span className="font-medium">{notice.totalUMA.toFixed(1)}</span>
                </div>
                <div className="p-2 rounded bg-secondary/50">
                  <span className="text-xs text-muted-foreground block">Fecha Límite</span>
                  <span className={`font-medium ${isUrgent ? 'text-destructive' : ''}`}>{notice.deadline}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">{notice.donations.length} operación(es) incluidas</div>

              {notice.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 transition-all">
                    Generar Aviso
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-info/15 text-info text-sm font-medium hover:bg-info/25 transition-all">
                    Marcar Presentado
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
