
// akash created this file
import { cn } from "@/lib/utils";

const Input = ({
    label,
    error,
    className,
    size = "md",
    leftIcon,
    rightIcon,
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
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={cn(
                        "w-full rounded-lg border border-gray-300 bg-white px-3 outline-none transition-all",
                        "placeholder:text-gray-400",
                        "focus:border-[rgb(98,60,231)] focus:ring-1 focus:ring-[rgb(98,60,231)]",
                        "group-hover:border-[rgb(98,60,231)]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "text-[16px]",
                        "text-gray-700",
                        sizes[size],
                        leftIcon && "pl-10",
                        rightIcon && "pr-10",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export { Input };
