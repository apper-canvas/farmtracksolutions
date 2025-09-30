import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ title, value, icon, gradient, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {value}
            </p>
            {trend && (
              <p className="text-sm text-gray-500 mt-2">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;