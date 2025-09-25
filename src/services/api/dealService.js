import { toast } from 'react-toastify';

class DealService {
  constructor() {
    this.tableName = 'deal_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "close_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
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
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      toast.error("Failed to load deals");
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "close_date_c"}},
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
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to load deal");
      return null;
    }
  }

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields and format properly
      const cleanData = {};
      if (dealData.title_c !== undefined && dealData.title_c !== null && dealData.title_c !== "") cleanData.title_c = dealData.title_c;
      if (dealData.value_c !== undefined && dealData.value_c !== null && dealData.value_c !== "") cleanData.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c !== undefined && dealData.stage_c !== null && dealData.stage_c !== "") cleanData.stage_c = dealData.stage_c;
      if (dealData.contact_id_c !== undefined && dealData.contact_id_c !== null && dealData.contact_id_c !== "") cleanData.contact_id_c = parseInt(dealData.contact_id_c);
      if (dealData.company_id_c !== undefined && dealData.company_id_c !== null && dealData.company_id_c !== "") cleanData.company_id_c = parseInt(dealData.company_id_c);
      if (dealData.probability_c !== undefined && dealData.probability_c !== null && dealData.probability_c !== "") cleanData.probability_c = parseInt(dealData.probability_c);
      if (dealData.close_date_c !== undefined && dealData.close_date_c !== null && dealData.close_date_c !== "") cleanData.close_date_c = dealData.close_date_c;
      if (dealData.created_at_c !== undefined && dealData.created_at_c !== null && dealData.created_at_c !== "") cleanData.created_at_c = dealData.created_at_c;

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
          console.error(`Failed to create ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Deal created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to create deal");
      return null;
    }
  }

  async update(id, dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields and format properly
      const cleanData = { Id: id };
      if (dealData.title_c !== undefined && dealData.title_c !== null && dealData.title_c !== "") cleanData.title_c = dealData.title_c;
      if (dealData.value_c !== undefined && dealData.value_c !== null && dealData.value_c !== "") cleanData.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c !== undefined && dealData.stage_c !== null && dealData.stage_c !== "") cleanData.stage_c = dealData.stage_c;
      if (dealData.contact_id_c !== undefined && dealData.contact_id_c !== null && dealData.contact_id_c !== "") cleanData.contact_id_c = parseInt(dealData.contact_id_c);
      if (dealData.company_id_c !== undefined && dealData.company_id_c !== null && dealData.company_id_c !== "") cleanData.company_id_c = parseInt(dealData.company_id_c);
      if (dealData.probability_c !== undefined && dealData.probability_c !== null && dealData.probability_c !== "") cleanData.probability_c = parseInt(dealData.probability_c);
      if (dealData.close_date_c !== undefined && dealData.close_date_c !== null && dealData.close_date_c !== "") cleanData.close_date_c = dealData.close_date_c;

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
          console.error(`Failed to update ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Deal updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to update deal");
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
          console.error(`Failed to delete ${failed.length} deals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Deal deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete deal");
      return false;
    }
  }
}

export const dealService = new DealService();