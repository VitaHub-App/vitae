
// Sample CV data structure for demo purposes
// In a real implementation, this would be generated from markdown files

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
  level: number; // 1-5
}

export interface Project {
  title: string;
  period: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  bio: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: {
    name: string;
    proficiency: string;
  }[];
}

// Language data
export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// English CV data
export const cvDataEn: CVData = {
  personalInfo: {
    name: 'Alex Morgan',
    title: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'www.alexmorgan.design',
    github: 'github.com/alexmorgan',
    linkedin: 'linkedin.com/in/alexmorgan',
    bio: 'Product designer with 8+ years of experience creating user-centered digital experiences for tech startups and established companies. Passionate about accessibility and inclusive design.'
  },
  experience: [
    {
      title: 'Senior Product Designer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      period: 'Jan 2020 - Present',
      description: [
        'Lead designer for flagship product serving 2M+ users, increasing engagement by 34%',
        'Managed team of 4 designers, implementing design system that reduced design inconsistency by 60%',
        'Collaborated with product and engineering teams to streamline design-to-development handoff, reducing iterations by 40%',
        'Conducted user research with over 200 participants to identify key pain points and opportunities'
      ]
    },
    {
      title: 'Product Designer',
      company: 'InnovateLab',
      location: 'Oakland, CA',
      period: 'Mar 2017 - Dec 2019',
      description: [
        'Redesigned core user flows resulting in 27% improvement in conversion rate',
        'Created responsive designs for web and mobile platforms, supporting devices from 320px to 1440px+',
        'Built interactive prototypes for user testing and stakeholder presentations',
        'Established design guidelines and component library for product design consistency'
      ]
    },
    {
      title: 'UI/UX Designer',
      company: 'DesignWorks Agency',
      location: 'Portland, OR',
      period: 'Sep 2015 - Feb 2017',
      description: [
        'Designed user interfaces for clients across e-commerce, fintech, and healthcare sectors',
        'Conducted usability testing and created user journey maps for client projects',
        'Collaborated with development team to ensure design feasibility and quality implementation',
        'Created wireframes, mockups, and prototypes to communicate design concepts'
      ]
    }
  ],
  education: [
    {
      degree: 'Master of Fine Arts, Interaction Design',
      institution: 'California College of the Arts',
      location: 'San Francisco, CA',
      period: '2013 - 2015',
      description: [
        'Thesis: "Designing for Behavioral Change in Digital Health Applications"',
        'Recipient of the Design Excellence Scholarship'
      ]
    },
    {
      degree: 'Bachelor of Arts, Graphic Design',
      institution: 'University of Oregon',
      location: 'Eugene, OR',
      period: '2009 - 2013',
      description: [
        'Minor in Psychology',
        'Design lead for student magazine "Emerge"',
        'Dean\'s List, 8 consecutive semesters'
      ]
    }
  ],
  skills: [
    { name: 'User Experience Design', level: 5 },
    { name: 'Figma', level: 5 },
    { name: 'Prototyping', level: 4 },
    { name: 'User Research', level: 4 },
    { name: 'Design Systems', level: 5 },
    { name: 'Adobe Creative Suite', level: 4 },
    { name: 'HTML/CSS', level: 3 },
    { name: 'Design Thinking', level: 5 },
    { name: 'Accessibility', level: 4 },
    { name: 'Sketch', level: 4 },
    { name: 'Information Architecture', level: 4 },
    { name: 'Usability Testing', level: 4 }
  ],
  projects: [
    {
      title: 'HealthTrack Mobile App',
      period: '2021',
      description: 'Redesigned health tracking app focusing on accessibility and habit formation.',
      technologies: ['Figma', 'Prototyping', 'User Research'],
      link: 'www.alexmorgan.design/healthtrack'
    },
    {
      title: 'E-commerce Design System',
      period: '2020',
      description: 'Created comprehensive component library and design guidelines for e-commerce platform.',
      technologies: ['Design Systems', 'Documentation', 'Component Design'],
      link: 'www.alexmorgan.design/ecommerce'
    },
    {
      title: 'Financial Dashboard',
      period: '2019',
      description: 'Designed data visualization dashboard for personal finance management application.',
      technologies: ['Data Visualization', 'UX Design', 'Figma'],
      link: 'www.alexmorgan.design/fintech'
    }
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'Professional working proficiency' },
    { name: 'French', proficiency: 'Elementary proficiency' }
  ]
};

