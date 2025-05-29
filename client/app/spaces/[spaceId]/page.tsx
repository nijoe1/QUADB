"use client";

import React from "react";

import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

import Loading from "@/components/animation/loading";
import { useFetchSpaceInstances } from "@/hooks/contracts/queries";
import { Button } from "@/primitives/Button/Button";
import { Badge } from "@/ui-shadcn/badge";
import { Container } from "@/ui-shadcn/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui-shadcn/dropdown-menu";

const SingleSpacePage = ({ params: { spaceId } }: { params: { spaceId: string } }) => {
  const router = useRouter();
  const spaceID = spaceId;

  const { instances, fetched } = useFetchSpaceInstances(spaceID);

  const handleNewClick = () => {
    router.push(`/spaces/${spaceId}/create`);
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
            variant="primary"
            value="Create Dataset"
            className="my-4 ml-3 bg-black/80 text-white hover:bg-black/90"
          />
          <div className="flex justify-center">
            <div className="relative flex w-full grid-cols-1 gap-6 md:grid-cols-2 md:justify-between lg:grid lg:grid-cols-3 lg:px-3 xl:grid-cols-4">
              {Object.entries(instances).map(
                ([type, instanceArray]) =>
                  Array.isArray(instanceArray) &&
                  instanceArray.length > 0 &&
                  instanceArray.map((instance) => (
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
                            className="aspect-[2/1] size-full object-cover"
                            onClick={() =>
                              router.push(`/instance/${instance.InstanceID.toLowerCase()}`)
                            }
                          />
                          <div className="absolute right-0 top-0 z-[1] flex items-start justify-start">
                            <Badge
                              className="mt-1.5"
                              variant={
                                type === "openInstances" || type === "openPrivateInstances"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {type === "openInstances" || type === "openPrivateInstances"
                                ? "Open"
                                : "Paid"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  icon={<MoreVertical className="size-4" />}
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
                                <DropdownMenuItem className="cursor-pointer bg-black/80 text-white">
                                  Fork Instance
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="h-[50px]">
                          <h3 className="mb-1 truncate text-sm font-semibold text-white">
                            {instance.metadata?.name?.slice(0, 30)}
                          </h3>
                          <p className="mb-1 line-clamp-2 text-xs text-white">
                            {instance.metadata?.about?.slice(0, 50)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )),
              )}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default SingleSpacePage;
