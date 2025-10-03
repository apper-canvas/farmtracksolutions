import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Modal from "@/components/molecules/Modal";
import SelectField from "@/components/molecules/SelectField";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import farmService from "@/services/api/farmService";

function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
const [formData, setFormData] = useState({
    name_c: "",
    location_c: "",
    size_c: "",
    soil_type_c: "",
    farm_type_c: "",
    weather_summary_c: ""
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (farm = null) => {
    if (farm) {
      setEditingFarm(farm);
setFormData({
        name_c: farm.name_c || "",
        location_c: farm.location_c || "",
        size_c: farm.size_c || "",
        soil_type_c: farm.soil_type_c || "",
        farm_type_c: farm.farm_type_c || "",
        weather_summary_c: farm.weather_summary_c || ""
      });
    } else {
      setEditingFarm(null);
setFormData({
        name_c: "",
        location_c: "",
        size_c: "",
        soil_type_c: "",
        farm_type_c: "",
        weather_summary_c: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFarm(null);
setFormData({
      name_c: "",
      location_c: "",
      size_c: "",
      soil_type_c: "",
      farm_type_c: "",
      weather_summary_c: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.name_c || !formData.location_c || !formData.size_c || !formData.soil_type_c || !formData.farm_type_c || !formData.weather_summary_c) {
      toast.error("All fields are required");
      return;
    }

    if (parseFloat(formData.size_c) <= 0) {
      toast.error("Farm size must be greater than 0");
      return;
    }

    try {
      if (editingFarm) {
        await farmService.update(editingFarm.Id, formData);
        toast.success("Farm updated successfully");
      } else {
        await farmService.create(formData);
        toast.success("Farm created successfully");
      }
      handleCloseModal();
      loadFarms();
    } catch (err) {
      toast.error(editingFarm ? "Failed to update farm" : "Failed to create farm");
    }
  };

  const handleDelete = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        await farmService.delete(farmId);
        toast.success("Farm deleted successfully");
        loadFarms();
      } catch (err) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Farms
          </h1>
          <p className="text-gray-600 mt-1">Manage your farm locations and details</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Farm
        </Button>
      </div>

      {farms.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <ApperIcon name="Warehouse" className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No farms found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first farm</p>
              <Button onClick={() => handleOpenModal()}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Farm
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm, index) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <ApperIcon name="Warehouse" className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {farm.name_c}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                    <span className="text-sm">{farm.location_c}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Maximize" className="w-4 h-4 mr-2" />
                    <span className="text-sm">{farm.size_c} acres</span>
</div>
                  <div className="h-4"></div>
</div>
                <FormField
                  label="Soil Type"
                  name="soil_type_c"
                  value={formData.soil_type_c}
                  onChange={handleInputChange}
                  placeholder="e.g., Clay, Sandy, Loamy"
                  required
                />
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleOpenModal(farm)}
                    className="flex-1"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleDelete(farm.Id)}
                    className="flex-1 text-error hover:bg-error hover:text-white border-error"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFarm ? "Edit Farm" : "Add New Farm"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Farm Name"
            name="name_c"
            value={formData.name_c}
            onChange={handleInputChange}
            placeholder="Enter farm name"
            required
          />
          <FormField
            label="Location"
            name="location_c"
            value={formData.location_c}
            onChange={handleInputChange}
            placeholder="Enter farm location"
            required
          />
<FormField
            label="Size (acres)"
            name="size_c"
            type="number"
            value={formData.size_c}
            onChange={handleInputChange}
            placeholder="Enter farm size"
            required
            step="0.01"
            min="0.01"
          />
<SelectField
            label="Soil Type"
            name="soil_type_c"
            value={formData.soil_type_c || ''}
            onChange={handleInputChange}
          >
            <option value="">Select soil type</option>
            <option value="Sandy">Sandy</option>
            <option value="Silty">Silty</option>
            <option value="Clay">Clay</option>
            <option value="Loamy">Loamy</option>
          </SelectField>
          <SelectField
            label="Farm Type"
            name="farm_type_c"
            value={formData.farm_type_c || ''}
            onChange={handleInputChange}
          >
            <option value="">Select farm type</option>
            <option value="Crop Farm">Crop Farm</option>
            <option value="Livestock Farm">Livestock Farm</option>
            <option value="Mixed Farm">Mixed Farm</option>
<option value="Orchard">Orchard</option>
            <option value="Vineyard">Vineyard</option>
          </SelectField>
          <FormField
            label="Weather Summary"
            name="weather_summary_c"
            value={formData.weather_summary_c}
            onChange={handleInputChange}
            placeholder="Enter weather summary..."
            multiline
            rows={4}
          />
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingFarm ? "Update Farm" : "Create Farm"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Farms;