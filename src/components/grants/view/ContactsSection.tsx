
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const ContactsSection = (): JSX.Element => {
  const granteeDetails = [
    { label: "Organization", value: "UNICEF" },
    { label: "Region", value: "East Asia" },
    { label: "Reference ID", value: "UNI1232688" },
    { label: "Program Area", value: "Health" },
    { label: "Contact Person", value: "Manager" },
    { label: "Email Address", value: "unicef@gmail.com" },
  ];

  const documents = [
    { name: "Signed agreement.pdf", url: "#" },
    { name: "Budget.docx", url: "#" },
  ];

  return (
    <Card className="flex flex-col rounded-sm h-fit shadow-lg border border-purple-200">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold text-black">
          Grantee Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="space-y-4">
          {granteeDetails.map((detail, index) => (
            <div key={index} className="flex">
              <div className="w-[185px] text-sm font-semibold text-black">
                {detail.label}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  {detail.value}
                </span>
              </div>
            </div>
          ))}
          
          {/* Link Documents */}
          <div className="flex">
            <div className="w-[185px] text-sm font-semibold text-black">
              Link Document
            </div>
            <div className="flex flex-col gap-1">
              {documents.map((doc, index) => (
                <a 
                  key={index}
                  href={doc.url}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {doc.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ContactsSection };
