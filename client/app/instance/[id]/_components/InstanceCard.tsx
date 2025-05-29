"use client";

import React, { useState, useEffect } from "react";

import makeBlockie from "ethereum-blockies-base64";
import { useAccount } from "wagmi";

import { Button } from "@/primitives/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/ui-shadcn/dialog";

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

interface InstanceCardProps {
  profileInfo?: ProfileInfo;
  creator?: string;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({ profileInfo, creator }) => {
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

  useEffect(() => {
    if (profileInfo?.members) {
      setContributors(
        profileInfo?.members
          .filter((member) => !!member)
          .map((member) => ({
            address: member,
            name: member,
            image: makeBlockie(member),
          })),
      );
    }
  }, [profileInfo]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center rounded-xl bg-[#424242] p-1 shadow-md">
        <div className="flex w-full flex-col items-center">
          <img
            src={profileInfo?.picture || "/path/to/image.jpg"}
            alt="Profile Image"
            className="mb-5 h-[200px] rounded-lg"
          />
          <p className="text-lg font-bold text-white">{profileInfo?.name || "User Name"}</p>
          <span className="mt-2 rounded-full bg-black px-2 py-1 text-sm text-white">
            {getCreator?.slice(0, 6)}...{getCreator?.slice(-6)}
          </span>
          <Button
            onClick={handleShowModal}
            className="mt-4 rounded bg-black/80 px-4 py-2 text-white"
            value="Contributors"
          />
          <p className="mt-2 line-clamp-5 p-5 text-sm text-white">
            {profileInfo?.desc || "User Description"}
          </p>
        </div>
      </div>

      {/* Contributors Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="border-grey-300 bg-white text-black sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-black">Contributors</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 text-black">Address</th>
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
                            src={contributor?.image || makeBlockie(contributor?.address)}
                            alt="Sender Avatar"
                          />
                          <p className="mx-2 mt-2 text-black">{contributor?.name}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button
              className="mr-3 rounded-lg bg-black px-4 py-2 text-white"
              onClick={handleCloseModal}
              value="Close"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
