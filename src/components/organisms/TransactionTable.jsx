import { format } from "date-fns";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                    transaction.type === "income"
                      ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200"
                      : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200"
                  )}>
                    <ApperIcon 
                      name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} 
                      className="w-3 h-3 mr-1"
                    />
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {transaction.description}
                </td>
                <td className={cn(
                  "px-6 py-4 whitespace-nowrap text-right text-base font-bold",
                  transaction.type === "income" ? "text-success" : "text-error"
                )}>
                  {transaction.type === "income" ? "+" : "-"}
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onEdit(transaction)}
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onDelete(transaction.Id)}
                      className="text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;