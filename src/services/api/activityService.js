import { toast } from 'react-toastify';

class ActivityService {
  constructor() {
    this.tableName = 'activity_c';
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}, 
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
      console.error("Error fetching activities:", error?.response?.data?.message || error.message);
      toast.error("Failed to load activities");
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
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
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error.message);
      toast.error("Failed to load activity");
      return null;
    }
  }

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const cleanData = {};
      if (activityData.type_c !== undefined && activityData.type_c !== null && activityData.type_c !== "") cleanData.type_c = activityData.type_c;
      if (activityData.description_c !== undefined && activityData.description_c !== null && activityData.description_c !== "") cleanData.description_c = activityData.description_c;
      if (activityData.contact_id_c !== undefined && activityData.contact_id_c !== null && activityData.contact_id_c !== "") cleanData.contact_id_c = parseInt(activityData.contact_id_c);
      if (activityData.deal_id_c !== undefined && activityData.deal_id_c !== null && activityData.deal_id_c !== "") cleanData.deal_id_c = parseInt(activityData.deal_id_c);
      if (activityData.created_at_c !== undefined && activityData.created_at_c !== null && activityData.created_at_c !== "") cleanData.created_at_c = activityData.created_at_c;

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
          console.error(`Failed to create ${failed.length} activities: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Activity created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error.message);
      toast.error("Failed to create activity");
      return null;
    }
  }

  async update(id, activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const cleanData = { Id: id };
      if (activityData.type_c !== undefined && activityData.type_c !== null && activityData.type_c !== "") cleanData.type_c = activityData.type_c;
      if (activityData.description_c !== undefined && activityData.description_c !== null && activityData.description_c !== "") cleanData.description_c = activityData.description_c;
      if (activityData.contact_id_c !== undefined && activityData.contact_id_c !== null && activityData.contact_id_c !== "") cleanData.contact_id_c = parseInt(activityData.contact_id_c);
      if (activityData.deal_id_c !== undefined && activityData.deal_id_c !== null && activityData.deal_id_c !== "") cleanData.deal_id_c = parseInt(activityData.deal_id_c);
      if (activityData.created_at_c !== undefined && activityData.created_at_c !== null && activityData.created_at_c !== "") cleanData.created_at_c = activityData.created_at_c;

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
          console.error(`Failed to update ${failed.length} activities: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Activity updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error.message);
      toast.error("Failed to update activity");
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
          console.error(`Failed to delete ${failed.length} activities: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Activity deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete activity");
      return false;
    }
  }
}

export const activityService = new ActivityService();