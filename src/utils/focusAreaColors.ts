// Helper function to get focus area color by name
export const getFocusAreaColor = (focusAreaName: string): string => {
  // Default colors for common focus areas following the custom instructions
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

export const colorOptions = [
  { value: "bg-blue-100 text-blue-800", label: "Blue", preview: "bg-blue-100" },
  { value: "bg-green-100 text-green-800", label: "Green", preview: "bg-green-100" },
  { value: "bg-orange-100 text-orange-800", label: "Orange", preview: "bg-orange-100" },
  { value: "bg-red-100 text-red-800", label: "Red", preview: "bg-red-100" },
  { value: "bg-purple-100 text-purple-800", label: "Purple", preview: "bg-purple-100" },
  { value: "bg-pink-100 text-pink-800", label: "Pink", preview: "bg-pink-100" },
  { value: "bg-emerald-100 text-emerald-800", label: "Emerald", preview: "bg-emerald-100" },
  { value: "bg-indigo-100 text-indigo-800", label: "Indigo", preview: "bg-indigo-100" },
];