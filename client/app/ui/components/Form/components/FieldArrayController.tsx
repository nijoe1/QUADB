import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FieldArray } from "@/components/Form";
import { Input } from "@/ui-shadcn/input";

export interface FieldArrayControllerProps {
  name: string;
}

const RenderField: React.FC<{ field: any; index: number; name: string }> = ({
  // field,
  index,
  name,
}) => {
  const { register, setValue, watch } = useFormContext();
  const value = watch(`${name}.${index}`) || "";

  return (
    <Input
      {...register(`${name}.${index}`)}
      onChange={(e) => {
        e.preventDefault();
        if (typeof e.target.value === "string") {
          setValue(`${name}.${index}`, e.target.value);
        }
      }}
      placeholder="Enter address"
      value={value}
    />
  );
};

export const FieldArrayController: React.FC<FieldArrayControllerProps> = ({ name }) => {
  const { control } = useFormContext();

  const renderField = (field: any, index: number) => (
    <RenderField field={field} index={index} name={name} />
  );

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <FieldArray
          name={name}
          renderField={renderField}
          hint={
            "If you want to maintain the instance with other members, add their addresses here."
          }
        />
      )}
    />
  );
};
