
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly: boolean;
}

const TextEditor = ({ content, onChange, readOnly }: TextEditorProps) => {
  const [text, setText] = useState(content);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-4xl mx-auto">
        <textarea
          value={text}
          onChange={handleChange}
          readOnly={readOnly}
          className={`w-full min-h-[600px] p-6 border border-gray-300 rounded-lg outline-none resize-none font-mono text-sm leading-relaxed ${
            readOnly ? 'bg-gray-50 cursor-default' : 'bg-white'
          }`}
          placeholder={readOnly ? '' : 'Start typing your document...'}
        />
      </div>
    </ScrollArea>
  );
};

export default TextEditor;
