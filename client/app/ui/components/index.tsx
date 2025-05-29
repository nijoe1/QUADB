import { ComponentPropsWithRef, ElementType, forwardRef, ReactNode } from "react";

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

export type ComponentProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
} & ComponentPropsWithRef<C>;

type VariantFunction = (props: { class?: string; [key: string]: any }) => string;

export function createComponent<T extends ElementType, TV extends VariantFunction>(
  tag: T,
  variant: TV,
) {
  return forwardRef(function UIComponent<C extends ElementType>(
    props: ComponentProps<C>,
    ref?: PolymorphicRef<C>,
  ) {
    const { as: Component = tag, className, ...rest } = props;
    return <Component ref={ref} className={variant({ class: className, ...props })} {...rest} />;
  });
}
