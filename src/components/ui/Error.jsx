import { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = forwardRef(({ className, message, onRetry, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "w-full min-h-[400px] flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={40} className="text-error" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-semibold text-primary">
            Oops! Something went wrong
          </h3>
          <p className="text-primary/60">
            {message || "We encountered an error loading this content."}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
});

Error.displayName = "Error";

export default Error;