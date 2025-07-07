export interface ComplianceDocument {
  id: string;
  title: string;
  description: string;
  department: string;
  effectiveDate: string;
  expiresDate: string;
  status: 'Active' | 'Pending' | 'Retired';
}

export const complianceDocumentsData: ComplianceDocument[] = [
  {
    id: '1',
    title: 'Data Protection Policy',
    description: 'Comprehensive policy outlining data protection procedures and GDPR compliance requirements.',
    department: 'IT & Technology',
    effectiveDate: '2024-01-15',
    expiresDate: '2025-01-15',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Financial Reporting Standards',
    description: 'Guidelines for financial reporting and accounting standards compliance.',
    department: 'Finance',
    effectiveDate: '2024-03-01',
    expiresDate: '2025-03-01',
    status: 'Active'
  },
  {
    id: '3',
    title: 'Employee Code of Conduct',
    description: 'Code of conduct and ethical guidelines for all employees and contractors.',
    department: 'Human Resources',
    effectiveDate: '2024-02-01',
    expiresDate: '2025-02-01',
    status: 'Pending'
  },
  {
    id: '4',
    title: 'Information Security Framework',
    description: 'Security policies and procedures for protecting organizational information assets.',
    department: 'IT & Technology',
    effectiveDate: '2024-04-10',
    expiresDate: '2025-04-10',
    status: 'Active'
  },
  {
    id: '5',
    title: 'Risk Management Protocol',
    description: 'Comprehensive risk assessment and management procedures for organizational operations.',
    department: 'Operations',
    effectiveDate: '2023-12-01',
    expiresDate: '2024-12-01',
    status: 'Retired'
  },
  {
    id: '6',
    title: 'Quality Assurance Standards',
    description: 'Quality control measures and standards for service delivery and project management.',
    department: 'Programs',
    effectiveDate: '2024-05-15',
    expiresDate: '2025-05-15',
    status: 'Pending'
  }
];