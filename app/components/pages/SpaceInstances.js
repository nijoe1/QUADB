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
import CreateNewInstance from "../contracts/createNewInstance";
import { getIpfsGatewayUri } from "@/utils/IPFS";
import { getSpaceInstances } from "@/utils/tableland";
import axios from "axios";
import Loading from "@/components/Animation/Loading";

const SingleSpacePage = () => {
  const router = useRouter();
  const spaceID = router.asPath.replace("/#/SingleSpacePage?id=", "");
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    const data = (await getSpaceInstances(spaceID))[0]?.instances;
    const dataObj = {}; // Initialize data object
    for (const key in data) {
      if (
        key === "openInstances" ||
        key === "openPrivateInstances" ||
        key === "paidInstances" ||
        key === "paidPrivateInstances"
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
  }, [spaceID]);

  const navigateToHashRoute = (hashRoute) => {
    if (hashRoute == "/") {
      router.push({
        pathname: hashRoute,
      });
    } else {
      router.push({
        pathname: "",
        hash: hashRoute,
      });
    }
  };

  const handleNewClick = () => {
    onOpen();
  };

  return (
    <div className="flex flex-col items-center">
      {!fetched ? (
        <div className="mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <Container>
          <Button
            onClick={handleNewClick}
            colorScheme="black"
            ml="3"
            className="bg-black/80 text-white"
            my="4"
          >
            Create Dataset
          </Button>
          <CreateNewInstance
            onClose={onClose}
            isOpen={isOpen}
            spaceID={spaceID}
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
                            navigateToHashRoute(
                              "/instance?id=" + instance.InstanceID,
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
                              type === "openInstances" ||
                              type === "openPrivateInstances"
                                ? "green"
                                : "red"
                            }
                          >
                            {type === "openInstances" ||
                            type === "openPrivateInstances"
                              ? "Open"
                              : "Paid"}
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
                )),
              )}
            </Grid>
          </Flex>
        </Container>
      )}
    </div>
  );
};

export default SingleSpacePage;
