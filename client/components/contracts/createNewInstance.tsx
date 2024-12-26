import React from "react";
import { FormData, useCreateInstance } from "@/hooks/useCreateInstance";
import { toast } from "sonner";

import { Alert } from "@/components/ui/Alert";

import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { Form } from "@/components/Form/Form";
import { FormField } from "@/components/Form/types/fieldTypes";
import { notification } from "@/hooks/utils/notification";
import { deleteFormValues } from "../Form/utils/deleteFormValues";

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
];

const args = {
  formTitle: "Dataset details",
  formDescription: "Fill out the details about your dataset.",
  fields,
  persistKey: "new-instance",
  backButtonText: "Cancel",
  nextButtonText: "Create",
};

interface CreateNewInstanceProps {
  isOpen: boolean;
  onClose: () => void;
  spaceID: `0x${string}`;
}

export function CreateNewInstance({
  isOpen,
  onClose,
  spaceID,
}: CreateNewInstanceProps) {
  const create = useCreateInstance({
    spaceID,
    onClose: () => {
      toast.success("Your dataset has been created successfully!");
      onClose();
    },
  });

  if (create.mutation.isSuccess) {
    return (
      <Alert variant="success" title="Dataset Created!">
        Your dataset has been successfully created.
      </Alert>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="flex flex-col items-center w-full">
        <Form
          {...args}
          onSubmit={async (formData: FormData) => {
            console.log("Form Data", formData);
            notification.info("Creating dataset...");

            await create.mutation.mutateAsync({
              name: formData.name,
              about: formData.about,
              image: formData.image,
              file: formData.file,
            });

            await deleteFormValues(["new-instance"]);
          }}
          onBack={() => {
            onClose();
          }}
        />
      </ModalContent>
    </Modal>
  );
}
