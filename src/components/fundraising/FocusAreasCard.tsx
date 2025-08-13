
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { FocusArea, useFocusAreas } from "@/hooks/useFocusAreas";
import { FocusAreaForm } from "./FocusAreaForm";

const FocusAreasCard: React.FC = () => {
  const { focusAreas, deleteFocusArea, loading } = useFocusAreas();
  const [editingArea, setEditingArea] = useState<FocusArea | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteFocusArea(id);
    } catch (error) {
      console.error('Error deleting focus area:', error);
    }
  };

  const handleEditSave = () => {
    setEditingArea(null);
    setIsEditDialogOpen(false);
  };

  const handleEdit = (area: FocusArea) => {
    setEditingArea(area);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
        <CardTitle className="text-base font-medium">Focus Areas</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-500">Loading focus areas...</div>
          </div>
        ) : focusAreas.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">No focus areas yet</div>
              <div className="text-xs text-gray-400">Create your first focus area to get started</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {focusAreas.map((area) => (
            <div key={area.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-sm transition-colors hover:bg-gray-50">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <Badge className={`${area.color} rounded-sm flex-shrink-0`}>
                    {area.name}
                  </Badge>
                </div>
                <span className="text-sm text-gray-600 truncate">{area.description}</span>
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
        )}
      </CardContent>
    </Card>
  );
};

export default FocusAreasCard;
