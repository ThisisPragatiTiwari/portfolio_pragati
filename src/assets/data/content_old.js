// All editable site content lives here — update your info without touching
// component code.

export const profile = {
  name: 'Pragati Tiwari',
  role: 'Frontend Developer',
  // ATS-friendly: states role + core stack in plain language, no wordplay
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

// Frontend-only skill set, grouped so the marquee/strip has natural clusters.
export const skills = [
  'React.js',
  'JavaScript (ES6+)',
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

export const projects = [
  {
    title: 'DevFest Noida 2026',
    description:
      'A dark, developer-first landing page built for the GDG Noida DevFest Web Team challenge — "System Online" concept with an interactive, terminal-inspired UI and a particle-text intro animation.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
    href: 'https://devfestnoida.vercel.app/',
    code: null,
    featured: true,
    category: 'React',
  },
  {
    title: 'SalesforceX Labs',
    description:
      'A four-page consultancy site for a Salesforce Summit Partner, rebuilt on a shared design system with consistent typography and scroll-reveal animation across every page.',
    stack: ['Bootstrap 5', 'CSS Custom Properties', 'AOS', 'JavaScript'],
    href: null,
    code: null,
    featured: false,
    category: 'Other',
  },
  {
    title: 'MyLifeGraph',
    description:
      'An eight-page nature/NGO website with a shared component-style CSS and JS system, scroll-reveal animation, and a custom leaf-particle effect across every page.',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    href: null,
    code: null,
    featured: false,
    category: 'Other',
  },
  {
    title: 'Bansal Masale Wala',
    description:
      'A multi-page storefront for a heritage spice brand ("Since 1985"), rebuilt from a PHP template into a fully static, JavaScript-routed app with cart functionality and product filtering.',
    stack: ['JavaScript', 'CSS3', 'HTML5'],
    href: null,
    code: null,
    featured: false,
    category: 'Other',
  },
]

export const nav = [
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]
