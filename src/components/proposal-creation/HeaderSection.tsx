
import React from "react";

const HeaderSection: React.FC = () => {
  return (
    <header className="w-full py-3 px-4">
      <div className="flex items-center">
        <h1 className="text-2xl text-[#383839] tracking-normal">
          <span className="font-medium">Proposal Title - </span>
          <span className="font-light">Opportunity Name</span>
        </h1>
      </div>
    </header>
  );
};

export default HeaderSection;
