import { DetailedHTMLProps } from "react";

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TContainer = DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  object;

export function Container(props: TContainer): JSX.Element {
  const { className, children, ...rest } = props;

  return (
    <div
      style={{ marginInline: "auto" }}
      className={cn("w-full p-2 max-w-[1200px]  mx-auto my-auto", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
