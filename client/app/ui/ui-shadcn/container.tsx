import { DetailedHTMLProps } from "react";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TContainer = DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement> &
  object;

export function Container(props: TContainer): JSX.Element {
  const { className, children, ...rest } = props;

  return (
    <div
      style={{ marginInline: "auto" }}
      className={cn("mx-auto my-auto w-full max-w-[1200px] p-2", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
