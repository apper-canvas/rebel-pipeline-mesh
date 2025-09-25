import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white border border-gray-200 rounded-lg shadow-card p-6",
      className
    )}
    {...props}
  />
));

Card.displayName = "Card";

export default Card;