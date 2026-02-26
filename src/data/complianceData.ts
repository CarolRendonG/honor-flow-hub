// UMA 2025 value
export const UMA_VALUE_MXN = 113.14;

// Thresholds in UMAs
export const UMA_THRESHOLDS = {
  LOW: 1605,      // < 1,605 UMA: basic record
  MEDIUM: 3209,   // 1,605 - 3,209 UMA: full KYC
  HIGH: 3210,     // >= 3,210 UMA: KYC + SAT notice
} as const;

export const UMA_THRESHOLD_MXN = {
  LOW: UMA_THRESHOLDS.LOW * UMA_VALUE_MXN,       // ~$181,489.70
  MEDIUM: UMA_THRESHOLDS.MEDIUM * UMA_VALUE_MXN,  // ~$362,866.26
  HIGH: UMA_THRESHOLDS.HIGH * UMA_VALUE_MXN,      // ~$362,979.40
} as const;

export type PaymentMethod = 'transfer' | 'cash' | 'card';
export type ComplianceTier = 'basic' | 'kyc_required' | 'sat_notice';
export type KycStatus = 'not_required' | 'pending' | 'submitted' | 'verified' | 'rejected';

export interface DonorFile {
  id: string;
  donorId: string;
  donorName: string;
  email: string;
  totalDonated6Months: number;
  totalDonatedUMA: number;
  tier: ComplianceTier;
  kycStatus: KycStatus;
  documents: DonorDocument[];
  satNoticeRequired: boolean;
  satNoticeGenerated: boolean;
  createdAt: string;
  retentionUntil: string; // 10 years
}

export interface DonorDocument {
  id: string;
  type: 'ine' | 'passport' | 'curp' | 'rfc' | 'proof_of_address' | 'receipt';
  name: string;
  uploadedAt: string;
  verified: boolean;
}

export interface ComplianceDonation {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  amountUMA: number;
  paymentMethod: PaymentMethod;
  date: string;
  projectId: string;
  projectName: string;
  requiresKyc: boolean;
  requiresSatNotice: boolean;
  receiptId?: string;
}

export interface SatNotice {
  id: string;
  donorId: string;
  donorName: string;
  totalAmount: number;
  totalUMA: number;
  period: string;
  deadline: string;
  status: 'pending' | 'generated' | 'submitted';
  donations: string[]; // donation IDs
}

export function convertToUMA(amountMXN: number): number {
  return amountMXN / UMA_VALUE_MXN;
}

export function classifyDonor(totalUMA: number): ComplianceTier {
  if (totalUMA >= UMA_THRESHOLDS.HIGH) return 'sat_notice';
  if (totalUMA >= UMA_THRESHOLDS.LOW) return 'kyc_required';
  return 'basic';
}

export function getTierLabel(tier: ComplianceTier): string {
  switch (tier) {
    case 'basic': return 'Expediente Básico';
    case 'kyc_required': return 'KYC Obligatorio';
    case 'sat_notice': return 'Aviso SAT Requerido';
  }
}

export function getTierColor(tier: ComplianceTier): string {
  switch (tier) {
    case 'basic': return 'text-success';
    case 'kyc_required': return 'text-warning';
    case 'sat_notice': return 'text-destructive';
  }
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'transfer': return 'Transferencia Bancaria';
    case 'cash': return 'Depósito en Efectivo';
    case 'card': return 'Pago con Tarjeta';
  }
}

