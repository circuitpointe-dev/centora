
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const DocumentCanvas = () => {
  return (
    <div className="col-span-6">
      <Card className="h-full rounded-[5px] shadow-sm border">
        <CardContent className="p-0 h-full">
          <div className="h-10 border-b flex items-center justify-between px-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ArrowLeft className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </Button>
              <span className="text-xs text-gray-600">Zoom: 50%</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
              >
                Preview
              </Button>
            </div>
          </div>

          <div className="p-4 h-full bg-gray-100 overflow-auto">
            <div className="bg-white rounded-[5px] shadow-sm p-6 max-w-2xl mx-auto min-h-[400px]">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">
                    Company Policy Acknowledgement
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-xs text-gray-900 mb-1">
                      Company Policy Statement
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      We maintain clear expectations for behavior,
                      confidentiality, and professionalism within our
                      organization.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-700 mb-1">
                      All employees are required to:
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 ml-3">
                      <li>
                        Follow all company policies and procedures as
                        stated in the employee handbook.
                      </li>
                      <li>
                        Maintain confidentiality of internal
                        information.
                      </li>
                      <li>
                        Conduct themselves with professionalism,
                        respect, and integrity in all work-related
                        activities.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs text-gray-700">
                      By signing this document, you confirm that you
                      have read, understood, and agree to comply with
                      the stated policies.
                    </p>
                  </div>

                  <div className="space-y-4 mt-8">
                    <div>
                      <h4 className="font-medium text-xs text-gray-900 mb-3">
                        Acknowledgement
                      </h4>
                      <p className="text-xs text-gray-700 mb-4">
                        I acknowledge that I have reviewed the Company
                        Policy and agree to abide by its guidelines.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-900">
                          Signature:
                        </span>
                        <div className="border-b border-gray-300 mt-1 h-6"></div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900">
                          Name:
                        </span>
                        <div className="border-b border-gray-300 mt-1 h-6"></div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900">
                          Date:
                        </span>
                        <div className="border-b border-gray-300 mt-1 h-6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
