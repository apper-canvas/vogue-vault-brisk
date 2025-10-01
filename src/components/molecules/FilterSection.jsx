import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterSection = ({ title, options, selected, onChange, type = "checkbox" }) => {
  const handleChange = (value) => {
    if (type === "checkbox") {
      if (selected.includes(value)) {
        onChange(selected.filter((item) => item !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display font-semibold text-lg text-primary">
        {title}
      </h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={cn(
                "w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200",
                selected.includes(option.value)
                  ? "border-accent bg-accent"
                  : "border-secondary group-hover:border-accent"
              )}
            >
              {selected.includes(option.value) && (
                <ApperIcon name="Check" size={14} className="text-white" />
              )}
            </div>
            <span className="text-primary group-hover:text-accent transition-colors duration-200">
              {option.label}
            </span>
            {option.count && (
              <span className="text-sm text-primary/40 ml-auto">
                ({option.count})
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;