// components/CreateNewInstance.tsx

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, useCreateInstance } from "@/app/hooks/useCreateInstance"; // Import the hook
import {
  Input,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Box,
  useToast,
} from "@chakra-ui/react";

import { Lit } from "@/app/lib/lit";
import { AuthSig } from "@lit-protocol/auth-helpers";
interface CreateNewInstanceProps {
  isOpen: boolean;
  onClose: () => void;
  spaceID: `0x${string}`;
}

export const CreateNewInstance: React.FC<CreateNewInstanceProps> = ({
  isOpen,
  onClose,
  spaceID,
}) => {
  const { mutation, isUploading, isProcessingTransaction } = useCreateInstance({
    onClose,
    spaceID,
  });
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  const toast = useToast();

  const onSubmit: SubmitHandler<FormData> = (formData) => {
    mutation.mutate(formData);
  };

  // Get the uploaded image to display a preview
  const imageFile = watch("image");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Dataset</ModalHeader>
        <ModalBody>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Button
              onClick={async () => {
                try {
                  const lit = new Lit("sepolia");
                  await lit.connect();
                  const res = await lit.getSessionSignatures();
                  const authSig = res.capacityDelegationAuthSig as AuthSig;
                  console.log(authSig);
                  const encrypt = await lit.encrypt("Hello World");
                  if (!encrypt) {
                    throw new Error("Failed to encrypt message");
                  }
                  console.log(encrypt);
                  const message = await lit.decrypt(
                    encrypt.jsonPayload,
                    // encrypt.ciphertext,
                    // encrypt.dataToEncryptHash,
                    // res.sessionSigs,
                    authSig
                  );
                  console.log(message);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Lit
            </Button>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Dataset Name"
                  {...register("name", { required: true })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>About</FormLabel>
                <Textarea
                  placeholder="Describe the dataset"
                  {...register("about", { required: true })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image (optional)</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  onChange={(e) =>
                    setValue("image", e.target.files ? e.target.files[0] : null)
                  }
                />
                {imageFile && (
                  <Box mt={2}>
                    <img
                      src={URL.createObjectURL(new Blob([imageFile]))}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>File (CSV, optional)</FormLabel>
                <Input
                  type="file"
                  accept=".csv"
                  {...register("file")}
                  onChange={(e) =>
                    setValue("file", e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  placeholder="Set a price"
                  {...register("price", { required: true })}
                />
              </FormControl>
            </Stack>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit(onSubmit)}
            isLoading={isUploading || isProcessingTransaction}
          >
            {isUploading || isProcessingTransaction
              ? "Processing..."
              : "Create Instance"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