// Spanish CV data
export const cvDataEs: CVData = {
  personalInfo: {
    name: 'Alex Morgan',
    title: 'Diseñador Senior de Productos',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'www.alexmorgan.design',
    github: 'github.com/alexmorgan',
    linkedin: 'linkedin.com/in/alexmorgan',
    bio: 'Diseñador de productos con más de 8 años de experiencia creando experiencias digitales centradas en el usuario para startups tecnológicas y empresas establecidas. Apasionado por la accesibilidad y el diseño inclusivo.'
  },
  experience: [
    {
      title: 'Diseñador Senior de Productos',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      period: 'Enero 2020 - Presente',
      description: [
        'Diseñador principal para producto insignia con más de 2M de usuarios, aumentando la participación en un 34%',
        'Gestioné un equipo de 4 diseñadores, implementando un sistema de diseño que redujo la inconsistencia en un 60%',
        'Colaboré con equipos de producto e ingeniería para optimizar la entrega de diseño a desarrollo, reduciendo las iteraciones en un 40%',
        'Realicé investigaciones con más de 200 usuarios para identificar puntos críticos y oportunidades'
      ]
    },
    {
      title: 'Diseñador de Productos',
      company: 'InnovateLab',
      location: 'Oakland, CA',
      period: 'Marzo 2017 - Diciembre 2019',
      description: [
        'Rediseñé flujos de usuario principales resultando en una mejora del 27% en la tasa de conversión',
        'Creé diseños responsivos para plataformas web y móviles, con soporte para dispositivos desde 320px hasta 1440px+',
        'Desarrollé prototipos interactivos para pruebas de usuario y presentaciones a interesados',
        'Establecí pautas de diseño y biblioteca de componentes para la consistencia en el diseño de productos'
      ]
    },
    {
      title: 'Diseñador UI/UX',
      company: 'DesignWorks Agency',
      location: 'Portland, OR',
      period: 'Septiembre 2015 - Febrero 2017',
      description: [
        'Diseñé interfaces de usuario para clientes en sectores de comercio electrónico, fintech y salud',
        'Realicé pruebas de usabilidad y creé mapas de viaje del usuario para proyectos de clientes',
        'Colaboré con el equipo de desarrollo para garantizar la viabilidad del diseño y la implementación de calidad',
        'Creé wireframes, maquetas y prototipos para comunicar conceptos de diseño'
      ]
    }
  ],
  education: [
    {
      degree: 'Maestría en Bellas Artes, Diseño de Interacción',
      institution: 'California College of the Arts',
      location: 'San Francisco, CA',
      period: '2013 - 2015',
      description: [
        'Tesis: "Diseñando para el Cambio de Comportamiento en Aplicaciones Digitales de Salud"',
        'Receptor de la Beca de Excelencia en Diseño'
      ]
    },
    {
      degree: 'Licenciatura en Artes, Diseño Gráfico',
      institution: 'Universidad de Oregon',
      location: 'Eugene, OR',
      period: '2009 - 2013',
      description: [
        'Especialización en Psicología',
        'Líder de diseño para la revista estudiantil "Emerge"',
        'Lista del Decano, 8 semestres consecutivos'
      ]
    }
  ],
  skills: [
    { name: 'Diseño de Experiencia de Usuario', level: 5 },
    { name: 'Figma', level: 5 },
    { name: 'Prototipado', level: 4 },
    { name: 'Investigación de Usuarios', level: 4 },
    { name: 'Sistemas de Diseño', level: 5 },
    { name: 'Adobe Creative Suite', level: 4 },
    { name: 'HTML/CSS', level: 3 },
    { name: 'Design Thinking', level: 5 },
    { name: 'Accesibilidad', level: 4 },
    { name: 'Sketch', level: 4 },
    { name: 'Arquitectura de Información', level: 4 },
    { name: 'Pruebas de Usabilidad', level: 4 }
  ],
  projects: [
    {
      title: 'Aplicación Móvil HealthTrack',
      period: '2021',
      description: 'Rediseño de aplicación de seguimiento de salud con enfoque en accesibilidad y formación de hábitos.',
      technologies: ['Figma', 'Prototipado', 'Investigación de Usuarios'],
      link: 'www.alexmorgan.design/healthtrack'
    },
    {
      title: 'Sistema de Diseño E-commerce',
      period: '2020',
      description: 'Creación de biblioteca de componentes y directrices de diseño para plataforma de comercio electrónico.',
      technologies: ['Sistemas de Diseño', 'Documentación', 'Diseño de Componentes'],
      link: 'www.alexmorgan.design/ecommerce'
    },
    {
      title: 'Panel de Control Financiero',
      period: '2019',
      description: 'Diseño de panel de visualización de datos para aplicación de gestión de finanzas personales.',
      technologies: ['Visualización de Datos', 'Diseño UX', 'Figma'],
      link: 'www.alexmorgan.design/fintech'
    }
  ],
  languages: [
    { name: 'Inglés', proficiency: 'Nativo' },
    { name: 'Español', proficiency: 'Nivel profesional' },
    { name: 'Francés', proficiency: 'Nivel básico' }
  ]
};

