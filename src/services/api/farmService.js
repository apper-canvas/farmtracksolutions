import { toast } from "react-toastify";

const farmService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
{ field: { Name: "size_c" } },
          { field: { Name: "soil_type_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("farm_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in fetchRecords for farm_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.info(`apper_info: An error occurred in farmService.getAll(). The error is: ${error.message}`);
      toast.error("Failed to load farms");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
{ field: { Name: "size_c" } },
          { field: { Name: "soil_type_c" } }
        ]
      };

      const response = await apperClient.getRecordById("farm_c", parseInt(id), params);

      if (!response.success) {
        console.info(`apper_info: An error was received in getRecordById for farm_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.info(`apper_info: An error occurred in farmService.getById(${id}). The error is: ${error.message}`);
      toast.error("Failed to load farm details");
      return null;
    }
  },

  async create(farmData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          name_c: farmData.name_c,
location_c: farmData.location_c,
          size_c: parseFloat(farmData.size_c),
          soil_type_c: farmData.soil_type_c
        }]
      };

      const response = await apperClient.createRecord("farm_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in createRecord for farm_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to create ${failed.length} farms. Failed records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.info(`apper_info: An error occurred in farmService.create(). The error is: ${error.message}`);
      toast.error("Failed to create farm");
      return null;
    }
  },

  async update(id, farmData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
name_c: farmData.name_c,
          location_c: farmData.location_c,
          size_c: parseFloat(farmData.size_c),
          soil_type_c: farmData.soil_type_c
        }]
      };

      const response = await apperClient.updateRecord("farm_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in updateRecord for farm_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to update ${failed.length} farms. Failed records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.info(`apper_info: An error occurred in farmService.update(${id}). The error is: ${error.message}`);
      toast.error("Failed to update farm");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("farm_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in deleteRecord for farm_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to delete ${failed.length} farms. Failed records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.info(`apper_info: An error occurred in farmService.delete(${id}). The error is: ${error.message}`);
      toast.error("Failed to delete farm");
      return false;
    }
  }
};

export default farmService;