
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthButtonProps {
  onClick?: () => void;
}

const MonthButton: React.FC<MonthButtonProps> = ({ onClick }) => (
  <Button variant="outline" size="sm" className="inline-flex items-center gap-2" onClick={onClick}>
    <Search className="mr-2 h-4 w-4" />
    Month
  </Button>
);

export default MonthButton;
