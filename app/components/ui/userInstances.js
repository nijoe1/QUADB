import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Badge,
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
import { FaEllipsisV } from "react-icons/fa";
import { Container } from "@/components/ui/container";
import { useRouter } from "next/router";
import { getIpfsGatewayUri } from "@/utils/IPFS";
import { getUserInstances } from "@/utils/tableland";
import axios from "axios";
import Loading from "@/components/Animation/Loading";
import { useAccount } from "wagmi";
import { isAddress } from "viem";

const UserInstances = () => {
  const { address } = useAccount();
  const router = useRouter();
  const { address: userAddress } = router.query;
  const [fetched, setFetched] = useState(false);
  const [instances, setInstances] = useState({
    openInstances: [],
    openPrivateInstances: [],
    paidInstances: [],
    paidPrivateInstances: [],
  });

  async function getMetadataCID(data) {
    const temp = [];
    for (const item of data) {
      const metadataCIDLink = getIpfsGatewayUri(item.metadataCID);
      const res = await axios(metadataCIDLink);
      item.metadata = res.data; // obj that contains => name about imageUrl
      temp.push(item); // Push fetched JSON metadata directly
    }
    return temp;
  }

  async function fetchInstances() {
    let addr = isAddress(userAddress) ? userAddress : address;
    const data = (await getUserInstances(addr?.toLowerCase()))[0]?.instances;
    console.log(data);
    const dataObj = {}; // Initialize data object
    for (const key in data) {
      if (
        key === "createdInstances" ||
        key === "partOfInstances" ||
        key === "subscribedInstances"
      ) {
        const instancesArray = data[key].map(JSON.parse); // Parse each stringified JSON object
        dataObj[key] = await getMetadataCID(instancesArray);
      }
    }
    return dataObj;
  }

  useEffect(() => {
    fetchInstances().then((resp) => {
      setInstances(resp);
      setFetched(!fetched);
    });
  }, [userAddress]);
  return (
    <div className="flex flex-col items-center">
      {!fetched ? (
        <div className="mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <Container>
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
              {Object.entries(instances).map(([type, instanceArray]) =>
                instanceArray.map((instance) => (
                  <GridItem key={instance.InstanceID}>
                    <Box
                      pb="4"
                      px="2"
                      pt="2"
                      bg="#333333"
                      borderRadius="md"
                      boxShadow="md"
                      position="relative"
                      cursor="pointer"
                    >
                      <Box
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        mb="10%"
                        height="120px"
                      >
                        <Image
                          src={
                            instance.metadata.imageUrl
                              ? instance.metadata.imageUrl
                              : "https://via.placeholder.com/150"
                          }
                          alt="Profile Image"
                          width="100%"
                          aspectRatio={2 / 1}
                          objectFit="cover"
                          onClick={() =>
                            router.push(
                              "/instance/" + instance.InstanceID.toLowerCase()
                            )
                          }
                        />
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          position="absolute"
                          top="0"
                          right="0"
                          zIndex="1"
                        >
                          <Badge
                            mt="1.5"
                            colorScheme={
                              type === "createdInstances" ? "green" : "red"
                            }
                          >
                            {type === "createdInstances"
                              ? "Created"
                              : type === "partOfInstances"
                                ? "Contributor"
                                : "Subscriber"}
                          </Badge>
                          <Menu zIndex="2">
                            <MenuButton
                              as={IconButton}
                              icon={<FaEllipsisV />}
                              aria-label="Options"
                              variant="ghost"
                              color="black"
                              size="sm"
                              mb="3"
                            />
                            <MenuList zIndex="3">
                              <MenuItem
                                colorScheme="black"
                                className="bg-black/80 text-white"
                                onClick={() => console.log("Download dataset")}
                              >
                                Download Dataset
                              </MenuItem>
                              <MenuItem
                                colorScheme="black"
                                className="bg-black/80 text-white"
                                onClick={() => console.log("Fork instance")}
                              >
                                Fork Instance
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Box>
                      </Box>
                      <Box height="50px">
                        <Text
                          fontWeight="semibold"
                          fontSize="sm"
                          noOfLines={1}
                          color="white"
                          mb="1"
                        >
                          {instance.metadata.name.slice(0, 30)}
                        </Text>
                        <Text fontSize="xs" noOfLines={2} color="white" mb="1">
                          {instance.metadata.about.slice(0, 50)}
                        </Text>
                      </Box>
                    </Box>
                  </GridItem>
                ))
              )}
            </Grid>
          </Flex>
        </Container>
      )}
    </div>
  );
};

export default UserInstances;
