import { toast } from 'react-toastify';

class CompanyService {
  constructor() {
    this.tableName = 'company_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
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
      console.error("Error fetching companies:", error?.response?.data?.message || error.message);
      toast.error("Failed to load companies");
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "created_at_c"}}
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
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to load company");
      return null;
    }
  }

  async create(companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const cleanData = {};
      if (companyData.name_c !== undefined && companyData.name_c !== null && companyData.name_c !== "") cleanData.name_c = companyData.name_c;
      if (companyData.industry_c !== undefined && companyData.industry_c !== null && companyData.industry_c !== "") cleanData.industry_c = companyData.industry_c;
      if (companyData.size_c !== undefined && companyData.size_c !== null && companyData.size_c !== "") cleanData.size_c = companyData.size_c;
      if (companyData.website_c !== undefined && companyData.website_c !== null && companyData.website_c !== "") cleanData.website_c = companyData.website_c;
      if (companyData.address_c !== undefined && companyData.address_c !== null && companyData.address_c !== "") cleanData.address_c = companyData.address_c;
      if (companyData.created_at_c !== undefined && companyData.created_at_c !== null && companyData.created_at_c !== "") cleanData.created_at_c = companyData.created_at_c;

      const params = {
        records: [cleanData]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Company created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error.message);
      toast.error("Failed to create company");
      return null;
    }
  }

  async update(id, companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const cleanData = { Id: id };
      if (companyData.name_c !== undefined && companyData.name_c !== null && companyData.name_c !== "") cleanData.name_c = companyData.name_c;
      if (companyData.industry_c !== undefined && companyData.industry_c !== null && companyData.industry_c !== "") cleanData.industry_c = companyData.industry_c;
      if (companyData.size_c !== undefined && companyData.size_c !== null && companyData.size_c !== "") cleanData.size_c = companyData.size_c;
      if (companyData.website_c !== undefined && companyData.website_c !== null && companyData.website_c !== "") cleanData.website_c = companyData.website_c;
      if (companyData.address_c !== undefined && companyData.address_c !== null && companyData.address_c !== "") cleanData.address_c = companyData.address_c;

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
          console.error(`Failed to update ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Company updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error.message);
      toast.error("Failed to update company");
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
          console.error(`Failed to delete ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Company deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete company");
      return false;
    }
  }
}

export const companyService = new CompanyService();