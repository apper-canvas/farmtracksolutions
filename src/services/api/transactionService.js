import { toast } from "react-toastify";

const transactionService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "farm_c" }, referenceField: { field: { Name: "name_c" } } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("transaction_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in fetchRecords for transaction_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.info(`apper_info: An error occurred in transactionService.getAll(). The error is: ${error.message}`);
      toast.error("Failed to load transactions");
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
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "farm_c" }, referenceField: { field: { Name: "name_c" } } }
        ]
      };

      const response = await apperClient.getRecordById("transaction_c", parseInt(id), params);

      if (!response.success) {
        console.info(`apper_info: An error was received in getRecordById for transaction_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.info(`apper_info: An error occurred in transactionService.getById(${id}). The error is: ${error.message}`);
      toast.error("Failed to load transaction details");
      return null;
    }
  },

  async create(transactionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          type_c: transactionData.type_c,
          amount_c: parseFloat(transactionData.amount_c),
          category_c: transactionData.category_c,
          description_c: transactionData.description_c || "",
          date_c: transactionData.date_c,
          farm_c: parseInt(transactionData.farm_c)
        }]
      };

      const response = await apperClient.createRecord("transaction_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in createRecord for transaction_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to create ${failed.length} transactions. Failed records: ${JSON.stringify(failed)}`);
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
      console.info(`apper_info: An error occurred in transactionService.create(). The error is: ${error.message}`);
      toast.error("Failed to create transaction");
      return null;
    }
  },

  async update(id, transactionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const payload = {
        records: [{
          Id: parseInt(id),
          type_c: transactionData.type_c,
          amount_c: parseFloat(transactionData.amount_c),
          category_c: transactionData.category_c,
          description_c: transactionData.description_c || "",
          date_c: transactionData.date_c,
          farm_c: parseInt(transactionData.farm_c)
        }]
      };

      const response = await apperClient.updateRecord("transaction_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in updateRecord for transaction_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to update ${failed.length} transactions. Failed records: ${JSON.stringify(failed)}`);
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
      console.info(`apper_info: An error occurred in transactionService.update(${id}). The error is: ${error.message}`);
      toast.error("Failed to update transaction");
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

      const response = await apperClient.deleteRecord("transaction_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in deleteRecord for transaction_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to delete ${failed.length} transactions. Failed records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.info(`apper_info: An error occurred in transactionService.delete(${id}). The error is: ${error.message}`);
      toast.error("Failed to delete transaction");
      return false;
    }
  }
};

export default transactionService;