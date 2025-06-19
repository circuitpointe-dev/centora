
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface WordEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly: boolean;
}

const WordEditor = ({ content, onChange, readOnly }: WordEditorProps) => {
  const [editorContent, setEditorContent] = useState(content);

  const formatText = (command: string) => {
    if (readOnly) return;
    document.execCommand(command, false);
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setEditorContent(newContent);
    onChange(newContent);
  };

  const toolbarButtons = [
    { command: 'bold', label: 'Bold', icon: Bold },
    { command: 'italic', label: 'Italic', icon: Italic },
    { command: 'underline', label: 'Underline', icon: Underline },
    { command: 'insertUnorderedList', label: 'Bullet List', icon: List },
    { command: 'justifyLeft', label: 'Align Left', icon: AlignLeft },
    { command: 'justifyCenter', label: 'Align Center', icon: AlignCenter },
    { command: 'justifyRight', label: 'Align Right', icon: AlignRight },
  ];

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center gap-2 flex-wrap">
            {toolbarButtons.map(({ command, label, icon: Icon }) => (
              <Button
                key={command}
                variant="outline"
                size="sm"
                onClick={() => formatText(command)}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="p-8 max-w-4xl mx-auto">
          <div
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={handleContentChange}
            className={`min-h-[600px] bg-white border border-gray-300 p-8 outline-none ${
              readOnly ? 'cursor-default' : 'cursor-text'
            }`}
            style={{
              fontFamily: 'Times New Roman, serif',
              fontSize: '12pt',
              lineHeight: '1.5',
            }}
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default WordEditor;
