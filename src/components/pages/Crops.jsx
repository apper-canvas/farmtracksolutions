import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import CropCard from "@/components/organisms/CropCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import cropService from "@/services/api/cropService";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
const [formData, setFormData] = useState({
    farm_c: 1,
    name_c: "",
    variety_c: "",
    plotfield_c: "",
    plantingdate_c: "",
    expectedharvestdate_c: "",
    status_c: "planted",
    notes_c: ""
  });

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cropService.getAll();
      setCrops(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await cropService.update(editingCrop.Id, formData);
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create(formData);
        toast.success("Crop added successfully!");
      }
      
      await loadCrops();
      handleCloseModal();
    } catch (err) {
      toast.error(err.message);
    }
  };

const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farm_c: crop.farm_c?.Id || crop.farm_c || 1,
      name_c: crop.name_c,
      variety_c: crop.variety_c,
      plotfield_c: crop.plotfield_c,
      plantingdate_c: crop.plantingdate_c,
      expectedharvestdate_c: crop.expectedharvestdate_c,
      status_c: crop.status_c,
      notes_c: crop.notes_c
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await cropService.delete(id);
        toast.success("Crop deleted successfully!");
        await loadCrops();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleCloseModal = () => {
setIsModalOpen(false);
    setEditingCrop(null);
    setFormData({
      farm_c: 1,
      name_c: "",
      variety_c: "",
      plotfield_c: "",
      plantingdate_c: "",
      expectedharvestdate_c: "",
      status_c: "planted",
      notes_c: ""
    });
  };

  if (loading) return <Loading count={3} />;
  if (error) return <Error message={error} onRetry={loadCrops} />;

const filteredCrops = filterStatus === "all" 
    ? crops 
    : crops.filter(c => c.status_c === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Crop Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your crops throughout the season</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="large"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Crop
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "planted", "growing", "ready", "harvested"].map(status => (
          <Button
            key={status}
            variant={filterStatus === status ? "primary" : "outline"}
            size="small"
            onClick={() => setFilterStatus(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {filteredCrops.length === 0 ? (
        <Empty
          title="No crops found"
          description="Start by adding your first crop to track its growth and harvest timeline."
          actionLabel="Add First Crop"
          onAction={() => setIsModalOpen(true)}
          icon="Sprout"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.Id}
              crop={crop}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCrop ? "Edit Crop" : "Add New Crop"}
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Crop Name"
              required
              value={formData.name}
onChange={(e) => setFormData({ ...formData, name_c: e.target.value })}
              placeholder="e.g., Tomatoes"
            />
            <FormField
              label="Variety"
              required
              value={formData.variety_c}
              onChange={(e) => setFormData({ ...formData, variety_c: e.target.value })}
              placeholder="e.g., Roma"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Plot/Field"
              required
              value={formData.plotfield_c}
              onChange={(e) => setFormData({ ...formData, plotfield_c: e.target.value })}
              placeholder="e.g., Field A"
            />
            <SelectField
              label="Status"
              required
              value={formData.status_c}
              onChange={(e) => setFormData({ ...formData, status_c: e.target.value })}
            >
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </SelectField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Planting Date"
              type="date"
              required
              value={formData.plantingdate_c}
              onChange={(e) => setFormData({ ...formData, plantingdate_c: e.target.value })}
            />
            <FormField
              label="Expected Harvest Date"
              type="date"
              required
              value={formData.expectedharvestdate_c}
              onChange={(e) => setFormData({ ...formData, expectedharvestdate_c: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Notes
            </label>
            <textarea
              value={formData.notes_c}
              onChange={(e) => setFormData({ ...formData, notes_c: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingCrop ? "Update Crop" : "Add Crop"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Crops;