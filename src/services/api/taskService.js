import { toast } from "react-toastify";

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completedat_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" }, referenceField: { field: { Name: "Name" } } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords("task_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in fetchRecords for task_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.info(`apper_info: An error occurred in taskService.getAll(). The error is: ${error.message}`);
      toast.error("Failed to load tasks");
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completedat_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      };

      const response = await apperClient.getRecordById("task_c", parseInt(id), params);

      if (!response.success) {
        console.info(`apper_info: An error was received in getRecordById for task_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.info(`apper_info: An error occurred in taskService.getById(${id}). The error is: ${error.message}`);
      toast.error("Failed to load task details");
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const payload = {
        records: [{
          title_c: taskData.title_c,
          description_c: taskData.description_c || "",
          due_date_c: taskData.due_date_c,
          priority_c: taskData.priority_c,
          farm_id_c: parseInt(taskData.farm_id_c),
          ...(taskData.crop_id_c && { crop_id_c: parseInt(taskData.crop_id_c) })
        }]
      };

      const response = await apperClient.createRecord("task_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in createRecord for task_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to create ${failed.length} tasks. Failed records: ${JSON.stringify(failed)}`);
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
      console.info(`apper_info: An error occurred in taskService.create(). The error is: ${error.message}`);
      toast.error("Failed to create task");
      return null;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const payload = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title_c,
          description_c: taskData.description_c || "",
          due_date_c: taskData.due_date_c,
          priority_c: taskData.priority_c,
          farm_id_c: parseInt(taskData.farm_id_c),
          ...(taskData.crop_id_c && { crop_id_c: parseInt(taskData.crop_id_c) })
        }]
      };

      const response = await apperClient.updateRecord("task_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in updateRecord for task_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to update ${failed.length} tasks. Failed records: ${JSON.stringify(failed)}`);
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
      console.info(`apper_info: An error occurred in taskService.update(${id}). The error is: ${error.message}`);
      toast.error("Failed to update task");
      return null;
    }
  },

  async toggleComplete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const taskResponse = await this.getById(id);
      if (!taskResponse) {
        toast.error("Task not found");
        return null;
      }

      const newCompletedStatus = !taskResponse.completed_c;
      const payload = {
        records: [{
          Id: parseInt(id),
          completed_c: newCompletedStatus,
          completedat_c: newCompletedStatus ? new Date().toISOString() : null
        }]
      };

      const response = await apperClient.updateRecord("task_c", payload);

      if (!response.success) {
        console.info(`apper_info: An error was received in toggleComplete for task_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to toggle ${failed.length} tasks. Failed records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.info(`apper_info: An error occurred in taskService.toggleComplete(${id}). The error is: ${error.message}`);
      toast.error("Failed to update task status");
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

      const response = await apperClient.deleteRecord("task_c", params);

      if (!response.success) {
        console.info(`apper_info: An error was received in deleteRecord for task_c. The response body is: ${JSON.stringify(response)}.`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.info(`apper_info: Failed to delete ${failed.length} tasks. Failed records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.info(`apper_info: An error occurred in taskService.delete(${id}). The error is: ${error.message}`);
      toast.error("Failed to delete task");
      return false;
    }
  }
};

export default taskService;