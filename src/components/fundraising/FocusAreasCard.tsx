
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { focusAreasData } from "@/data/focusAreaData";
import { FocusArea } from "@/types/donor";

const FocusAreasCard: React.FC = () => {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(focusAreasData);

  const handleDelete = (id: string) => {
    setFocusAreas(prev => prev.filter(area => area.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock donation amounts for focus areas
  const getDonationAmount = (id: string) => {
    const amounts: { [key: string]: number } = {
      "1": 450000,
      "2": 320000, 
      "3": 280000,
      "4": 150000
    };
    return amounts[id] || 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Focus Areas</CardTitle>
        <SideDialog>
          <SideDialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Focus Area
            </Button>
          </SideDialogTrigger>
          <SideDialogContent>
            <SideDialogHeader>
              <SideDialogTitle>Create Focus Area</SideDialogTitle>
            </SideDialogHeader>
            <div className="p-6">
              <p className="text-gray-600">Focus area creation form will be implemented here.</p>
            </div>
          </SideDialogContent>
        </SideDialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {focusAreas.map((area) => (
            <div key={area.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={area.color}>
                    {area.name}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(getDonationAmount(area.id))}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{area.description}</p>
              </div>
              <div className="flex gap-2">
                <SideDialog>
                  <SideDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </SideDialogTrigger>
                  <SideDialogContent>
                    <SideDialogHeader>
                      <SideDialogTitle>Edit Focus Area</SideDialogTitle>
                    </SideDialogHeader>
                    <div className="p-6">
                      <p className="text-gray-600">Edit focus area form for {area.name} will be implemented here.</p>
                    </div>
                  </SideDialogContent>
                </SideDialog>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(area.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusAreasCard;
