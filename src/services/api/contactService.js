import { toast } from 'react-toastify';

class ContactService {
  constructor() {
    this.tableName = 'contact_c';
  }

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "first_name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error.message);
      toast.error("Failed to load contacts");
      return [];
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to load contact");
      return null;
    }
  }

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const cleanData = {};
      if (contactData.first_name_c !== undefined && contactData.first_name_c !== null && contactData.first_name_c !== "") cleanData.first_name_c = contactData.first_name_c;
      if (contactData.last_name_c !== undefined && contactData.last_name_c !== null && contactData.last_name_c !== "") cleanData.last_name_c = contactData.last_name_c;
      if (contactData.email_c !== undefined && contactData.email_c !== null && contactData.email_c !== "") cleanData.email_c = contactData.email_c;
      if (contactData.phone_c !== undefined && contactData.phone_c !== null && contactData.phone_c !== "") cleanData.phone_c = contactData.phone_c;
      if (contactData.company_id_c !== undefined && contactData.company_id_c !== null && contactData.company_id_c !== "") cleanData.company_id_c = parseInt(contactData.company_id_c);
      if (contactData.title_c !== undefined && contactData.title_c !== null && contactData.title_c !== "") cleanData.title_c = contactData.title_c;
      if (contactData.status_c !== undefined && contactData.status_c !== null && contactData.status_c !== "") cleanData.status_c = contactData.status_c;
      if (contactData.created_at_c !== undefined && contactData.created_at_c !== null && contactData.created_at_c !== "") cleanData.created_at_c = contactData.created_at_c;
      if (contactData.updated_at_c !== undefined && contactData.updated_at_c !== null && contactData.updated_at_c !== "") cleanData.updated_at_c = contactData.updated_at_c;

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.createRecord(this.tableName, params);
toast.error(response.message || "Failed to create contact");

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
const createdContact = successful[0].data;
          
          // Return full response for display purposes
          return {
            contact: createdContact,
            response: response,
            successful: successful,
            failed: failed.length > 0 ? failed : null
          };
          
          // Send email notification via Edge function
          try {
            const { ApperClient } = window.ApperSDK;
            const apperClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            });

            // Prepare contact data for email
            const emailData = {
              first_name_c: createdContact.first_name_c,
              last_name_c: createdContact.last_name_c,
              email_c: createdContact.email_c,
              phone_c: createdContact.phone_c,
              title_c: createdContact.title_c,
              status_c: createdContact.status_c,
company_name: createdContact.company_id_c?.Name || 'Unknown Company'
            };

            // Invoke Edge function for email sending (non-blocking)
apperClient.functions.invoke(import.meta.env.VITE_SEND_CONTACT_NOTIFICATION, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(emailData)
            }).then(emailResult => {
              if (emailResult.success) {
                console.log('Email notification sent successfully:', emailResult.data);
              } else {
                console.error('Failed to send email notification:', emailResult.message);
              }
            }).catch(emailError => {
              console.error('Email notification error:', emailError.message);
            });

          } catch (emailError) {
            console.error('Failed to initialize email notification:', emailError.message);
          }

          toast.success("Contact created successfully");
          return createdContact;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error.message);
      toast.error("Failed to create contact");
      return null;
    }
  }

  async update(id, contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const cleanData = { Id: id };
      if (contactData.first_name_c !== undefined && contactData.first_name_c !== null && contactData.first_name_c !== "") cleanData.first_name_c = contactData.first_name_c;
      if (contactData.last_name_c !== undefined && contactData.last_name_c !== null && contactData.last_name_c !== "") cleanData.last_name_c = contactData.last_name_c;
      if (contactData.email_c !== undefined && contactData.email_c !== null && contactData.email_c !== "") cleanData.email_c = contactData.email_c;
      if (contactData.phone_c !== undefined && contactData.phone_c !== null && contactData.phone_c !== "") cleanData.phone_c = contactData.phone_c;
      if (contactData.company_id_c !== undefined && contactData.company_id_c !== null && contactData.company_id_c !== "") cleanData.company_id_c = parseInt(contactData.company_id_c);
      if (contactData.title_c !== undefined && contactData.title_c !== null && contactData.title_c !== "") cleanData.title_c = contactData.title_c;
      if (contactData.status_c !== undefined && contactData.status_c !== null && contactData.status_c !== "") cleanData.status_c = contactData.status_c;
      if (contactData.updated_at_c !== undefined && contactData.updated_at_c !== null && contactData.updated_at_c !== "") cleanData.updated_at_c = contactData.updated_at_c;

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Contact updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error.message);
      toast.error("Failed to update contact");
      return null;
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Contact deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete contact");
      return false;
    }
  }
}

export const contactService = new ContactService();