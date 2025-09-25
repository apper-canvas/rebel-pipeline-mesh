import React from "react";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ContactListItem = ({ 
  contact, 
  company,
  onEdit, 
  onView, 
  className 
}) => {
  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "default",
      prospect: "warning",
      customer: "primary"
    };
    return variants[status] || "default";
  };

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-card-hover transition-shadow duration-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar 
            name={`${contact.firstName} ${contact.lastName}`}
            size="default"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-gray-600">{contact.title}</p>
            {company && (
              <p className="text-sm text-gray-500">{company.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">{contact.email}</p>
            <p className="text-sm text-gray-500">{contact.phone}</p>
          </div>
          <Badge variant={getStatusVariant(contact.status)}>
            {contact.status}
          </Badge>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Eye"
              onClick={() => onView(contact)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit(contact)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactListItem;