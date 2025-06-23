
// Updated data for Proposals Turnaround Time
export const turnaroundData = [
  { stage: "Drafting", days: 12 },
  { stage: "Internal Review", days: 8 },
  { stage: "Donor Response", days: 25 },
];

// Updated colors and data for Donor Segmentation
export const PIE_COLORS = ["#22C55E", "#3B82F6", "#F59E42", "#A78BFA"];

export const donorSegmentationData = {
  Type: [
    { name: "Individual", value: 45 },
    { name: "Corporate", value: 30 },
    { name: "NGOs", value: 15 },
    { name: "Government", value: 10 },
  ],
  Sector: [
    { name: "Government", value: 40 },
    { name: "Private Foundation", value: 35 },
    { name: "Corporate", value: 25 },
  ],
  Geography: [
    { name: "Africa", value: 50 },
    { name: "Europe", value: 25 },
    { name: "America", value: 15 },
    { name: "Asia", value: 10 },
  ],
  "Interest Tags": [
    { name: "Health", value: 35 },
    { name: "Education", value: 25 },
    { name: "Girls", value: 20 },
    { name: "Environment", value: 20 },
  ],
};

// Updated data for Funding Raised
export const fundingRaisedData = {
  Sector: [
    { category: "Health", value: 450000 },
    { category: "Education", value: 320000 },
    { category: "Environment", value: 280000 },
    { category: "Agriculture", value: 190000 },
    { category: "Technology", value: 150000 },
    { category: "Gender", value: 120000 },
  ],
  "Donor Type": [
    { category: "Individual", value: 380000 },
    { category: "Corporate", value: 420000 },
    { category: "NGOs", value: 180000 },
    { category: "Government", value: 520000 },
  ],
  Teams: [
    { category: "Team Alpha", value: 340000 },
    { category: "Team Beta", value: 290000 },
    { category: "Team Gamma", value: 380000 },
    { category: "Team Delta", value: 240000 },
  ],
};

