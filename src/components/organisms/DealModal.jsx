import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const DealModal = ({ 
  isOpen, 
  onClose, 
  deal = null, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "lead",
    contactId: "",
    probability: 25,
    closeDate: ""
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadContacts();
      if (deal) {
        setFormData({
          title: deal.title || "",
          value: deal.value || "",
          stage: deal.stage || "lead",
          contactId: deal.contactId || "",
          probability: deal.probability || 25,
          closeDate: deal.closeDate ? deal.closeDate.split("T")[0] : ""
        });
      } else {
        // Set default close date to 30 days from now
        const defaultCloseDate = new Date();
        defaultCloseDate.setDate(defaultCloseDate.getDate() + 30);
        setFormData(prev => ({
          ...prev,
          closeDate: defaultCloseDate.toISOString().split("T")[0]
        }));
      }
    }
  }, [isOpen, deal]);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      toast.error("Failed to load contacts");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Deal title is required";
    if (!formData.value || isNaN(formData.value) || formData.value <= 0) {
      newErrors.value = "Value must be a positive number";
    }
    if (!formData.contactId) newErrors.contactId = "Contact is required";
    if (!formData.closeDate) newErrors.closeDate = "Close date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        closeDate: new Date(formData.closeDate).toISOString()
      };

      let savedDeal;
      if (deal) {
        savedDeal = await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully");
      } else {
        savedDeal = await dealService.create(dealData);
        toast.success("Deal created successfully");
      }
      
      onSave(savedDeal);
      onClose();
    } catch (error) {
      toast.error("Failed to save deal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update probability based on stage
    if (field === "stage") {
      const probabilities = {
        lead: 25,
        qualified: 50,
        proposal: 75,
        closed: 100
      };
      setFormData(prev => ({ 
        ...prev, 
        [field]: value, 
        probability: probabilities[value] || 25 
      }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {deal ? "Edit Deal" : "Create New Deal"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Deal Title"
            required
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            placeholder="e.g., Website Redesign Project"
          />

          <FormField
            label="Deal Value"
            type="number"
            required
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            error={errors.value}
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          <FormField
            label="Contact"
            type="select"
            required
            value={formData.contactId}
            onChange={(e) => handleChange("contactId", e.target.value)}
            error={errors.contactId}
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.firstName} {contact.lastName}
              </option>
            ))}
          </FormField>

          <FormField
            label="Stage"
            type="select"
            value={formData.stage}
            onChange={(e) => handleChange("stage", e.target.value)}
          >
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="closed">Closed</option>
          </FormField>

          <FormField
            label="Probability (%)"
            type="number"
            value={formData.probability}
            onChange={(e) => handleChange("probability", e.target.value)}
            min="0"
            max="100"
            step="5"
          />

          <FormField
            label="Expected Close Date"
            type="date"
            required
            value={formData.closeDate}
            onChange={(e) => handleChange("closeDate", e.target.value)}
            error={errors.closeDate}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {deal ? "Update" : "Create"} Deal
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DealModal;