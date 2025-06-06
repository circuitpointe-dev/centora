
export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
}

export const staffList: Staff[] = [
  {
    id: '1',
    name: 'Chioma Ike',
    role: 'NGO Manager',
    email: 'chioma.ike@ngo.org'
  },
  {
    id: '2',
    name: 'Cynthia Agatha',
    role: 'Project Manager',
    email: 'cynthia.agatha@ngo.org'
  },
  {
    id: '3',
    name: 'Chima Uno',
    role: 'Finance Officer',
    email: 'chima.uno@ngo.org'
  },
  {
    id: '4',
    name: 'Chukwueze Ami',
    role: 'M & E Officer',
    email: 'chukwueze.ami@ngo.org'
  },
  {
    id: '5',
    name: 'Mary Uzo',
    role: 'Executive Director',
    email: 'mary.uzo@ngo.org'
  }
];
