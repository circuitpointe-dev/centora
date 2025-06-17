
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Action {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

interface DocumentActionsSectionProps {
    actionRows: Action[][];
}

const DocumentActionsSection: React.FC<DocumentActionsSectionProps> = ({ actionRows }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 mt-auto pt-6">
            <div className="flex flex-col items-start gap-2 mb-4">
                {actionRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-[13px]">
                        {row.map((action) => (
                            <Button
                                key={action.label}
                                variant="ghost"
                                className="flex items-center gap-2 p-2.5 h-auto"
                                onClick={action.onClick}
                            >
                                {action.icon}
                                <span className="font-normal text-[#38383880] text-sm">
                                    {action.label}
                                </span>
                            </Button>
                        ))}
                    </div>
                ))}
            </div>
            <Button className="h-[43px] w-full gap-1.5 rounded-[5px] bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700">
                <Download className="h-4 w-4" />
                <span>Download Document</span>
            </Button>
        </div>
    );
};

export default DocumentActionsSection;
