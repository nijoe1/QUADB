import React, { useState, useEffect } from "react";
import { Box, Image, Text, Badge, Button, IconButton } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import UpdateProfile from "@/components/profile/UpdateProfile";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import { isAddress } from "viem";
// Inside your component:
const Profile = ({ onProfile }) => {
  const router = useRouter();
  const { address } = useAccount();
  const userAddress = router.asPath.replace("/#/profile?address=", "");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const [profileInfo, setProfileInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    async function getProfile() {
      await fetchNotifications();
      await fetchSubscriptions();
    }
    getProfile();
  }, [profileInfo, userAddress]);


  const updateProfileInfo = async (name, description, picture) => {
    try {
      const response = await pushSign.profile.update({
        name: name,
        desc: description,
        picture: picture,
      });

      const info = await pushSign.profile.info();
      setProfileInfo(info);
    } catch (error) {
      console.error("Error updating profile info:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await pushSign.notification.list("INBOX");
      console.log(response);
      setNotifications(response);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await pushSign.notification.subscriptions();
      setSubscriptions(response);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };
  useEffect(() => {
    async function getProfile() {
    }
    getProfile();
  }, [profileInfo]);

  return (
    <div className="mt-[5%] max-w-[1200px] mx-auto">
      <Box
        p={["2", "4"]}
        className="mx-[5%]"
        bg="#333333"
        borderRadius="xl"
        boxShadow="md"
      >
        <Box p="4" mb="4" className="flex flex-col items-center">
          <Image
            src={profileInfo?.picture || "/path/to/image.jpg"}
            alt="Profile Image"
            borderRadius="full"
            boxSize={["120px", "150px"]}
            mb="4"
          />
          <div className="flex flex-wrap items-center">
            <Text fontSize={["lg", "xl"]} fontWeight="bold" color="white">
              {profileInfo?.name || "User Name"}
            </Text>
            {onProfile && (
              <div>
                <IconButton
                  icon={<FaEdit />}
                  aria-label="Open Profile Modal"
                  colorScheme="ghost"
                  ml="3"
                  color="white"
                  onClick={handleOpenModal}
                />
                <UpdateProfile
                  isOpen={isOpen}
                  onClose={handleCloseModal}
                  onUpdateProfile={updateProfileInfo}
                />
              </div>
            )}
          </div>
          <Badge
            className="text-black bg-black"
            borderRadius="full"
            px="2"
            py="1"
            mt="2"
            fontSize="sm"
          >
            {userAddress.toLowerCase() == address?.toLowerCase() ||
            !isAddress(userAddress)
              ? `${address?.slice(0, 6)}...${address?.slice(-6)}`
              : `${userAddress.slice(0, 6)}...${userAddress.slice(-6)}`}
          </Badge>
          <Text fontSize={["sm", "md"]} color="white" mt="2">
            {profileInfo?.desc || "User Description"}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
