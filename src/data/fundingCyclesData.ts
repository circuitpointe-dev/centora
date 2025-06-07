
import { FundingCycle } from "@/types/donor";

export const allFundingData: (FundingCycle & { year: number })[] = [
  { 
    name: "FCDO", 
    width: "w-32", 
    position: 1, 
    color: "bg-[#F6B93E]", 
    status: "Upcoming",
    startMonth: 2,
    endMonth: 6,
    description: "Upcoming funding cycle for FCDO starting in March. Expected to support educational initiatives.",
    year: 2024
  },
  { 
    name: "Global Fund", 
    width: "w-[135px]", 
    position: 7, 
    color: "bg-[#A7ADB4]", 
    status: "Closed",
    startMonth: 8,
    endMonth: 11,
    description: "This funding cycle has been closed. No active projects currently funded by Global Fund.",
    year: 2024
  },
  { 
    name: "UNICEF", 
    width: "w-[262px]", 
    position: 3, 
    color: "bg-[#3AA072]", 
    status: "Ongoing",
    startMonth: 4,
    endMonth: 9,
    description: "Active funding from UNICEF supporting child health initiatives from May through October.",
    year: 2024
  },
  { 
    name: "UNISEF", 
    width: "w-[216px]", 
    position: 5, 
    color: "bg-[#3AA072]", 
    status: "Ongoing",
    startMonth: 6,
    endMonth: 10,
    description: "Current UNISEF funding for educational programs running from July to November.",
    year: 2024
  },
  { 
    name: "USAID", 
    width: "w-[321px]", 
    position: 0, 
    color: "bg-[#F6B93E]", 
    status: "Upcoming",
    startMonth: 1,
    endMonth: 7,
    description: "Upcoming USAID funding cycle for infrastructure development beginning in February.",
    year: 2024
  },
  { 
    name: "WHO", 
    width: "w-[180px]", 
    position: 2, 
    color: "bg-[#3AA072]", 
    status: "Ongoing",
    startMonth: 3,
    endMonth: 7,
    description: "Current WHO funding for pandemic preparedness initiatives in the region.",
    year: 2024
  },
  { 
    name: "Gates Foundation", 
    width: "w-[200px]", 
    position: 4, 
    color: "bg-[#F6B93E]", 
    status: "Upcoming",
    startMonth: 5,
    endMonth: 9,
    description: "Upcoming funding from Gates Foundation for vaccine distribution programs.",
    year: 2024
  },
  // Adding data for 2023
  { 
    name: "FCDO", 
    width: "w-[180px]", 
    position: 2, 
    color: "bg-[#A7ADB4]", 
    status: "Closed",
    startMonth: 3,
    endMonth: 8,
    description: "Past FCDO funding cycle that ended in August 2023.",
    year: 2023
  },
  { 
    name: "UNICEF", 
    width: "w-[240px]", 
    position: 0, 
    color: "bg-[#A7ADB4]", 
    status: "Closed",
    startMonth: 1,
    endMonth: 6,
    description: "Past UNICEF funding for healthcare initiatives that concluded in June 2023.",
    year: 2023
  },
  { 
    name: "Gates Foundation", 
    width: "w-[300px]", 
    position: 1, 
    color: "bg-[#A7ADB4]", 
    status: "Closed",
    startMonth: 5,
    endMonth: 12,
    description: "Completed Gates Foundation funding from 2023 for vaccine research.",
    year: 2023
  },
  // Adding data for 2025
  { 
    name: "WHO", 
    width: "w-[240px]", 
    position: 0, 
    color: "bg-[#F6B93E]", 
    status: "Upcoming",
    startMonth: 1,
    endMonth: 7,
    description: "Planned WHO funding for 2025 health initiatives.",
    year: 2025
  },
  { 
    name: "UNICEF", 
    width: "w-[180px]", 
    position: 1, 
    color: "bg-[#F6B93E]", 
    status: "Upcoming",
    startMonth: 4,
    endMonth: 9,
    description: "Projected UNICEF funding for 2025 educational programs.",
    year: 2025
  }
];

export const availableYears = [2023, 2024, 2025, 2026];

export const statusLegend = [
  { status: "Ongoing", color: "bg-[#3AA072]" },
  { status: "Upcoming", color: "bg-[#F6B93E]" },
  { status: "Closed", color: "bg-[#A7ADB4]" },
];

export const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
