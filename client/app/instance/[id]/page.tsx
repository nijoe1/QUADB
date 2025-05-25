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
import DatasetViewer from "@/components/datasetViewer";
import InstanceCodes from "@/components/InstanceCodes";
import { useAccount } from "wagmi";
import { Container } from "@/ui-shadcn/container";
import { CardItem } from "./components/CardItem";
import Loading from "@/components/animation/loading";
import { useInstanceData } from "@/hooks/contracts/queries";
import { Subscribe } from "@/components/contracts/subscribe";
import { useInstanceMembers } from "@/hooks/contracts/queries";
const InstanceDetailsPage = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const instanceID = id;
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, error } = useInstanceData(instanceID);
  const { data: instanceMembers } = useInstanceMembers(instanceID);

  if (isLoading) {
    return (
      <Container>
        <div className="mx-auto mt-[10%] flex flex-col items-center">
          <Loading />
        </div>
      </Container>
    );
  }

  if (error) {
    return <div>Error loading instance data</div>;
  }

  const hasAccess =
    data?.instance?.creator?.toLowerCase() === address?.toLowerCase();

  const { instance } = data || {};

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
                }}
                creator={instance?.creator}
              />
              {!((hasAccess ||
                instanceMembers?.find(
                  (member: any) =>
                    member?.toLowerCase() === address?.toLowerCase()
                )) as boolean) && (
                <div>
                  <Button
                    className="rounded-md border border-white p-3 "
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
                </div>
              )}
            </Box>
            <Box
              bg="#333333"
              borderRadius="md"
              height={1000}
              boxShadow="md"
              mb={4}
              p={["2", "4"]}
            >
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
                      threshold={instance?.threshold}
                      IPNS={instance?.IPNS}
                      EncryptedKeyCID={instance?.IPNSEncryptedKey}
                      isEncrypted={instance?.price > 0}
                      spaceID={instanceID}
                    />
                  </TabPanel>

                  <TabPanel>
                    <InstanceCodes
                      hasAccess={
                        (instance?.creator?.toLowerCase() ==
                          address?.toLowerCase() ||
                          instanceMembers?.find(
                            (member: any) =>
                              member?.toLowerCase() === address?.toLowerCase()
                          )) as boolean
                      }
                      InstanceID={instance?.InstanceID}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </div>
        )}
      </div>
    </Container>
  );
};

export default InstanceDetailsPage;