// Updated data for Proposal Activity - full year data
export const proposalActivityData: Record<string, any> = {
  2025: {
    Donor: [
      { month: "Jan", total: 100, submitted: 65, drafted: 50, approved: 30 },
      { month: "Feb", total:  95, submitted: 60, drafted: 45, approved: 28 },
      { month: "Mar", total:  98, submitted: 62, drafted: 48, approved: 29 },
      { month: "Apr", total: 101, submitted: 64, drafted: 49, approved: 31 },
      { month: "May", total: 105, submitted: 70, drafted: 55, approved: 35 },
      { month: "Jun", total: 110, submitted: 75, drafted: 60, approved: 38 },
      { month: "Jul", total: 108, submitted: 72, drafted: 58, approved: 37 },
      { month: "Aug", total: 112, submitted: 78, drafted: 64, approved: 40 },
      { month: "Sep", total: 115, submitted: 80, drafted: 65, approved: 42 },
      { month: "Oct", total: 118, submitted: 82, drafted: 68, approved: 45 },
      { month: "Nov", total: 110, submitted: 75, drafted: 60, approved: 36 },
      { month: "Dec", total: 120, submitted: 85, drafted: 70, approved: 50 },
    ],
    Sector: [
      { month: "Jan", total:  90, submitted: 55, drafted: 40, approved: 25 },
      { month: "Feb", total:  92, submitted: 58, drafted: 43, approved: 27 },
      { month: "Mar", total:  95, submitted: 60, drafted: 45, approved: 28 },
      { month: "Apr", total:  98, submitted: 62, drafted: 48, approved: 30 },
      { month: "May", total: 100, submitted: 65, drafted: 50, approved: 32 },
      { month: "Jun", total: 105, submitted: 68, drafted: 53, approved: 35 },
      { month: "Jul", total: 102, submitted: 66, drafted: 52, approved: 33 },
      { month: "Aug", total: 108, submitted: 72, drafted: 58, approved: 38 },
      { month: "Sep", total: 110, submitted: 75, drafted: 60, approved: 40 },
      { month: "Oct", total: 112, submitted: 78, drafted: 62, approved: 42 },
      { month: "Nov", total: 106, submitted: 70, drafted: 55, approved: 36 },
      { month: "Dec", total: 115, submitted: 80, drafted: 65, approved: 45 },
    ],
  },
    
  2024: {
    Donor: [
      { month: "Jan", total: 95, submitted: 60, drafted: 45, approved: 28 },
      { month: "Feb", total: 84, submitted: 53, drafted: 38, approved: 20 },
      { month: "Mar", total: 90, submitted: 62, drafted: 42, approved: 25 },
      { month: "Apr", total: 88, submitted: 50, drafted: 35, approved: 28 },
      { month: "May", total: 93, submitted: 65, drafted: 48, approved: 31 },
      { month: "Jun", total: 100, submitted: 70, drafted: 52, approved: 25 },
      { month: "Jul", total: 87, submitted: 55, drafted: 40, approved: 22 },
      { month: "Aug", total: 92, submitted: 58, drafted: 43, approved: 26 },
      { month: "Sep", total: 96, submitted: 63, drafted: 47, approved: 29 },
      { month: "Oct", total: 101, submitted: 72, drafted: 55, approved: 33 },
      { month: "Nov", total: 89, submitted: 56, drafted: 41, approved: 24 },
      { month: "Dec", total: 94, submitted: 61, drafted: 44, approved: 27 },
    ],
    Sector: [
      { month: "Jan", total: 85, submitted: 55, drafted: 40, approved: 25 },
      { month: "Feb", total: 92, submitted: 58, drafted: 43, approved: 22 },
      { month: "Mar", total: 88, submitted: 60, drafted: 38, approved: 28 },
      { month: "Apr", total: 95, submitted: 52, drafted: 40, approved: 30 },
      { month: "May", total: 87, submitted: 62, drafted: 45, approved: 27 },
      { month: "Jun", total: 98, submitted: 68, drafted: 48, approved: 29 },
      { month: "Jul", total: 83, submitted: 51, drafted: 37, approved: 21 },
      { month: "Aug", total: 90, submitted: 57, drafted: 42, approved: 25 },
      { month: "Sep", total: 94, submitted: 64, drafted: 46, approved: 28 },
      { month: "Oct", total: 99, submitted: 70, drafted: 53, approved: 32 },
      { month: "Nov", total: 86, submitted: 54, drafted: 39, approved: 23 },
      { month: "Dec", total: 91, submitted: 59, drafted: 43, approved: 26 },
    ],
  },
  2023: [
    { month: "Jan", total: 105, submitted: 68, drafted: 55, approved: 32 },
    { month: "Feb", total: 89, submitted: 56, drafted: 42, approved: 24 },
    { month: "Mar", total: 96, submitted: 64, drafted: 48, approved: 30 },
    { month: "Apr", total: 82, submitted: 48, drafted: 38, approved: 26 },
    { month: "May", total: 101, submitted: 72, drafted: 58, approved: 35 },
    { month: "Jun", total: 94, submitted: 65, drafted: 50, approved: 28 },
    { month: "Jul", total: 91, submitted: 59, drafted: 45, approved: 25 },
    { month: "Aug", total: 87, submitted: 53, drafted: 41, approved: 23 },
    { month: "Sep", total: 99, submitted: 67, drafted: 52, approved: 31 },
    { month: "Oct", total: 93, submitted: 61, drafted: 47, approved: 27 },
    { month: "Nov", total: 88, submitted: 54, drafted: 42, approved: 24 },
    { month: "Dec", total: 95, submitted: 63, drafted: 49, approved: 29 },
  ],
  2022: [
    { month: "Jan", total: 78, submitted: 48, drafted: 38, approved: 22 },
    { month: "Feb", total: 85, submitted: 52, drafted: 41, approved: 19 },
    { month: "Mar", total: 82, submitted: 55, drafted: 35, approved: 24 },
    { month: "Apr", total: 89, submitted: 47, drafted: 37, approved: 26 },
    { month: "May", total: 76, submitted: 58, drafted: 42, approved: 21 },
    { month: "Jun", total: 91, submitted: 62, drafted: 46, approved: 25 },
    { month: "Jul", total: 84, submitted: 51, drafted: 39, approved: 20 },
    { month: "Aug", total: 88, submitted: 54, drafted: 43, approved: 23 },
    { month: "Sep", total: 93, submitted: 59, drafted: 47, approved: 27 },
    { month: "Oct", total: 86, submitted: 56, drafted: 41, approved: 24 },
    { month: "Nov", total: 81, submitted: 49, drafted: 38, approved: 21 },
    { month: "Dec", total: 87, submitted: 53, drafted: 42, approved: 25 },
  ],
};

// Get available years (current year and previous years)
const currentYear = new Date().getFullYear();
export const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
