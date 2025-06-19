
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Document } from '../data';

interface DocumentTagsSectionProps {
    tags: Document['tags'];
}

const DocumentTagsSection: React.FC<DocumentTagsSectionProps> = ({ tags }) => {
    return (
        <div className="flex flex-col items-start gap-4 w-full">
            <div className="font-medium text-[#383838cc] text-base">
                Tags
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {tags.map((tag) => (
                    <Badge
                        key={tag.name}
                        className={`${tag.bgColor} ${tag.textColor} h-[25px] px-2.5 py-1 rounded-[5px] font-medium text-xs border-0 hover:${tag.bgColor} hover:${tag.textColor}`}
                    >
                        {tag.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default DocumentTagsSection;
