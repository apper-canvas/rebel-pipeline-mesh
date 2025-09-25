import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="text-error" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading your data. Please try again."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} icon="RefreshCw">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;