// Mock compliance data
export const mockDonorFiles: DonorFile[] = [
  {
    id: 'df1', donorId: 'u1', donorName: 'Carlos Mendoza', email: 'carlos@demo.com',
    totalDonated6Months: 48500, totalDonatedUMA: convertToUMA(48500),
    tier: 'basic', kycStatus: 'not_required',
    documents: [],
    satNoticeRequired: false, satNoticeGenerated: false,
    createdAt: '2024-06-15', retentionUntil: '2034-06-15',
  },
  {
    id: 'df2', donorId: 'u4', donorName: 'María Elena Ríos', email: 'maria@demo.com',
    totalDonated6Months: 195000, totalDonatedUMA: convertToUMA(195000),
    tier: 'kyc_required', kycStatus: 'verified',
    documents: [
      { id: 'doc1', type: 'ine', name: 'INE_MariaRios.pdf', uploadedAt: '2025-01-10', verified: true },
      { id: 'doc2', type: 'rfc', name: 'RFC_MariaRios.pdf', uploadedAt: '2025-01-10', verified: true },
      { id: 'doc3', type: 'proof_of_address', name: 'Comprobante_Domicilio.pdf', uploadedAt: '2025-01-10', verified: true },
    ],
    satNoticeRequired: false, satNoticeGenerated: false,
    createdAt: '2024-08-20', retentionUntil: '2034-08-20',
  },
  {
    id: 'df3', donorId: 'u5', donorName: 'Grupo Industrial del Norte SA', email: 'donaciones@ginsa.com',
    totalDonated6Months: 520000, totalDonatedUMA: convertToUMA(520000),
    tier: 'sat_notice', kycStatus: 'verified',
    documents: [
      { id: 'doc4', type: 'rfc', name: 'RFC_GINSA.pdf', uploadedAt: '2024-12-01', verified: true },
      { id: 'doc5', type: 'ine', name: 'INE_RepLegal.pdf', uploadedAt: '2024-12-01', verified: true },
      { id: 'doc6', type: 'proof_of_address', name: 'Comprobante_Domicilio_GINSA.pdf', uploadedAt: '2024-12-01', verified: true },
    ],
    satNoticeRequired: true, satNoticeGenerated: true,
    createdAt: '2024-05-10', retentionUntil: '2034-05-10',
  },
  {
    id: 'df4', donorId: 'u6', donorName: 'Donante Anónimo #847', email: 'anonimo@proxy.com',
    totalDonated6Months: 180000, totalDonatedUMA: convertToUMA(180000),
    tier: 'kyc_required', kycStatus: 'pending',
    documents: [],
    satNoticeRequired: false, satNoticeGenerated: false,
    createdAt: '2025-02-01', retentionUntil: '2035-02-01',
  },
];

export const mockComplianceDonations: ComplianceDonation[] = [
  { id: 'cd1', donorId: 'u1', donorName: 'Carlos Mendoza', amount: 5000, amountUMA: convertToUMA(5000), paymentMethod: 'card', date: '2025-02-20', projectId: 'p1', projectName: 'Escuela Rural en Tabasco', requiresKyc: false, requiresSatNotice: false, receiptId: 'CFDI-001' },
  { id: 'cd2', donorId: 'u4', donorName: 'María Elena Ríos', amount: 85000, amountUMA: convertToUMA(85000), paymentMethod: 'transfer', date: '2025-02-18', projectId: 'p3', projectName: 'Agua Limpia Oaxaca', requiresKyc: true, requiresSatNotice: false, receiptId: 'CFDI-002' },
  { id: 'cd3', donorId: 'u5', donorName: 'Grupo Industrial del Norte SA', amount: 180000, amountUMA: convertToUMA(180000), paymentMethod: 'transfer', date: '2025-02-15', projectId: 'p1', projectName: 'Escuela Rural en Tabasco', requiresKyc: true, requiresSatNotice: true, receiptId: 'CFDI-003' },
  { id: 'cd4', donorId: 'u6', donorName: 'Donante Anónimo #847', amount: 180000, amountUMA: convertToUMA(180000), paymentMethod: 'cash', date: '2025-02-10', projectId: 'p6', projectName: 'Comedor Comunitario Guerrero', requiresKyc: true, requiresSatNotice: false },
  { id: 'cd5', donorId: 'u1', donorName: 'Carlos Mendoza', amount: 10000, amountUMA: convertToUMA(10000), paymentMethod: 'card', date: '2025-02-15', projectId: 'p3', projectName: 'Agua Limpia Oaxaca', requiresKyc: false, requiresSatNotice: false, receiptId: 'CFDI-004' },
  { id: 'cd6', donorId: 'u5', donorName: 'Grupo Industrial del Norte SA', amount: 340000, amountUMA: convertToUMA(340000), paymentMethod: 'transfer', date: '2025-01-20', projectId: 'p5', projectName: 'Reforestación Sierra Madre', requiresKyc: true, requiresSatNotice: true, receiptId: 'CFDI-005' },
];

export const mockSatNotices: SatNotice[] = [
  {
    id: 'sn1', donorId: 'u5', donorName: 'Grupo Industrial del Norte SA',
    totalAmount: 520000, totalUMA: convertToUMA(520000),
    period: 'Febrero 2025', deadline: '2025-03-17',
    status: 'pending', donations: ['cd3', 'cd6'],
  },
  {
    id: 'sn2', donorId: 'u5', donorName: 'Grupo Industrial del Norte SA',
    totalAmount: 420000, totalUMA: convertToUMA(420000),
    period: 'Enero 2025', deadline: '2025-02-17',
    status: 'submitted', donations: ['cd6'],
  },
];

export const complianceStats = {
  totalDonationsMonth: 800000,
  identifiedDonors: 3,
  donorsAboveThreshold: 2,
  pendingSatNotices: 1,
  totalDonorFiles: 4,
  kycPending: 1,
  kycVerified: 2,
};
