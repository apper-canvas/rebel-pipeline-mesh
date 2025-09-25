import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCompanies();
    loadContacts();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies");
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

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company => 
company.name_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry_c.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  };
const getCompanyContacts = (companyId) => {
    return contacts.filter(contact => contact.company_id_c === companyId);
  };

  const handleViewCompany = (company) => {
    window.location.href = `/companies/${company.Id}`;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage your company relationships and track business opportunities
          </p>
        </div>
        <Button 
          icon="Plus"
          onClick={() => toast.info("Company creation feature coming soon")}
        >
          Add Company
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search companies by name or industry..."
        />
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description={searchTerm 
            ? "Try adjusting your search criteria."
            : "Companies will appear here as you add contacts associated with them."
          }
          icon="Building2"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => {
            const companyContacts = getCompanyContacts(company.Id);
            
            return (
              <Card 
                key={company.Id} 
                className="hover:shadow-card-hover transition-shadow cursor-pointer"
                onClick={() => handleViewCompany(company)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Building2" className="text-primary-600" size={24} />
                      </div>
                      <div>
<h3 className="font-semibold text-gray-900">{company.name_c}</h3>
                        <p className="text-sm text-gray-600">{company.industry_c}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" icon="ExternalLink" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Size</p>
<p className="text-gray-900 font-medium">{company.size_c}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contacts</p>
                      <p className="text-gray-900 font-medium">{companyContacts.length}</p>
                    </div>
                  </div>

{company.website_c && (
                    <div className="text-sm">
                      <p className="text-gray-500">Website</p>
                      <a 
                        href={company.website_c} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {company.website_c}
                      </a>
                    </div>
                  )}

{company.address_c && (
                    <div className="text-sm">
                      <p className="text-gray-500">Address</p>
                      <p className="text-gray-900">{company.address_c}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
<span>Added {new Date(company.created_at_c).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Users" size={14} />
                        <span>{companyContacts.length} contacts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Companies;