// French CV data
export const cvDataFr: CVData = {
  personalInfo: {
    name: 'Alex Morgan',
    title: 'Designer Produit Senior',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'www.alexmorgan.design',
    github: 'github.com/alexmorgan',
    linkedin: 'linkedin.com/in/alexmorgan',
    bio: 'Designer produit avec plus de 8 ans d\'expérience dans la création d\'expériences numériques centrées sur l\'utilisateur pour des startups technologiques et des entreprises établies. Passionné par l\'accessibilité et le design inclusif.'
  },
  experience: [
    {
      title: 'Designer Produit Senior',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      period: 'Janvier 2020 - Présent',
      description: [
        'Designer principal pour un produit phare servant plus de 2M d\'utilisateurs, augmentant l\'engagement de 34%',
        'Gestion d\'une équipe de 4 designers, mise en œuvre d\'un système de design réduisant les incohérences de 60%',
        'Collaboration avec les équipes produit et ingénierie pour rationaliser la transition du design au développement, réduisant les itérations de 40%',
        'Conduite de recherches utilisateurs avec plus de 200 participants pour identifier les points de douleur et les opportunités'
      ]
    },
    {
      title: 'Designer Produit',
      company: 'InnovateLab',
      location: 'Oakland, CA',
      period: 'Mars 2017 - Décembre 2019',
      description: [
        'Refonte des flux utilisateurs principaux résultant en une amélioration de 27% du taux de conversion',
        'Création de designs responsive pour plateformes web et mobile, supportant des appareils de 320px à 1440px+',
        'Construction de prototypes interactifs pour tests utilisateurs et présentations aux parties prenantes',
        'Établissement de directives de design et d\'une bibliothèque de composants pour la cohérence du design produit'
      ]
    },
    {
      title: 'Designer UI/UX',
      company: 'DesignWorks Agency',
      location: 'Portland, OR',
      period: 'Septembre 2015 - Février 2017',
      description: [
        'Conception d\'interfaces utilisateur pour des clients dans les secteurs de l\'e-commerce, de la fintech et de la santé',
        'Réalisation de tests d\'utilisabilité et création de cartes de parcours utilisateur pour les projets clients',
        'Collaboration avec l\'équipe de développement pour assurer la faisabilité du design et une implémentation de qualité',
        'Création de wireframes, maquettes et prototypes pour communiquer les concepts de design'
      ]
    }
  ],
  education: [
    {
      degree: 'Master en Beaux Arts, Design d\'Interaction',
      institution: 'California College of the Arts',
      location: 'San Francisco, CA',
      period: '2013 - 2015',
      description: [
        'Thèse: "Conception pour le changement comportemental dans les applications de santé numériques"',
        'Bénéficiaire de la Bourse d\'Excellence en Design'
      ]
    },
    {
      degree: 'Licence en Arts, Design Graphique',
      institution: 'Université de l\'Oregon',
      location: 'Eugene, OR',
      period: '2009 - 2013',
      description: [
        'Mineure en Psychologie',
        'Responsable design pour le magazine étudiant "Emerge"',
        'Liste du Doyen, 8 semestres consécutifs'
      ]
    }
  ],
  skills: [
    { name: 'Conception de l\'Expérience Utilisateur', level: 5 },
    { name: 'Figma', level: 5 },
    { name: 'Prototypage', level: 4 },
    { name: 'Recherche Utilisateur', level: 4 },
    { name: 'Systèmes de Design', level: 5 },
    { name: 'Adobe Creative Suite', level: 4 },
    { name: 'HTML/CSS', level: 3 },
    { name: 'Design Thinking', level: 5 },
    { name: 'Accessibilité', level: 4 },
    { name: 'Sketch', level: 4 },
    { name: 'Architecture de l\'Information', level: 4 },
    { name: 'Test d\'Utilisabilité', level: 4 }
  ],
  projects: [
    {
      title: 'Application Mobile HealthTrack',
      period: '2021',
      description: 'Refonte d\'une application de suivi de santé axée sur l\'accessibilité et la formation d\'habitudes.',
      technologies: ['Figma', 'Prototypage', 'Recherche Utilisateur'],
      link: 'www.alexmorgan.design/healthtrack'
    },
    {
      title: 'Système de Design E-commerce',
      period: '2020',
      description: 'Création d\'une bibliothèque complète de composants et de directives de design pour une plateforme de commerce électronique.',
      technologies: ['Systèmes de Design', 'Documentation', 'Conception de Composants'],
      link: 'www.alexmorgan.design/ecommerce'
    },
    {
      title: 'Tableau de Bord Financier',
      period: '2019',
      description: 'Conception d\'un tableau de bord de visualisation de données pour une application de gestion de finances personnelles.',
      technologies: ['Visualisation de Données', 'Conception UX', 'Figma'],
      link: 'www.alexmorgan.design/fintech'
    }
  ],
  languages: [
    { name: 'Anglais', proficiency: 'Langue maternelle' },
    { name: 'Espagnol', proficiency: 'Niveau professionnel' },
    { name: 'Français', proficiency: 'Niveau élémentaire' }
  ]
};

