"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FormData, useCreateInstance } from "@/hooks/contracts";
import { Alert } from "@/primitives/Alert/Alert";
import { Container } from "@/ui-shadcn/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-shadcn/card";
import { Button } from "@/primitives/Button/Button";
import { Form } from "@/components/Form/Form";
import { FormField } from "@/components/Form/types/fieldTypes";
import { toast } from "@/hooks/useToast";
import { deleteFormValues } from "@/components/Form/utils/deleteFormValues";
import { ArrowLeft } from "lucide-react";

const fields: FormField[] = [
  {
    field: {
      name: "name",
      label: "Dataset name",
      className: "border-grey-300",
      validation: { minLength: 3 },
    },
    component: "Input",
    placeholder: "your cool dataset name",
  },
  {
    field: {
      name: "about",
      label: "Dataset description",
      validation: { required: true },
      className: "w-full",
    },
    component: "MarkdownEditor",
  },
  {
    field: {
      name: "image",
      label: "Dataset image",
      validation: { required: true, isFile: true },
    },
    component: "FileUpload",
  },
  {
    field: {
      name: "file",
      label: "Dataset file",
      validation: { required: true, isFile: true },
    },
    component: "FileUpload",
  },
  {
    field: {
      name: "members",
      label: "Members",
      validation: { required: false, isArray: true },
    },
    component: "FieldArray",
  },
  {
    field: {
      name: "threshold",
      label: "Threshold",
      validation: { required: false },
    },
    component: "Input",
    placeholder: "quorum required to update the dataset default is 1",
    type: "number",
  },
];

const args = {
  formTitle: "Dataset details",
  formDescription: "Fill out the details about your dataset.",
  fields,
  persistKey: "new-instance",
  backButtonText: "Cancel",
  nextButtonText: "Create",
};

interface CreateNewInstancePageProps {
  params: {
    spaceId: string;
  };
}

export default function CreateNewInstancePage({
  params: { spaceId },
}: CreateNewInstancePageProps) {
  const router = useRouter();
  const spaceID = spaceId as `0x${string}`;

  const create = useCreateInstance({
    spaceID,
    onClose: () => {
      toast({
        title: "Your dataset has been created successfully!",
        description: "Your dataset has been created successfully!",
        variant: "default",
      });
      router.push(`/spaces/${spaceId}`);
    },
  });

  const handleBack = () => {
    router.push(`/spaces/${spaceId}`);
  };

  if (create.mutation.isSuccess) {
    return (
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="success" title="Dataset Created!">
            Your dataset has been successfully created.
          </Alert>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => router.push(`/spaces/${spaceId}`)}
              value="Back to Space"
            />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            variant="outlined-secondary"
            onClick={handleBack}
            icon={<ArrowLeft className="w-4 h-4" />}
            value="Back to Space"
            className="mb-4"
          />
          <div>
            <h1 className="text-3xl font-bold text-grey-900 mb-2">
              Create New Dataset
            </h1>
            <p className="text-grey-600">
              Add a new dataset to your space with all the necessary details.
            </p>
          </div>
        </div>

        {/* Main content card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Dataset Information</CardTitle>
            <CardDescription>
              Provide the details for your new dataset. All required fields must
              be completed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              {...args}
              onSubmit={async (formData: FormData) => {
                console.log("Form Data", formData);
                toast({
                  title: "Creating dataset...",
                  description: "Creating dataset...",
                  variant: "default",
                });

                await create.mutation.mutateAsync({
                  name: formData.name,
                  about: formData.about,
                  image: formData.image,
                  file: formData.file,
                  members: formData.members,
                  threshold: formData.threshold,
                });

                await deleteFormValues(["new-instance"]);
              }}
              onBack={handleBack}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
