"use client";
import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import DatasetViewer from "@/components/UI/DatasetViewer";
import InstanceCodes from "@/components/UI/InstanceCodes";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Container } from "@/components/UI/container";
import CardItem from "@/components/Profile/CardItem";
import Loading from "@/components/Animation/Loading";
import useInstanceData from "@/hooks/useInstanceData";

const InstanceDetailsPage = ({ params: { id } }) => {
  const router = useRouter();
  const instanceID = id;
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, error } = useInstanceData(instanceID);

  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center mx-auto mt-[10%]">
          <Loading />
        </div>
      </Container>
    );
  }

  if (error) {
    return <div>Error loading instance data</div>;
  }

  const { instance, instanceMembers } = data;

  return (
    <Container>
      <div>
        {instance && ( // Render component only if instance data is available
          <div>
            <Box
              bg="#333333"
              className="flex flex-col items-center "
              borderRadius="md"
              boxShadow="md"
              mb={4}
              p={["2", "4"]}
            >
              <CardItem
                profileInfo={{
                  name: instance?.metadata?.name || "Instance Name",
                  desc: instance?.metadata?.about || "Instance Description",
                  picture: instance?.metadata?.imageUrl || "/path/to/image.jpg",
                  members: instanceMembers || [instance?.creator],
                  creator: instance?.creator,
                }}
                creator={instance?.creator}
              />
              {/* {!(
                  hasAccess ||
                  instanceMembers.find(
                    (member) => member?.toLowerCase() === address?.toLowerCase()
                  )
                ) && (
                  <div>
                    <Button
                      className="border-white border p-3 rounded-md "
                      colorScheme="black"
                      size="mb"
                      mb={3}
                      onClick={() => {
                        onOpen();
                      }}
                    >
                      Subscribe
                    </Button>
                    <Subscribe
                      instanceID={instanceID}
                      isOpen={isOpen}
                      onClose={onClose}
                      price={instance?.price || 0}
                    />
                  </div> */}
              {/* )} */}
            </Box>
            <Box
              bg="#333333"
              borderRadius="md"
              height={1000}
              boxShadow="md"
              mb={4}
              p={["2", "4"]}
            >
              {
                //   (hasAccess ||
                // instanceMembers.find(
                //   (member) => member.toLowerCase() === address.toLowerCase()
                //     )) &&
                <Tabs
                  isFitted
                  variant="enclosed"
                  className="text-white"
                  minWidth={["150px", "200px"]}
                  colorScheme="white"
                  mb="4"
                >
                  <TabList mb="4">
                    <Tab>Dataset</Tab>
                    <Tab>Codes</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <DatasetViewer
                        cid={instance?.cid}
                        IPNS={instance?.IPNS}
                        EncryptedKeyCID={instance?.IPNSEncryptedKey}
                        isEncrypted={instance?.price > 0}
                        spaceID={instanceID}
                        hasAccess={
                          instance?.creator?.toLowerCase() ==
                            address?.toLowerCase() ||
                          instanceMembers.find(
                            (member) =>
                              member?.toLowerCase() === address?.toLowerCase()
                          )
                        }
                      />
                    </TabPanel>

                    <TabPanel>
                      <InstanceCodes
                        hasAccess={
                          instance?.creator?.toLowerCase() ==
                            address?.toLowerCase() ||
                          instanceMembers.find(
                            (member) =>
                              member?.toLowerCase() === address?.toLowerCase()
                          )
                        }
                        spaceID={instance?.spaceID}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              }
            </Box>
          </div>
        )}
      </div>
    </Container>
  );
};

export default InstanceDetailsPage;
