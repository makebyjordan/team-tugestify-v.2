
import { Asset, BrandItem, TeamMember, ActivityLog, Project, ChatMessage } from './types';

export const MOCK_USER: TeamMember = {
  id: 'u1',
  name: 'John Makhowsky',
  role: 'Admin',
  avatar: 'https://picsum.photos/seed/john/200/200',
  password: 'admin'
};

export const INITIAL_TEAM: TeamMember[] = [
  MOCK_USER,
  {
    id: 'u2',
    name: 'Sarah Design',
    role: 'Diseñador',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    password: '123'
  },
  {
    id: 'u3',
    name: 'Mike Dev',
    role: 'Desarrollador',
    avatar: 'https://picsum.photos/seed/mike/200/200',
    password: '123'
  },
  {
    id: 'u4',
    name: 'Elena Marketing',
    role: 'Marketing',
    avatar: 'https://picsum.photos/seed/elena/200/200',
    password: '123'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'a1',
    name: 'Logo Principal',
    category: 'icons',
    url: 'https://picsum.photos/seed/logo1/300/300',
    uploadedBy: 'John Makhowsky',
    date: '2023-10-24',
    size: '1.2MB',
    tags: ['branding', 'logo', 'vector']
  },
  {
    id: 'a2',
    name: 'Folleto Campaña v1',
    category: 'flyers',
    url: 'https://picsum.photos/seed/flyer1/300/400',
    uploadedBy: 'Sarah Design',
    date: '2023-10-25',
    size: '4.5MB',
    tags: ['campaña', 'print', 'octubre']
  },
  {
    id: 'a3',
    name: 'Estadísticas Q3',
    category: 'infographics',
    url: 'https://picsum.photos/seed/info1/400/300',
    uploadedBy: 'John Makhowsky',
    date: '2023-10-26',
    size: '2.1MB',
    tags: ['data', 'social']
  }
];

export const INITIAL_BRAND_ITEMS: BrandItem[] = [
  { id: 'b1', type: 'hashtag', content: '#TecnologiaFutura' },
  { id: 'b2', type: 'hashtag', content: '#InnovacionDiaria' },
  { id: 'b3', type: 'keyword', content: 'Sostenibilidad' },
  { id: 'b4', type: 'text', content: 'Empoderando a la próxima generación de creadores digitales.' }
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  { id: 'l1', action: 'Subió "Logo Principal"', user: 'John Makhowsky', time: 'hace 2 min' },
  { id: 'l2', action: 'Añadió miembro "Mike Dev"', user: 'Sarah Design', time: 'hace 1 hora' },
  { id: 'l3', action: 'Generó hashtags con IA', user: 'John Makhowsky', time: 'hace 3 horas' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Lanzamiento Website v2',
    description: 'Rediseño completo de la web corporativa con nuevas secciones de blog y contacto.',
    createdAt: '2023-10-20',
    isArchived: false,
    stages: [
      { id: 's1', title: 'Wireframes y UX', isCompleted: true, completedBy: 'Sarah Design', completedAt: '2023-10-22' },
      { id: 's2', title: 'Diseño UI en Figma', isCompleted: true, completedBy: 'Sarah Design', completedAt: '2023-10-25' },
      { id: 's3', title: 'Desarrollo Frontend', isCompleted: false },
      { id: 's4', title: 'Integración CMS', isCompleted: false },
      { id: 's5', title: 'QA y Deploy', isCompleted: false },
    ],
    notes: []
  },
  {
    id: 'p2',
    title: 'Campaña Redes Sociales Q4',
    description: 'Planificación y creación de assets para la campaña de fin de año.',
    createdAt: '2023-10-28',
    isArchived: false,
    stages: [
      { id: 's1', title: 'Definición de Concepto', isCompleted: true, completedBy: 'John Makhowsky', completedAt: '2023-10-29' },
      { id: 's2', title: 'Creación de Copy', isCompleted: false },
      { id: 's3', title: 'Diseño de Piezas Gráficas', isCompleted: false },
    ],
    notes: []
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    userId: 'u2',
    content: 'Chicos, he subido la primera versión del flyer. ¿Qué os parece el color?',
    timestamp: '09:30',
    context: {
      id: 'a2',
      type: 'asset',
      title: 'Folleto Campaña v1',
      thumbnail: 'https://picsum.photos/seed/flyer1/300/400',
      detail: 'flyers'
    }
  },
  {
    id: 'm2',
    userId: 'u1',
    content: 'Me gusta, pero creo que deberíamos usar el hashtag oficial.',
    timestamp: '09:35',
    context: {
      id: 'b1',
      type: 'brand',
      title: '#TecnologiaFutura',
      detail: 'hashtag'
    }
  },
  {
    id: 'm3',
    userId: 'u3',
    content: 'Genial, lo cambiaré. Por cierto, ¿cómo vamos con el desarrollo web?',
    timestamp: '10:00'
  }
];
