
export const profile = {
  name: 'Pragati Tiwari',
  role: 'Frontend Developer',
  tagline:
    'Frontend Developer specializing in React.js, building fast, accessible, and responsive user interfaces.',
  intro:
    "I build interfaces that feel considered — from animated, component-driven React apps to fast, accessible sites. I care about clean code as much as clean design.",
  location: 'India',
  email: 'tiwari.pragati099@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/ThisisPragatiTiwari', icon: 'bi-github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pragati-tiwari-/', icon: 'bi-linkedin' },
    { label: 'Twitter', href: 'https://twitter.com/Thisis_Pragati', icon: 'bi-twitter-x' },
    { label: 'Email', href: 'mailto:tiwari.pragati099@gmail.com', icon: 'bi-envelope' },
  ],
}

export const skills = [
  'React.js',
  'JavaScript (ES6+)',
  'Jquery',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'Bootstrap 5',
  'Framer Motion',
  'GSAP',
  'Vite',
  'Responsive Design',
  'Git & GitHub',
  'REST APIs',
]

// Each project has a `tier` that controls how it's rendered:
//   'featured'    — large, full-width row with a live preview, top of the section
//   'standard'    — compact grid card with a live preview thumbnail
//   'case-study'  — compact grid card with no thumbnail; opens a Challenge/
//                   Approach/Result modal instead, for work with no public
//                   URL or screenshots to show (client/internal projects)
//
// `preview` controls the thumbnail for 'featured'/'standard' cards:
//   'iframe'   — embeds the live `href` as a scaled-down preview window
//   'gradient' — falls back to a gradient block with the project's initial
//   'image'    — uses a static image (e.g., screenshot) for the preview

export const projects = [
  {
    title: 'DevFest Noida 2026',
    description:
      'A dark, developer-first landing page built for the GDG Noida DevFest Web Team challenge — "System Online" concept with an interactive, terminal-inspired UI and a particle-text intro animation.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
    href: 'https://devfestnoida.vercel.app/',
    code: null,
    category: 'React',
    tier: 'featured',
    preview: 'iframe',
    caseStudy: null,
  },
  {
    title: 'PaisaGraph',
    description:
      "A premium fintech platform for Indian investors. Rebuilt the audience experience on top of an existing template: a dropdown lets visitors switch between Individual and Business modes, which reshapes the entire nav menu and redirects to the home page on every switch, with the choice persisted across both localStorage and sessionStorage. Added a light/dark theme toggle with its own persisted preference, and reworked the overall page layout for a cleaner, more premium feel.",
    stack: ['JavaScript', 'Bootstrap 5', 'localStorage', 'sessionStorage', 'CSS3'],
    href: 'https://paisagraph.com/',
    code: null,
    category: 'Web Development',
    tier: 'featured',
    preview: 'image', 
    image: '/images/paisagraph.png',
    caseStudy: null,
  },
  {
    title: 'Tekshapers',
    description:
      "My company's corporate website, built from scratch. The homepage uses a GSAP scroll-triggered animation to surface our best projects as you scroll, and a dynamic portfolio page lists 100+ projects, each with its own screenshots, feature breakdown, and tech stack. The whole site is built around clean, simple navigation and lively, interactive infographics — an attempt to make a corporate site feel less like a brochure.",
    stack: ['HTML5', 'CSS3', 'Bootstrap 5', 'PHP (CodeIgniter)', 'JavaScript', 'jQuery', 'GSAP'],
    href: 'https://tekshapers.com/',
    code: null,
    category: 'Web Development',
    tier: 'standard',
    preview: 'image', 
    image: '/images/tekshapers.png',
    caseStudy: null,
  },
  {
    title: 'TekHRM',
    description:
      "Built TekHRM's responsive marketing website from scratch based on a Figma design. Translated the static UI into a production-ready experience optimized for desktop, tablet, and mobile. TekHRM is an HR management platform that streamlines employee data, attendance, payroll, recruitment, and performance management, helping organizations reduce manual work and improve HR efficiency.",
    stack: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'jQuery', 'AOS', 'Smooth Transitions'],
    href: 'https://tekhrm.com/',
    code: null,
    category: 'Web Development',
    tier: 'standard',
    preview: 'image', 
    image: '/images/tekhrm.png', 
    caseStudy: null,
  },
  {
    title: 'TekHRM — HRMS Portal',
    description:
      'Redesigned the Employee Master page inside a large, in-use HRMS admin panel — an internal product.',
    stack: ['PHP (CodeIgniter-style)', 'Metronic Bootstrap', 'jQuery', 'AJAX', 'DataTables'],
    href: null,
    code: null,
    category: 'Design',
    tier: 'case-study',
    preview: null,
    caseStudy: {
      challenge:
        "The Employee Master table in a large HRMS admin panel (Metronic Bootstrap + CodeIgniter-style PHP) had grown hard to scan — filters were buried, and there was no quick way to separate active from inactive employees. Any redesign had to work within strict constraints: don't touch the underlying PHP logic, preserve the existing color system, and stick to Metronic's own component classes rather than introducing custom CSS.",
      approach:
        "Delivered three distinct layout mockups for the toolbar and filter bar before writing any code, so the direction could be agreed on first. Implemented the chosen layout directly in the existing PHP views — the toolbar/filters view and the AJAX-loaded employee row template — reusing Metronic's existing classes throughout. Added a new All / Active / Inactive status filter wired into the existing AJAX fetch without touching its underlying query logic.",
      result:
        "Shipped a cleaner, more scannable Employee Master page with a working status filter — delivered without a single change to the page's PHP business logic or its established visual language. A constraint-driven redesign, not a rebuild.",
    },
  },
  {
    title: 'Client Portal — Milestone Timeline',
    description:
      "Added a visual project timeline to a PHP client portal so clients can follow progress without asking for a status update. An internal/client-facing tool.",
    stack: ['PHP', 'ApexGantt', 'JavaScript'],
    href: null,
    code: null,
    category: 'Design',
    tier: 'case-study',
    preview: null,
    caseStudy: {
      challenge:
        "A PHP client portal's Milestones tab gave clients no visual sense of project timing — just a list, with no way to see how sprints or milestones overlapped or how far along the work actually was. The brief was to add a timeline view, but a naive Gantt chart risked forcing clients into awkward horizontal scrolling just to see a project's full span.",
      approach:
        'Integrated ApexGantt as a read-only timeline embedded directly in the existing Milestones tab, favoring the simplest workable layout over a feature-heavy chart. Tuned the scaling and label density specifically to avoid the horizontal-scroll problem, keeping a full project visible without clients needing to drag the view around.',
      result:
        'Clients can now see ongoing milestone and sprint progress at a glance, from the same portal they already use — no separate tool, and no scrolling required to understand where a project stands.',
    },
  },
]

export const nav = [
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]