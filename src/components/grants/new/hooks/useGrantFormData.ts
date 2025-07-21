
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
    organization: string;
    granteeRefId: string;
    region: string;
    programArea: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
    documents: Array<{
      type: string;
      name: string;
      url?: string;
      file?: File;
    }>;
  };
  granteeSubmission: {
    submissionTypes: Array<{
      id: string;
      name: string;
      enabled: boolean;
      isCustom?: boolean;
    }>;
    reportEntries: Array<{
      id: string;
      submissionType: string;
      reportingPeriod: string;
      dueDate: string;
      assignedReviewer: string;
    }>;
    frequency: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
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
    organization: '',
    granteeRefId: 'GR-0001',
    region: '',
    programArea: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    documents: [],
  },
  granteeSubmission: {
    submissionTypes: [],
    reportEntries: [],
    frequency: '',
    startDate: undefined,
    endDate: undefined,
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
