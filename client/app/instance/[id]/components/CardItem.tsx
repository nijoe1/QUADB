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
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
  }, [profileInfo]);

  return (
    <div className="mt-20 max-w-5xl mx-auto">
      <div className="p-4 mx-5 bg-gray-800 rounded-xl shadow-md">
        <div className="p-4 mb-4 flex flex-col items-center">
          <img
            src={profileInfo?.picture || "/path/to/image.jpg"}
            alt="Profile Image"
            className="rounded-full w-3/4 aspect-[2/1] object-cover mb-4"
          />
          <p className="text-lg font-bold text-white">
            {profileInfo?.name || "User Name"}
          </p>
          <span className="text-black bg-black rounded-full px-2 py-1 mt-2 text-sm">
            {getCreator?.slice(0, 6)}...{getCreator?.slice(-6)}
          </span>
          <p className="text-sm text-white mt-2">
            {profileInfo?.desc || "User Description"}
          </p>
          <button
            onClick={handleShowModal}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Contributors
          </button>
        </div>
      </div>

      {/* Contributors Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} size="lg">
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
                            className="mt-2 rounded-md w-9"
                            src={
                              contributor?.image ||
                              makeBlockie(contributor?.address)
                            }
                            alt="Sender Avatar"
                          />
                          <p className="text-md mt-2 mx-2 text-black ml-2">
                            {contributor?.name}
                          </p>
                          <span
                            className="text-black bg-black rounded-full px-2 py-1 mt-2 text-sm cursor-pointer"
                            onClick={() => {
                              router.push("/profile" + contributor?.address);
                            }}
                          >
                            {contributor?.address?.slice(0, 6)}...
                            {contributor?.address?.slice(-6)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <button
              className="bg-black text-white rounded-lg mr-3 px-4 py-2"
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
