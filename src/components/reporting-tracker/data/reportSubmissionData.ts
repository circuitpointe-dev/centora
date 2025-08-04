export interface ReportSubmissionData {
  id: string;
  reportType: 'Narrative' | 'Financial' | 'M&E' | 'Report' | 'Other';
  status: 'Approved' | 'Pending review' | 'Not submitted' | 'Awaiting reviewer feedback';
  comments: string;
  action: 'View' | 'Resubmit' | 'Submit';
}

export interface PeriodData {
  id: string;
  name: string;
  dateRange: string;
  reports: ReportSubmissionData[];
}

export interface GrantSubmissionData {
  id: string;
  grantName: string;
  organization: string;
  periods: PeriodData[];
}

export const reportSubmissionData: GrantSubmissionData[] = [
  {
    id: '1',
    grantName: 'Rural health initiative',
    organization: 'Health Care Foundation',
    periods: [
      {
        id: 'period1',
        name: 'Period 1',
        dateRange: 'Jan 1, 2025 - Jun 30, 2025',
        reports: [
          {
            id: 'r1-n',
            reportType: 'Narrative',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          },
          {
            id: 'r1-f',
            reportType: 'Financial',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          },
          {
            id: 'r1-m',
            reportType: 'M&E',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          },
          {
            id: 'r1-r',
            reportType: 'Report',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          },
          {
            id: 'r1-o',
            reportType: 'Other',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          }
        ]
      },
      {
        id: 'period2',
        name: 'Period 2',
        dateRange: 'Apr 1, 2025 - Apr 30, 2025',
        reports: [
          {
            id: 'r2-n',
            reportType: 'Narrative',
            status: 'Pending review',
            comments: 'No comments',
            action: 'Resubmit'
          },
          {
            id: 'r2-f',
            reportType: 'Financial',
            status: 'Pending review',
            comments: 'No comments',
            action: 'Resubmit'
          },
          {
            id: 'r2-m',
            reportType: 'M&E',
            status: 'Pending review',
            comments: 'No comments',
            action: 'Resubmit'
          },
          {
            id: 'r2-r',
            reportType: 'Report',
            status: 'Pending review',
            comments: 'No comments',
            action: 'Resubmit'
          },
          {
            id: 'r2-o',
            reportType: 'Other',
            status: 'Pending review',
            comments: 'No comments',
            action: 'Resubmit'
          }
        ]
      },
      {
        id: 'period3',
        name: 'Period 3',
        dateRange: 'Apr 1, 2025 - Apr 30, 2025',
        reports: [
          {
            id: 'r3-n',
            reportType: 'Narrative',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r3-f',
            reportType: 'Financial',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r3-m',
            reportType: 'M&E',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r3-r',
            reportType: 'Report',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r3-o',
            reportType: 'Other',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    grantName: 'Literacy for all program',
    organization: 'Education Foundation',
    periods: [
      {
        id: 'period1-2',
        name: 'Period 1',
        dateRange: 'Jan 1, 2025 - Jun 30, 2025',
        reports: [
          {
            id: 'r1-n-2',
            reportType: 'Narrative',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          },
          {
            id: 'r1-f-2',
            reportType: 'Financial',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          },
          {
            id: 'r1-m-2',
            reportType: 'M&E',
            status: 'Pending review',
            comments: 'No comments',
            action: 'Resubmit'
          },
          {
            id: 'r1-r-2',
            reportType: 'Report',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          },
          {
            id: 'r1-o-2',
            reportType: 'Other',
            status: 'Approved',
            comments: 'No comments',
            action: 'View'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    grantName: 'Green energy transition',
    organization: 'Environment Foundation',
    periods: [
      {
        id: 'period1-3',
        name: 'Period 1',
        dateRange: 'Jan 1, 2025 - Jun 30, 2025',
        reports: [
          {
            id: 'r1-n-3',
            reportType: 'Narrative',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r1-f-3',
            reportType: 'Financial',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r1-m-3',
            reportType: 'M&E',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r1-r-3',
            reportType: 'Report',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          },
          {
            id: 'r1-o-3',
            reportType: 'Other',
            status: 'Not submitted',
            comments: 'Awaiting reviewer feedback',
            action: 'Submit'
          }
        ]
      }
    ]
  }
];