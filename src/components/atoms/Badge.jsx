import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    planted: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200",
    growing: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200",
    ready: "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200",
    harvested: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200",
    high: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200",
    medium: "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200",
    low: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;