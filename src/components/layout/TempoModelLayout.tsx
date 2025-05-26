import React from "react";
import TempoModelSidebar from "./TempoModelSidebar";

interface TempoModelLayoutProps {
  children: React.ReactNode;
}

const TempoModelLayout: React.FC<TempoModelLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block w-64">
        <TempoModelSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default TempoModelLayout;
