"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-normal rounded-xl",
    "text-sm font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-teal text-white shadow-sm hover:bg-teal-dark",
        secondary:
          "bg-ocean text-white shadow-sm hover:bg-ocean/90",
        coral:
          "bg-coral text-white shadow-sm hover:bg-coral-dark",
        outline:
          "border-2 border-navy/20 bg-transparent text-navy hover:bg-navy/5",
        ghost:
          "text-navy hover:bg-navy/5",
        link:
          "text-teal underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-11 rounded-lg px-3 py-2 text-xs",
        default: "min-h-12 px-5 py-3",
        lg: "min-h-12 rounded-xl px-8 py-3 text-base",
        xl: "min-h-14 rounded-xl px-10 py-3 text-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        />
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
        whileHover={reducedMotion === false && !props.disabled ? (props.whileHover ?? { scale: 1.02 }) : undefined}
        whileTap={reducedMotion === false && !props.disabled ? (props.whileTap ?? { scale: 0.98 }) : undefined}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
