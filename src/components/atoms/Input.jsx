import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-base bg-white border rounded-lg transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "placeholder:text-gray-400",
        error 
          ? "border-error focus:ring-error focus:border-error" 
          : "border-gray-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;