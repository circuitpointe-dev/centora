
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface Permission {
    group: string;
    permission: string;
    icon: React.ReactNode;
}

interface DocumentPermissionsSectionProps {
    permissions: Permission[];
    onEditPermissions?: () => void;
}

const DocumentPermissionsSection: React.FC<DocumentPermissionsSectionProps> = ({ 
    permissions, 
    onEditPermissions 
}) => {
    return (
        <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center justify-between w-full">
                <div className="font-medium text-[#383838cc] text-base">
                    Permissions
                </div>
                {onEditPermissions && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEditPermissions}
                        className="h-7 px-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                    </Button>
                )}
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
                        <Badge className="bg-[#f2f2f2] text-[#383839b2] h-[25px] px-2.5 py-1 rounded-[5px] font-medium text-xs border-0 hover:bg-[#f2f2f2] hover:text-[#383839b2]">
                            {item.permission}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentPermissionsSection;
