"use client";
import React from "react";
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
import { useRouter } from "next/navigation";
import { CreateNewInstance } from "@/components/contracts/createNewInstance";
import Loading from "@/components/animation/loading";
import useFetchSpaceInstances from "@/hooks/useFetchSpaceInstances"; // Importing the custom hook

const SingleSpacePage = ({
  params: { spaceId },
}: {
  params: { spaceId: string };
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const spaceID = spaceId;

  // Using the custom hook to fetch instances
  const { instances, fetched } = useFetchSpaceInstances(spaceID);

  console.log(instances);

  const handleNewClick = () => {
    onOpen();
  };

  console.log("openInstances", instances);

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
              className="flex md:justify-between lg:grid lg:px-3 relative"
            >
              {Object.entries(instances).map(
                ([type, instanceArray]) =>
                  Array.isArray(instanceArray) &&
                  instanceArray.length > 0 &&
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
                                `/instance/${instance.InstanceID.toLowerCase()}`,
                                undefined
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
                            <Menu>
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
                                  className="bg-black/80 text-white"
                                  onClick={() =>
                                    console.log("Download dataset")
                                  }
                                >
                                  Download Dataset
                                </MenuItem>
                                <MenuItem className="bg-black/80 text-white">
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
                            {instance.metadata?.name?.slice(0, 30)}
                          </Text>
                          <Text
                            fontSize="xs"
                            noOfLines={2}
                            color="white"
                            mb="1"
                          >
                            {instance.metadata?.about?.slice(0, 50)}
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

export default SingleSpacePage;
