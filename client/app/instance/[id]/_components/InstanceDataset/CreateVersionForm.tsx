"use client";

import React from "react";

import { ArrowLeft } from "lucide-react";

import { Form } from "@/components/Form/Form";
import { FormField } from "@/components/Form/types/fieldTypes";
import { deleteFormValues } from "@/components/Form/utils/deleteFormValues";
import { ProgressModal } from "@/components/ProgressModal";
import { Alert } from "@/primitives/Alert/Alert";
import { Button } from "@/primitives/Button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui-shadcn/card";

import { VersionFormData, useVersionManager } from "./hooks";

// Form field configuration for version creation
const fields: FormField[] = [
  {
    field: {
      name: "description",
      label: "Version description",
      validation: { required: true },
      className: "w-full",
    },
    component: "MarkdownEditor",
  },
  {
    field: {
      name: "file",
      label: "Dataset file",
      validation: { required: true, isFile: true },
    },
    component: "FileUpload",
  },
];

const args = {
  formTitle: "Version details",
  formDescription: "Fill out the details about your new version.",
  fields,
  persistKey: "new-version",
  backButtonText: "Cancel",
  nextButtonText: "Create Version",
};

interface CreateVersionFormProps {
  IPNS: string;
  spaceID: string;
  threshold: number;
  EncryptedKeyCID: string;
  onBack: () => void;
}

export const CreateVersionForm: React.FC<CreateVersionFormProps> = ({
  IPNS,
  spaceID,
  threshold,
  EncryptedKeyCID,
  onBack,
}) => {
  const versionManager = useVersionManager({
    IPNS,
    spaceID,
    threshold,
    EncryptedKeyCID,
  });

  // Show success state after version creation
  if (versionManager.createVersionMutation.isSuccess) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert variant="success" title="Version Created!">
          Your version proposal has been created successfully.
        </Alert>
        <div className="mt-6">
          <Button variant="primary" onClick={onBack} value="Back to Versions" />
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
          value="Back to Versions"
          className="mb-4"
        />
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">Create New Version</h1>
          <p className="text-white">
            Create a new version proposal for this dataset. All members will need to approve it.
          </p>
        </div>
      </div>

      {/* Main content card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Version Information</CardTitle>
          <CardDescription>
            Provide the details for your new version. All required fields must be completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            {...args}
            onSubmit={async (formData: VersionFormData) => {
              await versionManager.createVersionMutation.mutateAsync({
                file: formData.file,
                description: formData.description,
              });

              await deleteFormValues(["new-version"]);
            }}
            onBack={onBack}
          />
        </CardContent>
      </Card>

      {/* Progress Modal */}
      <ProgressModal
        {...versionManager.createVersionModalProps}
        isOpen={versionManager.createVersionMutation.isPending}
      />
    </div>
  );
};
