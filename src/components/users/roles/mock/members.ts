// src/components/users/roles/mock/members.ts

export interface Member {
  id: string;
  fullName: string;
  email: string;
  status: 'Active' | 'Suspended';
}

export const ROLE_MEMBERS: Record<string, Member[]> = {
  'super-admin': [
    { id: 'm1', fullName: 'Adaeze Okafor', email: 'adaeze@centora.io', status: 'Active' },
    { id: 'm2', fullName: 'Kelechi Nwosu', email: 'kelechi@centora.io', status: 'Active' },
    { id: 'm3', fullName: 'Yinka Adesina', email: 'yinka@centora.io', status: 'Active' },
  ],
  'support-admin': [
    { id: 'm4', fullName: 'Tari Ibim', email: 'tari@centora.io', status: 'Active' },
    { id: 'm5', fullName: 'Boma Briggs', email: 'boma@centora.io', status: 'Suspended' },
  ],
  'billing-admin': [
    { id: 'm6', fullName: 'Seyi Odu', email: 'seyi@centora.io', status: 'Active' },
  ],
  'client-admin': [
    { id: 'm7', fullName: 'Chioma Umeh', email: 'chioma@client.org', status: 'Active' },
  ],
  'client-user': [
    { id: 'm8', fullName: 'Ifeanyi O.', email: 'ifeanyi@client.org', status: 'Active' },
    { id: 'm9', fullName: 'Halima B.', email: 'halima@client.org', status: 'Active' },
  ],
  'client-viewer': [
    { id: 'm10', fullName: 'Kunle A.', email: 'kunle@client.org', status: 'Active' },
  ],
};
