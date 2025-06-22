
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const ContactsSection = (): JSX.Element => {
  const contacts = [
    {
      name: "Chioma Ike",
      role: "Grant Manager", 
      email: "ike.chioma@cp.com"
    },
    {
      name: "Samuel Obi",
      role: "Finance Lead",
      email: "obi.samuel@cp.com"
    },
    {
      name: "Aisha Bello", 
      role: "Monitoring Officer",
      email: "bello.aisha@cp.com"
    }
  ];

  return (
    <Card className="flex flex-col rounded-sm h-fit">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold text-black">
          Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="text-sm font-semibold text-black">
                  {contact.name}
                </div>
                <div className="text-xs text-gray-500">
                  {contact.role}
                </div>
              </div>
              <div className="flex items-start">
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { ContactsSection };
