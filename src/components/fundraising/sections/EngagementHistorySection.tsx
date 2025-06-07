
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EngagementHistorySection = (): JSX.Element => {
  // Profile information data
  const profileData = {
    organization: "FEHD Foundation",
    contactPerson: "FEHD Foundation",
    email: "Millicenterp@gmail.com",
    affiliation: "Lorem ipsum non aliquet fusce",
    companyUrl: "https://FEHDfoundation.com",
    fundingStartTime: "Jan 2024",
    fundingEndTime: "Jan 2024",
  };

  // Interest tags data
  const interestTags = [
    { name: "Health", bgColor: "bg-red-100", textColor: "text-gray-700" },
    { name: "Education", bgColor: "bg-indigo-100", textColor: "text-gray-700" },
    {
      name: "Environment",
      bgColor: "bg-emerald-100",
      textColor: "text-gray-700",
    },
    { name: "Gender", bgColor: "bg-pink-100", textColor: "text-gray-700" },
  ];

  // Engagement history data
  const engagementEntries = [
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
  ];

  return (
    <div className="flex items-start gap-[34px] w-full">
      {/* Profile Information Section */}
      <div className="flex flex-col w-full md:w-1/2 items-start gap-4">
        <h2 className="font-medium text-black text-base">
          Profile Information
        </h2>

        <Card className="w-full h-auto">
          <CardContent className="p-8">
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Organization Name */}
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="text-[#383839b2] text-sm">
                  Name of Organization
                </label>
                <div className="flex items-center gap-2.5 p-2.5 w-full rounded-[5px] border border-solid border-[#dddddd]">
                  <span className="font-medium text-[#383839e6] text-base">
                    {profileData.organization}
                  </span>
                </div>
              </div>

              {/* Contact Person */}
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="text-[#383839b2] text-sm">
                  Name of Contact Person
                </label>
                <div className="flex items-center gap-2.5 p-2.5 w-full rounded-[5px] border border-solid border-[#dddddd]">
                  <span className="font-medium text-[#383839e6] text-base">
                    {profileData.contactPerson}
                  </span>
                </div>
              </div>

              {/* Email Fields */}
              <div className="flex items-center gap-[25px] w-full">
                <div className="flex flex-col w-1/2 items-start gap-2">
                  <label className="text-[#383839b2] text-sm">Email</label>
                  <div className="flex items-center gap-2.5 p-2.5 w-full rounded-[5px] border border-solid border-[#dddddd]">
                    <span className="font-medium text-[#383839e6] text-base">
                      {profileData.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col w-1/2 items-start gap-2">
                  <label className="text-[#383839b2] text-sm">Phone</label>
                  <div className="flex items-center gap-2.5 p-2.5 w-full rounded-[5px] border border-solid border-[#dddddd]">
                    <span className="font-medium text-[#383839e6] text-base">
                      +1-555-0123
                    </span>
                  </div>
                </div>
              </div>

              {/* Affiliation */}
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="text-[#383839b2] text-sm">
                  Affiliation
                </label>
                <div className="flex items-center gap-2.5 p-2.5 w-full rounded-[5px] border border-solid border-[#dddddd]">
                  <span className="font-medium text-[#383839e6] text-base">
                    {profileData.affiliation}
                  </span>
                </div>
              </div>

              {/* Company URL */}
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="text-[#383839b2] text-sm">
                  Company URL
                </label>
                <div className="flex items-center gap-2.5 p-2.5 w-full rounded-[5px] border border-solid border-[#dddddd]">
                  <span className="font-medium text-[#383839e6] text-base">
                    {profileData.companyUrl}
                  </span>
                </div>
              </div>

              {/* Funding Time */}
              <div className="flex items-center gap-[27px]">
                <div className="flex flex-col w-[216px] items-start gap-2">
                  <label className="text-[#383839b2] text-sm">
                    Funding Start Time
                  </label>
                  <Select defaultValue={profileData.fundingStartTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jan 2024">Jan 2024</SelectItem>
                      <SelectItem value="Feb 2024">Feb 2024</SelectItem>
                      <SelectItem value="Mar 2024">Mar 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col w-[216px] items-start gap-2">
                  <label className="text-[#383839b2] text-sm">
                    Funding End Time
                  </label>
                  <Select defaultValue={profileData.fundingEndTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jan 2024">Jan 2024</SelectItem>
                      <SelectItem value="Feb 2024">Feb 2024</SelectItem>
                      <SelectItem value="Mar 2024">Mar 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Interest Tags */}
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="text-[#383839b2] text-sm">
                  Interest Tags
                </label>
                <div className="flex items-center gap-[31px] w-full flex-wrap">
                  {interestTags.map((tag, index) => (
                    <Badge
                      key={index}
                      className={`${tag.bgColor} ${tag.textColor} font-medium text-xs px-5 py-2.5 rounded-[5px]`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-10 text-violet-600 border-violet-600"
            >
              Add Tag
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Engagement History Section */}
      <div className="flex flex-col w-full md:w-1/2 items-start gap-4">
        <h2 className="font-medium text-black text-base">
          Engagement History
        </h2>

        <Card className="w-full">
          <CardContent className="p-8">
            <div className="flex flex-col items-start gap-6 w-full">
              {engagementEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-2 px-2.5 py-3 w-full rounded-[5px] border border-solid border-[#dddddd]"
                >
                  <h3 className="font-semibold text-[#383839] text-sm w-full">
                    {entry.date}
                  </h3>
                  <p className="text-[#383839b2] text-sm w-full">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-10 text-violet-600 border-violet-600"
            >
              Add Engagement Entry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
