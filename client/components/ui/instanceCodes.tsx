"use client";
import React, { useState, useEffect } from "react";
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
import { Container } from "@/components/ui/container";
import CodeViewer from "@/components/ui/CodeViewer"; // Import CodeViewer component
import CreateNewInstanceCode from "@/components/contracts/createInstanceCode";
import { FaEllipsisV } from "react-icons/fa";
import { getInstanceCodes } from "@/lib/tableland";
import Loading from "@/components/animation/loading";
import { getIpfsGatewayUri, resolveIPNS } from "@/lib/ipfs";
import { FaArrowLeft } from "react-icons/fa";
import UpdateIPNS from "@/components/ui/UpdateIPNS";
import makeBlockie from "ethereum-blockies-base64";
import router from "next/router";

const InstanceCodes = ({
  hasAccess,
  spaceID,
}: {
  hasAccess: boolean;
  spaceID: string;
}) => {
  const [code, setCode] = useState<any | null>(null);
  const [viewAllCodes, setViewAllCodes] = useState(true);

  const {
    isOpen,
    onOpen,
    onClose,
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const [codes, setCodes] = useState([] as any[]);
  const [fetched, setFetched] = useState(false);

  async function fetchInstanceCodes() {
    // const data = (await getSpaceInstances(spaceID))[0].instances;
    const data = await getInstanceCodes(spaceID);
    for (const key in data) {
      data[key].codeCID = getIpfsGatewayUri(await resolveIPNS(data[key].IPNS));
      data[key].blockie = makeBlockie(data[key].creator);
      data[key].profile = await getProfileInfo(data[key].creator);
    }
    console.log(data);
    return data;
  }

  const getProfileInfo = async (address: any) => {
    return;
  };

  useEffect(() => {
    if (!fetched) {
      fetchInstanceCodes().then((resp) => {
        setCodes(resp);
        setFetched(!fetched);
      });
    }
  }, [spaceID]);

  const handleNewClick = async () => {
    onOpen();
  };

  const handleUpdateClick = async () => {
    onUpdateOpen();
  };

  const handleClick = (instance: any) => {
    setCode(instance);
    setViewAllCodes(false);
  };

  const handleBack = () => {
    setCode(null);
    setViewAllCodes(true);
  };

  return (
    <div>
      {!fetched ? (
        <div className="mx-auto mt-[10%] flex flex-col items-center">
          <Loading />
        </div>
      ) : (
        <Container>
          {code ? (
            <>
              {hasAccess && (
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
                    threshold={code.threshold}
                    currentIPNSValue={code.IPNS}
                    isOpen={isUpdateOpen}
                    onClose={onUpdateClose}
                    isDataset={false}
                    IPNS={code.IPNS}
                    EncryptedKeyCID={code.IPNSEncryptedKey}
                    isEncrypted={code.isEncrypted}
                    spaceID={spaceID}
                    currentCSV=""
                  />
                </div>
              )}

              <CodeViewer code={code} onClose={handleBack} />
            </>
          ) : (
            <div>
              <Button
                onClick={handleNewClick}
                colorScheme="black"
                ml="3"
                className="bg-black/80 text-white"
                my="4"
              >
                Create Code
              </Button>
              <CreateNewInstanceCode
                onClose={onClose}
                isOpen={isOpen}
                spaceID={spaceID as `0x${string}`}
              />
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
                  className="relative flex md:justify-between lg:grid lg:px-3"
                >
                  {codes.map((code) => (
                    <GridItem key={code.InstanceID}>
                      <Box
                        pb="4"
                        px="2"
                        pt="2"
                        bg="#333333"
                        // borderRadius="md"
                        boxShadow="md"
                        position="relative"
                        className="border-1 cursor-pointer border-white"
                      >
                        <Box
                          height="100px"
                          className="border-1 cursor-pointer border-white"
                        >
                          <Box
                            display="flex"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            position="absolute"
                            top="0"
                            right="0"
                            zIndex="1"
                          >
                            <Menu>
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
                          <div className="border-1 mb-2 flex cursor-pointer flex-wrap items-center rounded-md border-white">
                            <Box
                              borderRadius="md"
                              boxSize="35px"
                              mr={2}
                              bg="#333333"
                              cursor={"pointer"}
                              className="border-1 cursor-pointer border-white"
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
                                    pathname: "/profile" + code.creator,
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
                                  pathname: "/profile" + code?.creator,
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

export default InstanceCodes;
