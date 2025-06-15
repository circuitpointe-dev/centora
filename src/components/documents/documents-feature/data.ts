
export interface Document {
  id: string;
  fileName: string;
  addedTime: string;
  owner: {
    name: string;
    avatar: string;
  };
  tags: { name: string; bgColor: string; textColor: string }[];
}

export const documentsData: Document[] = [
  {
    id: '1',
    fileName: 'Company_Policy_and_Procedures_Handbook.pdf',
    addedTime: 'Added 2 days ago',
    owner: {
      name: 'Millicent ERP',
      avatar: 'https://github.com/shadcn.png',
    },
    tags: [
      { name: 'HR', bgColor: 'bg-[#f9e6fd]', textColor: 'text-[#cb27f5]' },
      { name: 'Contract', bgColor: 'bg-[#e8fbef]', textColor: 'text-[#17a34b]' },
    ],
  },
  {
    id: '2',
    fileName: 'Q3_Financial_Report.xlsx',
    addedTime: 'Added 5 days ago',
    owner: {
      name: 'John Doe',
      avatar: 'https://github.com/shadcn.png',
    },
    tags: [
      { name: 'Finance', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      { name: 'Report', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    ],
  },
  {
    id: '3',
    fileName: 'Marketing_Campaign_Brief.docx',
    addedTime: 'Added 1 week ago',
    owner: {
      name: 'Jane Smith',
      avatar: 'https://github.com/shadcn.png',
    },
    tags: [
      { name: 'Marketing', bgColor: 'bg-pink-100', textColor: 'text-pink-800' },
      { name: 'Brief', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
      { name: 'Urgent', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    ],
  },
  {
    id: '4',
    fileName: 'Project_Alpha_Specification.pdf',
    addedTime: 'Added 2 weeks ago',
    owner: {
      name: 'Peter Jones',
      avatar: 'https://github.com/shadcn.png',
    },
    tags: [
      { name: 'Project', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      { name: 'Specs', bgColor: 'bg-gray-200', textColor: 'text-gray-800' },
    ],
  },
  {
    id: '5',
    fileName: 'Onboarding_Presentation.pptx',
    addedTime: 'Added 1 month ago',
    owner: {
      name: 'Millicent ERP',
      avatar: 'https://github.com/shadcn.png',
    },
    tags: [
      { name: 'HR', bgColor: 'bg-[#f9e6fd]', textColor: 'text-[#cb27f5]' },
      { name: 'Onboarding', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    ],
  },
  {
    id: '6',
    fileName: 'Legal_Agreement_V2.pdf',
    addedTime: 'Added 1 month ago',
    owner: {
      name: 'Sarah Miller',
      avatar: 'https://github.com/shadcn.png',
    },
    tags: [
      { name: 'Legal', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
      { name: 'Agreement', bgColor: 'bg-gray-200', textColor: 'text-gray-800' },
    ],
  },
];
