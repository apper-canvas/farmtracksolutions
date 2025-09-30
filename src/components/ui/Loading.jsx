import Card from "@/components/atoms/Card";

const Loading = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="p-6 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Loading;