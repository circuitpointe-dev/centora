import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit } from "lucide-react";
import { ManageEngagementDialog } from "../ManageEngagementDialog";
import { useToast } from "@/hooks/use-toast";
import { useDonorEngagements, useUpdateDonorEngagement, useDeleteDonorEngagement } from "@/hooks/useDonorEngagements";
import { format } from "date-fns";

interface EngagementHistorySectionProps {
  donorId: string;
}

export const EngagementHistorySection: React.FC<EngagementHistorySectionProps> = ({ donorId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { toast } = useToast();
  
  const { data: engagementEntries = [], isLoading } = useDonorEngagements(donorId);
  const updateEngagementMutation = useUpdateDonorEngagement();
  const deleteEngagementMutation = useDeleteDonorEngagement();

  const handleEdit = (id: string, currentText: string): void => {
    setEditingEntry(id);
    setEditText(currentText);
  };

  const handleSaveEdit = async (id: string): Promise<void> => {
    try {
      await updateEngagementMutation.mutateAsync({
        id,
        description: editText,
      });
      setEditingEntry(null);
      setEditText("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancelEdit = (): void => {
    setEditingEntry(null);
    setEditText("");
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteEngagementMutation.mutateAsync(id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 h-full">
      <h2 className="font-medium text-black text-base">
        Engagement History
      </h2>

      <Card className="w-full flex-1">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading engagement history...</div>
              </div>
            ) : engagementEntries.length > 0 ? (
              engagementEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  {editingEntry === entry.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(entry.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={updateEngagementMutation.isPending}
                        >
                          {updateEngagementMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pr-16">
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {entry.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{format(new Date(entry.engagement_date), 'MMM dd, yyyy')}</span>
                          <span>•</span>
                          <span>Added on {format(new Date(entry.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(entry.id, entry.description)}
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Edit className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(entry.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100"
                          disabled={deleteEngagementMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-sm text-muted-foreground mb-2">No engagement entries yet</div>
                <div className="text-xs text-muted-foreground">
                  Click "Add Engagement Entry" to get started
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="mt-4 text-violet-600 border-violet-600"
            onClick={() => setIsDialogOpen(true)}
          >
            Add Engagement Entry
          </Button>
        </CardContent>
      </Card>

      <ManageEngagementDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        donorId={donorId}
      />
    </div>
  );
};