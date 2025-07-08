export interface PolicyDocument {
  id: string;
  title: string;
  version: string;
  lastUpdated: string;
  status: 'Acknowledged' | 'Pending' | 'Expired';
  description: string;
  department: string;
  effectiveDate: string;
  expiresDate: string;
  content: {
    overview: string;
    scope: string;
    keyGuidelines: string[];
    conflictsOfInterest: string;
    consequences: string;
  };
}

export const policyLibraryData: PolicyDocument[] = [
  {
    id: 'pol-001',
    title: 'IT Security & Acceptable Use Policy',
    version: '2.1',
    lastUpdated: '2025-01-03',
    status: 'Pending',
    description: 'Comprehensive policy outlining IT security requirements and acceptable use guidelines for all employees.',
    department: 'IT Department',
    effectiveDate: '2025-01-01',
    expiresDate: '2026-01-01',
    content: {
      overview: 'Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis nulla nec velius posuere vitae tincidunt ipsum. Egestas pellentesque vitae cursus vel sed tellus in fringilla elit. Rhoncus id quam pellentesque dolor pharetra arcu ac quam. Sed velit ipsum.',
      scope: 'Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis nulla nec velius posuere vitae tincidunt ipsum.',
      keyGuidelines: [
        'Lorem ipsum dolor sit amet consectetur adipiscing',
        'Lorem ipsum dolor sit amet consectetur adipiscing',
        'Lorem ipsum dolor sit amet consectetur adipiscing'
      ],
      conflictsOfInterest: 'Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis nulla nec velius posuere vitae tincidunt ipsum. Egestas pellentesque vitae cursus vel sed tellus in fringilla elit.',
      consequences: 'Lorem ipsum dolor sit amet consectetur. Adipiscing molestie venenatis nulla nec velius posuere vitae tincidunt ipsum. Egestas pellentesque vitae cursus vel sed tellus in fringilla elit.'
    }
  },
  {
    id: 'pol-002',
    title: 'Data Protection Policy',
    version: '1.5',
    lastUpdated: '2024-12-15',
    status: 'Acknowledged',
    description: 'Guidelines for handling, storing, and protecting sensitive data and personal information.',
    department: 'Legal Department',
    effectiveDate: '2024-12-01',
    expiresDate: '2025-12-01',
    content: {
      overview: 'Comprehensive data protection guidelines ensuring compliance with privacy regulations.',
      scope: 'Applies to all employees handling personal or sensitive data.',
      keyGuidelines: [
        'Encrypt all sensitive data in transit and at rest',
        'Implement strong access controls and authentication',
        'Regular security audits and assessments'
      ],
      conflictsOfInterest: 'Any conflicts must be reported to the Data Protection Officer immediately.',
      consequences: 'Violations may result in disciplinary action, including termination and legal consequences.'
    }
  },
  {
    id: 'pol-003',
    title: 'Remote Work Policy',
    version: '3.0',
    lastUpdated: '2024-11-20',
    status: 'Expired',
    description: 'Policy governing remote work arrangements, equipment usage, and productivity expectations.',
    department: 'HR Department',
    effectiveDate: '2024-11-01',
    expiresDate: '2024-12-31',
    content: {
      overview: 'Guidelines for effective remote work practices and maintaining productivity.',
      scope: 'All employees eligible for remote work arrangements.',
      keyGuidelines: [
        'Maintain secure home office environment',
        'Use company-approved software and tools',
        'Regular communication with team and supervisors'
      ],
      conflictsOfInterest: 'Remote work should not interfere with client relationships or confidentiality.',
      consequences: 'Non-compliance may result in revocation of remote work privileges.'
    }
  },
  {
    id: 'pol-004',
    title: 'Code of Conduct',
    version: '4.2',
    lastUpdated: '2024-10-05',
    status: 'Acknowledged',
    description: 'Ethical guidelines and behavioral expectations for all employees and contractors.',
    department: 'HR Department',
    effectiveDate: '2024-10-01',
    expiresDate: '2025-10-01',
    content: {
      overview: 'Fundamental principles governing professional conduct and ethical behavior.',
      scope: 'All employees, contractors, and temporary staff.',
      keyGuidelines: [
        'Maintain professional integrity in all interactions',
        'Respect diversity and promote inclusive environment',
        'Report unethical behavior through proper channels'
      ],
      conflictsOfInterest: 'Disclose any potential conflicts of interest to immediate supervisor.',
      consequences: 'Violations will be investigated and may result in disciplinary action up to termination.'
    }
  },
  {
    id: 'pol-005',
    title: 'Social Media Policy',
    version: '1.8',
    lastUpdated: '2024-09-12',
    status: 'Pending',
    description: 'Guidelines for appropriate social media use and representation of company brand.',
    department: 'Marketing Department',
    effectiveDate: '2024-09-01',
    expiresDate: '2025-09-01',
    content: {
      overview: 'Best practices for social media engagement while maintaining professional standards.',
      scope: 'All employees with access to company social media accounts or representing the company online.',
      keyGuidelines: [
        'Maintain professional tone in all company-related posts',
        'Obtain approval for official company communications',
        'Respect confidentiality and intellectual property'
      ],
      conflictsOfInterest: 'Personal social media activity should not conflict with company interests.',
      consequences: 'Inappropriate social media use may result in disciplinary action and account restrictions.'
    }
  }
];