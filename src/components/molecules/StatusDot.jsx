import React from "react";
import { cn } from "@/utils/cn";

const StatusDot = ({ status, className }) => {
  const statusColors = {
    active: "bg-success",
    inactive: "bg-gray-400",
    prospect: "bg-warning",
    customer: "bg-primary-500",
    lead: "bg-blue-400",
    qualified: "bg-yellow-500", 
    proposal: "bg-orange-500",
    closed: "bg-success",
    "closed-won": "bg-success",
    "closed-lost": "bg-error"
  };

  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full",
        statusColors[status] || "bg-gray-300",
        className
      )}
    />
  );
};

export default StatusDot;