import { type ComponentProps, createElement } from "react";

import { type LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";

import { createComponent } from "@/components/index";

const alert = tv({
  base: "rounded-xl p-4",
  variants: {
    variant: {
      warning: "bg-red-200 text-red-800",
      info: "bg-grey-100 text-grey-900 dark:bg-grey-800 dark:text-grey-300",
      success: "bg-green-200 text-green-800",
    },
  },
});

export const AlertComponent = createComponent("div", alert);

export const Alert = ({
  icon,
  title,
  children,
  ...props
}: { icon?: LucideIcon } & ComponentProps<typeof AlertComponent>) => {
  return (
    <AlertComponent {...props}>
      <div className="flex items-center gap-2">
        {icon ? createElement(icon, { className: "w-4 h-4" }) : null}
        {title && <div className="mb-2 text-lg font-semibold">{title}</div>}
      </div>
      {children}
    </AlertComponent>
  );
};
