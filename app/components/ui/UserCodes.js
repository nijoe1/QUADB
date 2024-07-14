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
import { Container } from "@/components//ui/container";
import CodeViewer from "./CodeViewer"; // Import CodeViewer component
import { useRouter } from "next/router";
import { FaEllipsisV } from "react-icons/fa";
import { getUserCodes } from "@/utils/tableland";
import Loading from "@/components/Animation/Loading";
import { getIpfsGatewayUri, resolveIPNS } from "@/utils/IPFS";
import { FaArrowLeft } from "react-icons/fa";
import UpdateIPNS from "@/components/ui/UpdateIPNS";
import makeBlockie from "ethereum-blockies-base64";
import { useAccount } from "wagmi";
import { isAddress } from "viem";

const UserCodes = () => {
  const { address } = useAccount();
  const [code, setCode] = useState(null);
  const [viewAllCodes, setViewAllCodes] = useState(true);

  const router = useRouter();
  const userAddress = router.asPath.replace("/#/profile?address=", "");
  const {
    isOpen,
    onOpen,
    onClose,
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const [codes, setCodes] = useState([]);
  const [fetched, setFetched] = useState(false);

  async function fetchInstanceCodes() {
    let addr = isAddress(userAddress) ? userAddress : address;

    const data = await getUserCodes(addr);
    for (const key in data) {
      data[key].codeCID = getIpfsGatewayUri(await resolveIPNS(data[key].IPNS));
      data[key].blockie = makeBlockie(data[key].creator);
      data[key].creator = data[key].creator.toLowerCase();
    }
    console.log(data);
    return data;
  }

  useEffect(() => {
    if (!fetched) {
      fetchInstanceCodes().then((resp) => {
        setCodes(resp);
        setFetched(!fetched);
      });
    }
  }, [address, userAddress]);

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
      {!fetched ? (
        <div className="flex flex-col items-center mx-auto mt-[10%]">
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
                                    pathname: "",
                                    hash: "/profile?address=" + code.creator,
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
                                  pathname: "",
                                  hash: "/profile?address=" + code.creator,
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
