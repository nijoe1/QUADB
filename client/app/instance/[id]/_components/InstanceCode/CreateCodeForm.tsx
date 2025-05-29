"use client";

import React from "react";

import { ArrowLeft } from "lucide-react";

import { Form } from "@/components/Form/Form";
import { FormField } from "@/components/Form/types/fieldTypes";
import { deleteFormValues } from "@/components/Form/utils/deleteFormValues";
import { ProgressModal } from "@/components/ProgressModal";
import { CodeFormData, useCreateInstanceCode } from "@/hooks/contracts";
import { Alert } from "@/primitives/Alert/Alert";
import { Button } from "@/primitives/Button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui-shadcn/card";

// Form field configuration for code creation
const fields: FormField[] = [
  {
    field: {
      name: "name",
      label: "Code name",
      className: "border-grey-300",
      validation: { minLength: 3 },
    },
    component: "Input",
    placeholder: "your cool code name",
  },
  {
    field: {
      name: "about",
      label: "Code description",
      validation: { required: true },
      className: "w-full",
    },
    component: "MarkdownEditor",
  },
  {
    field: {
      name: "file",
      label: "Code file",
      validation: { required: true, isFile: true },
    },
    component: "FileUpload",
  },
];

const args = {
  formTitle: "Code details",
  formDescription: "Fill out the details about your code.",
  fields,
  persistKey: "new-code",
  backButtonText: "Cancel",
  nextButtonText: "Create",
};

interface CreateCodeFormProps {
  instanceID: `0x${string}`;
  onBack: () => void;
}

export const CreateCodeForm: React.FC<CreateCodeFormProps> = ({ instanceID, onBack }) => {
  const create = useCreateInstanceCode({
    instanceID,
    onClose: onBack,
  });

  // Show success state after code creation
  if (create.mutation.isSuccess) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert variant="success" title="Code Created!">
          Your code has been successfully created.
        </Alert>
        <div className="mt-6">
          <Button variant="primary" onClick={onBack} value="Back to Codes" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with back button */}
      <div className="mb-6">
        <Button
          onClick={onBack}
          icon={<ArrowLeft className="size-4" />}
          value="Back to Codes"
          className="mb-4"
        />
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">Create New Code</h1>
          <p className="text-white">
            Add a new code to this instance with all the necessary details.
          </p>
        </div>
      </div>

      {/* Main content card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Code Information</CardTitle>
          <CardDescription>
            Provide the details for your new code. All required fields must be completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            {...args}
            onSubmit={async (formData: CodeFormData) => {
              await create.mutation.mutateAsync({
                name: formData.name,
                about: formData.about,
                file: formData.file,
              });

              await deleteFormValues(["new-code"]);
            }}
            onBack={onBack}
          />
        </CardContent>
      </Card>

      {/* Progress Modal */}
      <ProgressModal {...create.progressModalProps} isOpen={create.mutation.isPending} />
    </div>
  );
};
