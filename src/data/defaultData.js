export const defaultResumeData = {
  // Personal Details
  jobTitle: 'Senior Product Designer',
  first: 'Maksud',
  last: 'Alam',
  email: 'maksud@musemind.agency',
  phone: '+880 123 456 7890',
  address: 'Dhaka, Bangladesh',
  photo: '', // Default avatar SVG is rendered when empty

  // Bio
  bio: "I'm a Senior Product Designer at MuseMind, creating meaningful, user-centered experiences with a decade of design experience across mobile and web platforms.",

  // Work Experience (Dynamic array of jobs)
  jobs: [
    {
      id: 'job-1',
      title: 'Senior Product Designer',
      company: 'Musemind Digital Agency',
      place: 'Dhaka, Bangladesh',
      dates: '02/08/2021 - Present',
      points: [
        'Designed high-fidelity visual designs and comprehensive UI design systems.',
        'Created design specifications and interactive documentation for development teams.',
        'Mentored junior designers and conducted collaborative design critique reviews.'
      ]
    },
    {
      id: 'job-2',
      title: 'Product Designer',
      company: 'Lunchbox',
      place: 'Kiev, Ukraine',
      dates: '01/01/2020 - 01/07/2021',
      points: [
        'Designed and launched several digital products for high-growth clients in hospitality.',
        'Worked closely with engineering leads to ensure design fidelity and responsive performance.'
      ]
    }
  ],

  // Education (Dynamic array)
  education: [
    {
      id: 'edu-1',
      degree: 'BFA Industrial Design',
      school: 'Rhode Island School of Design',
      year: '2013',
      note: 'Top 3% class GPA & Dean\'s Honor List'
    },
    {
      id: 'edu-2',
      degree: 'BA in Interaction Design',
      school: 'Brown University',
      year: '2016',
      note: 'Focus on Human-Computer Interaction'
    }
  ],

  // Skills (Dynamic array of categorized skill groups)
  skillGroups: [
    {
      id: 'skill-1',
      name: 'Industry Knowledge',
      skills: 'Product Design, User Interface, Interaction Design, Wire-framing, Design Systems'
    },
    {
      id: 'skill-2',
      name: 'Tools & Technologies',
      skills: 'Figma, Sketch, Protopie, Framer, InVision, Adobe CC'
    },
    {
      id: 'skill-3',
      name: 'Other Skills',
      skills: 'HTML5, CSS3, JavaScript, User Research, Usability Testing'
    }
  ]
};

export const ACCENT_COLORS = [
  { name: 'Terracotta', hex: '#c2410c' },
  { name: 'Royal Sapphire', hex: '#2563eb' },
  { name: 'Forest Emerald', hex: '#059669' },
  { name: 'Deep Amethyst', hex: '#7c3aed' },
  { name: 'Rosewood', hex: '#be123c' },
  { name: 'Slate Onyx', hex: '#1e293b' }
];
