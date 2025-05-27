import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  cloneElement,
  useEffect,
  ComponentProps,
} from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type UseFormReturn,
  type FieldValues,
  useFieldArray,
  DefaultValues,
} from "react-hook-form";
import { useInterval } from "react-use";

import localforage from "localforage";
import { PlusIcon, Search, Trash } from "lucide-react";
import { tv } from "tailwind-variants";
import { type z } from "zod";
import { ZodType } from "zod";

import { createComponent } from "@/components/index";
import { Button } from "@/primitives/Button";
import { cn } from "@/utils/classNames";

const inputBase = [
  "bg-transparent",
  "text-grey-700",
  "p-2",
  "border-2",
  "rounded",
  "disabled:opacity-30",
  "checked:bg-grey-800",
];
export const Input = createComponent(
  "input",
  tv({
    base: ["w-full", ...inputBase],
    variants: {
      error: {
        true: "!border-red-900",
      },
    },
  }),
);
export const InputWrapper = createComponent(
  "div",
  tv({
    base: "relative flex w-full",
    variants: {},
  }),
);
export const InputAddon = createComponent(
  "div",
  tv({
    base: "absolute right-0 inline-flex h-full items-center justify-center border-l border-grey-300 px-4 font-semibold text-grey-900 dark:border-grey-800",
    variants: {
      disabled: {
        true: "text-grey-800",
      },
    },
  }),
);

export const InputIcon = createComponent(
  "div",
  tv({
    base: "absolute left-0 inline-flex h-full items-center justify-center px-4 text-grey-800",
  }),
);

export const Select = createComponent(
  "select",
  tv({
    base: [...inputBase],
    variants: {
      error: {
        true: "!border-red-900",
      },
    },
  }),
);

export const Checkbox = createComponent(
  "input",
  tv({
    base: [...inputBase, "checked:hover:bg-grey-700 checked:focus:bg-grey-700"],
  }),
);

export const Label = createComponent(
  "label",
  tv({
    base: "block font-semibold tracking-wider text-grey-800",
  }),
);
export const Textarea = createComponent("textarea", tv({ base: [...inputBase, "w-full"] }));

export const SearchInput = forwardRef(function SearchInput(
  { ...props }: ComponentPropsWithRef<typeof Input>,
  ref,
) {
  return (
    <InputWrapper className="h-12">
      <InputIcon>
        <Search />
      </InputIcon>
      <Input ref={ref} {...props} className="rounded-full pl-12" />
    </InputWrapper>
  );
});
export const FormControl = ({
  name,
  label,
  hint,
  description,
  required,
  children,
  valueAsNumber,
  className,
}: {
  name: string;
  label?: string;
  required?: boolean;
  valueAsNumber?: boolean;
  hint?: string | ReactNode;
  description?: string | ReactNode;
} & ComponentPropsWithoutRef<"fieldset">) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Get error for name - handles field arrays (field.index.prop)
  const error = name.split(".").reduce(
    /* eslint-disable-next-line */
    (err, key) => (err as any)?.[key],
    errors,
  ) as unknown as { message: string };

  return (
    <fieldset className={cn("mb-4", className)}>
      {label && (
        <Label className="mb-1" htmlFor={name}>
          {label}
          {required && <span className="text-red-300">*</span>}
        </Label>
      )}
      {description && <div className="mb-2 text-xs text-grey-800">{description}</div>}
      {cloneElement(children as ReactElement, {
        id: name,
        error: Boolean(error),
        ...register(name, { valueAsNumber }),
      })}
      {hint && <div className="pt-1 text-xs text-grey-800">{hint}</div>}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </fieldset>
  );
};

export const ErrorMessage = createComponent("div", tv({ base: "pt-1 text-xs text-red-500" }));

