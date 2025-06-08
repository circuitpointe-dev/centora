
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { ManageEngagementDialog } from "../ManageEngagementDialog";
import { toast } from "@/hooks/use-toast";

export const EngagementHistorySection = (): JSX.Element => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Engagement history data with more entries for scrolling
  const [engagementEntries, setEngagementEntries] = useState([
    {
      id: '1',
      date: "April 12th, 2024",
      description: "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
      user: "John Smith"
    },
    {
      id: '2',
      date: "April 10th, 2024",
      description: "Met with donor representative to discuss upcoming funding opportunities and quarterly objectives.",
      user: "Jane Doe"
    },
    {
      id: '3',
      date: "April 8th, 2024",
      description: "Follow-up call regarding quarterly report submission and compliance requirements.",
      user: "Sarah Wilson"
    },
    {
      id: '4',
      date: "April 5th, 2024",
      description: "Initial meeting to establish partnership framework and set expectations for collaboration.",
      user: "John Smith"
    },
    {
      id: '5',
      date: "April 3rd, 2024",
      description: "Review of previous year's performance metrics and discussion of improvement strategies.",
      user: "Mike Johnson"
    },
    {
      id: '6',
      date: "April 1st, 2024",
      description: "Quarterly planning session with stakeholders to align on goals and priorities.",
      user: "Jane Doe"
    },
  ]);

  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (id: string, currentText: string) => {
    setEditingEntry(id);
    setEditText(currentText);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) {
      toast({
        title: "Error",
        description: "Engagement description cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setEngagementEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, description: editText } : entry
      )
    );
    setEditingEntry(null);
    setEditText("");
    
    toast({
      title: "Success",
      description: "Engagement entry updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditText("");
  };

  const handleDelete = (id: string) => {
    setEngagementEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Success",
      description: "Engagement entry deleted successfully.",
    });
  };

  return (
    <div className="flex flex-col items-start gap-4 h-full">
      <h2 className="font-medium text-black text-base">
        Engagement History
      </h2>

      <Card className="w-full flex-1">
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex flex-col items-start gap-4 w-full flex-1 overflow-y-auto max-h-[400px]">
            {engagementEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col items-start gap-2 px-2.5 py-3 w-full rounded-[5px] border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between w-full">
                  <h3 className="font-semibold text-[#383839] text-sm">
                    {entry.date}
                  </h3>
                  <div className="flex gap-2">
                    {editingEntry === entry.id ? (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveEdit(entry.id)}
                          className="h-6 px-2 text-xs text-green-600"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="h-6 px-2 text-xs text-gray-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEdit(entry.id, entry.description)}
                        >
                          <Pencil className="h-3 w-3 text-violet-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-3 w-3 text-violet-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {editingEntry === entry.id ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="text-[#383839b2] text-sm w-full min-h-[60px] border border-gray-300 rounded p-2 resize-none"
                    autoFocus
                  />
                ) : (
                  <p className="text-[#383839b2] text-sm w-full">
                    {entry.description}
                  </p>
                )}
                
                <span className="text-xs text-[#707070] mt-1">
                  by {entry.user}
                </span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="mt-6 text-violet-600 border-violet-600"
            onClick={() => setIsDialogOpen(true)}
          >
            Add Engagement Entry
          </Button>
        </CardContent>
      </Card>

      <ManageEngagementDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};
