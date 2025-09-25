import React, { useState } from "react";
import { toast } from "react-toastify";
import DealCard from "@/components/molecules/DealCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";

const PipelineBoard = ({ 
  deals, 
  contacts, 
  companies, 
  onDealUpdate,
  onCreateDeal,
  onEditDeal 
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const stages = [
    { id: "lead", name: "Lead", color: "bg-blue-100 border-blue-200" },
    { id: "qualified", name: "Qualified", color: "bg-yellow-100 border-yellow-200" },
    { id: "proposal", name: "Proposal", color: "bg-orange-100 border-orange-200" },
    { id: "closed", name: "Closed", color: "bg-green-100 border-green-200" }
  ];

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getCompanyById = (companyId) => {
    return companies.find(company => company.Id === companyId);
  };

  const getStageValue = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((total, deal) => total + (deal.value || 0), 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    setDragOverColumn(stage);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedDeal && draggedDeal.stage !== targetStage) {
      try {
        const updatedDeal = await dealService.update(draggedDeal.Id, {
          ...draggedDeal,
          stage: targetStage
        });
        onDealUpdate(updatedDeal);
        toast.success("Deal moved successfully");
      } catch (error) {
        toast.error("Failed to move deal");
      }
    }
    setDraggedDeal(null);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const stageValue = getStageValue(stage.id);
        
        return (
          <div
            key={stage.id}
            className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg ${
              dragOverColumn === stage.id ? "deal-column-drag-over" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <p className="text-sm text-gray-600">
                    {stageDeals.length} deals • {formatCurrency(stageValue)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Plus"
                  onClick={() => onCreateDeal(stage.id)}
                />
              </div>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                {stageDeals.map((deal) => {
                  const contact = getContactById(deal.contactId);
                  const company = contact ? getCompanyById(contact.companyId) : null;
                  
                  return (
                    <div
                      key={deal.Id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      className="cursor-move"
                    >
                      <DealCard
                        deal={deal}
                        contact={contact}
                        company={company}
                        onClick={() => onEditDeal(deal)}
                        isDragging={draggedDeal?.Id === deal.Id}
                      />
                    </div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Target" className="mx-auto mb-2" size={24} />
                    <p className="text-sm">No deals in {stage.name.toLowerCase()}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => onCreateDeal(stage.id)}
                    >
                      Add Deal
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;