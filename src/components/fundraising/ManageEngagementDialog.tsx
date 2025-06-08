import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ManageEngagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EngagementEntry {
  id: string;
  date: string;
  description: string;
  user: string;
}

export const ManageEngagementDialog: React.FC<ManageEngagementDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [entries, setEntries] = useState<EngagementEntry[]>([
    {
      id: '1',
      date: 'April 12th, 2024',
      description: 'Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.',
      user: 'John Smith'
    },
    {
      id: '2',
      date: 'April 10th, 2024',
      description: 'Met with donor representative to discuss upcoming funding opportunities.',
      user: 'Jane Doe'
    },
    {
      id: '3',
      date: 'April 8th, 2024',
      description: 'Follow-up call regarding quarterly report submission.',
      user: 'John Smith'
    },
    {
      id: '4',
      date: 'April 5th, 2024',
      description: 'Initial meeting to establish partnership framework and expectations.',
      user: 'Sarah Wilson'
    },
  ]);

  const [newEntry, setNewEntry] = useState({
    description: '',
  });

  const [editingEntry, setEditingEntry] = useState<EngagementEntry | null>(null);

  const handleAddEntry = () => {
    if (!newEntry.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter engagement details.",
        variant: "destructive",
      });
      return;
    }

    const entry: EngagementEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      description: newEntry.description,
      user: 'Current User', // In real app, this would come from auth context
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ description: '' });
    
    toast({
      title: "Success",
      description: "Engagement entry added successfully.",
    });
  };

  const handleEditEntry = (entry: EngagementEntry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = () => {
    if (!editingEntry || !editingEntry.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter engagement details.",
        variant: "destructive",
      });
      return;
    }

    setEntries(prev =>
      prev.map(entry =>
        entry.id === editingEntry.id ? editingEntry : entry
      )
    );
    setEditingEntry(null);
    
    toast({
      title: "Success",
      description: "Engagement entry updated successfully.",
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Success",
      description: "Engagement entry deleted successfully.",
    });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-medium">
            Manage Engagement History
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Records Management Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Existing Engagement Entries */}
            <div className="flex-1">
              <div className="space-y-4">
                <h2 className="font-medium text-lg text-[#383839]">Existing Engagement Entries</h2>
                
                <Card className="w-full">
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[#a273f2] font-medium">Date</TableHead>
                          <TableHead className="text-[#a273f2] font-medium">Description</TableHead>
                          <TableHead className="text-[#a273f2] font-medium">User</TableHead>
                          <TableHead className="text-[#a273f2] font-medium text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-normal text-[#232323]">
                              {entry.date}
                            </TableCell>
                            <TableCell className="font-normal text-[#232323] max-w-[300px]">
                              {editingEntry?.id === entry.id ? (
                                <Textarea
                                  value={editingEntry.description}
                                  onChange={(e) => setEditingEntry({
                                    ...editingEntry,
                                    description: e.target.value
                                  })}
                                  className="min-h-[60px]"
                                />
                              ) : (
                                <div className="truncate" title={entry.description}>
                                  {entry.description}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-normal text-[#232323]">
                              {entry.user}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingEntry?.id === entry.id ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSaveEdit}
                                    className="text-green-600 border-green-600"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    className="text-gray-600 border-gray-300"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-4">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 p-0"
                                    onClick={() => handleEditEntry(entry)}
                                  >
                                    <Pencil className="h-4 w-4 text-violet-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 p-0"
                                    onClick={() => handleDeleteEntry(entry.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-violet-500" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Add New Entry */}
            <div className="flex-1">
              <div className="space-y-4">
                <h2 className="font-medium text-lg text-[#383839]">Add New Engagement Entry</h2>
                
                <Card className="w-full">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description" className="font-medium text-[#707070] text-sm">
                          Engagement Details
                        </Label>
                        <Textarea
                          id="description"
                          value={newEntry.description}
                          onChange={(e) => setNewEntry({ description: e.target.value })}
                          placeholder="Enter engagement details..."
                          className="min-h-[120px] border-[#d2d2d2]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddEntry}
                          className="bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          Add Engagement Entry
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
