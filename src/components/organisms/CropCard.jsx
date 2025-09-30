import { format } from "date-fns";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CropCard = ({ crop, onEdit, onDelete }) => {
  const statusConfig = {
    planted: { variant: "planted", icon: "Sprout" },
    growing: { variant: "growing", icon: "TrendingUp" },
    ready: { variant: "ready", icon: "AlertCircle" },
    harvested: { variant: "harvested", icon: "CheckCircle" }
  };

  const config = statusConfig[crop.status] || statusConfig.planted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
              <ApperIcon name={config.icon} className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{crop.name}</h3>
              <p className="text-sm text-gray-600">{crop.variety}</p>
            </div>
          </div>
          <Badge variant={config.variant}>{crop.status}</Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Plot/Field:</span>
            <span className="font-semibold text-gray-900">{crop.plotField}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Planted:</span>
            <span className="font-semibold text-gray-900">
              {format(new Date(crop.plantingDate), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Expected Harvest:</span>
            <span className="font-semibold text-gray-900">
              {format(new Date(crop.expectedHarvestDate), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        {crop.notes && (
          <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
            {crop.notes}
          </p>
        )}

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="small"
            onClick={() => onEdit(crop)}
            className="flex-1"
          >
            <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => onDelete(crop.Id)}
            className="flex-1"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CropCard;