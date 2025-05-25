import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Icon,
  Text,
  Input,
} from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import {
  CodeFormData,
  useCreateInstanceCode,
} from "@/hooks/contracts";
import { Alert } from "@/primitives/Alert/Alert";
import { toast } from "sonner";
import { Hex } from "viem";

const CreateNewInstanceCode = ({
  isOpen,
  onClose,
  instanceID,
}: {
  isOpen: boolean;
  onClose: () => void;
  instanceID: Hex;
}) => {
  const [formData, setFormData] = React.useState<CodeFormData>({
    name: "",
    about: "",
    file: null as unknown as File,
  });

  const create = useCreateInstanceCode({
    instanceID,
    onClose: () => {
      toast.success("Your code has been created successfully!");
      onClose();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.about || !formData.file) {
      toast.error("Please fill all fields");
      return;
    }

    toast.info("Creating code...");

    await create.mutation.mutateAsync({
      name: formData.name,
      about: formData.about,
      file: formData.file,
    });
  };

  if (create.mutation.isSuccess) {
    return (
      <Alert variant="success" title="Code Created!">
        Your code has been successfully created.
      </Alert>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="rounded-md bg-[#333333]">
        <ModalHeader>Create New Code</ModalHeader>
        <ModalBody>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Enter code name"
                value={formData.name}
                onChange={handleChange}
                bg="#424242"
                color="white"
                borderRadius="md"
                _focus={{
                  borderColor: "white",
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>About</FormLabel>
              <Input
                name="about"
                placeholder="Enter code description"
                value={formData.about}
                onChange={handleChange}
                bg="#424242"
                color="white"
                borderRadius="md"
                _focus={{
                  borderColor: "white",
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Code</FormLabel>
              <div className="  rounded-md bg-[#424242] text-white focus:border-white">
                <InputGroup className="flex justify-between items-center p-2">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    id="_file-upload"
                    className="hidden"
                    accept=".ipynb"
                  />
                  <Text className="text-gray-400 text-sm">
                    Upload Model Code
                  </Text>

                  <label htmlFor="_file-upload">
                    <Icon as={FaFileUpload} cursor="pointer" />
                  </label>
                </InputGroup>
              </div>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSubmit}
            isLoading={create.isLoading || create.mutation.isPending}
            loadingText={create.isLoading ? "Creating..." : "Processing..."}
          >
            Create
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNewInstanceCode;
