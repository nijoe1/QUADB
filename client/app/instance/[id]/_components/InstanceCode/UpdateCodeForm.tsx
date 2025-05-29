"use client";

import React from "react";

import { ArrowLeft } from "lucide-react";

import { Form } from "@/components/Form/Form";
import { FormField } from "@/components/Form/types/fieldTypes";
import { deleteFormValues } from "@/components/Form/utils/deleteFormValues";
import { ProgressModal } from "@/components/ProgressModal";
import { IPNSConfig } from "@/lib/types";
import { Alert } from "@/primitives/Alert/Alert";
import { Button } from "@/primitives/Button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui-shadcn/card";

import { UpdateCodeFormData, useUpdateCodeManager } from "./hooks";

// Form field configuration for code update
const fields: FormField[] = [
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
  formTitle: "Update code",
  formDescription: "Upload a new version of your code file.",
  fields,
  persistKey: "update-code",
  backButtonText: "Cancel",
  nextButtonText: "Update Code",
};

interface UpdateCodeFormProps {
  onBack: () => void;
  ipnsConfig: IPNSConfig & { codeID: string };
}

export const UpdateCodeForm: React.FC<UpdateCodeFormProps> = ({ onBack, ipnsConfig }) => {
  console.log("ipnsConfig", ipnsConfig);
  const updateCodeManager = useUpdateCodeManager({
    IPNSConfig: ipnsConfig,
    onClose: onBack,
  });

  // Show success state after code update
  if (updateCodeManager.updateCodeMutation.isSuccess) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert variant="success" title="Code Updated!">
          Your code has been updated successfully.
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
          <h1 className="mb-2 text-3xl font-bold text-white">Update Code</h1>
          <p className="text-white">
            Upload a new version of your code file. This will update the IPNS record.
          </p>
        </div>
      </div>

      {/* Main content card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Code File</CardTitle>
          <CardDescription>
            Select the new code file to upload. This will replace the current version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            {...args}
            onSubmit={async (formData: UpdateCodeFormData) => {
              await updateCodeManager.updateCodeMutation.mutateAsync({
                file: formData.file,
                IPNSConfig: ipnsConfig,
              });

              await deleteFormValues(["update-code"]);
            }}
            onBack={onBack}
          />
        </CardContent>
      </Card>

      {/* Progress Modal */}
      <ProgressModal
        {...updateCodeManager.progressModalProps}
        isOpen={updateCodeManager.updateCodeMutation.isPending}
      />
    </div>
  );
};
