import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [defaultStage, setDefaultStage] = useState("lead");

  useEffect(() => {
    loadDeals();
    loadContacts();
    loadCompanies();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      setError("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      console.error("Failed to load companies", err);
    }
  };

  const handleCreateDeal = (stage = "lead") => {
    setDefaultStage(stage);
    setSelectedDeal(null);
    setModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setModalOpen(true);
  };

  const handleDealSave = (savedDeal) => {
    if (selectedDeal) {
      setDeals(prev => prev.map(d => d.Id === savedDeal.Id ? savedDeal : d));
    } else {
      setDeals(prev => [...prev, savedDeal]);
    }
  };

  const handleDealUpdate = (updatedDeal) => {
    setDeals(prev => prev.map(d => d.Id === updatedDeal.Id ? updatedDeal : d));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTotalPipelineValue = () => {
return deals.reduce((total, deal) => total + (deal.value_c || 0), 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDeals} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600">
              {deals.length} active deals
            </p>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <p className="text-gray-600">
              {formatCurrency(getTotalPipelineValue())} total value
            </p>
          </div>
        </div>
        <Button 
          icon="Plus"
          onClick={() => handleCreateDeal()}
        >
          New Deal
        </Button>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <Empty
          title="No deals in your pipeline"
          description="Start tracking your sales opportunities by creating your first deal."
          actionLabel="Create First Deal"
          onAction={() => handleCreateDeal()}
          icon="Target"
        />
      ) : (
        <PipelineBoard
          deals={deals}
          contacts={contacts}
          companies={companies}
          onDealUpdate={handleDealUpdate}
          onCreateDeal={handleCreateDeal}
          onEditDeal={handleEditDeal}
        />
      )}

      {/* Deal Modal */}
      <DealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
deal={selectedDeal ? { ...selectedDeal, stage_c: selectedDeal.stage_c || defaultStage } : { stage_c: defaultStage }}
        onSave={handleDealSave}
      />
    </div>
  );
};

export default Deals;