export function FieldArray<S extends z.Schema>({
  name,
  renderField,
  requiredRows,
  ErrorMessage,
  hint,
}: {
  name: string;
  renderField: (field: z.infer<S>, index: number) => ReactNode;
  requiredRows?: number;
  ErrorMessage?: string;
  hint?: string;
}) {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  const isError = requiredRows && fields.length < requiredRows;

  return (
    <div className="space-y-2">
      {hint && <div className="pb-2 text-xs text-grey-500 dark:text-grey-400">{hint}</div>}
      {isError && <div className="text-red-500">{String(ErrorMessage)}</div>}
      {fields.map((field, i) => (
        <div key={field.id} className="items-center gap-4 md:flex">
          {renderField(field, i)}

          <div className="flex justify-end">
            <Button
              // @ts-ignore
              tabIndex={-1}
              type="button"
              variant="ghost"
              icon={<Trash size={20} />}
              onClick={() => remove(i)}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        {/* @ts-ignore */}
        <Button
          type="button"
          size="sm"
          icon={<PlusIcon size={20} />}
          className="text-white"
          onClick={() => append("")}
          value="Add curator"
        />
      </div>
    </div>
  );
}

export function FieldsRow<S extends z.Schema>({
  label,
  required,
  hint,
  name,
  renderField,
}: {
  label?: string;
  required?: boolean;
  hint?: string;
  name: string;
  renderField: (field: z.infer<S>, index: number) => ReactNode;
}) {
  const form = useFormContext();
  const { fields } = useFieldArray({
    control: form.control,
    name,
  });

  const error = form.formState.errors[name]?.message ?? "";

  console.log(fields);

  return (
    <section className="mb-8">
      {label && (
        <Label className="mb-1" htmlFor={name}>
          {label}
          {required && <span className="text-red-300">*</span>}
        </Label>
      )}
      {hint && <div className="pb-2 text-xs text-grey-500 dark:text-grey-400">{hint}</div>}
      {error && <div className="border border-red-900 p-2 dark:text-red-500">{String(error)}</div>}
      <div key={fields[0]?.id} className="gap-4 md:flex">
        {renderField(fields[0], 1)}
      </div>
    </section>
  );
}

export function FormSection({
  title,
  description,
  className,
  children,
}: {
  title: string | ReactNode;
  className?: string;
  description: string;
} & ComponentProps<"section">) {
  return (
    <section className={`mb-8 ${className}`}>
      <h3 className="mb-1 text-xl font-semibold">{title}</h3>
      <p className="mb-4 leading-loose text-grey-600 dark:text-grey-400">{description}</p>
      {children}
    </section>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type });
}

async function serializeFormValues(values: any): Promise<any> {
  const serializedValues = { ...values };

  for (const key in values) {
    if (values[key] instanceof File) {
      const dataUrl = await fileToDataUrl(values[key]);
      serializedValues[key] = {
        dataUrl,
        fileName: values[key].name,
      };
    } else if (typeof values[key] === "object" && values[key] !== null) {
      serializedValues[key] = await serializeFormValues(values[key]);
    }
  }

  return serializedValues;
}

export const deserializeFormValues = async (values: any): Promise<any> => {
  const deserializedValues = { ...values };

  for (const key in values) {
    if (values[key] && values[key].dataUrl && values[key].fileName) {
      const file = await dataUrlToFile(values[key].dataUrl, values[key].fileName);
      deserializedValues[key] = file;
    } else if (typeof values[key] === "object" && values[key] !== null) {
      deserializedValues[key] = await deserializeFormValues(values[key]);
    }
  }

  return deserializedValues;
};

export function usePersistForm(form: UseFormReturn<FieldValues>, persistKey: string) {
  useEffect(() => {
    localforage.getItem(persistKey).then(async (draft) => {
      if (draft) {
        const deserializedValues = await deserializeFormValues(draft);
        form.reset(deserializedValues);
      }
    });
  }, [persistKey, form]);

  useInterval(() => {
    const values = form.getValues();
    serializeFormValues(values).then((serializedValues) => {
      localforage.setItem(persistKey, serializedValues);
    });
  }, 300);
}

interface FormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues?: Partial<T>;
  persistKey?: string;
  onSubmit: (values: any) => void;
  children: React.ReactNode | ((methods: UseFormReturn<T>) => React.ReactNode);
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  persistKey,
  onSubmit,
  children,
}: FormProps<T>) {
  const methods = useForm<T>({
    // @ts-ignore
    resolver: schema,
    defaultValues: defaultValues as DefaultValues<T>,
    mode: "onBlur",
  });

  const formMethods = methods as UseFormReturn<FieldValues>;

  // Always call the hook, but only do something if persistKey exists
  usePersistForm(formMethods, persistKey || "");

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {typeof children === "function" ? children(methods as any) : children}
      </form>
    </FormProvider>
  );
}
