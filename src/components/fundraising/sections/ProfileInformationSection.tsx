
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const ProfileInformationSection = (): JSX.Element => {
  // Message data for mapping
  const messages = [
    {
      id: 1,
      author: "John Dhoe",
      timestamp: "April 10th, 2:13 AM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nibh sit enim sagittis in duis non dolor sagittis eu.",
      avatar: "https://c.animaapp.com/LmQp0a9i/img/profile-picture-2-5@2x.png",
    },
    {
      id: 2,
      author: "John Dhoe",
      timestamp: "April 10th, 2:13 AM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nibh sit enim sagittis in duis non dolor sagittis eu.",
      avatar: "https://c.animaapp.com/LmQp0a9i/img/profile-picture-2-5@2x.png",
    },
    {
      id: 3,
      author: "John Dhoe",
      timestamp: "April 10th, 2:13 AM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nibh sit enim sagittis in duis non dolor sagittis eu.",
      avatar: "https://c.animaapp.com/LmQp0a9i/img/profile-picture-2-5@2x.png",
    },
  ];

  return (
    <div className="flex flex-row gap-6">
      {/* Communications & Notes */}
      <section className="flex flex-col w-full max-w-[510px] items-start gap-4">
        <h2 className="font-medium text-black text-base [font-family:'Inter',Helvetica]">
          Communications &amp; Notes
        </h2>

        <div className="flex flex-col items-start gap-6 self-stretch w-full">
          <Card className="w-full h-[273px] rounded-[10px] bg-white">
            <ScrollArea className="h-[272px] w-full rounded-[10px]">
              <CardContent className="p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center gap-3 w-full"
                  >
                    <Avatar className="w-11 h-11">
                      <AvatarImage
                        src={message.avatar}
                        alt="Profile picture"
                        className="object-cover"
                      />
                    </Avatar>

                    <div className="flex flex-col w-full items-start gap-2">
                      <div className="inline-flex items-center gap-4">
                        <div className="font-bold text-[#00000099] text-base text-center whitespace-nowrap [font-family:'Inter',Helvetica]">
                          {message.author}
                        </div>

                        <div className="font-normal text-[#0000004c] text-sm text-center [font-family:'Inter',Helvetica]">
                          {message.timestamp}
                        </div>
                      </div>

                      <div className="w-full [font-family:'Inter',Helvetica] font-normal text-[#00000099] text-sm leading-[18px]">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <ScrollBar
                orientation="vertical"
                className="bg-[#eeeeee] rounded-r-[10px] w-[9px]"
              >
                <div className="relative w-[9px] h-[30px] top-2.5 bg-violet-600 rounded-[10px]" />
              </ScrollBar>
            </ScrollArea>
          </Card>

          <Button
            variant="outline"
            className="h-auto px-4 py-3 rounded-[5px] border border-solid border-violet-600 text-violet-600 font-medium text-sm [font-family:'Inter',Helvetica]"
          >
            Add Notes
          </Button>
        </div>
      </section>

      {/* Files */}
      <div className="flex flex-col w-full items-start gap-4">
        <h3 className="font-medium text-black text-base">Files</h3>

        <Card className="w-full border border-dashed border-[#d2d2d2] bg-transparent">
          <CardContent className="flex items-center justify-center h-[272px] p-0">
            <div className="text-center text-[#707070] text-base">
              <span className="font-medium">Drag and drop files here or </span>
              <Button
                variant="link"
                className="font-bold p-0 h-auto text-base text-[#707070]"
              >
                Browse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
