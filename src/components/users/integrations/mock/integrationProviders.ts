import { IntegrationProvider } from './types';

export const integrationProviders: IntegrationProvider[] = [
  // Document Storage
  {
    id: 'sharepoint',
    name: 'SharePoint',
    categoryId: 'document-storage',
    description: 'Microsoft SharePoint for enterprise document management',
    icon: 'Building2',
    company: 'Microsoft',
    isConnected: true,
    lastSync: '2024-01-15T10:30:00Z',
    features: ['Document sync', 'Version control', 'Permissions management'],
    connectionType: 'oauth'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    categoryId: 'document-storage',
    description: 'Google Drive for cloud storage and collaboration',
    icon: 'Cloud',
    company: 'Google',
    isConnected: false,
    features: ['File sync', 'Real-time collaboration', 'Version history'],
    connectionType: 'oauth'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    categoryId: 'document-storage',
    description: 'Dropbox for secure file storage and sharing',
    icon: 'Box',
    company: 'Dropbox',
    isConnected: false,
    features: ['File sync', 'Smart sync', 'File recovery'],
    connectionType: 'oauth'
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    categoryId: 'document-storage',
    description: 'Microsoft OneDrive for personal and business storage',
    icon: 'HardDrive',
    company: 'Microsoft',
    isConnected: false,
    features: ['File sync', 'Office integration', 'Backup'],
    connectionType: 'oauth'
  },
  // Accounting
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    categoryId: 'accounting',
    description: 'QuickBooks for comprehensive accounting management',
    icon: 'BookOpen',
    company: 'Intuit',
    isConnected: false,
    features: ['Financial reporting', 'Invoice management', 'Tax preparation'],
    connectionType: 'oauth'
  },
  {
    id: 'xero',
    name: 'Xero',
    categoryId: 'accounting',
    description: 'Xero for beautiful accounting software',
    icon: 'Calculator',
    company: 'Xero',
    isConnected: false,
    features: ['Bank reconciliation', 'Expense tracking', 'Payroll'],
    connectionType: 'oauth'
  },
  {
    id: 'sage',
    name: 'Sage',
    categoryId: 'accounting',
    description: 'Sage for business management solutions',
    icon: 'TrendingUp',
    company: 'Sage',
    isConnected: false,
    features: ['Accounting', 'Payroll', 'HR management'],
    connectionType: 'api-key'
  },
  {
    id: 'freshbooks',
    name: 'FreshBooks',
    categoryId: 'accounting',
    description: 'FreshBooks for time tracking and invoicing',
    icon: 'Receipt',
    company: 'FreshBooks',
    isConnected: false,
    features: ['Time tracking', 'Invoice management', 'Expense tracking'],
    connectionType: 'oauth'
  },
  // Survey Tools
  {
    id: 'surveymonkey',
    name: 'SurveyMonkey',
    categoryId: 'survey-tools',
    description: 'SurveyMonkey for powerful survey creation and analysis',
    icon: 'BarChart3',
    company: 'SurveyMonkey',
    isConnected: false,
    features: ['Survey creation', 'Response analysis', 'Data export'],
    connectionType: 'oauth'
  },
  {
    id: 'typeform',
    name: 'Typeform',
    categoryId: 'survey-tools',
    description: 'Typeform for engaging forms and surveys',
    icon: 'FileQuestion',
    company: 'Typeform',
    isConnected: false,
    features: ['Interactive forms', 'Logic jumps', 'Custom branding'],
    connectionType: 'oauth'
  },
  {
    id: 'google-forms',
    name: 'Google Forms',
    categoryId: 'survey-tools',
    description: 'Google Forms for simple form creation',
    icon: 'FileText',
    company: 'Google',
    isConnected: false,
    features: ['Form creation', 'Response collection', 'Google Sheets integration'],
    connectionType: 'oauth'
  },
  {
    id: 'microsoft-forms',
    name: 'Microsoft Forms',
    categoryId: 'survey-tools',
    description: 'Microsoft Forms for quick surveys and polls',
    icon: 'ClipboardCheck',
    company: 'Microsoft',
    isConnected: false,
    features: ['Form creation', 'Real-time responses', 'Excel integration'],
    connectionType: 'oauth'
  },
  // Communication
  {
    id: 'slack',
    name: 'Slack',
    categoryId: 'communication',
    description: 'Slack for team communication and collaboration',
    icon: 'MessageCircle',
    company: 'Slack',
    isConnected: false,
    features: ['Channels', 'Direct messaging', 'File sharing'],
    connectionType: 'oauth'
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    categoryId: 'communication',
    description: 'Microsoft Teams for meetings and collaboration',
    icon: 'Users',
    company: 'Microsoft',
    isConnected: false,
    features: ['Video meetings', 'Chat', 'File collaboration'],
    connectionType: 'oauth'
  },
  {
    id: 'discord',
    name: 'Discord',
    categoryId: 'communication',
    description: 'Discord for community communication',
    icon: 'Gamepad2',
    company: 'Discord',
    isConnected: false,
    features: ['Voice channels', 'Text chat', 'Server management'],
    connectionType: 'webhook'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    categoryId: 'communication',
    description: 'Zoom for video conferencing and webinars',
    icon: 'Video',
    company: 'Zoom',
    isConnected: false,
    features: ['Video meetings', 'Webinars', 'Recording'],
    connectionType: 'oauth'
  }
];