
export const getFeatureName = (featureId: string) => {
  // Convert kebab-case to Title Case
  return featureId?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';
};

export const getModuleName = (moduleId: string) => {
  const moduleNames: { [key: string]: string } = {
    fundraising: 'Fundraising',
    programme: 'Programme Management',
    procurement: 'Procurement',
    inventory: 'Inventory Management',
    finance: 'Finance & Control',
    learning: 'Learning Management',
    documents: 'Document Management',
    hr: 'HR Management',
    users: 'User Management',
    grants: 'Grants Management',
  };
  return moduleNames[moduleId] || moduleId;
};
