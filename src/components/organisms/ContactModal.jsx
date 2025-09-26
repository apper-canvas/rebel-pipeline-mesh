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
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_id_c: "",
    title_c: "",
    status_c: "prospect"
  });
const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [createResponse, setCreateResponse] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      if (contact) {
setFormData({
          first_name_c: contact.first_name_c || "",
          last_name_c: contact.last_name_c || "",
          email_c: contact.email_c || "",
          phone_c: contact.phone_c || "",
          company_id_c: contact.company_id_c || "",
          title_c: contact.title_c || "",
          status_c: contact.status_c || "prospect"
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
if (!(formData.first_name_c || '').trim()) newErrors.first_name_c = "First name is required";
    if (!(formData.last_name_c || '').trim()) newErrors.last_name_c = "Last name is required";
    if (!(formData.email_c || '').trim()) newErrors.email_c = "Email is required";
    if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
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
        setCreateResponse(null); // Clear response for updates
        onSave(savedContact);
        onClose();
      } else {
        const response = await contactService.create(formData);
        savedContact = response.contact;
        setCreateResponse(response); // Store the full response
        toast.success("Contact created successfully");
        onSave(savedContact);
        // Don't close modal immediately so user can see response
      }
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
              value={formData.first_name_c}
              onChange={(e) => handleChange("first_name_c", e.target.value)}
              error={errors.first_name_c}
            />
<FormField
              label="Last Name"
              required
              value={formData.last_name_c}
              onChange={(e) => handleChange("last_name_c", e.target.value)}
              error={errors.last_name_c}
            />
          </div>

<FormField
            label="Email"
            type="email"
            required
            value={formData.email_c}
            onChange={(e) => handleChange("email_c", e.target.value)}
            error={errors.email_c}
          />

<FormField
            label="Phone"
            type="tel"
            value={formData.phone_c}
            onChange={(e) => handleChange("phone_c", e.target.value)}
            error={errors.phone_c}
          />

<FormField
            label="Job Title"
            value={formData.title_c}
            onChange={(e) => handleChange("title_c", e.target.value)}
          />

          <FormField
label="Company"
            type="select"
            value={formData.company_id_c}
            onChange={(e) => handleChange("company_id_c", e.target.value)}
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.Id} value={company.Id}>
                {company.name_c}
              </option>
            ))}
          </FormField>

<FormField
            label="Status"
            type="select"
            value={formData.status_c}
            onChange={(e) => handleChange("status_c", e.target.value)}
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

        {/* Display Create Response */}
        {createResponse && (
          <div className="px-6 pb-6">
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">API Response:</h3>
              <pre className="text-xs text-gray-600 overflow-auto max-h-60 whitespace-pre-wrap">
                {JSON.stringify(createResponse, null, 2)}
              </pre>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setCreateResponse(null);
                    onClose();
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactModal;