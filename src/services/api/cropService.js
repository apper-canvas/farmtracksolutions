import { toast } from "react-toastify";

const cropService = {
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
          { field: { Name: "variety_c" } },
          { field: { Name: "plotfield_c" } },
          { field: { Name: "plantingdate_c" } },
          { field: { Name: "expectedharvestdate_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_c" }, referenceField: { field: { Name: "name_c" } } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("crop_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in fetchRecords for crop_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.info(`apper_info: An error occurred in cropService.getAll(). The error is: ${error.message}`);
      toast.error("Failed to load crops");
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
          { field: { Name: "variety_c" } },
          { field: { Name: "plotfield_c" } },
          { field: { Name: "plantingdate_c" } },
          { field: { Name: "expectedharvestdate_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_c" }, referenceField: { field: { Name: "name_c" } } }
        ]
      };

      const response = await apperClient.getRecordById("crop_c", parseInt(id), params);

      if (!response.success) {
        console.info(`apper_info: An error was received in getRecordById for crop_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.info(`apper_info: An error occurred in cropService.getById(${id}). The error is: ${error.message}`);
      toast.error("Failed to load crop details");
      return null;
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          name_c: cropData.name_c,
          variety_c: cropData.variety_c,
          plotfield_c: cropData.plotfield_c,
          plantingdate_c: cropData.plantingdate_c,
          expectedharvestdate_c: cropData.expectedharvestdate_c,
          status_c: cropData.status_c,
          notes_c: cropData.notes_c || "",
          farm_c: parseInt(cropData.farm_c)
        }]
      };

      const response = await apperClient.createRecord("crop_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in createRecord for crop_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to create ${failed.length} crops. Failed records: ${JSON.stringify(failed)}`);
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
      console.info(`apper_info: An error occurred in cropService.create(). The error is: ${error.message}`);
      toast.error("Failed to create crop");
      return null;
    }
  },

  async update(id, cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: cropData.name_c,
          variety_c: cropData.variety_c,
          plotfield_c: cropData.plotfield_c,
          plantingdate_c: cropData.plantingdate_c,
          expectedharvestdate_c: cropData.expectedharvestdate_c,
          status_c: cropData.status_c,
          notes_c: cropData.notes_c || "",
          farm_c: parseInt(cropData.farm_c)
        }]
      };

      const response = await apperClient.updateRecord("crop_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in updateRecord for crop_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to update ${failed.length} crops. Failed records: ${JSON.stringify(failed)}`);
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
      console.info(`apper_info: An error occurred in cropService.update(${id}). The error is: ${error.message}`);
      toast.error("Failed to update crop");
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

      const response = await apperClient.deleteRecord("crop_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in deleteRecord for crop_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to delete ${failed.length} crops. Failed records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.info(`apper_info: An error occurred in cropService.delete(${id}). The error is: ${error.message}`);
      toast.error("Failed to delete crop");
      return false;
    }
  }
};
export default cropService;