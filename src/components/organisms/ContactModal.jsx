import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const ContactModal = ({ 
  isOpen, 
  onClose, 
  contact = null, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyId: "",
    title: "",
    status: "prospect"
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      if (contact) {
        setFormData({
          firstName: contact.firstName || "",
          lastName: contact.lastName || "",
          email: contact.email || "",
          phone: contact.phone || "",
          companyId: contact.companyId || "",
          title: contact.title || "",
          status: contact.status || "prospect"
        });
      }
    }
  }, [isOpen, contact]);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      toast.error("Failed to load companies");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      let savedContact;
      if (contact) {
        savedContact = await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully");
      } else {
        savedContact = await contactService.create(formData);
        toast.success("Contact created successfully");
      }
      
      onSave(savedContact);
      onClose();
    } catch (error) {
      toast.error("Failed to save contact");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              {contact ? "Edit Contact" : "Add New Contact"}
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={errors.firstName}
            />
            <FormField
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={errors.lastName}
            />
          </div>

          <FormField
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />

          <FormField
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
          />

          <FormField
            label="Job Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <FormField
            label="Company"
            type="select"
            value={formData.companyId}
            onChange={(e) => handleChange("companyId", e.target.value)}
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.Id} value={company.Id}>
                {company.name}
              </option>
            ))}
          </FormField>

          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </FormField>

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
              {contact ? "Update" : "Create"} Contact
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactModal;