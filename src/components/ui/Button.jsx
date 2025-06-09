'use client'
// akash created this file
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:bg-blue-700 focus-visible:ring-[#573CFA]",
                secondary:
                    "bg-[#E5E7EB] text-black hover:bg-[#D9D9D9] focus-visible:ring-[#FB8D1A]",
                success:
                    "bg-[#02864A] text-white hover:bg-[#03A15C] focus-visible:ring-[#02864A]",
                danger:
                    "bg-[#E8083E] text-white hover:bg-[#F03C65] focus-visible:ring-[#E8083E]",
                neutral:
                    "bg-[#1C1A27] text-white hover:bg-[#2F2D3A] focus-visible:ring-[#1C1A27]",
                outline:
                    "border border-[#573CFA] text-[#573CFA] bg-transparent hover:bg-[#f3f0ff] focus-visible:ring-[#573CFA]",
            },
            size: {
                sm: "h-8 px-3 text-xs",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-6 text-base",
                icon: "h-9 w-9",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            fullWidth: false,
        },
    }
);

const Button = ({ className, variant, size, fullWidth, children, ...props }) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, fullWidth, className }))}
            {...props}
        >
            {children}
        </button>
    );
};

export { Button, buttonVariants };


// for exporting the button

{/* <Button variant="secondary">Secondary Action</Button>
<Button variant="success">Confirm</Button>
<Button variant="danger">Delete</Button>
<Button variant="neutral">Cancel</Button> */}
