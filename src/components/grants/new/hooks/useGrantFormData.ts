
import { useState } from 'react';

export interface GrantFormData {
  overview: {
    grantName: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    amount: string;
    currency: string;
    grantManager: string;
    fiduciaryOfficer: string;
    grantAdministrator: string;
  };
  granteeDetails: {
    granteeName: string;
    granteeRefId: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
  };
  granteeSubmission: {
    narrativeReports: Array<{ title: string; status: string }>;
    financialReports: Array<{ title: string; status: string }>;
    meReports: Array<{ title: string; status: string }>;
    customReportTypes: Array<{
      name: string;
      reports: Array<{ title: string; status: string }>;
    }>;
  };
  reportingSchedule: {
    frequency: string;
    periodStart: Date | undefined;
    periodEnd: Date | undefined;
    reportingPeriods: Array<{
      label: string;
      submissionType: string;
      dueDate: Date | undefined;
      assignedReviewer: string;
    }>;
  };
  complianceChecklist: {
    complianceRequirements: Array<{
      name: string;
      dueDate: Date | undefined;
      status: string;
    }>;
  };
  disbursementSchedule: {
    disbursements: Array<{
      amount: number;
      disbursementDate: Date | undefined;
    }>;
  };
}

const initialFormData: GrantFormData = {
  overview: {
    grantName: '',
    startDate: undefined,
    endDate: undefined,
    amount: '',
    currency: 'USD',
    grantManager: '',
    fiduciaryOfficer: '',
    grantAdministrator: '',
  },
  granteeDetails: {
    granteeName: '',
    granteeRefId: 'GR-0001',
    contactPerson: '',
    email: '',
    phoneNumber: '',
  },
  granteeSubmission: {
    narrativeReports: [],
    financialReports: [],
    meReports: [],
    customReportTypes: [],
  },
  reportingSchedule: {
    frequency: '',
    periodStart: undefined,
    periodEnd: undefined,
    reportingPeriods: [],
  },
  complianceChecklist: {
    complianceRequirements: [],
  },
  disbursementSchedule: {
    disbursements: [],
  },
};

export const useGrantFormData = () => {
  const [formData, setFormData] = useState<GrantFormData>(initialFormData);

  const updateFormData = (section: keyof GrantFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  return {
    formData,
    updateFormData,
  };
};
