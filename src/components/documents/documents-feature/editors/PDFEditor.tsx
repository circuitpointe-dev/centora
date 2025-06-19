
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Highlighter, Type, Square, Circle } from 'lucide-react';

interface PDFEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly: boolean;
}

const PDFEditor = ({ content, onChange, readOnly }: PDFEditorProps) => {
  const [selectedTool, setSelectedTool] = useState<string>('none');
  const [annotations, setAnnotations] = useState<any[]>([]);

  const tools = [
    { id: 'highlight', label: 'Highlight', icon: Highlighter },
    { id: 'text', label: 'Add Text', icon: Type },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
  ];

  const handleAddAnnotation = (type: string, x: number, y: number) => {
    if (readOnly) return;
    
    const newAnnotation = {
      id: Date.now(),
      type,
      x,
      y,
      content: type === 'text' ? 'New annotation' : '',
    };
    
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);
    onChange(JSON.stringify({ content, annotations: updatedAnnotations }));
  };

  return (
    <div className="flex h-full">
      {!readOnly && (
        <div className="w-64 border-r border-gray-200 p-4">
          <h3 className="font-medium text-sm mb-3">Annotation Tools</h3>
          <div className="space-y-2">
            {tools.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={selectedTool === id ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedTool(id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 relative">
        <ScrollArea className="h-full">
          <div 
            className="bg-white min-h-[800px] m-4 border border-gray-300 relative cursor-crosshair"
            onClick={(e) => {
              if (selectedTool !== 'none' && !readOnly) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                handleAddAnnotation(selectedTool, x, y);
              }
            }}
          >
            {/* Simulated PDF content */}
            <div className="p-8 text-gray-800 leading-relaxed">
              <h1 className="text-2xl font-bold mb-4">Document Title</h1>
              <p className="mb-4">
                This is a simulated PDF document. In a real implementation, 
                you would integrate with PDF.js or similar library to render 
                the actual PDF content.
              </p>
              <p className="mb-4">
                Users can add annotations, highlights, and text overlays 
                to the document using the tools in the sidebar.
              </p>
              
              {/* Render annotations */}
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className={`absolute border-2 ${
                    annotation.type === 'highlight' ? 'bg-yellow-200 border-yellow-400' :
                    annotation.type === 'text' ? 'bg-blue-100 border-blue-400' :
                    annotation.type === 'rectangle' ? 'bg-transparent border-red-400' :
                    'bg-transparent border-green-400 rounded-full'
                  }`}
                  style={{
                    left: annotation.x,
                    top: annotation.y,
                    width: annotation.type === 'circle' ? '50px' : '100px',
                    height: '30px',
                    minHeight: annotation.type === 'text' ? 'auto' : '30px',
                  }}
                >
                  {annotation.type === 'text' && (
                    <input
                      type="text"
                      defaultValue={annotation.content}
                      className="w-full h-full bg-transparent text-xs p-1"
                      readOnly={readOnly}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PDFEditor;
