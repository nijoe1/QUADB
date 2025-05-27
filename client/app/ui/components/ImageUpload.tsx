import { ComponentProps, useRef, useState, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";

import clsx from "clsx";
import { ImageIcon } from "lucide-react";

import { Button } from "@/primitives/Button";

type Props = { name: string } & ComponentProps<"div">;

export function ImageUpload({ name, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const { control } = useFormContext();

  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
    rules: { required: "Image is required" },
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof value === "string") {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleClick = () => {
    console.log("IconButton clicked");
    ref.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {/* Background Div */}
      <div
        className={clsx("h-full rounded-xl bg-grey-800 bg-cover bg-center bg-no-repeat", {
          ["opacity-50"]: !previewUrl,
        })}
        style={{
          backgroundImage: previewUrl ? `url("${previewUrl}")` : undefined,
          minHeight: "200px", // Ensure div has height
        }}
      >
        {!previewUrl && (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="text-grey-400" size={50} />
          </div>
        )}
      </div>

      {/* IconButton */}
      <Button
        onClick={handleClick}
        className="absolute bottom-1 right-1 z-10"
        icon={<ImageIcon className="text-grey-400" size={50} />}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        ref={ref}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
