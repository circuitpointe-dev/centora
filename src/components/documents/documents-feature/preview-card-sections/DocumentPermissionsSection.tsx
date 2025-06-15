
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Permission {
    group: string;
    permission: string;
    icon: React.ReactNode;
}

interface DocumentPermissionsSectionProps {
    permissions: Permission[];
}

const DocumentPermissionsSection: React.FC<DocumentPermissionsSectionProps> = ({ permissions }) => {
    return (
        <div className="flex flex-col items-start gap-4 w-full">
            <div className="font-medium text-[#383838cc] text-base">
                Permissions
            </div>
            <div className="flex flex-col items-start gap-4 w-full">
                {permissions.map((item) => (
                    <div
                        key={item.group}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center gap-2.5">
                            {item.icon}
                            <div className="font-medium text-[#383838cc] text-[13px]">
                                {item.group}
                            </div>
                        </div>
                        <Badge className="bg-[#f2f2f2] text-[#383839b2] h-[25px] px-2.5 py-1 rounded-[5px] font-medium text-xs border-0">
                            {item.permission}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentPermissionsSection;
