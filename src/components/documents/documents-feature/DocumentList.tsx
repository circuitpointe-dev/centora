
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Document } from '@/hooks/useDocuments';
import { formatDistanceToNow } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  selectedDocumentId: string | null;
  onSelectDocument: (id: string) => void;
}

const DocumentList = ({ documents, selectedDocumentId, onSelectDocument }: DocumentListProps) => {
  const displayedTagsCount = 1;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-gray-50">
          <TableHead className="w-[40%] text-gray-600">Name</TableHead>
          <TableHead className="text-gray-600">Last Modified</TableHead>
          <TableHead className="text-gray-600">Owner</TableHead>
          <TableHead className="text-gray-600">Tags</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow
            key={doc.id}
            onClick={() => onSelectDocument(doc.id)}
            data-state={selectedDocumentId === doc.id ? 'selected' : 'unselected'}
            className="cursor-pointer"
          >
            <TableCell className="font-medium max-w-xs truncate" title={doc.file_name}>
              {doc.file_name}
            </TableCell>
            <TableCell>{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</TableCell>
            <TableCell>{doc.creator?.full_name || 'Unknown'}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1 flex-wrap">
                {doc.tags?.slice(0, displayedTagsCount).map((tag, index) => (
                  <Badge
                    key={index}
                    className={`h-[25px] px-2.5 py-1 ${tag.bg_color} ${tag.text_color} font-medium text-xs rounded-[5px] border-0 hover:${tag.bg_color} hover:${tag.text_color}`}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {(doc.tags?.length || 0) > displayedTagsCount && (
                  <Badge
                    className="h-[25px] px-2.5 py-1 bg-gray-200 text-gray-800 font-medium text-xs rounded-[5px] border-0 hover:bg-gray-200 hover:text-gray-800"
                  >
                    +{(doc.tags?.length || 0) - displayedTagsCount}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={(e) => {
                e.stopPropagation();
              }}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DocumentList;
