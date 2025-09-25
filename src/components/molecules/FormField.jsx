import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  required,
  className,
  children,
  ...props 
}) => {
  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <Select error={error} {...props}>
            {children}
          </Select>
        );
      case "textarea":
        return <Textarea error={error} {...props} />;
      default:
        return <Input type={type} error={error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;