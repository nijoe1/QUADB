"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-shadcn/tabs";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Button } from "@/primitives/Button";
import { DatasetViewer } from "@/components/datasetViewer";
import InstanceCodes from "@/components/InstanceCodes";
import { useAccount } from "wagmi";
import { Container } from "@/ui-shadcn/container";
import { CardItem } from "./components/CardItem";
import Loading from "@/components/animation/loading";
import { useInstanceData } from "@/hooks/contracts/queries";
import { Subscribe } from "@/components/contracts/subscribe";
import { useInstanceMembers } from "@/hooks/contracts/queries";
import { useState } from "react";

const InstanceDetailsPage = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const instanceID = id;
  const { address } = useAccount();
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
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
            <Card className="mb-4 bg-[#333333] p-4 md:p-6">
              <CardContent className="flex flex-col items-center p-0">
                <CardItem
                  profileInfo={{
                    name: instance?.metadata?.name || "Instance Name",
                    desc: instance?.metadata?.about || "Instance Description",
                    picture:
                      instance?.metadata?.imageUrl || "/path/to/image.jpg",
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
                      className="mb-3 rounded-md border border-white p-3"
                      onClick={() => setIsSubscribeOpen(true)}
                      value="Subscribe"
                    />
                    <Subscribe
                      instanceID={instanceID}
                      isOpen={isSubscribeOpen}
                      onClose={() => setIsSubscribeOpen(false)}
                      price={instance?.price || 0}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-4 min-h-[1000px] bg-[#333333] p-4 md:p-6">
              <CardContent className="p-0">
                <Tabs defaultValue="dataset" className="w-full">
                  <TabsList className="mb-4 grid w-full grid-cols-2 bg-[#424242]">
                    <TabsTrigger
                      value="dataset"
                      className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Dataset
                    </TabsTrigger>
                    <TabsTrigger
                      value="codes"
                      className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Codes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dataset">
                    <DatasetViewer
                      cid={instance?.cid}
                      threshold={instance?.threshold}
                      IPNS={instance?.IPNS}
                      EncryptedKeyCID={instance?.IPNSEncryptedKey}
                      spaceID={instanceID}
                    />
                  </TabsContent>

                  <TabsContent value="codes">
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
};

export default InstanceDetailsPage;
