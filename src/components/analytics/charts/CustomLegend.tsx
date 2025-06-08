
import React from "react";

export const CustomLegend = ({
  visibleLines,
  toggleLine,
  lineConfigs,
}: {
  visibleLines: Record<string, boolean>;
  toggleLine: (key: string) => void;
  lineConfigs: Array<{ key: string; name: string; color: string }>;
}) => (
  <div className="flex flex-wrap justify-center gap-4 mt-2">
    {lineConfigs.map((line) => (
      <div
        key={line.key}
        className="flex items-center cursor-pointer"
        onClick={() => toggleLine(line.key)}
      >
        <div
          className="w-4 h-4 mr-2 rounded-sm"
          style={{
            backgroundColor: line.color,
            opacity: visibleLines[line.key] ? 1 : 0.5,
          }}
        />
        <span style={{ opacity: visibleLines[line.key] ? 1 : 0.5 }}>
          {line.name}
        </span>
      </div>
    ))}
  </div>
);
