
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileText } from 'lucide-react';

interface GranteeDetailsTabProps {
  data: {
    organization: string;
    granteeRefId: string;
    region: string;
    programArea: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
    documents: Array<{
      type: string;
      name: string;
      url?: string;
      file?: File;
    }>;
  };
  onUpdate: (data: any) => void;
}

export const GranteeDetailsTab: React.FC<GranteeDetailsTabProps> = ({ data, onUpdate }) => {
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentType, setDocumentType] = useState('');

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && documentType) {
      const file = files[0];
      const newDocument = {
        type: documentType,
        name: file.name,
        file: file,
      };
      onUpdate({ documents: [...data.documents, newDocument] });
      setDocumentType('');
    }
  };

  const handleUrlAdd = () => {
    if (documentUrl && documentType) {
      const newDocument = {
        type: documentType,
        name: documentUrl.split('/').pop() || documentUrl,
        url: documentUrl,
      };
      onUpdate({ documents: [...data.documents, newDocument] });
      setDocumentUrl('');
      setDocumentType('');
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = data.documents.filter((_, i) => i !== index);
    onUpdate({ documents: updatedDocuments });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="organization" className="text-sm font-medium">
            Organization *
          </Label>
          <Input
            id="organization"
            value={data.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            placeholder="Enter organization name"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm font-medium">
            Region *
          </Label>
          <Select value={data.region} onValueChange={(value) => handleInputChange('region', value)}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="south-america">South America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="granteeRefId" className="text-sm font-medium">
            Grantee Reference ID *
          </Label>
          <Input
            id="granteeRefId"
            value={data.granteeRefId}
            onChange={(e) => handleInputChange('granteeRefId', e.target.value)}
            placeholder="GR-0001"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="programArea" className="text-sm font-medium">
            Program Area *
          </Label>
          <Select value={data.programArea} onValueChange={(value) => handleInputChange('programArea', value)}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Select program area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="poverty-alleviation">Poverty Alleviation</SelectItem>
              <SelectItem value="human-rights">Human Rights</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPerson" className="text-sm font-medium">
            Contact Person *
          </Label>
          <Input
            id="contactPerson"
            value={data.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            placeholder="Enter contact person name"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number *
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number"
            className="rounded-sm"
          />
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Documents</Label>
        
        <Card className="rounded-sm">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="rounded-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="due-diligence">Due Diligence</SelectItem>
                    <SelectItem value="agreement">Agreement</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Upload File</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    className="rounded-sm"
                    accept=".pdf,.doc,.docx,.xlsx,.pptx"
                    disabled={!documentType}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Or Add URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    placeholder="Enter document URL"
                    className="rounded-sm"
                    disabled={!documentType}
                  />
                  <Button 
                    onClick={handleUrlAdd}
                    disabled={!documentUrl || !documentType}
                    className="rounded-sm"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Documents List */}
            {data.documents.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Uploaded Documents</Label>
                <div className="space-y-2">
                  {data.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-sm">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{doc.type.replace('-', ' ')}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="rounded-sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
