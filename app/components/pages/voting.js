import React, { useCallback, useEffect, useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  ModalFooter,
} from "@chakra-ui/react";
import {
  FaAccessibleIcon,
  FaArrowRight,
  FaEllipsisV,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import { Container } from "@/components/ui/container";
import { getIpfsGatewayUri } from "@/utils/IPFS";
import { getCategorizedInstances } from "@/utils/tableland";
import axios from "axios";
import Loading from "@/components/Animation/Loading";
import { useRouter } from "next/router";

const VotingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fetched, setFetched] = useState(false);
  const [instances, setInstances] = useState([]);
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();
  const [voiceCredits, setVoiceCredits] = useState(100000);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem("votes")) || {};
    setVotes(savedVotes);
  }, []);

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
    const data = await getCategorizedInstances();
    const instancesWithMetadata = await getMetadataCID(data);
    setInstances(instancesWithMetadata);
    setFilteredInstances(instancesWithMetadata);
    setFetched(true);

    // Extract unique categories
    const uniqueCategories = [
      ...new Set(instancesWithMetadata.map((instance) => instance.category)),
    ];
    setCategories(uniqueCategories);
  }

  useEffect(() => {
    fetchInstances();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredInstances(
        instances.filter((instance) => instance.category === selectedCategory)
      );
    } else {
      setFilteredInstances(instances);
    }
  }, [selectedCategory, instances]);

  const addToCart = (instance) => {
    if (cart.find((item) => item.InstanceID === instance.InstanceID)) {
      return; // Avoid duplicates
    }
    const updatedCart = [...cart, instance];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (instanceID) => {
    const updatedCart = cart.filter((item) => item.InstanceID !== instanceID);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleVote = (instanceID, action) => {
    const currentVotes = votes[instanceID] || 0;
    const newVotes =
      action === "increment" ? currentVotes + 1 : currentVotes - 1;

    if (newVotes < 0) return;

    const newVotesObj = { ...votes, [instanceID]: newVotes };
    setVotes(newVotesObj);
    localStorage.setItem("votes", JSON.stringify(newVotesObj));

    // Update voice credits
    const usedVoiceCredits = Object.values(newVotesObj).reduce(
      (acc, numVotes) => acc + numVotes * numVotes,
      0
    );
    setVoiceCredits(100000 - usedVoiceCredits);
  };
  const router = useRouter();

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

  return (
    <div className="flex flex-col items-center">
      {!fetched ? (
        <div className="mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <Container>
          <Flex justify="space-between" mb="4">
            <Select
              placeholder="Select Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Button onClick={onCartOpen} leftIcon={<FaShoppingCart />}>
              Open Cart ({cart.length})
            </Button>
          </Flex>
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
              {filteredInstances.map((instance) => (
                <GridItem key={instance.InstanceID}>
                  <Box
                    pb="4"
                    px="2"
                    pt="2"
                    bg="white"
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
                        <Badge className="mt-2"colorScheme="green">{instance.category}</Badge>
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
                        color="black"
                        mb="1"
                      >
                        {instance.metadata.name.slice(0, 30)}
                      </Text>
                      <Text fontSize="xs" noOfLines={2} color="black" mb="1">
                        {instance.metadata.about.slice(0, 50)}
                      </Text>
                    </Box>
                    <div className="flex items-center justify-between mx-auto gap-4 ">
                      <Button
                        colorScheme="gray"
                        className="mt-5"
                        onClick={() => addToCart(instance)}
                        leftIcon={<FaShoppingCart />}
                      ></Button>
                      <Button
                        onClick={() =>
                          navigateToHashRoute(
                            "/instance?id=" + instance.InstanceID
                          )
                        }
                        colorScheme="gray"
                        className="mt-5"
                        leftIcon={<FaArrowRight />}
                      ></Button>
                    </div>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </Container>
      )}
      <Modal isOpen={isCartOpen} onClose={onCartClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Cart</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {cart.length === 0 ? (
              <Text>No items in the cart</Text>
            ) : (
              cart.map((instance) => (
                <Box key={instance.InstanceID} mb="4">
                  <Flex justify="space-between">
                    <Box>
                      <Text fontWeight="semibold">
                        {instance.metadata.name}
                      </Text>
                      <Text fontSize="sm">{instance.metadata.about}</Text>
                    </Box>
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => removeFromCart(instance.InstanceID)}
                    />
                  </Flex>
                  <Flex mt="2" justify="space-between" alignItems="center">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleVote(instance.InstanceID, "decrement")
                      }
                      isDisabled={!(votes[instance.InstanceID] > 0)}
                    >
                      -
                    </Button>
                    <Text>{votes[instance.InstanceID] || 0}</Text>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleVote(instance.InstanceID, "increment")
                      }
                      isDisabled={
                        voiceCredits -
                          ((votes[instance.InstanceID] || 0) + 1) *
                            ((votes[instance.InstanceID] || 0) + 1) <
                        0
                      }
                    >
                      +
                    </Button>
                  </Flex>
                </Box>
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Text mr="4">Voice Credits: {voiceCredits}</Text>
            <Button colorScheme="blue" mr={3} onClick={onCartClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VotingPage;
