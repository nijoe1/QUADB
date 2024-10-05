"use client";
import React, { useState } from "react";
import {
  Flex,
  Box,
  Image,
  Text,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Container } from "@/app/components/UI/container";
import CodeViewer from "./CodeViewer"; // Import CodeViewer component
import { useRouter } from "next/navigation";
import { FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import Loading from "@/app/components/Animation/Loading";
import UpdateIPNS from "@/app/components/UI/UpdateIPNS";
import useUserInstanceCodes from "@/app/hooks/useUserInstanceCodes";
import makeBlockie from "ethereum-blockies-base64";

const UserCodes = () => {
  const [code, setCode] = useState(null);
  const [viewAllCodes, setViewAllCodes] = useState(true);

  const router = useRouter();
  const userAddress = undefined;
  const {
    isOpen,
    onOpen,
    onClose,
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const { data: codes, isLoading } = useUserInstanceCodes(userAddress);

  const handleNewClick = async () => {
    onOpen();
  };

  const handleUpdateClick = async () => {
    onUpdateOpen();
  };

  const handleClick = (instance) => {
    setCode(instance);
    setViewAllCodes(false);
  };

  const handleBack = () => {
    setCode(null);
    setViewAllCodes(true);
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col items-center mx-[10%] mt-[10%]">
          <Loading />
        </div>
      ) : (
        <Container>
          {code ? (
            <>
              <div className="flex flex-wrap">
                <IconButton
                  icon={<FaArrowLeft />}
                  aria-label="Go back to All Codes"
                  variant="outline"
                  mb="4"
                  ml={"6%"}
                  onClick={handleBack}
                />
                <Button
                  colorScheme="black"
                  ml="3"
                  className="bg-black/80 text-white"
                  onClick={handleUpdateClick}
                >
                  Update Notebook
                </Button>
                <UpdateIPNS
                  isOpen={isUpdateOpen}
                  onClose={onUpdateClose}
                  isDataset={false}
                  IPNS={code.IPNS}
                  EncryptedKeyCID={code.IPNSEncryptedKey}
                />
              </div>

              <CodeViewer code={code} onClose={handleBack} />
            </>
          ) : (
            <div>
              <Flex justify="center">
                <Grid
                  templateColumns={[
                    "1fr",
                    "repeat(2, 1fr)",
                    "repeat(3, 1fr)",
                    "repeat(4, 1fr)",
                  ]}
                  gap={6}
                  width="100%"
                  className="flex md:justify-between lg:grid lg:px-3 relative"
                >
                  {codes.map((code) => (
                    <GridItem key={code.InstanceID}>
                      <Box
                        pb="4"
                        px="2"
                        pt="2"
                        bg="#333333"
                        borderRadius="md"
                        borderColor={"white"}
                        boxShadow="md"
                        className="cursor-pointer border-1 border-white"
                        position="relative"
                      >
                        <Box height="100px">
                          <Box
                            display="flex"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            position="absolute"
                            top="0"
                            right="0"
                            zIndex="1"
                          >
                            <Menu zIndex="2">
                              <MenuButton
                                as={IconButton}
                                icon={<FaEllipsisV />}
                                aria-label="Options"
                                variant="black"
                                color="white"
                                size="sm"
                                mb="3"
                              />
                              <MenuList zIndex="15" scale={0.2}>
                                <MenuItem
                                  onClick={() => console.log("Download code")}
                                >
                                  Download code{" "}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => console.log("View code")}
                                >
                                  View code{" "}
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Box>
                          <div className="flex flex-wrap items-center mb-2 rounded-md">
                            <Box
                              borderRadius="md"
                              boxSize="35px"
                              mr={2}
                              bg="#333333"
                              cursor={"pointer"}
                            >
                              <Image
                                className=" rounded-md"
                                src={
                                  code.profile?.picture
                                    ? code.profile?.picture
                                    : makeBlockie(code.creator)
                                }
                                alt="Sender Avatar"
                                onClick={() => {
                                  router.push({
                                    pathname: "/profile" + contributor?.address,
                                  });
                                }}
                              />
                            </Box>
                            <Text
                              fontWeight="semibold"
                              fontSize="sm"
                              noOfLines={1}
                              color="white"
                              mb="1"
                              cursor="pointer"
                              onClick={() => {
                                router.push({
                                  pathname: "/profile/" + code.creator,
                                });
                              }}
                            >
                              {code.profile?.name}
                            </Text>
                          </div>

                          <Text
                            fontWeight="semibold"
                            fontSize="sm"
                            noOfLines={1}
                            color="white"
                            mb="1"
                            cursor="pointer"
                            onClick={() => handleClick(code)}
                          >
                            {code.name.slice(0, 30)}
                          </Text>
                          <Text
                            cursor="pointer"
                            fontSize="xs"
                            noOfLines={2}
                            color="white"
                            mb="1"
                            onClick={() => handleClick(code)}
                          >
                            {code.about.slice(0, 50)}
                          </Text>
                        </Box>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </Flex>
            </div>
          )}
        </Container>
      )}
    </div>
  );
};

export default UserCodes;
