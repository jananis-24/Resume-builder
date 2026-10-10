export const defaultResumeData = {
  // Personal Details
  jobTitle: 'Professional Accountant',
  first: 'Sebastian',
  last: 'Bennett',
  email: 'hello@reallygreatsite.com',
  phone: '+123-456-7890',
  address: '123 Anywhere St., Any City',
  photo: '',

  // Bio / About Me
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',

  // Education (Dynamic array)
  education: [
    {
      id: 'edu-1',
      degree: 'Senior Accountant',
      school: 'Borcelle University',
      year: '2026-2030',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: 'edu-2',
      degree: 'Senior Accountant',
      school: 'Borcelle University',
      year: '2025-2026',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ],

  // Work Experience (Dynamic array of jobs)
  jobs: [
    {
      id: 'job-1',
      title: 'Senior Accountant',
      company: 'Salford & Co.',
      place: 'New York, USA',
      dates: '2033 - 2035',
      points: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
      ]
    },
    {
      id: 'job-2',
      title: 'Financial Accountant',
      company: 'Salford & Co.',
      place: 'New York, USA',
      dates: '2030 - 2033',
      points: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      ]
    }
  ],

  // Skills (Individual skills or comma-separated groups for the 3-column bulleted layout)
  skillGroups: [
    {
      id: 'skill-1',
      name: 'Accounting & Auditing',
      skills: 'Auditing, Financial Accounting, Financial Reporting, Auditing, Financial Accounting, Tax Advisory'
    }
  ]
};

export const ACCENT_COLORS = [
  { name: 'Charcoal Slate', hex: '#4e5159' },
  { name: 'Midnight Onyx', hex: '#1e293b' },
  { name: 'Classic Black', hex: '#18181b' },
  { name: 'Royal Sapphire', hex: '#2563eb' },
  { name: 'Forest Emerald', hex: '#059669' },
  { name: 'Terracotta', hex: '#c2410c' }
];
