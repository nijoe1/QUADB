"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import makeBlockie from "ethereum-blockies-base64";

interface ProfileInfo {
  picture?: string;
  name?: string;
  desc?: string;
  members?: string[];
}

interface Contributor {
  address: string;
  name?: string;
  image?: string;
}

interface CardItemProps {
  profileInfo?: ProfileInfo;
  creator?: string;
}

export const CardItem: React.FC<CardItemProps> = ({ profileInfo, creator }) => {
  const { address } = useAccount();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [conributors, setContributors] = useState<Contributor[]>([]);
  const getCreator = creator ? creator : address;

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchProfileInfo = async () => {
    return;
  };

  useEffect(() => {
    if (profileInfo) {
      fetchProfileInfo();
    }
    if (profileInfo?.members) {
      setContributors(
        profileInfo?.members
          .filter((member) => !!member)
          .map((member) => ({
            address: member,
            name: member,
            image: makeBlockie(member),
          }))
      );
    }
  }, [profileInfo]);

  return (
    <div className="mx-auto mt-20 max-w-5xl">
      <div className="mx-5 rounded-xl bg-[#424242] p-4 shadow-md">
        <div className="mb-4 flex flex-col items-center p-4">
          <img
            src={profileInfo?.picture || "/path/to/image.jpg"}
            alt="Profile Image"
            className="mb-4 aspect-[2/1] w-3/4 rounded-lg object-cover"
          />
          <p className="text-lg font-bold text-white">
            {profileInfo?.name || "User Name"}
          </p>
          <span className="mt-2 rounded-full bg-black px-2 py-1 text-sm text-white">
            {getCreator?.slice(0, 6)}...{getCreator?.slice(-6)}
          </span>
          <p className="mt-2 text-sm text-white">
            {profileInfo?.desc || "User Description"}
          </p>
          <button
            onClick={handleShowModal}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Contributors
          </button>
        </div>
      </div>

      {/* Contributors Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contributors</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {conributors.length > 0 &&
                  conributors.map((contributor, index) => (
                    <tr key={index}>
                      <td className="py-2">
                        <div className="flex items-center">
                          <img
                            className="mt-2 w-9 rounded-sm"
                            src={
                              contributor?.image ||
                              makeBlockie(contributor?.address)
                            }
                            alt="Sender Avatar"
                          />
                          <p className="text-md mx-2 mt-2 text-black">
                            {contributor?.name}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <button
              className="mr-3 rounded-lg bg-black px-4 py-2 text-white"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
