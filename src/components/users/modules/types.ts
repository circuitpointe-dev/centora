// src/components/users/modules/types.ts
export interface ModuleFeatureState {
  [moduleId: string]: { [featureId: string]: boolean };
}

export interface PerModuleSettings {
  [moduleId: string]: {
    accessControl: string;
    notifications: boolean;
    autoAssignNewUsers: boolean;
    assignHRManager: boolean;
  };
}

export type GeneralSettings = {
  timeZone: string;
  dateFormat: string;
  language: string;
  weekStart: string;

  notifSystem: boolean;
  notifEmail: boolean;
  notifReminders: boolean;
  notifMobile: boolean;
  notifFrequency: string;

  passwordComplexity: boolean;
  passwordExpiration: boolean;
  twoFactor: boolean;
  sessionTimeout: string;
};
