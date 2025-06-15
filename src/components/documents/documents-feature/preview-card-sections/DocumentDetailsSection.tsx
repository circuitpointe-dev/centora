
import React from 'react';

interface DocumentDetail {
    label: string;
    value: string;
}

interface DocumentDetailsSectionProps {
    details: DocumentDetail[];
}

const DocumentDetailsSection: React.FC<DocumentDetailsSectionProps> = ({ details }) => {
    return (
        <div className="flex flex-col items-start gap-2 w-full">
            <div className="font-medium text-[#383838cc] text-base">
                Details
            </div>
            <div className="flex items-start justify-between w-full">
                <div className="flex flex-col items-start gap-[18px]">
                    {details.map((detail) => (
                        <div
                            key={detail.label}
                            className="font-normal text-[#38383880] text-[13px]"
                        >
                            {detail.label}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-end gap-[18px]">
                    {details.map((detail) => (
                        <div
                            key={detail.label}
                            className="font-normal text-[#383838e6] text-[13px] text-right"
                        >
                            {detail.value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentDetailsSection;
