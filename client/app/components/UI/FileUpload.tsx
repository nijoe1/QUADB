import { ComponentProps, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IconButton } from "@/app/components/ui/Button";
import { FileIcon } from "lucide-react";
import clsx from "clsx";

type Props = { name: string } & ComponentProps<"div">;

export function FileUpload({ name, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: "File is required" }}
      render={({ field: { value, onChange } }) => {
        return (
          <div className={clsx("relative overflow-hidden", className)}>
            <IconButton
              onClick={() => ref.current?.click()}
              icon={FileIcon}
              className="absolute bottom-1 right-1 fill-white bg-transparent"
            />

            <div className="h-full rounded-xl bg-gray-200 flex justify-start p-2">
              {value && value.name ? value.name : "No file selected"}
            </div>

            <input
              type="file"
              accept=".csv"
              ref={ref}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onChange(file);
                }
              }}
            />
          </div>
        );
      }}
    />
  );
}
