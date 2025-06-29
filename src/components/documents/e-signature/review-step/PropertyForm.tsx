
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2 } from "lucide-react";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
}

interface PropertyFormProps {
  selectedField: Field;
}

export const PropertyForm = ({ selectedField }: PropertyFormProps) => {
  if (selectedField.type === "signature") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Signature</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-blue-600">
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-600">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Assigned to
            </label>
            <Select defaultValue="chioma">
              <SelectTrigger className="h-8 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-blue-600" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chioma">Chioma Ike (Me)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Required
            </label>
            <Select defaultValue="yes">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Field Name <span className="text-gray-500">(Optional)</span>
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signature">Signature</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  // For text-based fields (name, date, email, text)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedField.icon}
          <span className="text-sm font-medium text-gray-900">{selectedField.name}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-600">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-900 block mb-1">
            Assigned to
          </label>
          <Select defaultValue="chioma">
            <SelectTrigger className="h-8 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-blue-600" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chioma">Chioma Ike (Me)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-900 block mb-1">
            Required
          </label>
          <Select defaultValue="yes">
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-900 block mb-1">
            Formatting
          </label>
          <Select>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="uppercase">Uppercase</SelectItem>
              <SelectItem value="lowercase">Lowercase</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-900 block mb-1">
            Field Name
          </label>
          <Input 
            className="h-8 text-xs" 
            defaultValue={selectedField.name}
          />
        </div>
      </div>
    </div>
  );
};
