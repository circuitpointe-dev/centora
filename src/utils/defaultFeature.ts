// src/utils/defaultFeature.ts
import { moduleConfigs } from "@/config/moduleConfigs";

export const getDefaultFeatureForModule = (
  moduleId: string,
  user?: { is_super_admin?: boolean; userType?: string }
) => {
  const cfg = moduleConfigs[moduleId as keyof typeof moduleConfigs];
  if (!cfg) return "dashboard"; // safe fallback

  if (moduleId === "users") {
    const isSuper = !!user?.is_super_admin;
    const list = isSuper ? cfg.superAdminFeatures : cfg.adminFeatures;
    return list?.[0]?.id ?? "dashboard";
  }

  if (moduleId === "grants") {
    const isDonor = user?.userType === "Donor";
    const list = isDonor ? cfg.donorFeatures : cfg.ngoFeatures;
    return list?.[0]?.id ?? "dashboard";
  }

  // LMS modules
  if (moduleId === "lmsAuthor" || moduleId === "lmsAdmin") {
    return cfg.features?.[0]?.id ?? "dashboard";
  }

  // generic modules
  const list = cfg.features;
  return list?.[0]?.id ?? "dashboard";
};
