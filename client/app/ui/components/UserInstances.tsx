"use client";

import React, { useState, useEffect } from "react";

import axios from "axios";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

import Loading from "@/components/animation/loading";
import { getIpfsGatewayUri } from "@/lib/ipfs";
import { getUserInstances } from "@/lib/tableland";
import { Button } from "@/primitives/Button/Button";
import { Badge } from "@/ui-shadcn/badge";
import { Container } from "@/ui-shadcn/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui-shadcn/dropdown-menu";

export const UserInstances = () => {
  const { address } = useAccount();
  const router = useRouter();
  const userAddress = undefined;
  const [fetched, setFetched] = useState(false);
  const [instances, setInstances] = useState<any>({
    openInstances: [],
    openPrivateInstances: [],
    paidInstances: [],
    paidPrivateInstances: [],
  });

  async function getMetadataCID(data: any) {
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
    const addr = isAddress(userAddress ?? "") ? userAddress : address;
    const data = (await getUserInstances(addr?.toLowerCase()))[0]?.instances;
    console.log(data);
    const dataObj = {} as any; // Initialize data object
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
          <div className="flex justify-center">
            <div className="relative grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:justify-between lg:grid lg:grid-cols-3 lg:px-3 xl:grid-cols-4">
              {Object.entries(instances).map(([type, instanceArray]) => {
                const array = instanceArray as any[];
                return array.map((instance: any) => (
                  <div key={instance.InstanceID} className="w-full">
                    <div className="relative cursor-pointer rounded-md bg-[#333333] px-2 pb-4 pt-2 shadow-md">
                      <div className="relative mb-[10%] h-[120px] overflow-hidden rounded-md">
                        <img
                          src={
                            instance.metadata.imageUrl
                              ? instance.metadata.imageUrl
                              : "https://via.placeholder.com/150"
                          }
                          alt="Profile Image"
                          className="aspect-[2/1] h-full w-full object-cover"
                          onClick={() =>
                            router.push("/instance/" + instance.InstanceID.toLowerCase())
                          }
                        />
                        <div className="absolute right-0 top-0 z-[1] flex items-start justify-start">
                          <Badge
                            className="mt-1.5"
                            variant={type === "createdInstances" ? "default" : "destructive"}
                          >
                            {type === "createdInstances"
                              ? "Created"
                              : type === "partOfInstances"
                                ? "Contributor"
                                : "Subscriber"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                icon={<MoreVertical className="h-4 w-4" />}
                                className="mb-3 border-none bg-transparent text-black hover:bg-black/10"
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="z-[3]">
                              <DropdownMenuItem
                                className="cursor-pointer bg-black/80 text-white"
                                onClick={() => console.log("Download dataset")}
                              >
                                Download Dataset
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer bg-black/80 text-white"
                                onClick={() => console.log("Fork instance")}
                              >
                                Fork Instance
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="h-[50px]">
                        <h3 className="mb-1 truncate text-sm font-semibold text-white">
                          {instance.metadata.name.slice(0, 30)}
                        </h3>
                        <p className="mb-1 line-clamp-2 text-xs text-white">
                          {instance.metadata.about.slice(0, 50)}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};
