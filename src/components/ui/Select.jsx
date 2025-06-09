import { cn } from "@/lib/utils";

const Select = ({
    label,
    options = [],
    error,
    size = "md",
    className,
    containerClassName,
    labelClassName,
    ...props
}) => {
    const sizes = {
        sm: "h-8 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-lg",
    };

    return (
        <div className={cn("group space-y-2", containerClassName)}>
            {label && (
                <label className={cn(
                    "block text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-[rgb(98,60,231)]",
                    labelClassName
                )}>
                    {label}
                </label>
            )}
            <select
                className={cn(
                    "w-full rounded-lg border border-gray-300 bg-white px-3 outline-none transition-all",
                    "focus:border-[rgb(98,60,231)] focus:ring-1 focus:ring-[rgb(98,60,231)]",
                    "group-hover:border-[rgb(98,60,231)]",
                    "text-gray-600",
                    sizes[size],
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export { Select };