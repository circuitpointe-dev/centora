
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (note: any) => void;
  opportunityId: string;
}

const formSchema = z.object({
  content: z.string().min(1, { message: "Note content is required" }),
});

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({
  isOpen,
  onClose,
  onAddNote,
  opportunityId,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onAddNote({
      ...data,
      opportunityId,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: "Chioma Ike", // Updated to show actual user name
    });

    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white text-black border shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">Add Note</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Note
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your note here..."
                      className="min-h-[150px] resize-none border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 text-white shadow-sm hover:bg-violet-700"
              >
                Add Note
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
