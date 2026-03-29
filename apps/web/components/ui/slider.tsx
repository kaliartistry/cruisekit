"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/*  Slider                                                             */
/* ------------------------------------------------------------------ */

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Format the value shown in the tooltip. Defaults to `String(value)`. */
  formatValue?: (value: number) => string;
  /** Hide the tooltip entirely. */
  hideTooltip?: boolean;
}

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      defaultValue,
      value,
      formatValue = String,
      hideTooltip = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      value ?? defaultValue ?? [0]
    );
    const [isDragging, setIsDragging] = React.useState(false);

    const displayValue = value ?? internalValue;

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          setInternalValue(v);
          props.onValueChange?.(v);
        }}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        {...props}
      >
        {/* Track */}
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-teal" />
        </SliderPrimitive.Track>

        {/* Thumbs */}
        {displayValue.map((val, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              "relative block size-5 rounded-full border-2 border-teal bg-navy shadow-md",
              "transition-shadow duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2",
              "hover:shadow-lg",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
            onFocus={() => setIsDragging(true)}
            onBlur={() => setIsDragging(false)}
          >
            {/* Tooltip */}
            {!hideTooltip && isDragging && (
              <span
                className={cn(
                  "absolute -top-9 left-1/2 -translate-x-1/2",
                  "rounded-md bg-navy px-2 py-0.5 text-xs font-semibold text-white shadow-md",
                  "whitespace-nowrap",
                  "after:absolute after:left-1/2 after:top-full after:-translate-x-1/2",
                  "after:border-4 after:border-transparent after:border-t-navy"
                )}
              >
                {formatValue(val)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
