import React, { useState } from 'react';
import { Search, FileText, Download, Award, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSignatureRequests } from '@/hooks/useESignature';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

export const CertificateOfCompletion = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: signatureRequests, isLoading, error } = useSignatureRequests({
    status: 'signed',
    search: searchTerm,
  });

  const handleGenerateCertificate = (documentId: string) => {
    console.log('Generate certificate for:', documentId);
    // TODO: Implement certificate generation
  };

  const handleDownloadCertificate = (documentId: string) => {
    console.log('Download certificate for:', documentId);
    // TODO: Implement certificate download
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-full p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-full p-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-2">Failed to load certificates</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Certificate of Completion</h2>
            <p className="text-sm text-gray-600">Generate and manage completion certificates for signed documents</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search completed documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-[5px] bg-white"
          />
        </div>

        {/* Table */}
        <Card className="rounded-[5px] bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Document Name</TableHead>
                  <TableHead className="font-semibold">Completed By</TableHead>
                  <TableHead className="font-semibold">Completion Date</TableHead>
                  <TableHead className="font-semibold">Certificate Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signatureRequests?.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{document.document?.title || 'Unknown Document'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{document.signer_name || document.signer_email}</div>
                        {document.signer_name && (
                          <div className="text-sm text-gray-500">{document.signer_email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {document.signed_at ? formatDistanceToNow(new Date(document.signed_at), { addSuffix: true }) : 'Not completed'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Available
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateCertificate(document.document_id)}
                          className="text-violet-600 hover:text-violet-700"
                        >
                          <Award className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadCertificate(document.document_id)}
                          className="text-violet-600 hover:text-violet-700"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {signatureRequests?.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No completed documents found</p>
                <p className="text-sm text-gray-400 mt-1">Certificates will appear here once documents are signed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};