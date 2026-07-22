import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-bordeaux text-cream-100 hover:bg-bordeaux-900 hover:shadow-lg hover:shadow-bordeaux/20",
        outline:
          "border border-bordeaux/40 bg-transparent text-bordeaux hover:border-bordeaux hover:bg-bordeaux hover:text-cream-100",
        ghost: "text-bordeaux hover:bg-nude/40",
        link: "text-bordeaux underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-7",
        sm: "h-9 px-5 text-xs",
        lg: "h-14 px-10 text-[0.95rem] tracking-wide",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
