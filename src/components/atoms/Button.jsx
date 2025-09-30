import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "default",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:scale-[1.02] focus:ring-primary",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary/5 focus:ring-primary",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-error"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;