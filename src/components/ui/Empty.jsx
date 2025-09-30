import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, description, actionLabel, onAction, icon = "Inbox" }) => {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-4">
          <ApperIcon name={icon} className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="primary" size="large">
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;