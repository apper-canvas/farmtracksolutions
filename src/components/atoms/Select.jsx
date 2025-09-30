import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className,
  children,
  error,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-base bg-white border rounded-lg transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "cursor-pointer",
        error 
          ? "border-error focus:ring-error focus:border-error" 
          : "border-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;