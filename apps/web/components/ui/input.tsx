"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none text-navy peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

/* ------------------------------------------------------------------ */
/*  Input                                                              */
/* ------------------------------------------------------------------ */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** When truthy, renders a red border and an error message below the input. */
  error?: string | boolean;
  /** Optional label rendered above the input. */
  label?: string;
  /** id used to link the label and the input; auto-generated if omitted. */
  inputId?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, inputId, ...props }, ref) => {
    const id = inputId ?? props.id ?? React.useId();
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    return (
      <div className="grid w-full gap-1.5">
        {label && <Label htmlFor={id}>{label}</Label>}

        <input
          id={id}
          ref={ref}
          type={type}
          aria-invalid={hasError || undefined}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2",
            "text-sm text-navy placeholder:text-gray-400",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            hasError
              ? "border-error ring-1 ring-error/30 focus-visible:ring-error"
              : "border-gray-200 hover:border-gray-300",
            className
          )}
          {...props}
        />

        {errorMessage && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs font-medium text-error"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, Label };
