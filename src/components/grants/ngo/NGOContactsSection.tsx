import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone } from 'lucide-react';

export const NGOContactsSection = () => {
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Program Officer",
      email: "sarah.johnson@unicef.org",
      phone: "+1 (555) 123-4567",
      isPrimary: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Financial Officer", 
      email: "m.chen@unicef.org",
      phone: "+1 (555) 123-4568",
      isPrimary: false
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Donor Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-start space-x-3 p-3 rounded-lg border">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-600">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                {contact.isPrimary && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Primary
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{contact.role}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{contact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};