"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const ProgressVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    variant: {
      default: "bg-sky-600",
      success: "bg-emerald-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ProgressVariants>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {}

const Progress: React.FC<ProgressProps> = ({
  className,
  value,
  variant,
  ...props
}) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(ProgressVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
};

export { Progress };
