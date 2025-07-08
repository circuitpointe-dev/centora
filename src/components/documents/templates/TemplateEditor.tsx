import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TemplateEditorProps {
  template: any;
  onBack: () => void;
  onSave: (content: string) => void;
  onPublish: (content: string) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onBack,
  onSave,
  onPublish
}) => {
  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.

Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit.

Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed molestie augue sit amet leo consequat posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin vel ante a orci tempus eleifend ut et magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In condimentum facilisis porta. Sed nec diam eu diam mattis viverra. Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris, quis sollicitudin sapien justo in libero. Vestibulum mollis mauris enim. Morbi euismod magna ac lorem rutrum elementum. Donec viverra auctor lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`;

  const [content, setContent] = useState(template?.content || loremIpsum);

  const handleSave = () => {
    onSave(content);
  };

  const handlePublish = () => {
    onPublish(content);
  };

  const formatButtons = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Underline, label: 'Underline' },
    { icon: List, label: 'Bullet List' },
    { icon: ListOrdered, label: 'Numbered List' },
    { icon: AlignLeft, label: 'Align Left' },
    { icon: AlignCenter, label: 'Align Center' },
    { icon: AlignRight, label: 'Align Right' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Back Link and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <h1 className="text-xl font-medium text-gray-900">
            Edit: {template?.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Save
          </Button>
          <Button
            onClick={handlePublish}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Publish as Template
          </Button>
        </div>
      </div>

      {/* Editor Card */}
      <Card className="rounded-[5px]">
        <CardContent className="p-6">
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 mb-4 p-2 border-b border-gray-200">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title={button.label}
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Content Editor */}
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your template content..."
              className="min-h-[400px] resize-none border-gray-200 focus:border-violet-300 focus:ring-violet-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Template Info */}
      <Card className="rounded-[5px]">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category:</span>
              <span className="ml-2 text-gray-900">{template?.category}</span>
            </div>
            <div>
              <span className="text-gray-500">Department:</span>
              <span className="ml-2 text-gray-900">{template?.department}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-900">{template?.lastUpdated}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};