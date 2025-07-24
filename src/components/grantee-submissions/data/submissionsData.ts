export interface Submission {
  id: string;
  submissionType: string;
  grantName: string;
  organization: string;
  submittedOn: string;
  status: 'Pending review' | 'Revision requested' | 'Approved';
}

export const submissionsData: Submission[] = [
  {
    id: '1',
    submissionType: 'Narrative',
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Pending review'
  },
  {
    id: '2',
    submissionType: 'Financial',
    grantName: 'Rural health initiative',
    organization: 'USAID',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Pending review'
  },
  {
    id: '3',
    submissionType: 'M & E',
    grantName: 'Rural health initiative',
    organization: 'WFP',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Approved'
  },
  {
    id: '4',
    submissionType: 'Financial',
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Revision requested'
  },
  {
    id: '5',
    submissionType: 'M & E',
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Approved'
  },
  {
    id: '6',
    submissionType: 'Narrative',
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Approved'
  },
  {
    id: '7',
    submissionType: 'Financial',
    grantName: 'Rural health initiative',
    organization: 'USAID',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Pending review'
  },
  {
    id: '8',
    submissionType: 'M & E',
    grantName: 'Rural health initiative',
    organization: 'WFP',
    submittedOn: 'Jun 5, 2025 2:40pm',
    status: 'Revision requested'
  }
];