// German CV data
export const cvDataDe: CVData = {
  personalInfo: {
    name: 'Alex Morgan',
    title: 'Senior Produktdesigner',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'www.alexmorgan.design',
    github: 'github.com/alexmorgan',
    linkedin: 'linkedin.com/in/alexmorgan',
    bio: 'Produktdesigner mit über 8 Jahren Erfahrung in der Erstellung nutzerzentrierter digitaler Erlebnisse für Technologie-Startups und etablierte Unternehmen. Leidenschaftlich für Barrierefreiheit und inklusives Design.'
  },
  experience: [
    {
      title: 'Senior Produktdesigner',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      period: 'Januar 2020 - Gegenwärtig',
      description: [
        'Leitender Designer für Hauptprodukt mit über 2 Mio. Nutzern, Steigerung des Engagements um 34%',
        'Leitung eines Teams von 4 Designern, Implementierung eines Designsystems, das die Designinkonsistenz um 60% reduzierte',
        'Zusammenarbeit mit Produkt- und Entwicklungsteams zur Optimierung der Design-zu-Entwicklung-Übergabe, Reduzierung der Iterationen um 40%',
        'Durchführung von Nutzerforschung mit über 200 Teilnehmern zur Identifizierung von Schmerzpunkten und Chancen'
      ]
    },
    {
      title: 'Produktdesigner',
      company: 'InnovateLab',
      location: 'Oakland, CA',
      period: 'März 2017 - Dezember 2019',
      description: [
        'Neugestaltung der Kernbenutzerflüsse, was zu einer 27%igen Verbesserung der Konversionsrate führte',
        'Erstellung responsiver Designs für Web- und Mobilplattformen, Unterstützung von Geräten von 320px bis 1440px+',
        'Erstellung interaktiver Prototypen für Benutzertests und Stakeholder-Präsentationen',
        'Etablierung von Designrichtlinien und einer Komponentenbibliothek für Produktdesign-Konsistenz'
      ]
    },
    {
      title: 'UI/UX Designer',
      company: 'DesignWorks Agency',
      location: 'Portland, OR',
      period: 'September 2015 - Februar 2017',
      description: [
        'Design von Benutzeroberflächen für Kunden aus den Bereichen E-Commerce, Fintech und Gesundheitswesen',
        'Durchführung von Usability-Tests und Erstellung von User Journey Maps für Kundenprojekte',
        'Zusammenarbeit mit dem Entwicklungsteam zur Sicherstellung der Designmachbarkeit und Qualitätsimplementierung',
        'Erstellung von Wireframes, Mockups und Prototypen zur Kommunikation von Designkonzepten'
      ]
    }
  ],
  education: [
    {
      degree: 'Master of Fine Arts, Interaktionsdesign',
      institution: 'California College of the Arts',
      location: 'San Francisco, CA',
      period: '2013 - 2015',
      description: [
        'Thesis: "Gestaltung für Verhaltensänderung in digitalen Gesundheitsanwendungen"',
        'Empfänger des Design Excellence Stipendiums'
      ]
    },
    {
      degree: 'Bachelor of Arts, Grafikdesign',
      institution: 'Universität von Oregon',
      location: 'Eugene, OR',
      period: '2009 - 2013',
      description: [
        'Nebenfach Psychologie',
        'Designleiter für das Studentenmagazin "Emerge"',
        'Dekansliste, 8 aufeinanderfolgende Semester'
      ]
    }
  ],
  skills: [
    { name: 'User Experience Design', level: 5 },
    { name: 'Figma', level: 5 },
    { name: 'Prototyping', level: 4 },
    { name: 'Nutzerforschung', level: 4 },
    { name: 'Designsysteme', level: 5 },
    { name: 'Adobe Creative Suite', level: 4 },
    { name: 'HTML/CSS', level: 3 },
    { name: 'Design Thinking', level: 5 },
    { name: 'Barrierefreiheit', level: 4 },
    { name: 'Sketch', level: 4 },
    { name: 'Informationsarchitektur', level: 4 },
    { name: 'Usability Testing', level: 4 }
  ],
  projects: [
    {
      title: 'HealthTrack Mobile App',
      period: '2021',
      description: 'Neugestaltung einer Health-Tracking-App mit Fokus auf Barrierefreiheit und Gewohnheitsbildung.',
      technologies: ['Figma', 'Prototyping', 'Nutzerforschung'],
      link: 'www.alexmorgan.design/healthtrack'
    },
    {
      title: 'E-Commerce Designsystem',
      period: '2020',
      description: 'Erstellung einer umfassenden Komponentenbibliothek und Designrichtlinien für eine E-Commerce-Plattform.',
      technologies: ['Designsysteme', 'Dokumentation', 'Komponentendesign'],
      link: 'www.alexmorgan.design/ecommerce'
    },
    {
      title: 'Finanzdashboard',
      period: '2019',
      description: 'Design eines Datenvisualisierungs-Dashboards für eine persönliche Finanzverwaltungsanwendung.',
      technologies: ['Datenvisualisierung', 'UX Design', 'Figma'],
      link: 'www.alexmorgan.design/fintech'
    }
  ],
  languages: [
    { name: 'Englisch', proficiency: 'Muttersprache' },
    { name: 'Spanisch', proficiency: 'Berufliche Arbeitskenntnis' },
    { name: 'Französisch', proficiency: 'Grundkenntnisse' }
  ]
};

// Function to get CV data by language code
export function getCVData(languageCode: string): CVData {
  switch (languageCode) {
    case 'es':
      return cvDataEs;
    case 'fr':
      return cvDataFr;
    case 'de':
      return cvDataDe;
    case 'en':
    default:
      return cvDataEn;
  }
}
