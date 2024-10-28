import React from "react";
import { z } from "zod";
import { FormData, useCreateInstance } from "@/hooks/useCreateInstance";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormSection,
  Input,
  Textarea,
  FieldArray,
} from "@/components/ui/Form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "../ui/Button";
import { ImageUpload } from "../ui/ImageUpload";
import { FileUpload } from "../ui/FileUpload";
import localforage from "localforage";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { isAddress } from "viem";
import { notification } from "@/hooks/utils/notification";

interface CreateNewInstanceProps {
  isOpen: boolean;
  onClose: () => void;
  spaceID: `0x${string}`;
}

const CreateNewInstanceSchema = z.object({
  name: z.string().nonempty("Name is required"),
  about: z.string().nonempty("About is required"),
  image: z.any().refine((file) => file instanceof File, "Image is required"),
  file: z
    .any()
    .refine((file) => file instanceof File, "Dataset file is required"),
  members: z
    .array(
      z
        .string()
        .refine(
          (member: string) => isAddress(member),
          "Each member must be a valid Ethereum address"
        )
    )
    .optional(),
  isPrivate: z.boolean().optional(),
});

const fileToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  }) as Promise<string>;
};
export function CreateNewInstance({
  isOpen,
  onClose,
  spaceID,
}: CreateNewInstanceProps) {
  const create = useCreateInstance({
    spaceID,
    onClose: () => {
      toast.success("Your dataset has been created successfully!");
      localforage.removeItem("instance-draft");
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
      <ModalContent className="flex flex-col items-center w-[300px]">
        <Form
          // @ts-ignore
          schema={CreateNewInstanceSchema}
          defaultValues={{
            name: "",
            about: "",
            image: undefined,
            file: undefined,
          }}
          persistKey="instance-draft"
          onSubmit={async (formData: FormData) => {
            console.log("Form Data", formData);
            notification.info("Creating dataset...");
            // Convert image to base64
            const fileImage = formData.image;
            const fileData = formData.file;
            const file = await fileToBase64(fileData);
            const image = await fileToBase64(fileImage);
            console.log("Image", image);

            await create.mutation.mutateAsync({
              name: formData.name,
              about: formData.about,
              image: image,
              file: file,
            });
            await localforage.removeItem("instance-draft");
          }}
        >
          {({ formState: { errors } }) => (
            <div className="p-6 bg-white rounded-lg shadow-lg space-y-6 w-full max-w-lg mx-auto">
              <FormSection
                title="Dataset Details"
                description="Create your dataset by filling out the form below."
              >
                {/* Name Field */}
                <FormControl required label="Dataset Name" name="name">
                  <Input type="text" placeholder="Dataset Name" />
                </FormControl>

                {/* About Field */}
                <FormControl required label="Describe the dataset" name="about">
                  <Textarea placeholder="Describe the dataset" rows={4} />
                </FormControl>

                <div className="flex flex-wrap justify-between w-full gap-2">
                  {/* Image Upload */}
                  <FormControl
                    required
                    label="Dataset Image"
                    name="image"
                    className="w-48"
                    hint={<span className="text-xs">Upload dataset image</span>}
                  >
                    <ImageUpload name="image" className="h-48 w-48 " />
                  </FormControl>

                  {/* File Upload */}
                  <div className="mb-4 gap-4 md:flex">
                    <FormControl
                      required
                      label="Dataset Data"
                      name="file"
                      className="w-48"
                      hint={
                        <span className="text-xs">
                          Upload dataset data as csv
                        </span>
                      }
                    >
                      <FileUpload name={"file"} className="h-20 w-full " />
                    </FormControl>
                  </div>
                </div>
                <FieldArray
                  name="members"
                  renderField={(field, index) => (
                    <FormControl
                      key={field.id}
                      name={field.id}
                      className="w-full"
                    >
                      <Input type="text" placeholder="Ethereum Address" />
                    </FormControl>
                  )}
                  hint="Add curators to this dataset"
                />
              </FormSection>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={onClose}
                  disabled={create.isLoading}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={create.isLoading}
                  variant="primary"
                >
                  {create.isLoading ? "Processing..." : "Create Instance"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </ModalContent>
    </Modal>
  );
}
