"use client";

import React, { useState, useEffect } from "react";

import makeBlockie from "ethereum-blockies-base64";
import { MoreVertical, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hex } from "viem";

import CodeViewer from "@/components/CodeViewer";
import Loading from "@/components/animation/loading";
import { fetchIPFSFile, getFileMetadata, getIpfsGatewayUri, resolveIPNS } from "@/lib/ipfs";
import { getInstanceCodes } from "@/lib/tableland";
import { IPNSConfig } from "@/lib/types";
import { Button } from "@/primitives/Button";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Container } from "@/ui-shadcn/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui-shadcn/dropdown-menu";

import { CreateCodeForm } from "./CreateCodeForm";
import { UpdateCodeForm } from "./UpdateCodeForm";

interface InstanceCodesViewProps {
  hasAccess: boolean;
  InstanceID: string;
}

export const InstanceCodesView: React.FC<InstanceCodesViewProps> = ({ hasAccess, InstanceID }) => {
  const [code, setCode] = useState<any | null>(null);
  const [, /* viewAllCodes */ setViewAllCodes] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [codes, setCodes] = useState([] as any[]);
  const [fetched, setFetched] = useState(false);

  // Check if we should show the create code form or update code form
  const showCreateForm = searchParams.get("new-code") === "true";
  const showUpdateForm = searchParams.get("update-code") === "true";
  const updateCodeIPNS = searchParams.get("ipns") || "";

  const getIPNSConfig = async (cid: string) => {
    const ipnsConfig = (await fetchIPFSFile(cid, true, "data.json")) as {
      lit_config_cid: string;
    };
    const config = await fetchIPFSFile(ipnsConfig.lit_config_cid, true, "data.json");

    return config as IPNSConfig & { codeID: string };
  };

  async function fetchInstanceCodes() {
    const data = await getInstanceCodes(InstanceID);

    // Process all codes in parallel using Promise.all
    const processedData = await Promise.all(
      Object.keys(data).map(async (key) => {
        const codeItem = data[key];

        // Fetch all async operations in parallel for each code item
        const [ipnsValue, ipnsConfig] = await Promise.all([
          resolveIPNS(codeItem.IPNS),
          getIPNSConfig(codeItem.IPNSEncryptedKey),
        ]);

        // Get file metadata after resolving IPNS
        const fileMetadata = await getFileMetadata(ipnsValue);

        return {
          ...codeItem,
          codeCID: getIpfsGatewayUri(fileMetadata.dataCID),
          ipnsConfig,
          blockie: makeBlockie(codeItem.creator),
        };
      }),
    );

    return processedData;
  }

  useEffect(() => {
    if (!fetched) {
      fetchInstanceCodes().then((resp) => {
        setCodes(resp);
        setFetched(!fetched);
      });
    }
  }, [InstanceID]);

  const handleNewClick = () => {
    // Navigate to create code form using URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set("new-code", "true");
    router.push(`?${params.toString()}`);
  };

  const handleBackFromCreate = () => {
    // Remove the new-code param to go back to codes list
    const params = new URLSearchParams(searchParams.toString());
    params.delete("new-code");
    router.push(`?${params.toString()}`);
  };

  const handleBackFromUpdate = () => {
    // Remove the update-code and ipns params to go back to codes list
    const params = new URLSearchParams(searchParams.toString());
    params.delete("update-code");
    params.delete("ipns");
    router.push(`?${params.toString()}`);
  };

  const handleUpdateClick = (codeIPNS: string) => {
    // Navigate to update code form using URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set("update-code", "true");
    params.set("ipns", codeIPNS);
    router.push(`?${params.toString()}`);
  };

  const handleClick = (instance: any) => {
    setCode(instance);
    setViewAllCodes(false);
  };

  const handleBack = () => {
    setCode(null);
    setViewAllCodes(true);
  };

  // Show create code form if URL param is set
  if (showCreateForm) {
    return (
      <Container>
        <CreateCodeForm instanceID={InstanceID as Hex} onBack={handleBackFromCreate} />
      </Container>
    );
  }

  const codeToUpdate =
    fetched && codes && Array.isArray(codes)
      ? codes.find((code) => code.ipnsConfig?.ipns === updateCodeIPNS)
      : null;

  // Show update code form if URL param is set
  if (showUpdateForm && updateCodeIPNS && codeToUpdate) {
    return (
      <Container>
        <UpdateCodeForm onBack={handleBackFromUpdate} ipnsConfig={codeToUpdate.ipnsConfig} />
      </Container>
    );
  }

  return (
    <div>
      {!fetched ? (
        <div className="mx-auto mt-[10%] flex flex-col items-center">
          <Loading />
        </div>
      ) : (
        <Container>
          {code ? (
            <div className="flex w-full flex-col gap-2">
              {hasAccess && (
                <div className="mb-4 flex flex-wrap gap-3">
                  <Button
                    icon={<ArrowLeft className="mr-2 size-4" />}
                    onClick={handleBack}
                    className="mb-4 bg-black/80 text-white"
                    value="Back"
                  />

                  <Button
                    className="bg-black/80 text-white"
                    onClick={() => handleUpdateClick(code.IPNS)}
                    value="Update Notebook"
                  />
                </div>
              )}

              <CodeViewer code={code} onClose={handleBack} />
            </div>
          ) : (
            <div>
              {hasAccess && (
                <Button
                  onClick={handleNewClick}
                  className="my-4 bg-black/80 text-white"
                  value="Create Code"
                />
              )}

              <div className="flex justify-center">
                <div className="grid w-full grid-cols-1 gap-6 px-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {codes.map((code, index) => (
                    <Card
                      key={index}
                      className="relative cursor-pointer border border-white bg-[#333333]"
                      onClick={() => handleClick(code)}
                    >
                      <CardContent className="p-4">
                        <div className="relative h-[130px] cursor-pointer border-none">
                          <div className="mb-2 flex items-center rounded-md border border-white p-2">
                            <div className="mr-2 size-[35px] cursor-pointer rounded-md border border-white bg-[#333333]">
                              <img
                                className="size-full rounded-md object-cover"
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
