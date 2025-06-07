
export interface GivingHistoryData {
  year: number;
  monthlyData: {
    month: string;
    amount: number;
    height: string;
    color: string;
  }[];
}

export const givingHistoryData: GivingHistoryData[] = [
  {
    year: 2024,
    monthlyData: [
      { month: "Jan", amount: 25000, height: "h-[107px]", color: "bg-[#9f9ff8]" },
      { month: "Feb", amount: 35000, height: "h-[189px]", color: "bg-[#96e2d6]" },
      { month: "Mar", amount: 20000, height: "h-[123px]", color: "bg-black" },
      { month: "Apr", amount: 40000, height: "h-[209px]", color: "bg-[#92bfff]" },
      { month: "May", amount: 15000, height: "h-[77px]", color: "bg-[#aec7ed]" },
      { month: "Jun", amount: 30000, height: "h-[156px]", color: "bg-[#94e9b8]" },
      { month: "Jul", amount: 25000, height: "h-[107px]", color: "bg-[#9f9ff8]" },
      { month: "Aug", amount: 35000, height: "h-[189px]", color: "bg-[#96e2d6]" },
      { month: "Sep", amount: 20000, height: "h-[123px]", color: "bg-black" },
      { month: "Oct", amount: 40000, height: "h-[209px]", color: "bg-[#92bfff]" },
      { month: "Nov", amount: 15000, height: "h-[77px]", color: "bg-[#aec7ed]" },
      { month: "Dec", amount: 30000, height: "h-[156px]", color: "bg-[#94e9b8]" },
    ]
  },
  {
    year: 2023,
    monthlyData: [
      { month: "Jan", amount: 20000, height: "h-[87px]", color: "bg-[#9f9ff8]" },
      { month: "Feb", amount: 30000, height: "h-[169px]", color: "bg-[#96e2d6]" },
      { month: "Mar", amount: 18000, height: "h-[103px]", color: "bg-black" },
      { month: "Apr", amount: 35000, height: "h-[189px]", color: "bg-[#92bfff]" },
      { month: "May", amount: 12000, height: "h-[57px]", color: "bg-[#aec7ed]" },
      { month: "Jun", amount: 28000, height: "h-[136px]", color: "bg-[#94e9b8]" },
      { month: "Jul", amount: 22000, height: "h-[87px]", color: "bg-[#9f9ff8]" },
      { month: "Aug", amount: 32000, height: "h-[169px]", color: "bg-[#96e2d6]" },
      { month: "Sep", amount: 19000, height: "h-[103px]", color: "bg-black" },
      { month: "Oct", amount: 37000, height: "h-[189px]", color: "bg-[#92bfff]" },
      { month: "Nov", amount: 14000, height: "h-[57px]", color: "bg-[#aec7ed]" },
      { month: "Dec", amount: 29000, height: "h-[136px]", color: "bg-[#94e9b8]" },
    ]
  },
  {
    year: 2022,
    monthlyData: [
      { month: "Jan", amount: 18000, height: "h-[67px]", color: "bg-[#9f9ff8]" },
      { month: "Feb", amount: 25000, height: "h-[149px]", color: "bg-[#96e2d6]" },
      { month: "Mar", amount: 16000, height: "h-[83px]", color: "bg-black" },
      { month: "Apr", amount: 30000, height: "h-[169px]", color: "bg-[#92bfff]" },
      { month: "May", amount: 10000, height: "h-[37px]", color: "bg-[#aec7ed]" },
      { month: "Jun", amount: 24000, height: "h-[116px]", color: "bg-[#94e9b8]" },
      { month: "Jul", amount: 20000, height: "h-[67px]", color: "bg-[#9f9ff8]" },
      { month: "Aug", amount: 27000, height: "h-[149px]", color: "bg-[#96e2d6]" },
      { month: "Sep", amount: 17000, height: "h-[83px]", color: "bg-black" },
      { month: "Oct", amount: 32000, height: "h-[169px]", color: "bg-[#92bfff]" },
      { month: "Nov", amount: 12000, height: "h-[37px]", color: "bg-[#aec7ed]" },
      { month: "Dec", amount: 26000, height: "h-[116px]", color: "bg-[#94e9b8]" },
    ]
  }
];
