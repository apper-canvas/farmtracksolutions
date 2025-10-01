import { toast } from 'react-toastify';

const equipmentService = {
  async getAll(searchQuery = '') {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'type_c' } },
          { field: { Name: 'purchase_date_c' } },
          { field: { Name: 'cost_c' } },
          { field: { Name: 'Owner' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'CreatedBy' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'ModifiedBy' } }
        ],
        orderBy: [{ fieldName: 'Id', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      if (searchQuery && searchQuery.trim()) {
        params.whereGroups = [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'name_c',
                    operator: 'Contains',
                    values: [searchQuery.trim()]
                  }
                ],
                operator: ''
              },
              {
                conditions: [
                  {
                    fieldName: 'type_c',
                    operator: 'Contains',
                    values: [searchQuery.trim()]
                  }
                ],
                operator: ''
              }
            ]
          }
        ];
      }

      const response = await apperClient.fetchRecords('equipments_c', params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching equipment:', error?.response?.data?.message || error);
      toast.error('Failed to fetch equipment');
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
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'type_c' } },
          { field: { Name: 'purchase_date_c' } },
          { field: { Name: 'cost_c' } },
          { field: { Name: 'Owner' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'CreatedBy' } },
          { field: { Name: 'ModifiedOn' } },
          { field: { Name: 'ModifiedBy' } }
        ]
      };

      const response = await apperClient.getRecordById('equipments_c', id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching equipment ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to fetch equipment details');
      return null;
    }
  },

  async create(equipmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {};
      
      if (equipmentData.Name) recordData.Name = equipmentData.Name;
      if (equipmentData.Tags) recordData.Tags = equipmentData.Tags;
      if (equipmentData.name_c) recordData.name_c = equipmentData.name_c;
      if (equipmentData.type_c) recordData.type_c = equipmentData.type_c;
      if (equipmentData.purchase_date_c) recordData.purchase_date_c = equipmentData.purchase_date_c;
      if (equipmentData.cost_c !== undefined && equipmentData.cost_c !== null && equipmentData.cost_c !== '') {
        recordData.cost_c = parseFloat(equipmentData.cost_c);
      }

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('equipments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          return { success: false, error: 'Failed to create equipment' };
        }

        if (successful.length > 0) {
          toast.success('Equipment added successfully');
          return { success: true, data: successful[0].data };
        }
      }

      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Error creating equipment:', error?.response?.data?.message || error);
      toast.error('Failed to add equipment');
      return { success: false, error: error?.response?.data?.message || error.message };
    }
  },

  async update(id, equipmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = { Id: id };
      
      if (equipmentData.Name !== undefined) recordData.Name = equipmentData.Name;
      if (equipmentData.Tags !== undefined) recordData.Tags = equipmentData.Tags;
      if (equipmentData.name_c !== undefined) recordData.name_c = equipmentData.name_c;
      if (equipmentData.type_c !== undefined) recordData.type_c = equipmentData.type_c;
      if (equipmentData.purchase_date_c !== undefined) recordData.purchase_date_c = equipmentData.purchase_date_c;
      if (equipmentData.cost_c !== undefined && equipmentData.cost_c !== null && equipmentData.cost_c !== '') {
        recordData.cost_c = parseFloat(equipmentData.cost_c);
      }

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord('equipments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          return { success: false, error: 'Failed to update equipment' };
        }

        if (successful.length > 0) {
          toast.success('Equipment updated successfully');
          return { success: true, data: successful[0].data };
        }
      }

      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Error updating equipment:', error?.response?.data?.message || error);
      toast.error('Failed to update equipment');
      return { success: false, error: error?.response?.data?.message || error.message };
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
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('equipments_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, error: response.message };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false, error: 'Failed to delete equipment' };
        }

        if (successful.length > 0) {
          toast.success('Equipment deleted successfully');
          return { success: true };
        }
      }

      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Error deleting equipment:', error?.response?.data?.message || error);
      toast.error('Failed to delete equipment');
      return { success: false, error: error?.response?.data?.message || error.message };
    }
  }
};

export default equipmentService;