export type UserRole = 'donor' | 'receptor' | 'admin';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  honorPoints: number;
  totalDonated: number;
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  donors: number;
  verified: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  image: string;
  location: string;
  receptor: string;
  createdAt: string;
  updates: ProjectUpdate[];
  proofOfLife: string[];
}

export interface ProjectUpdate {
  date: string;
  title: string;
  description: string;
  type: 'donation_received' | 'assigned' | 'executed' | 'evidence';
}

export interface Donation {
  id: string;
  donorId: string;
  projectId: string;
  amount: number;
  date: string;
  recurring: boolean;
  receiptGenerated: boolean;
}

export interface AuctionEvent {
  id: string;
  title: string;
  description: string;
  celebrity: string;
  currentBid: number;
  minBid: number;
  endsAt: string;
  image: string;
  type: 'auction' | 'tournament' | 'lounge';
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  coupons: Coupon[];
}

export interface Coupon {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
}

export const mockUsers: MockUser[] = [
  { id: 'u1', name: 'Carlos Mendoza', email: 'carlos@demo.com', role: 'donor', honorPoints: 2450, totalDonated: 48500, joinedAt: '2024-06-15' },
  { id: 'u2', name: 'Fundación Esperanza', email: 'contacto@esperanza.org', role: 'receptor', honorPoints: 0, totalDonated: 0, joinedAt: '2024-03-10' },
  { id: 'u3', name: 'Admin Cashed', email: 'admin@cashed.mx', role: 'admin', honorPoints: 0, totalDonated: 0, joinedAt: '2024-01-01' },
];

export const mockProjects: Project[] = [
  {
    id: 'p1', title: 'Escuela Rural en Tabasco', description: 'Construcción de aulas para 120 niños en comunidad indígena de Tabasco. Infraestructura educativa digna con materiales sustentables.',
    category: 'Educación', goal: 850000, raised: 623000, donors: 184, verified: true, urgency: 'high',
    image: '🏫', location: 'Villahermosa, Tabasco', receptor: 'Fundación Esperanza', createdAt: '2024-08-01',
    updates: [
      { date: '2025-02-20', title: 'Donación Recibida', description: 'Se recibieron $45,000 MXN', type: 'donation_received' },
      { date: '2025-02-15', title: 'Materiales Asignados', description: 'Compra de cemento y varilla', type: 'assigned' },
      { date: '2025-02-10', title: 'Cimentación Ejecutada', description: 'Primera etapa de construcción completada', type: 'executed' },
      { date: '2025-02-05', title: 'Evidencia Fotográfica', description: 'Galería de avance disponible', type: 'evidence' },
    ],
    proofOfLife: ['📸 Foto 1: Cimentación', '📸 Foto 2: Estructura', '🎥 Video: Comunidad'],
  },
  {
    id: 'p2', title: 'Albergue Animal CDMX', description: 'Refugio para 200 animales rescatados. Incluye área veterinaria, rehabilitación y programa de adopción.',
    category: 'Bienestar Animal', goal: 420000, raised: 198000, donors: 312, verified: true, urgency: 'medium',
    image: '🐾', location: 'CDMX', receptor: 'Patitas con Amor AC', createdAt: '2024-09-15',
    updates: [
      { date: '2025-02-18', title: 'Meta 47% alcanzada', description: 'Gracias a todos los donantes', type: 'donation_received' },
    ],
    proofOfLife: ['📸 Instalaciones', '🎥 Adopciones exitosas'],
  },
  {
    id: 'p3', title: 'Agua Limpia Oaxaca', description: 'Sistema de purificación de agua para 5 comunidades de la Sierra Norte. Beneficia a 2,000 personas.',
    category: 'Salud', goal: 1200000, raised: 890000, donors: 428, verified: true, urgency: 'critical',
    image: '💧', location: 'Sierra Norte, Oaxaca', receptor: 'AquaVida MX', createdAt: '2024-05-20',
    updates: [
      { date: '2025-02-22', title: 'Filtros instalados', description: '3 de 5 comunidades ya tienen agua limpia', type: 'executed' },
      { date: '2025-02-20', title: 'Evidencia Final', description: 'Comunidad de San Pablo con agua purificada', type: 'evidence' },
    ],
    proofOfLife: ['📸 Filtros instalados', '📸 Niños bebiendo agua limpia', '🎥 Testimonio comunidad'],
  },
  {
    id: 'p4', title: 'Becas STEM Monterrey', description: 'Programa de becas para 50 estudiantes de preparatoria en STEM. Incluye mentoría y equipo de cómputo.',
    category: 'Educación', goal: 600000, raised: 245000, donors: 89, verified: false, urgency: 'low',
    image: '🔬', location: 'Monterrey, NL', receptor: 'TechEdu NL', createdAt: '2024-11-01',
    updates: [],
    proofOfLife: [],
  },
  {
    id: 'p5', title: 'Reforestación Sierra Madre', description: 'Plantación de 10,000 árboles nativos. Restauración ecológica con participación comunitaria.',
    category: 'Medio Ambiente', goal: 350000, raised: 310000, donors: 567, verified: true, urgency: 'medium',
    image: '🌲', location: 'Sierra Madre, Jalisco', receptor: 'VerdeVida AC', createdAt: '2024-07-10',
    updates: [
      { date: '2025-02-19', title: '8,500 árboles plantados', description: 'Avance del 85%', type: 'executed' },
    ],
    proofOfLife: ['📸 Jornada de reforestación', '🎥 Dron sobre zona reforestada'],
  },
  {
    id: 'p6', title: 'Comedor Comunitario Guerrero', description: 'Alimentación diaria para 300 familias en zona de alta marginación. Nutrición balanceada y digna.',
    category: 'Alimentación', goal: 280000, raised: 165000, donors: 203, verified: true, urgency: 'high',
    image: '🍲', location: 'Chilpancingo, Guerrero', receptor: 'Manos que Nutren', createdAt: '2024-10-05',
    updates: [
      { date: '2025-02-21', title: '15,000 comidas servidas', description: 'Operación estable', type: 'executed' },
    ],
    proofOfLife: ['📸 Comedor en operación'],
  },
];

