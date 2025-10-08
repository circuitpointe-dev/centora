import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link, 
  Image, 
  Code2, 
  Quote, 
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start typing...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [textType, setTextType] = useState<'normal' | 'h1' | 'h2' | 'h3'>('normal');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0066FF',
    '#6600FF', '#FF0066', '#00FFFF', '#FFFF00', '#FF00FF'
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateToolbarState();
    handleContentChange();
  };

  const updateToolbarState = () => {
    if (editorRef.current) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsStrikethrough(document.queryCommandState('strikeThrough'));
      setIsCode(document.queryCommandState('fontName') === 'monospace');
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const handleTextTypeChange = (type: 'normal' | 'h1' | 'h2' | 'h3') => {
    setTextType(type);
    const tagMap = {
      normal: 'p',
      h1: 'h1',
      h2: 'h2',
      h3: 'h3'
    };
    execCommand('formatBlock', tagMap[type]);
  };

  const handleAlignmentChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    setAlignment(align);
    execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    execCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target?.result as string;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          editorRef.current?.appendChild(img);
          handleContentChange();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLinkInsert = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className={`border border-border rounded-lg bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('undo')}
          className="h-8 w-8 p-0"
        >
          <Undo size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('redo')}
          className="h-8 w-8 p-0"
        >
          <Redo size={16} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Type */}
        <select
          value={textType}
          onChange={(e) => handleTextTypeChange(e.target.value as any)}
          className="h-8 px-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="normal">Normal text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          variant={alignment === 'left' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAlignmentChange('left')}
          className="h-8 w-8 p-0"
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          variant={alignment === 'center' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAlignmentChange('center')}
          className="h-8 w-8 p-0"
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          variant={alignment === 'right' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAlignmentChange('right')}
          className="h-8 w-8 p-0"
        >
          <AlignRight size={16} />
        </Button>
        <Button
          variant={alignment === 'justify' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAlignmentChange('justify')}
          className="h-8 w-8 p-0"
        >
          <AlignJustify size={16} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Color Picker */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="h-8 w-8 p-0"
          >
            <div 
              className="w-4 h-4 border border-border rounded"
              style={{ backgroundColor: selectedColor }}
            />
          </Button>
          {showColorPicker && (
            <div className="absolute top-10 left-0 z-50 p-2 bg-card border border-border rounded-lg shadow-lg">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 border border-border rounded hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Formatting */}
        <Button
          variant={isBold ? 'default' : 'ghost'}
          size="sm"
          onClick={() => execCommand('bold')}
          className="h-8 w-8 p-0 font-bold"
        >
          B
        </Button>
        <Button
          variant={isItalic ? 'default' : 'ghost'}
          size="sm"
          onClick={() => execCommand('italic')}
          className="h-8 w-8 p-0 italic"
        >
          I
        </Button>
        <Button
          variant={isUnderline ? 'default' : 'ghost'}
          size="sm"
          onClick={() => execCommand('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline size={16} />
        </Button>
        <Button
          variant={isStrikethrough ? 'default' : 'ghost'}
          size="sm"
          onClick={() => execCommand('strikeThrough')}
          className="h-8 w-8 p-0"
        >
          <Strikethrough size={16} />
        </Button>
        <Button
          variant={isCode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => execCommand('fontName', 'monospace')}
          className="h-8 w-8 p-0"
        >
          <Code size={16} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          className="h-8 w-8 p-0"
        >
          <List size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered size={16} />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Insert Elements */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLinkInsert}
          className="h-8 w-8 p-0"
        >
          <Link size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          className="h-8 w-8 p-0"
        >
          <Image size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'pre')}
          className="h-8 w-8 p-0"
        >
          <Code2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'blockquote')}
          className="h-8 w-8 p-0"
        >
          <Quote size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertHorizontalRule')}
          className="h-8 w-8 p-0"
        >
          <Minus size={16} />
        </Button>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyUp={updateToolbarState}
        onMouseUp={updateToolbarState}
        className="min-h-[300px] p-4 text-foreground focus:outline-none"
        style={{ minHeight: '300px' }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
