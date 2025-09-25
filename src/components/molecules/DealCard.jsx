import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const DealCard = ({ 
  deal, 
  contact, 
  company,
  isDragging = false,
  onClick,
  className 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStageColor = (stage) => {
    const colors = {
      lead: "bg-blue-100 border-blue-200",
      qualified: "bg-yellow-100 border-yellow-200",
      proposal: "bg-orange-100 border-orange-200", 
      closed: "bg-green-100 border-green-200"
    };
    return colors[stage] || "bg-gray-100 border-gray-200";
  };

return (
    <Card className={cn(
      "p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover border-l-4",
      getStageColor(deal.stage_c),
      isDragging && "deal-card-dragging",
      className
    )} onClick={onClick}>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{deal.title_c}</h3>
          <p className="text-lg font-bold text-accent-500 mt-1">
            {formatCurrency(deal.value_c)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
{contact && (
            <>
              <Avatar 
                name={`${contact.first_name_c || ''} ${contact.last_name_c || ''}`}
                size="sm"
              />
              <div className="text-xs">
                <p className="text-gray-900 font-medium">
                  {contact.first_name_c} {contact.last_name_c}
                </p>
                {company && (
                  <p className="text-gray-500">{company.name_c}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
<Badge variant="default" size="sm">
            {deal.probability_c}% probability
          </Badge>
          <span className="text-xs text-gray-500">
            {new Date(deal.close_date_c).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default DealCard;