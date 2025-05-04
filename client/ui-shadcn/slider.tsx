import * as React from "react";

import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="bg-grey-100 relative h-2 w-full grow overflow-hidden rounded-full dark:bg-black">
      <SliderPrimitive.Range className="dark:bg-grey-50 absolute h-full bg-black" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="dark:border-grey-50 dark:focus-visible:ring-grey-100 block size-5 rounded-full border-2 border-black bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-black dark:ring-offset-black" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
