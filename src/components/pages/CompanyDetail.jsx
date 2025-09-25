import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadCompanyData();
    }
  }, [id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const companyData = await companyService.getById(parseInt(id));
      setCompany(companyData);

      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);

      const companyContacts = contactsData.filter(contact => contact.companyId === companyData.Id);
      setContacts(companyContacts);

      const companyDeals = dealsData.filter(deal => 
        companyContacts.some(contact => contact.Id === deal.contactId)
      );
      setDeals(companyDeals);
    } catch (err) {
      setError("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTotalDealsValue = () => {
    return deals.reduce((total, deal) => total + (deal.value || 0), 0);
  };

  const handleViewContact = (contact) => {
    window.location.href = `/contacts/${contact.Id}`;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanyData} />;
  if (!company) return <Error message="Company not found" />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          icon="ArrowLeft"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-2xl font-bold text-gray-900">Company Details</h1>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Building2" className="text-primary-600" size={32} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                <p className="text-gray-600 mt-1">{company.industry}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Size</p>
                      <p className="text-gray-900">{company.size}</p>
                    </div>
                    {company.website && (
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                        >
                          <span>{company.website}</span>
                          <ApperIcon name="ExternalLink" size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {company.address && (
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">{company.address}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Added</p>
                      <p className="text-gray-900">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Deal Value</p>
                <p className="text-2xl font-bold text-accent-500">
                  {formatCurrency(getTotalDealsValue())}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Contacts and Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contacts ({contacts.length})</h3>
          <div className="space-y-3">
            {contacts.map(contact => (
              <div 
                key={contact.Id} 
                className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleViewContact(contact)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar 
                    name={`${contact.firstName} ${contact.lastName}`}
                    size="sm"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{contact.title}</p>
                  </div>
                  <ApperIcon name="ChevronRight" className="text-gray-400" size={16} />
                </div>
              </div>
            ))}
            {contacts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No contacts yet</p>
            )}
          </div>
        </Card>

        {/* Deals */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Deals ({deals.length})</h3>
          <div className="space-y-3">
            {deals.map(deal => (
              <div key={deal.Id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{deal.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">{deal.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent-500">
                      {formatCurrency(deal.value)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deal.probability}% probability
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {deals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No deals yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetail;