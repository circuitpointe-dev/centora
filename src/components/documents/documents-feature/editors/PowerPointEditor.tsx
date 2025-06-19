
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Square, Type, Image } from 'lucide-react';

interface PowerPointEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly: boolean;
}

interface Slide {
  id: string;
  title: string;
  content: string;
}

const PowerPointEditor = ({ content, onChange, readOnly }: PowerPointEditorProps) => {
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', title: 'Slide 1', content: 'Click to add content' },
    { id: '2', title: 'Slide 2', content: 'Click to add content' },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const addSlide = () => {
    if (readOnly) return;
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Slide ${slides.length + 1}`,
      content: 'Click to add content',
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    onChange(JSON.stringify(newSlides));
  };

  const updateSlide = (index: number, field: 'title' | 'content', value: string) => {
    if (readOnly) return;
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
    onChange(JSON.stringify(newSlides));
  };

  const deleteSlide = (index: number) => {
    if (readOnly || slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.min(currentSlideIndex, newSlides.length - 1));
    onChange(JSON.stringify(newSlides));
  };

  return (
    <div className="flex h-full">
      {/* Slide Navigator */}
      <div className="w-64 border-r border-gray-200 bg-gray-50">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Slides</h3>
            {!readOnly && (
              <Button size="sm" variant="outline" onClick={addSlide}>
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2 space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  currentSlideIndex === index
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCurrentSlideIndex(index)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{slide.title}</span>
                  {!readOnly && slides.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5 text-gray-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(index);
                      }}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {slide.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Slide Editor */}
      <div className="flex-1 flex flex-col">
        {!readOnly && (
          <div className="border-b border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Type className="w-4 h-4 mr-1" />
                Text Box
              </Button>
              <Button variant="outline" size="sm">
                <Square className="w-4 h-4 mr-1" />
                Shape
              </Button>
              <Button variant="outline" size="sm">
                <Image className="w-4 h-4 mr-1" />
                Image
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 p-8 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white aspect-[16/9] border border-gray-300 shadow-lg p-8 flex flex-col">
              <input
                type="text"
                value={slides[currentSlideIndex]?.title || ''}
                onChange={(e) => updateSlide(currentSlideIndex, 'title', e.target.value)}
                className="text-2xl font-bold mb-6 outline-none border-none bg-transparent"
                placeholder="Slide Title"
                readOnly={readOnly}
              />
              <textarea
                value={slides[currentSlideIndex]?.content || ''}
                onChange={(e) => updateSlide(currentSlideIndex, 'content', e.target.value)}
                className="flex-1 text-lg outline-none border-none bg-transparent resize-none"
                placeholder="Click to add content"
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerPointEditor;