export const mockDonations: Donation[] = [
  { id: 'd1', donorId: 'u1', projectId: 'p1', amount: 5000, date: '2025-02-20', recurring: true, receiptGenerated: true },
  { id: 'd2', donorId: 'u1', projectId: 'p3', amount: 10000, date: '2025-02-15', recurring: false, receiptGenerated: true },
  { id: 'd3', donorId: 'u1', projectId: 'p5', amount: 2500, date: '2025-01-28', recurring: true, receiptGenerated: true },
  { id: 'd4', donorId: 'u1', projectId: 'p2', amount: 8000, date: '2025-01-10', recurring: false, receiptGenerated: false },
  { id: 'd5', donorId: 'u1', projectId: 'p6', amount: 3000, date: '2024-12-20', recurring: true, receiptGenerated: true },
  { id: 'd6', donorId: 'u1', projectId: 'p1', amount: 5000, date: '2024-12-01', recurring: true, receiptGenerated: true },
  { id: 'd7', donorId: 'u1', projectId: 'p3', amount: 15000, date: '2024-11-15', recurring: false, receiptGenerated: true },
];

export const donationsByMonth = [
  { month: 'Sep', amount: 0 },
  { month: 'Oct', amount: 5000 },
  { month: 'Nov', amount: 15000 },
  { month: 'Dec', amount: 8000 },
  { month: 'Ene', amount: 10500 },
  { month: 'Feb', amount: 15000 },
];

export const mockEvents: AuctionEvent[] = [
  { id: 'e1', title: 'Juega con Chicharito', description: 'Partido amistoso de fútbol con Javier Hernández. Incluye jersey autografiado.', celebrity: 'Javier "Chicharito" Hernández', currentBid: 45000, minBid: 5000, endsAt: '2025-03-01T18:00:00', image: '⚽', type: 'auction' },
  { id: 'e2', title: 'Cena con Yuya', description: 'Cena privada y sesión de mentoría con la creadora de contenido más influyente de México.', celebrity: 'Yuya', currentBid: 32000, minBid: 3000, endsAt: '2025-03-05T20:00:00', image: '✨', type: 'auction' },
  { id: 'e3', title: 'Torneo Relámpago FIFA', description: 'Torneo de videojuegos. Inscripción = donación. Premio: visibilidad + Honor Points.', celebrity: '', currentBid: 500, minBid: 500, endsAt: '2025-02-28T16:00:00', image: '🎮', type: 'tournament' },
  { id: 'e4', title: 'The Order Lounge', description: 'Acceso exclusivo para donantes recurrentes. Networking con líderes sociales y empresariales.', celebrity: '', currentBid: 0, minBid: 0, endsAt: '2025-04-15T19:00:00', image: '🏛️', type: 'lounge' },
];

export const mockPartners: Partner[] = [
  { id: 'pt1', name: 'OXXO', logo: '🏪', coupons: [
    { id: 'c1', title: 'Recarga sin comisión', pointsCost: 200, description: 'Recarga de tiempo aire de cualquier monto sin comisión' },
    { id: 'c2', title: '2x1 Café Andatti', pointsCost: 100, description: 'Válido en cualquier OXXO del país' },
  ]},
  { id: 'pt2', name: '7-Eleven', logo: '🏬', coupons: [
    { id: 'c3', title: '20% en snacks', pointsCost: 150, description: 'Descuento en categoría snacks y bebidas' },
  ]},
];

export const adminStats = {
  totalMoved: 3_250_000,
  todayMoved: 125_000,
  totalDonors: 1_284,
  activeProjects: 6,
  pendingReview: 3,
  pldAlerts: 2,
  receiptsGenerated: 847,
};

export const categories = ['Todas', 'Educación', 'Salud', 'Bienestar Animal', 'Medio Ambiente', 'Alimentación'];
