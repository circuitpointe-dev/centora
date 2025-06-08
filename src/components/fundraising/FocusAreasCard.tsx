
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { focusAreasData } from "@/data/focusAreaData";
import { FocusArea } from "@/types/donor";
import { FocusAreaForm } from "./FocusAreaForm";

const FocusAreasCard: React.FC = () => {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(focusAreasData);
  const [editingArea, setEditingArea] = useState<FocusArea | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setFocusAreas(prev => prev.filter(area => area.id !== id));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    const end = new Date(endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    return `${start} - ${end}`;
  };

  const handleCreateSave = (newAreaData: Omit<FocusArea, 'id'>) => {
    const newArea: FocusArea = {
      ...newAreaData,
      id: Date.now().toString(),
    };
    setFocusAreas(prev => [...prev, newArea]);
    setIsCreateDialogOpen(false);
  };

  const handleEditSave = (updatedAreaData: Omit<FocusArea, 'id'>) => {
    if (editingArea) {
      setFocusAreas(prev => 
        prev.map(area => 
          area.id === editingArea.id 
            ? { ...updatedAreaData, id: editingArea.id }
            : area
        )
      );
      setEditingArea(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleEdit = (area: FocusArea) => {
    setEditingArea(area);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
        <CardTitle className="text-lg font-semibold">Focus Areas</CardTitle>
        <SideDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <SideDialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent text-black hover:bg-gray-50 border border-gray-300">
              <Plus className="h-4 w-4" />
              Create Focus Area
            </Button>
          </SideDialogTrigger>
          <SideDialogContent>
            <SideDialogHeader>
              <SideDialogTitle>Create Focus Area</SideDialogTitle>
            </SideDialogHeader>
            <div className="p-6">
              <FocusAreaForm
                onSave={handleCreateSave}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </div>
          </SideDialogContent>
        </SideDialog>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-3">
          {focusAreas.map((area) => (
            <div key={area.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-sm transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${area.color} rounded-sm flex-shrink-0`}>
                    {area.name}
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(area.amount, area.currency)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{area.description}</p>
                <div className="text-xs text-gray-600 mb-2">
                  <span className="font-medium">Funding Period:</span> {formatDateRange(area.fundingStartDate, area.fundingEndDate)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {area.interestTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs px-2 py-0 rounded-sm bg-gray-50 text-gray-600 border-gray-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-3">
                <SideDialog open={isEditDialogOpen && editingArea?.id === area.id} onOpenChange={(open) => {
                  if (!open) {
                    setIsEditDialogOpen(false);
                    setEditingArea(null);
                  }
                }}>
                  <SideDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(area)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </SideDialogTrigger>
                  <SideDialogContent>
                    <SideDialogHeader>
                      <SideDialogTitle>Edit Focus Area</SideDialogTitle>
                    </SideDialogHeader>
                    <div className="p-6">
                      {editingArea && (
                        <FocusAreaForm
                          focusArea={editingArea}
                          onSave={handleEditSave}
                          onCancel={() => {
                            setIsEditDialogOpen(false);
                            setEditingArea(null);
                          }}
                        />
                      )}
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
