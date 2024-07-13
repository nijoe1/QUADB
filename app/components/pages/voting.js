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
  Input,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
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
  const [voiceCredits, setVoiceCredits] = useState(10000);
  const [votes, setVotes] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem("votes")) || {};
    setVotes(savedVotes);
    updateVoiceCredits(savedVotes);
  }, []);

  const updateVoiceCredits = (votesObj) => {
    const usedVoiceCredits = Object.values(votesObj).reduce(
      (acc, numVotes) => acc + numVotes * numVotes,
      0
    );
    setVoiceCredits(10000 - usedVoiceCredits);
  };

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

    // Remove votes associated with the removed item
    const updatedVotes = { ...votes };
    delete updatedVotes[instanceID];
    setVotes(updatedVotes);
    localStorage.setItem("votes", JSON.stringify(updatedVotes));
    updateVoiceCredits(updatedVotes);
  };

  const handleVoteChange = (instanceID, value) => {
    if (value < 0) return;

    const newVotesObj = { ...votes, [instanceID]: value };
    setVotes(newVotesObj);
    localStorage.setItem("votes", JSON.stringify(newVotesObj));
    updateVoiceCredits(newVotesObj);
  };

  const handleVote = (instanceID, action) => {
    const currentVotes = votes[instanceID] || 0;
    const newVotes =
      action === "increment" ? currentVotes + 1 : currentVotes - 1;

    if (newVotes < 0) return;

    const newVotesObj = { ...votes, [instanceID]: newVotes };
    setVotes(newVotesObj);
    localStorage.setItem("votes", JSON.stringify(newVotesObj));
    updateVoiceCredits(newVotesObj);
  };

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
          <Flex justify="space-between" mb="4" gap={3}>
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
                        <Badge className="mt-2" colorScheme="green">
                          {instance.category}
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
                        onClick={() =>
                          navigateToHashRoute(
                            "/instance?id=" + instance.InstanceID
                          )
                        }
                        colorScheme="gray"
                        className="mt-5 items-end float-right"
                        leftIcon={<FaArrowRight />}
                      ></Button>
                      {!cart.find(
                        (item) => item.InstanceID === instance.InstanceID
                      ) && (
                        <Button
                          colorScheme="gray"
                          className="mt-5 items-start float-left"
                          onClick={() => addToCart(instance)}
                          leftIcon={<FaShoppingCart />}
                        ></Button>
                      )}
                    </div>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </Container>
      )}
      <Modal isOpen={isCartOpen} onClose={onCartClose} isCentered={true}>
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
                  <Flex justify="space-between" alignItems="center">
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
                    <Text>Votes:</Text>
                    <Flex alignItems="center">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleVote(instance.InstanceID, "decrement")
                        }
                        isDisabled={!(votes[instance.InstanceID] > 0)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={votes[instance.InstanceID] || 0}
                        onChange={(e) =>
                          handleVoteChange(
                            instance.InstanceID,
                            parseInt(e.target.value)
                          )
                        }
                        width="60px"
                        textAlign="center"
                        mx="2"
                      />
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
                    <Text>
                      Voice Credits: {(votes[instance.InstanceID] || 0) ** 2}
                    </Text>
                  </Flex>
                </Box>
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Text mr="4">Remaining Voice Credits: {voiceCredits}</Text>
            <Button colorScheme="gray" mr={3} onClick={onCartClose}>
              Close
            </Button>
            <Tooltip
              label="WIP!  Soon you will be able to vote privately for the datasets that matter for you sir."
              fontSize="md"
            >
              <Button colorScheme="gray">Vote</Button>
            </Tooltip>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VotingPage;
