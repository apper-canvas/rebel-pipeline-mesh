import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "default",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm hover:shadow-md",
    accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-sm hover:shadow-md",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500",
    danger: "bg-error text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:shadow-md"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    default: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  const iconSizes = {
    sm: 16,
    default: 18,
    lg: 20
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className={cn("animate-spin", children ? "mr-2" : "")} size={iconSizes[size]} />
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} className={cn(children ? "mr-2" : "")} size={iconSizes[size]} />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} className={cn(children ? "ml-2" : "")} size={iconSizes[size]} />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;