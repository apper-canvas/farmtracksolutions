import { safeFormatDate } from "@/utils/cn";
import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const CropCard = ({ crop, onEdit, onDelete }) => {
const statusConfig = {
    planted: { variant: "planted", icon: "Sprout" },
    growing: { variant: "growing", icon: "TrendingUp" },
    ready: { variant: "ready", icon: "AlertCircle" },
    harvested: { variant: "harvested", icon: "CheckCircle" }
  };

  const config = statusConfig[crop.status_c] || statusConfig.planted;

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
<h3 className="text-lg font-bold text-gray-900">{crop.name_c}</h3>
              <p className="text-sm text-gray-600">{crop.variety_c}</p>
            </div>
          </div>
          <Badge variant={config.variant}>{crop.status_c}</Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Plot/Field:</span>
<span className="font-semibold text-gray-900">{crop.plot_field_c}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-primary" />
            <span className="text-xs">Planted:</span>
            <span className="font-semibold text-gray-900 ml-1">
{safeFormatDate(crop.planting_date_c, "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2 text-primary" />
            <span className="text-xs">Expected Harvest:</span>
<span className="font-semibold text-gray-900 ml-1">
{safeFormatDate(crop.expected_harvest_date_c, "MMM dd, yyyy")}
            </span>
          </div>
</div>

        {crop.notes_c && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{crop.notes_c}</p>
          </div>
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