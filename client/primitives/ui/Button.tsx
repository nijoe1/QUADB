import { tv } from "tailwind-variants";
import { createComponent } from "..";
import {
  type ComponentPropsWithRef,
  type FunctionComponent,
  createElement,
  forwardRef,
} from "react";
import { cn } from "@/utils/classNames";
import { Spinner } from "./Spinner";

const button = tv({
  base: "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-full text-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-800",
  variants: {
    variant: {
      primary:
        "bg-primary-600 hover:bg-primary-700 dark:hover:bg-primary-500 text-white dark:bg-white dark:text-gray-900 dark:disabled:bg-gray-500",
      ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
      default:
        "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700",
      inverted: "bg-white text-black hover:bg-white/90",
      link: "bg-none hover:underline",
      outline: "border-2 hover:bg-white/5",
    },
    size: {
      sm: "h-10 min-w-[40px] px-3 py-2",
      deafult: "h-12 px-4 py-2",
      icon: "size-12",
    },
    disabled: {
      true: "pointer-default pointer-events-none border-none opacity-50 dark:text-gray-400",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "deafult",
  },
});

const ButtonComponent = createComponent("button", button);
// @ts-ignore
export const IconButton = forwardRef(function IconButton(
  {
    children,
    icon,
    size,
    onClick, // Add onClick to the destructured props
    ...props
  }: {
    icon: any;
    size?: string;
    onClick?: () => void; // Add onClick to the type definition
  } & ComponentPropsWithRef<typeof Button>,
  ref
) {
  return (
    <Button
      ref={ref}
      onClick={onClick}
      {...props}
      size={children ? size : "icon"}
    >
      {icon
        ? createElement(icon, {
            className: `w-4 h-4 fill-white z-40 ${children ? "mr-2" : ""}`,
          })
        : null}
      {children}
    </Button>
  );
});

export function Button({
  icon,
  children,
  isLoading,
  ...props
}: ComponentPropsWithRef<typeof ButtonComponent> & {
  /*eslint-disable @typescript-eslint/no-explicit-any */
  icon?: FunctionComponent<any>;
  isLoading?: boolean;
}) {
  const Icon = isLoading ? Spinner : icon;
  return (
    <ButtonComponent
      type="button"
      role="button"
      disabled={isLoading}
      size={icon && !children ? "icon" : undefined}
      {...props}
    >
      {Icon &&
        createElement(Icon, {
          className: cn("size-4", { ["mr-2"]: Boolean(children) }),
        })}
      {children}
    </ButtonComponent>
  );
}
