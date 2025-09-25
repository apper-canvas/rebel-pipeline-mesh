import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import SearchBar from "@/components/molecules/SearchBar";
import ContactListItem from "@/components/molecules/ContactListItem";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ContactModal from "@/components/organisms/ContactModal";
import Button from "@/components/atoms/Button";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadContacts();
    loadCompanies();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
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

const filterContacts = () => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact => 
        `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.email_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.title_c || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => contact.status_c === statusFilter);
    }
    
    setFilteredContacts(filtered);
  };
  
  const handleCreateContact = () => {
    setSelectedContact(null);
    setModalOpen(true);
  };
  
  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };
  
  const handleViewContact = (contact) => {
    window.location.href = `/contacts/${contact.Id}`;
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(contactId);
        setContacts(prev => prev.filter(c => c.Id !== contactId));
        toast.success("Contact deleted successfully");
      } catch (error) {
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleContactSave = (savedContact) => {
    if (selectedContact) {
      setContacts(prev => prev.map(c => c.Id === savedContact.Id ? savedContact : c));
    } else {
      setContacts(prev => [...prev, savedContact]);
    }
  };

  const getCompanyById = (companyId) => {
    return companies.find(company => company.Id === companyId);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">
            Manage your contacts and build stronger relationships
          </p>
        </div>
        <Button 
          icon="Plus"
          onClick={handleCreateContact}
        >
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts by name, email, or title..."
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your search or filter criteria."
            : "Start building your contact database by adding your first contact."
          }
          actionLabel={searchTerm || statusFilter !== "all" ? "" : "Add First Contact"}
          onAction={searchTerm || statusFilter !== "all" ? null : handleCreateContact}
          icon="Users"
        />
      ) : (
        <div className="space-y-4">
          {filteredContacts.map(contact => (
            <ContactListItem
              key={contact.Id}
              contact={contact}
company={getCompanyById(contact.company_id_c)}
              onEdit={handleEditContact}
              onView={handleViewContact}
              onDelete={handleDeleteContact}
            />
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contact={selectedContact}
        onSave={handleContactSave}
      />
    </div>
  );
};

export default Contacts;