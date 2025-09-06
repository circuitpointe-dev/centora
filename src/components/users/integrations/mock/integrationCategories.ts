import { IntegrationCategory } from './types';

export const integrationCategories: IntegrationCategory[] = [
  {
    id: 'document-storage',
    name: 'Document Storage',
    description: 'Connect your document storage platforms for seamless file management',
    icon: 'FileText',
    providerCount: 4
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Integrate with accounting software for financial data sync',
    icon: 'Calculator',
    providerCount: 4
  },
  {
    id: 'survey-tools',
    name: 'Survey Tools',
    description: 'Connect survey platforms to collect and analyze feedback',
    icon: 'ClipboardList',
    providerCount: 4
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Integrate communication tools for team collaboration',
    icon: 'MessageSquare',
    providerCount: 4
  }
];