import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-error to-red-600 flex items-center justify-center mb-4">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-6">{message || "Failed to load data. Please try again."}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;