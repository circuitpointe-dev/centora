import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Download, FileText, MoreVertical } from 'lucide-react';
import { Document } from '@/hooks/useDocuments';
import { useDocumentDownload } from '@/hooks/useDocumentOperations';
import { Loader2 } from 'lucide-react';

interface DocumentCardProps extends Document {
  selected?: boolean;
  onSelect: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  created_at,
  creator,
  tags,
  onSelect,
  selected = false,
  ...document
}) => {
  const downloadMutation = useDocumentDownload();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadMutation.mutate(id);
  };

  const displayedTags = tags?.slice(0, 1) || [];
  const remainingTagsCount = (tags?.length || 0) - 1;

  const formatTimeAgo = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateFileName = (name: string, maxLength: number = 30): string => {
    if (name.length <= maxLength) {
      return name;
    }
  
    const extensionIndex = name.lastIndexOf('.');
    if (extensionIndex === -1 || extensionIndex < 1) {
      return name.slice(0, maxLength - 3) + '...';
    }
  
    const extension = name.slice(extensionIndex);
    const nameWithoutExt = name.slice(0, extensionIndex);
    
    const availableNameLength = maxLength - extension.length - 3;
    
    if (availableNameLength < 1) {
      return '...' + extension.slice(0, maxLength - 3);
    }
  
    const truncatedName = nameWithoutExt.slice(0, availableNameLength);
    
    return truncatedName + '...' + extension;
  };

  return (
    <Card 
      className={`flex flex-col h-[263px] w-full p-0 overflow-hidden cursor-pointer transition-all duration-200 ${selected ? 'border-violet-600 border-2 shadow-lg' : 'border-transparent hover:shadow-md'}`}
      onClick={onSelect}
    >
      <div className="flex h-28 items-center justify-center bg-[#f2f2f2] rounded-t-[5px]">
        <FileText className="w-10 h-10 text-gray-500" />
      </div>

      <CardContent className="flex flex-grow flex-col items-start gap-4 px-3 py-4 bg-white rounded-b-[5px]">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
            <h3 className="mt-[-1.00px] font-medium text-[#383838] text-sm w-full truncate" title={title}>
              {truncateFileName(title)}
            </h3>
            <p className="text-xs text-[#38383899] font-normal">
              {formatTimeAgo(created_at)}
            </p>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 shrink-0" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-start gap-3 w-full mt-auto">
          <div className="flex items-center gap-1.5">
            <Avatar className="w-[30px] h-[30px]">
              <AvatarFallback>{creator?.full_name?.substring(0,2).toUpperCase() || 'UN'}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-[#38383899] font-normal">
              {creator?.full_name || 'Unknown'}
            </span>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-wrap">
              {displayedTags.map((tag, index) => (
                <Badge
                  key={index}
                  className="h-[25px] px-2.5 py-1 font-medium text-xs rounded-[5px] border-0"
                  style={{
                    backgroundColor: tag.bg_color || '#f3f4f6',
                    color: tag.text_color || '#374151'
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
               {remainingTagsCount > 0 && (
                <Badge
                  className="h-[25px] px-2.5 py-1 bg-gray-200 text-gray-800 font-medium text-xs rounded-[5px] border-0 hover:bg-gray-200 hover:text-gray-800"
                >
                  +{remainingTagsCount}
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 p-0 shrink-0" 
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
            >
              {downloadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;