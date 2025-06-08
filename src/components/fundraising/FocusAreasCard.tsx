import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { useToast } from "@/hooks/use-toast";
import { focusAreasData } from "@/data/focusAreaData";
import { FocusArea } from "@/types/donor";
import { FocusAreaForm } from "./FocusAreaForm";

const FocusAreasCard: React.FC = () => {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(focusAreasData);
  const [editingArea, setEditingArea] = useState<FocusArea | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setFocusAreas(prev => prev.filter(area => area.id !== id));
    toast({
      title: "Focus Area Deleted",
      description: "The focus area has been successfully deleted.",
    });
  };

  const handleCreateSave = (newAreaData: Omit<FocusArea, 'id'>) => {
    const newArea: FocusArea = {
      ...newAreaData,
      id: Date.now().toString(),
    };
    setFocusAreas(prev => [...prev, newArea]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Focus Area Created",
      description: `${newAreaData.name} has been successfully created.`,
    });
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
      toast({
        title: "Focus Area Updated",
        description: `${updatedAreaData.name} has been successfully updated.`,
      });
    }
  };

  const handleEdit = (area: FocusArea) => {
    setEditingArea(area);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-base font-medium">Focus Areas</CardTitle>
          <Button variant="link" className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800 self-start">
            <ExternalLink className="h-3 w-3 mr-1" />
            View All
          </Button>
        </div>
        <SideDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <SideDialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent text-black hover:bg-gray-50 border border-gray-300">
              <Plus className="h-4 w-4" />
              Create Focus Area
            </Button>
          </SideDialogTrigger>
          <SideDialogContent className="overflow-hidden">
            <SideDialogHeader>
              <SideDialogTitle>Create Focus Area</SideDialogTitle>
            </SideDialogHeader>
            <div className="flex-1 overflow-y-auto p-6">
              <FocusAreaForm
                onSave={handleCreateSave}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </div>
          </SideDialogContent>
        </SideDialog>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-2">
          {focusAreas.map((area) => (
            <div key={area.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-sm transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Badge className={`${area.color} rounded-sm flex-shrink-0`}>
                  {area.name}
                </Badge>
              </div>
              <div className="flex gap-2 flex-shrink-0">
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
                  <SideDialogContent className="overflow-hidden">
                    <SideDialogHeader>
                      <SideDialogTitle>Edit Focus Area</SideDialogTitle>
                    </SideDialogHeader>
                    <div className="flex-1 overflow-y-auto p-6">
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
