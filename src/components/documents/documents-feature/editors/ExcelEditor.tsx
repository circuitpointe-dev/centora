
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Calculator } from 'lucide-react';

interface ExcelEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly: boolean;
}

const ExcelEditor = ({ content, onChange, readOnly }: ExcelEditorProps) => {
  const [data, setData] = useState<string[][]>(() => {
    // Initialize with sample data
    const rows = 20;
    const cols = 10;
    const initialData = Array(rows).fill(null).map((_, rowIndex) => 
      Array(cols).fill(null).map((_, colIndex) => 
        rowIndex === 0 ? String.fromCharCode(65 + colIndex) : ''
      )
    );
    return initialData;
  });

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const handleCellChange = (row: number, col: number, value: string) => {
    if (readOnly) return;
    
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
    onChange(JSON.stringify(newData));
  };

  const addRow = () => {
    if (readOnly) return;
    const newData = [...data, Array(data[0].length).fill('')];
    setData(newData);
    onChange(JSON.stringify(newData));
  };

  const addColumn = () => {
    if (readOnly) return;
    const newData = data.map((row, index) => [
      ...row, 
      index === 0 ? String.fromCharCode(65 + row.length) : ''
    ]);
    setData(newData);
    onChange(JSON.stringify(newData));
  };

  return (
    <div className="flex flex-col h-full">
      {!readOnly && (
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </Button>
            <Button variant="outline" size="sm" onClick={addColumn}>
              <Plus className="w-4 h-4 mr-1" />
              Add Column
            </Button>
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-1" />
              Formula
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="border border-gray-300 rounded">
            <div className="grid" style={{ gridTemplateColumns: `40px repeat(${data[0]?.length || 0}, 100px)` }}>
              {/* Row headers */}
              <div className="bg-gray-100 border-b border-r border-gray-300 p-2 text-xs font-medium"></div>
              {data[0]?.map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="bg-gray-100 border-b border-r border-gray-300 p-2 text-xs font-medium text-center"
                >
                  {String.fromCharCode(65 + colIndex)}
                </div>
              ))}

              {/* Data rows */}
              {data.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="bg-gray-100 border-b border-r border-gray-300 p-2 text-xs font-medium text-center">
                    {rowIndex + 1}
                  </div>
                  {row.map((cell, colIndex) => (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onFocus={() => setSelectedCell([rowIndex, colIndex])}
                      readOnly={readOnly}
                      className={`border-b border-r border-gray-300 p-2 text-xs outline-none ${
                        selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                          ? 'bg-blue-100 border-blue-400'
                          : 'hover:bg-gray-50'
                      } ${readOnly ? 'cursor-default' : 'cursor-cell'}`}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExcelEditor;
