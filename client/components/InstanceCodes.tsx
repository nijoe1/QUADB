"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Button } from "@/primitives/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui-shadcn/dropdown-menu";
import { Container } from "@/ui-shadcn/container";
import CodeViewer from "@/components/CodeViewer";
import CreateNewInstanceCode from "@/components/contracts/createInstanceCode";
import { MoreVertical, ArrowLeft } from "lucide-react";
import { getInstanceCodes } from "@/lib/tableland";
import Loading from "@/components/animation/loading";
import {
  getFileMetadata,
  getIpfsGatewayUri,
  resolveIPNS,
} from "@/lib/ipfs";
import makeBlockie from "ethereum-blockies-base64";
import { useRouter } from "next/navigation";
import { Hex } from "viem";
import { UpdateCode } from "@/components/UpdateCode";

const InstanceCodes = ({
  hasAccess,
  InstanceID,
}: {
  hasAccess: boolean;
  InstanceID: string;
}) => {
  const [code, setCode] = useState<any | null>(null);
  const [/* viewAllCodes */, setViewAllCodes] = useState(true);
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const [codes, setCodes] = useState([] as any[]);
  const [fetched, setFetched] = useState(false);

  async function fetchInstanceCodes() {
    const data = await getInstanceCodes(InstanceID);
    for (const key in data) {
      const ipnsValue = await resolveIPNS(data[key].IPNS);
      data[key].codeCID = getIpfsGatewayUri(
        (await getFileMetadata(ipnsValue)).dataCID
      );
      data[key].blockie = makeBlockie(data[key].creator);
    }
    return data;
  }

  useEffect(() => {
    if (!fetched) {
      fetchInstanceCodes().then((resp) => {
        setCodes(resp);
        setFetched(!fetched);
      });
    }
  }, [InstanceID]);

  const handleNewClick = async () => {
    setIsCreateOpen(true);
  };

  const handleUpdateClick = async () => {
    setIsUpdateOpen(true);
  };

  const handleClick = (instance: any) => {
    setCode(instance);
    setViewAllCodes(false);
  };

  const handleBack = () => {
    setCode(null);
    setViewAllCodes(true);
  };

  return (
    <div>
      {!fetched ? (
        <div className="mx-auto mt-[10%] flex flex-col items-center">
          <Loading />
        </div>
      ) : (
        <Container>
          {code ? (
            <>
              {hasAccess && (
                <div className="mb-4 flex flex-wrap gap-3">
                  <Button onClick={handleBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Codes
                  </Button>
                  <Button
                    className="bg-black/80 text-white"
                    onClick={handleUpdateClick}
                    value="Update Notebook"
                  />
                  <UpdateCode
                    isOpen={isUpdateOpen}
                    onClose={() => setIsUpdateOpen(false)}
                    IPNS={code.IPNS}
                  />
                </div>
              )}

              <CodeViewer code={code} onClose={handleBack} />
            </>
          ) : (
            <div>
              <Button
                onClick={handleNewClick}
                className="my-4 bg-black/80 text-white"
                value="Create Code"
              />
              <CreateNewInstanceCode
                onClose={() => setIsCreateOpen(false)}
                isOpen={isCreateOpen}
                instanceID={InstanceID as Hex}
              />

              <div className="flex justify-center">
                <div className="grid w-full grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {codes.map((code) => (
                    <Card
                      key={code.InstanceID}
                      className="relative cursor-pointer border border-white bg-[#333333]"
                    >
                      <CardContent className="p-4">
                        <div className="relative h-[130px] cursor-pointer border-none">
                          <div className="absolute right-0 top-0 z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-white"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="border-grey-600 bg-black text-white">
                                <DropdownMenuItem
                                  onClick={() => console.log("Download code")}
                                  className="text-white hover:bg-grey-700"
                                >
                                  Download code
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => console.log("View code")}
                                  className="text-white hover:bg-grey-700"
                                >
                                  View code
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="mb-2 flex items-center rounded-md border border-white p-2">
                            <div className="mr-2 h-[35px] w-[35px] cursor-pointer rounded-md border border-white bg-[#333333]">
                              <img
                                className="h-full w-full rounded-md object-cover"
                                src={
                                  code.profile?.picture
                                    ? code.profile?.picture
                                    : makeBlockie(code.creator)
                                }
                                alt="Sender Avatar"
                                onClick={() => {
                                  router.push("/profile" + code.creator);
                                }}
                              />
                            </div>
                            <span
                              className="mb-1 cursor-pointer truncate text-sm font-semibold text-white"
                              onClick={() => {
                                router.push("/profile" + code?.creator);
                              }}
                            >
                              {code.profile?.name}
                            </span>
                          </div>

                          <h3
                            className="mb-1 cursor-pointer truncate text-sm font-semibold text-white"
                            onClick={() => handleClick(code)}
                          >
                            {code.name.slice(0, 30)}
                          </h3>
                          <p
                            className="mb-1 line-clamp-2 cursor-pointer text-xs text-white"
                            onClick={() => handleClick(code)}
                          >
                            {code.about.slice(0, 50)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      )}
    </div>
  );
};

export default InstanceCodes;
