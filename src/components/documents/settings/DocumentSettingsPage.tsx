import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  FileText, 
  Shield, 
  Users, 
  Database, 
  Upload, 
  Download,
  Trash2,
  Plus,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useDocumentTags, useCreateDocumentTag, useDeleteDocumentTag } from '@/hooks/useDocuments';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DocumentSettingsPage = () => {
  const navigate = useNavigate();
  const [autoSave, setAutoSave] = useState(true);
  const [maxFileSize, setMaxFileSize] = useState('50');
  const [allowedFormats, setAllowedFormats] = useState('pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,png');
  const [retentionPeriod, setRetentionPeriod] = useState('7');
  const [virusScanning, setVirusScanning] = useState(true);
  const [fileEncryption, setFileEncryption] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [defaultAccessLevel, setDefaultAccessLevel] = useState('organization');
  const [allowSharing, setAllowSharing] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');

  const { data: tags, isLoading: tagsLoading } = useDocumentTags();
  const createTag = useCreateDocumentTag();
  const deleteTag = useDeleteDocumentTag();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('documentSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAutoSave(settings.autoSave ?? true);
        setMaxFileSize(settings.maxFileSize ?? '50');
        setAllowedFormats(settings.allowedFormats ?? 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,png');
        setRetentionPeriod(settings.retentionPeriod ?? '7');
        setVirusScanning(settings.virusScanning ?? true);
        setFileEncryption(settings.fileEncryption ?? true);
        setAuditLogging(settings.auditLogging ?? true);
        setDefaultAccessLevel(settings.defaultAccessLevel ?? 'organization');
        setAllowSharing(settings.allowSharing ?? true);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

    const handleCreateTag = async () => {
        if (!newTagName.trim()) {
            toast.error('Please enter a tag name');
            return;
        }

        try {
            await createTag.mutateAsync({
                name: newTagName.trim(),
                color: newTagColor,
                bg_color: 'bg-blue-100',
                text_color: 'text-blue-800',
            });
            setNewTagName('');
            toast.success('Tag created successfully');
        } catch (error) {
            toast.error('Failed to create tag');
        }
    };

    const handleDeleteTag = async (tagId: string) => {
        try {
            await deleteTag.mutateAsync(tagId);
            toast.success('Tag deleted successfully');
        } catch (error) {
            toast.error('Failed to delete tag');
        }
    };

  const handleSaveSettings = async () => {
    try {
      // In a real implementation, this would save to backend
      // For now, we'll save to localStorage as a demo
      const settings = {
        autoSave,
        maxFileSize,
        allowedFormats,
        retentionPeriod,
        virusScanning,
        fileEncryption,
        auditLogging,
        defaultAccessLevel,
        allowSharing,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('documentSettings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

    const colorOptions = [
        { value: '#3B82F6', label: 'Blue', bg: 'bg-blue-100', text: 'text-blue-800' },
        { value: '#10B981', label: 'Green', bg: 'bg-green-100', text: 'text-green-800' },
        { value: '#F59E0B', label: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
        { value: '#EF4444', label: 'Red', bg: 'bg-red-100', text: 'text-red-800' },
        { value: '#8B5CF6', label: 'Purple', bg: 'bg-purple-100', text: 'text-purple-800' },
        { value: '#06B6D4', label: 'Cyan', bg: 'bg-cyan-100', text: 'text-cyan-800' },
    ];

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Settings className="h-6 w-6 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-900">Document Settings</h1>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            General Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="auto-save">Auto-save documents</Label>
                                <p className="text-sm text-gray-500">Automatically save document changes</p>
                            </div>
                            <Switch
                                id="auto-save"
                                checked={autoSave}
                                onCheckedChange={setAutoSave}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="max-file-size">Maximum file size (MB)</Label>
                            <Input
                                id="max-file-size"
                                type="number"
                                value={maxFileSize}
                                onChange={(e) => setMaxFileSize(e.target.value)}
                                placeholder="50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="allowed-formats">Allowed file formats</Label>
                            <Input
                                id="allowed-formats"
                                value={allowedFormats}
                                onChange={(e) => setAllowedFormats(e.target.value)}
                                placeholder="pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,png"
                            />
                            <p className="text-sm text-gray-500">Comma-separated list of allowed file extensions</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="retention-period">Document retention period (years)</Label>
                            <Input
                                id="retention-period"
                                type="number"
                                value={retentionPeriod}
                                onChange={(e) => setRetentionPeriod(e.target.value)}
                                placeholder="7"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="virus-scan">Enable virus scanning</Label>
                                <p className="text-sm text-gray-500">Scan uploaded files for malware</p>
                            </div>
                            <Switch 
                                id="virus-scan" 
                                checked={virusScanning}
                                onCheckedChange={setVirusScanning}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="encryption">Enable file encryption</Label>
                                <p className="text-sm text-gray-500">Encrypt files at rest</p>
                            </div>
                            <Switch 
                                id="encryption" 
                                checked={fileEncryption}
                                onCheckedChange={setFileEncryption}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="audit-log">Enable audit logging</Label>
                                <p className="text-sm text-gray-500">Log all document access and modifications</p>
                            </div>
                            <Switch 
                                id="audit-log" 
                                checked={auditLogging}
                                onCheckedChange={setAuditLogging}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="access-level">Default access level</Label>
                            <Select 
                                value={defaultAccessLevel}
                                onValueChange={setDefaultAccessLevel}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="organization">Organization</SelectItem>
                                    <SelectItem value="department">Department</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* User Permissions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            User Permissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Allow document sharing</span>
                                <Switch 
                                    checked={allowSharing}
                                    onCheckedChange={setAllowSharing}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Allow bulk operations</span>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Allow template creation</span>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Require approval for uploads</span>
                                <Switch />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Document Tags Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Document Tags
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Create New Tag */}
                        <div className="space-y-3">
                            <Label>Create New Tag</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="Tag name"
                                    className="flex-1"
                                />
                                <Select value={newTagColor} onValueChange={setNewTagColor}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colorOptions.map((color) => (
                                            <SelectItem key={color.value} value={color.value}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: color.value }}
                                                    />
                                                    {color.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleCreateTag} disabled={createTag.isPending}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Existing Tags */}
                        <div className="space-y-3">
                            <Label>Existing Tags</Label>
                            {tagsLoading ? (
                                <p className="text-sm text-gray-500">Loading tags...</p>
                            ) : tags && tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                            style={{
                                                backgroundColor: tag.bg_color?.replace('bg-', '').replace('-100', '') + '20',
                                                color: tag.color
                                            }}
                                        >
                                            {tag.name}
                                            <button
                                                onClick={() => handleDeleteTag(tag.id)}
                                                className="hover:text-red-600 ml-1"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No tags created yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Storage & Backup */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Storage & Backup
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Storage Usage</Label>
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="flex justify-between text-sm">
                                    <span>Used: 2.4 GB</span>
                                    <span>Total: 10 GB</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Backup Settings</Label>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Daily backup</span>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Cloud sync</span>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Actions</Label>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Data
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Import Data
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                </Button>
            </div>
        </div>
    );
};

export default DocumentSettingsPage;
