import React, { useState } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  Center,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const UpdateProfile = ({ isOpen, onClose, profileInfo, onUpdateProfile }) => {
  const [name, setName] = useState(profileInfo?.name || "");
  const [description, setDescription] = useState(
    profileInfo?.description || "",
  );
  const [profileImage, setProfileImage] = useState(
    profileInfo?.profileImage || null,
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onUpdateProfile(name, description, profileImage);
    onClose(); // Close the modal after submission
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgGradient="linear(to-br, #333333, #222222)" color="white">
        <ModalHeader>Update Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb="2">Profile Name:</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            mb="4"
            variant="outline"
            _focus={{
              borderColor: "white",
            }}
          />
          <Text mb="2">Profile Description:</Text>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your description"
            mb="4"
            variant="outline"
            _focus={{
              borderColor: "white",
            }}
          />
          <Text mb="2">Profile Image:</Text>
          <div className="flex flex-col items-center">
            {profileImage && (
              <Image
                src={profileImage}
                alt="Profile"
                boxSize="100px"
                objectFit="cover"
                borderRadius="full"
              />
            )}
            <Input
              type="file"
              onChange={handleImageChange}
              mb="4"
              accept="image/*"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSubmit}
            colorScheme="black"
            ml="3"
            className="bg-black/80 text-white"
            mr={3}
          >
            Update Profile
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProfile;
