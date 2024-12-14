// "use client";
// import React, { useState, useEffect } from "react";
// import { Box, Image, Text, Badge, Button, IconButton } from "@chakra-ui/react";
// import { useAccount } from "wagmi";
// import UpdateProfile from "../../components/Profile/UpdateProfile";
// import { FaEdit } from "react-icons/fa";
// import { isAddress } from "viem";
// // Inside your component:
// const Profile = ({ onProfile }: { onProfile: any }) => {
//   const { address } = useAccount();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleOpenModal = () => {
//     setIsOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsOpen(false);
//   };
//   const [profileInfo, setProfileInfo] = useState<any>(null);

//   useEffect(() => {
//     async function getProfile() {}
//     getProfile();
//   }, [profileInfo, address]);

//   useEffect(() => {
//     async function getProfile() {}
//     getProfile();
//   }, [profileInfo]);

//   return (
//     <div className="mt-[5%] max-w-[1200px] mx-auto">
//       <Box
//         p={["2", "4"]}
//         className="mx-[5%]"
//         bg="#333333"
//         borderRadius="xl"
//         boxShadow="md"
//       >
//         <Box p="4" mb="4" className="flex flex-col items-center">
//           <img src="./images/allo.jpg" alt="Profile Image" />
//           <div className="flex flex-wrap items-center">
//             <Text fontWeight="bold" color="white">
//               {profileInfo?.name || "User Name"}
//             </Text>
//             {onProfile && (
//               <div>
//                 <IconButton
//                   icon={<FaEdit />}
//                   aria-label="Open Profile Modal"
//                   onClick={handleOpenModal}
//                 />
//                 <UpdateProfile
//                   isOpen={isOpen}
//                   onClose={handleCloseModal}
//                   onUpdateProfile={() => {}}
//                   profileInfo={profileInfo}
//                 />
//               </div>
//             )}
//           </div>
//           <Badge
//             className="text-black bg-black"
//             borderRadius="full"
//             px="2"
//             py="1"
//             mt="2"
//             fontSize="sm"
//           >
//             User Name
//           </Badge>
//           <Text fontSize={["sm", "md"]} color="white" mt="2">
//             {profileInfo?.desc || "User Description"}
//           </Text>
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default Profile;
