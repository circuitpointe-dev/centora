import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PenTool, 
  Type, 
  User, 
  Calendar, 
  Building,
  Stamp,
  Edit3,
  GripVertical,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureField {
  id: string;
  type: 'signature' | 'initials' | 'name' | 'date' | 'text' | 'stamp';
  label: string;
  value?: string;
  required: boolean;
}

interface ProfessionalFieldsSidebarProps {
  fields: SignatureField[];
  onFieldEdit: (field: SignatureField) => void;
  onFieldDragStart: (field: SignatureField) => void;
  onSign: () => void;
  isSigningMode?: boolean;
}

const ProfessionalFieldsSidebar: React.FC<ProfessionalFieldsSidebarProps> = ({
  fields,
  onFieldEdit,
  onFieldDragStart,
  onSign,
  isSigningMode = false
}) => {
  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'signature':
        return PenTool;
      case 'initials':
        return Type;
      case 'name':
        return User;
      case 'date':
        return Calendar;
      case 'text':
        return Building;
      case 'stamp':
        return Stamp;
      default:
        return User;
    }
  };

  const getFieldIconColor = (type: string) => {
    switch (type) {
      case 'signature':
        return 'text-blue-600 bg-blue-100';
      case 'initials':
        return 'text-blue-600 bg-blue-100';
      case 'name':
        return 'text-gray-600 bg-gray-100';
      case 'date':
        return 'text-gray-600 bg-gray-100';
      case 'text':
        return 'text-gray-600 bg-gray-100';
      case 'stamp':
        return 'text-gray-400 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Separate required and optional fields
  const requiredFields = fields.filter(field => field.required);
  const optionalFields = fields.filter(field => !field.required);

  // Default fields if none exist
  const defaultRequiredFields: SignatureField[] = [
    { id: 'req-sig-1', type: 'signature', label: 'Signature', required: true }
  ];

  const defaultOptionalFields: SignatureField[] = [
    { id: 'opt-init-1', type: 'initials', label: 'Initials', required: false },
    { id: 'opt-name-1', type: 'name', label: 'Name', required: false },
    { id: 'opt-date-1', type: 'date', label: 'Date', required: false },
    { id: 'opt-text-1', type: 'text', label: 'Text', required: false },
    { id: 'opt-stamp-1', type: 'stamp', label: 'Company Stamp', required: false }
  ];

  const displayRequiredFields = requiredFields.length > 0 ? requiredFields : defaultRequiredFields;
  const displayOptionalFields = optionalFields.length > 0 ? optionalFields : defaultOptionalFields;

  const renderField = (field: SignatureField) => {
    const IconComponent = getFieldIcon(field.type);
    const iconColorClass = getFieldIconColor(field.type);
    const isCompleted = field.value && field.value.length > 0;
    const isCompanyStamp = field.type === 'stamp';

    return (
      <div
        key={field.id}
        className={cn(
          "group flex items-center gap-3 p-3 border-2 border-dashed rounded-lg transition-all",
          isCompleted ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50",
          isCompanyStamp && !field.value ? "opacity-50" : "",
          "hover:border-blue-300 cursor-pointer"
        )}
        draggable={!isSigningMode}
        onDragStart={() => !isSigningMode && onFieldDragStart(field)}
      >
        {/* Drag Handle */}
        <div className="flex flex-col gap-0.5 text-gray-400 hover:text-gray-600">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
          </div>
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
          </div>
        </div>

        {/* Field Icon */}
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          iconColorClass
        )}>
          {field.type === 'initials' ? (
            <span className="text-sm font-bold text-white bg-blue-600 w-full h-full rounded-lg flex items-center justify-center">
              AC
            </span>
          ) : (
            <IconComponent className="w-5 h-5" />
          )}
        </div>

        {/* Field Content */}
        <div className="flex-1 min-w-0">
          <div className="border-2 border-dashed border-gray-300 rounded p-3 bg-white min-h-[60px] flex items-center justify-center">
            {field.value ? (
              field.type === 'signature' ? (
                <div className="text-center">
                  {field.value.startsWith('data:image') ? (
                    <img 
                      src={field.value} 
                      alt="Signature" 
                      className="max-h-[40px] max-w-full object-contain"
                    />
                  ) : (
                    <div className="font-signature text-lg text-gray-800">
                      {field.value}
                    </div>
                  )}
                </div>
              ) : field.type === 'initials' ? (
                <div className="font-bold text-2xl text-gray-800">
                  {field.value}
                </div>
              ) : (
                <div className="text-sm text-gray-800">
                  {field.value}
                </div>
              )
            ) : (
              <div className="text-gray-400 text-sm text-center">
                {field.label}
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onFieldEdit(field);
          }}
          disabled={isCompanyStamp && !field.value}
        >
          <Edit3 className="w-4 h-4 text-blue-600" />
        </Button>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Required Fields */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required fields</h3>
          <div className="space-y-3">
            {displayRequiredFields.map(renderField)}
          </div>
        </div>

        {/* Optional Fields */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional fields</h3>
          <div className="space-y-3">
            {displayOptionalFields.map(renderField)}
          </div>
        </div>
      </div>

      {/* Sign Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={onSign}
          className="w-full bg-red-400 hover:bg-red-500 text-white py-3 text-lg font-medium rounded-lg flex items-center justify-center gap-2"
          size="lg"
        >
          Sign
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalFieldsSidebar;