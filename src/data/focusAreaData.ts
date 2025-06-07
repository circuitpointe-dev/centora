
import { FocusArea } from "@/types/donor";

export const focusAreasData: FocusArea[] = [
  {
    id: "1",
    name: "Education",
    description: "Educational programs and initiatives",
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "2", 
    name: "Health",
    description: "Healthcare and medical programs",
    color: "bg-green-100 text-green-800"
  },
  {
    id: "3",
    name: "Infrastructure",
    description: "Infrastructure development projects",
    color: "bg-orange-100 text-orange-800"
  },
  {
    id: "4",
    name: "Emergency Response",
    description: "Emergency and disaster response programs",
    color: "bg-red-100 text-red-800"
  }
];

// Helper function to get focus area color by name
export const getFocusAreaColor = (focusAreaName: string): string => {
  const focusArea = focusAreasData.find(area => 
    area.name.toLowerCase() === focusAreaName.toLowerCase()
  );
  
  if (focusArea) {
    return focusArea.color;
  }
  
  // Default colors for other focus areas
  const colorMap: { [key: string]: string } = {
    'health': 'bg-green-100 text-green-800',
    'education': 'bg-blue-100 text-blue-800',
    'infrastructure': 'bg-orange-100 text-orange-800',
    'emergency response': 'bg-red-100 text-red-800',
    'environment': 'bg-emerald-100 text-emerald-800',
    'gender': 'bg-pink-100 text-pink-800',
    'poverty': 'bg-purple-100 text-purple-800',
    'technology': 'bg-indigo-100 text-indigo-800'
  };
  
  return colorMap[focusAreaName.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
