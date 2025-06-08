
import React from "react";
import { Calendar, Check, AlertCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Opportunity } from "@/types/opportunity";

interface OpportunitySummaryCardsProps {
  opportunities: Opportunity[];
  month: number;
  year: number;
}

const OpportunitySummaryCards: React.FC<OpportunitySummaryCardsProps> = ({
  opportunities,
  month,
  year
}) => {
  const total = opportunities.length;
  const closed = opportunities.filter(o => o.status === "Awarded" || o.status === "Declined").length;
  const urgent = opportunities.filter(o => {
    const deadline = new Date(o.deadline);
    const now = new Date();
    const urgency = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return urgency < 14 && deadline > now;
  }).length;
  // For Staff Overload: count the max assigned per person (excluding manager)
  const overloadCounts = {};
  opportunities.forEach(o => {
    if (o.assignedTo && o.status !== "Awarded" && o.status !== "Declined") {
      overloadCounts[o.assignedTo] = (overloadCounts[o.assignedTo] || 0) + 1;
    }
  });
  const mostOverload = Object.values(overloadCounts).length
    ? Math.max(...Object.values(overloadCounts) as number[])
    : 0;

  const cards = [
    {
      title: "Total Opportunities",
      count: total,
      icon: <Calendar className="h-5 w-5 text-violet-500" />,
      bg: "bg-violet-50",
    },
    {
      title: "Closed Opportunities",
      count: closed,
      icon: <Check className="h-5 w-5 text-green-500" />,
      bg: "bg-green-50",
    },
    {
      title: "Urgent Deadlines",
      count: urgent,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      bg: "bg-red-50",
    },
    {
      title: "Staff Overload",
      count: mostOverload,
      icon: <Users className="h-5 w-5 text-orange-500" />,
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(card => (
        <Card key={card.title} className={`flex items-center p-4 ${card.bg}`}>
          <div className="flex-shrink-0 mr-4">{card.icon}</div>
          <div>
            <div className="text-lg font-bold">{card.count}</div>
            <div className="text-sm text-gray-600">{card.title}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OpportunitySummaryCards;
