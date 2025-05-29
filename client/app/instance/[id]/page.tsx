"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";

import Loading from "@/components/animation/loading";
import { DatasetViewer } from "@/components/datasetViewer";
import { useInstanceData } from "@/hooks/contracts/queries";
import { useInstanceMembers } from "@/hooks/contracts/queries";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Container } from "@/ui-shadcn/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-shadcn/tabs";

import { InstanceCard, InstanceCodesView, VersionsView } from "./_components";

const InstanceDetailsPage = ({ params: { id } }: { params: { id: string } }) => {
  const instanceID = id;
  const { address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useInstanceData(instanceID);
  const { data: instanceMembers } = useInstanceMembers(instanceID);
  // Get current tab from URL params, default to 'dataset'
  const currentTab = searchParams.get("tab") || "dataset";

  // Handle tab changes with URL params
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "dataset") {
      params.delete("tab"); // Remove tab param for default tab
    } else {
      params.set("tab", value);
    }
    router.push(`?${params.toString()}`);
  };

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

  const { instance } = data || {};

  return (
    <Container>
      <div>
        {instance && ( // Render component only if instance data is available
          <div>
            <Card className="mb-4 bg-[#333333] p-4 md:p-6">
              <CardContent className="flex flex-col items-center p-0">
                <InstanceCard
                  profileInfo={{
                    name: instance?.metadata?.name || "Instance Name",
                    desc: instance?.metadata?.about || "Instance Description",
                    picture: instance?.metadata?.imageUrl || "/path/to/image.jpg",
                    members: instanceMembers || [instance?.creator],
                  }}
                  creator={instance?.creator}
                />
              </CardContent>
            </Card>

            <Card className="mb-4 min-h-[1000px] bg-[#333333] p-4 md:p-6">
              <CardContent className="p-0">
                <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="mb-4 grid w-full grid-cols-3 bg-[#424242]">
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
                    <TabsTrigger
                      value="versions"
                      className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Versions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dataset">
                    <DatasetViewer cid={instance?.cid} />
                  </TabsContent>

                  <TabsContent value="codes">
                    <InstanceCodesView
                      hasAccess={
                        (instance?.creator?.toLowerCase() == address?.toLowerCase() ||
                          instanceMembers?.find(
                            (member: any) => member?.toLowerCase() === address?.toLowerCase(),
                          )) as boolean
                      }
                      InstanceID={instance?.InstanceID}
                    />
                  </TabsContent>

                  <TabsContent value="versions">
                    <VersionsView
                      hasAccess={
                        (instance?.creator?.toLowerCase() == address?.toLowerCase() ||
                          instanceMembers?.find(
                            (member: any) => member?.toLowerCase() === address?.toLowerCase(),
                          )) as boolean
                      }
                      IPNS={instance?.IPNS}
                      spaceID={instanceID}
                      threshold={instance?.threshold}
                      EncryptedKeyCID={instance?.IPNSEncryptedKey}
                      currentIPNSValue={instance?.IPNS}
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
