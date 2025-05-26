import * as React from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

export type ProgressVariants = "default" | "green" | "green-md";

const progressVariants = tv({
  slots: {
    root: "relative h-4 w-full overflow-hidden rounded-full",
    indicator: "size-full flex-1 transition-all",
  },
  variants: {
    variant: {
      default: {
        root: "bg-grey-100 dark:bg-black",
        indicator: "dark:bg-grey-50 bg-black",
      },
      green: {
        root: " bg-grey-100",
        indicator: "bg-moss-700",
      },
      "green-md": {
        root: "bg-grey-100 w-[228px]",
        indicator: "bg-moss-700",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "default" | "green" | "green-md";
  }
>(({ className, value, variant = "default", ...props }, ref) => {
  const { root, indicator } = progressVariants({ variant });

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={`${root()} ${className}`}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(indicator(), className)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
