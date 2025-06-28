
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Award, BadgeCheck, Copy, Download } from 'lucide-react';

const signers = [
  {
    name: "Chioma Ike",
    email: "chiomaIke@circuitpointe.com",
    date: "Apr 5, 2025",
    time: "2:30PM",
  },
  {
    name: "Winifred Taigbenu",
    email: "winifredtaigbenu@circuitpointe.com",
    date: "Apr 15, 2025",
    time: "2:30PM",
  },
  {
    name: "Wasiu Baanu",
    email: "wasiubaanu@circuitpointe.com",
    date: "Apr 23, 2025",
    time: "2:30PM",
  },
];

export const CertificateOfCompletion = () => {
  return (
    <div className="bg-gray-50 min-h-full p-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
        <Card className="w-full max-w-[860px] h-[522px] shadow-[0px_4px_16px_#eae2fd] rounded-[5px] overflow-hidden bg-white">
          <CardContent className="flex flex-col items-center gap-8 p-0 pt-[50px] px-[37px]">
            <div className="flex items-center gap-2">
              <h1 className="font-medium text-[#383838] text-xl leading-[25px]">
                Certificate of Completion
              </h1>
              <Award className="w-8 h-8 text-purple-500" />
            </div>

            <div className="flex flex-col items-start gap-8 w-full">
              <div className="flex flex-col w-[223px] items-start gap-0.5">
                <h2 className="font-medium text-[#383838] text-base leading-5">
                  Company Policy
                </h2>

                <div className="flex items-center gap-[17px] w-full">
                  <span className="font-normal text-[#38383899] text-xs leading-[15px]">
                    Completed - April 23, 2025
                  </span>

                  <Badge className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-100 text-[#10bb4b] hover:bg-green-100 rounded-[30px] font-normal text-xs">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 w-full">
                <h2 className="font-medium text-[#383838] text-base leading-5">
                  Signers
                </h2>

                <div className="w-full border border-solid border-[#e0e5ea] rounded-[5px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f2f4f6] border border-solid border-[#e0e5eb] rounded-[5px_5px_0px_0px]">
                        <TableHead className="w-[188px] py-2.5 pl-[22px] font-normal text-[#383838cc] text-sm leading-[17.5px]">
                          Name
                        </TableHead>
                        <TableHead className="font-normal text-[#383838cc] text-sm leading-[17.5px]">
                          Email
                        </TableHead>
                        <TableHead className="font-normal text-[#383838cc] text-sm leading-[17.5px]">
                          Date Signed
                        </TableHead>
                        <TableHead className="pr-[50px] font-normal text-[#383838cc] text-sm leading-[17.5px]">
                          Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {signers.map((signer, index) => (
                        <TableRow key={index} className="border-none">
                          <TableCell className="py-4 pl-[22px] font-normal text-[#383838cc] text-sm leading-[17.5px]">
                            {signer.name}
                          </TableCell>
                          <TableCell className="font-normal text-[#383838cc] text-sm leading-[17.5px]">
                            {signer.email}
                          </TableCell>
                          <TableCell className="font-normal text-[#383838cc] text-sm leading-[17.5px]">
                            {signer.date}
                          </TableCell>
                          <TableCell className="font-normal text-[#383838cc] text-sm leading-[17.5px]">
                            {signer.time}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-[75px]">
          <Button
            variant="outline"
            className="flex items-center gap-2.5 px-8 py-3 h-auto border border-solid border-[#dfdfdf] rounded-[5px] font-medium text-[#38383880] text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy Certificate Link
          </Button>

          <Button className="flex items-center gap-2.5 px-8 py-3 h-auto bg-violet-600 hover:bg-violet-700 rounded-[5px] font-medium text-white text-sm">
            <Download className="w-4 h-4" />
            Download Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};
