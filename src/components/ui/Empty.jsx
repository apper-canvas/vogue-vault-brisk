import { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Empty = forwardRef(
  ({ className, icon = "ShoppingBag", title, message, action, ...props }, ref) => {
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
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
            <ApperIcon name={icon} size={48} className="text-primary/40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-semibold text-primary">
              {title}
            </h3>
            <p className="text-primary/60">{message}</p>
          </div>
          {action && (
            <Button onClick={action.onClick} variant="primary">
              {action.label}
            </Button>
          )}
        </div>
      </div>
    );
  }
);

Empty.displayName = "Empty";

export default Empty;