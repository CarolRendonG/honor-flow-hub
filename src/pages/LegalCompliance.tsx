import { motion } from 'framer-motion';
import { Shield, Scale, Lock, Eye, FileText, Clock, Building2, ChevronRight } from 'lucide-react';
import { UMA_VALUE_MXN } from '@/data/complianceData';

const sections = [
  {
    icon: Scale,
    title: 'Cumplimiento con LFPIORPI',
    content: `Cashed cumple con la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita (LFPIORPI). Todas las donaciones son monitoreadas conforme a los umbrales establecidos en Unidades de Medida y Actualización (UMA). Las operaciones que igualen o superen 1,605 UMA ($${(1605 * UMA_VALUE_MXN).toLocaleString()} MXN) requieren identificación obligatoria del donante. Las que superen 3,210 UMA ($${(3210 * UMA_VALUE_MXN).toLocaleString()} MXN) son reportadas al SAT a través del Sistema de Prevención de Lavado de Dinero (SPPLD).`,
  },
  {
    icon: Clock,
    title: 'Conservación de Datos por 10 Años',
    content: 'Conforme al Artículo 18 de la LFPIORPI, toda la información y documentación recopilada de donantes, incluyendo expedientes de identificación, comprobantes de donación, recibos CFDI y documentos KYC, se conserva por un período mínimo de 10 años contados a partir de la fecha de la operación. Los datos se almacenan con encriptación de grado bancario y acceso controlado mediante autenticación multifactor.',
  },
  {
    icon: Building2,
    title: 'Requerimiento por Autoridad Fiscal',
    content: 'La información almacenada en la plataforma puede ser requerida por la autoridad fiscal competente (SAT, UIF) en el ejercicio de sus facultades de verificación y fiscalización. Cashed mantiene los mecanismos técnicos necesarios para atender dichos requerimientos de manera oportuna y completa, conforme a los plazos establecidos por la legislación vigente.',
  },
  {
    icon: Lock,
    title: 'Política de Privacidad',
    content: 'Los datos personales de donantes y receptores son tratados conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP). La información se recopila con el consentimiento informado del titular y se utiliza exclusivamente para los fines de la plataforma: gestión de donaciones, cumplimiento normativo y generación de recibos fiscales. Los titulares pueden ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) contactando a nuestro oficial de privacidad.',
  },
  {
    icon: Eye,
    title: 'Transparencia y Auditoría',
    content: 'Cada acción en la plataforma queda registrada en una bitácora de auditoría inmutable. Esto incluye accesos a expedientes, modificaciones de datos, generación de reportes y aprobaciones. Los registros incluyen identificación del usuario, fecha, hora y dirección IP. Esta información está disponible para revisión interna y externa conforme a los lineamientos de la CNBV.',
  },
  {
    icon: FileText,
    title: 'Obligaciones de Reporte',
    content: 'Las operaciones que superen el umbral de 3,210 UMA se reportan al SAT a través del portal del SPPLD a más tardar el día 17 del mes siguiente al de la operación. Adicionalmente, Cashed genera alertas automáticas cuando un donante se acerca al umbral de identificación obligatoria, asegurando el cumplimiento preventivo de las obligaciones legales.',
  },
];

export default function LegalCompliance() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> Marco Legal y Cumplimiento
        </h1>
        <p className="text-muted-foreground">Información sobre nuestras prácticas de cumplimiento normativo</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6 border-primary/20">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-primary mt-1" />
          <div>
            <h2 className="font-semibold text-lg">Compromiso con el Cumplimiento</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Cashed opera como plataforma de intermediación de donaciones con estricto apego a la normatividad mexicana
              en materia de prevención de lavado de dinero, protección de datos personales y transparencia fiscal.
              Valor vigente de la UMA: <strong className="text-primary">${UMA_VALUE_MXN} MXN (2025)</strong>.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
            className="glass rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass rounded-xl p-4 text-center text-xs text-muted-foreground">
        Última actualización: Febrero 2025 · Versión UMA vigente · Cumplimiento LFPIORPI, LFPDPPP, CNBV
      </motion.div>
    </div>
  );
}
