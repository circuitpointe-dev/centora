
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, MoreVertical, Download } from 'lucide-react';

interface DocumentTag {
  name: string;
  bgColor: string;
  textColor: string;
}

interface DocumentOwner {
  name: string;
  avatar: string;
}

export interface DocumentCardProps {
  fileName: string;
  addedTime: string;
  owner: DocumentOwner;
  tags: DocumentTag[];
  onSelect: () => void;
  selected: boolean;
}

const DocumentCard = ({ fileName, addedTime, owner, tags, onSelect, selected }: DocumentCardProps) => {
  const displayedTags = tags.slice(0, 2);

  return (
    <Card 
      className={`flex flex-col w-[230px] h-[263px] p-0 overflow-hidden cursor-pointer transition-all duration-200 ${selected ? 'border-violet-600 border-2 shadow-lg' : 'border-transparent hover:shadow-md'}`}
      onClick={onSelect}
    >
      <div className="flex h-28 items-center justify-center bg-[#f2f2f2] rounded-t-[5px]">
        <FileText className="w-10 h-10 text-gray-500" />
      </div>

      <CardContent className="flex flex-grow flex-col items-start gap-4 px-3 py-4 bg-white rounded-b-[5px]">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
            <h3 className="mt-[-1.00px] font-medium text-[#383838] text-sm w-full truncate" title={fileName}>
              {fileName}
            </h3>
            <p className="text-xs text-[#38383899] font-normal">
              {addedTime}
            </p>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 shrink-0" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-start gap-3 w-full mt-auto">
          <div className="flex items-center gap-1.5">
            <Avatar className="w-[30px] h-[30px]">
              <AvatarImage
                src={owner.avatar}
                alt={owner.name}
              />
              <AvatarFallback>{owner.name.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-[#38383899] font-normal">
              {owner.name}
            </span>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-wrap">
              {displayedTags.map((tag, index) => (
                <Badge
                  key={index}
                  className={`h-[25px] px-2.5 py-1 ${tag.bgColor} ${tag.textColor} font-medium text-xs rounded-[5px] border-0`}
                >
                  {tag.name}
                </Badge>
              ))}
               {tags.length > 2 && (
                <Badge
                  className="h-[25px] px-2.5 py-1 bg-gray-200 text-gray-800 font-medium text-xs rounded-[5px] border-0"
                >
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
