"use client";

import React from "react";

import { Plus, History, GitBranch } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import Loading from "@/components/animation/loading";
import { Button } from "@/primitives/Button/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui-shadcn/card";
import { Container } from "@/ui-shadcn/container";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui-shadcn/select";
import { Separator } from "@/ui-shadcn/separator";

import { CreateVersionForm } from "./CreateVersionForm";
import { ProposalCard } from "./ProposalCard";
import { useVersionManager } from "./hooks";

interface VersionsViewProps {
  hasAccess: boolean;
  IPNS: string;
  spaceID: string;
  threshold: number;
  EncryptedKeyCID: string;
  currentIPNSValue: string;
}

export const VersionsView: React.FC<VersionsViewProps> = ({
  hasAccess,
  IPNS,
  spaceID,
  threshold,
  EncryptedKeyCID,
  currentIPNSValue,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if we should show the create version form
  const showCreateForm = searchParams.get("new-version") === "true";

  const versionManager = useVersionManager({
    IPNS,
    spaceID,
    threshold,
    EncryptedKeyCID,
  });

  const {
    currentSequence,
    historicalSequences,
    selectedSequence,
    proposals,
    isLoadingSequences,
    isLoadingProposals,
    setSelectedSequence,
  } = versionManager;

  const handleNewClick = () => {
    // Navigate to create version form using URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set("new-version", "true");
    router.push(`?${params.toString()}`);
  };

  const handleBackFromCreate = () => {
    // Remove the new-version param to go back to versions list
    const params = new URLSearchParams(searchParams.toString());
    params.delete("new-version");
    router.push(`?${params.toString()}`);
  };

  // Show create version form if URL param is set
  if (showCreateForm) {
    return (
      <Container>
        <CreateVersionForm
          IPNS={IPNS}
          spaceID={spaceID}
          threshold={threshold}
          EncryptedKeyCID={EncryptedKeyCID}
          onBack={handleBackFromCreate}
        />
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="size-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Dataset Versions</h2>
              <p className="text-sm text-grey-400">
                Manage and track different versions of your dataset
              </p>
            </div>
          </div>
          {hasAccess && (
            <Button
              onClick={handleNewClick}
              icon={<Plus className="size-4" />}
              className="bg-blue-600 text-white hover:bg-blue-700"
              value="Create Version"
            />
          )}
        </div>

        {/* Current IPNS Value */}
        <Card className="border border-grey-600 bg-[#333333]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <History className="size-5" />
              Current Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="break-all font-mono text-sm text-grey-400">{currentIPNSValue}</p>
          </CardContent>
        </Card>

        {/* Sequence Selector */}
        {isLoadingSequences ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Select Version Sequence
              </label>
              <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                <SelectTrigger className="border-grey-600 bg-grey-700 text-white">
                  <SelectValue placeholder="Select a sequence" />
                </SelectTrigger>
                <SelectContent className="border-grey-600 bg-grey-700 text-white">
                  {historicalSequences.map((seq) => (
                    <SelectItem
                      key={seq}
                      value={seq}
                      className="bg-black text-white hover:bg-white hover:text-black"
                    >
                      <div className="flex items-center gap-2">
                        <span>Sequence {seq}</span>
                        {seq === currentSequence && (
                          <span className="text-xs text-green-400">(Current)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-grey-600" />

            {/* Proposals Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                Version Proposals
                {selectedSequence && (
                  <span className="ml-2 text-sm font-normal text-grey-400">
                    for Sequence {selectedSequence}
                  </span>
                )}
              </h3>

              {isLoadingProposals ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : proposals.length === 0 ? (
                <Card className="border border-grey-600 bg-[#333333]">
                  <CardContent className="py-8 text-center">
                    <GitBranch className="mx-auto mb-4 size-12 text-grey-500" />
                    <p className="text-grey-400">No proposals found for this sequence</p>
                    {hasAccess && selectedSequence === currentSequence && (
                      <Button
                        onClick={handleNewClick}
                        className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                        value="Create First Proposal"
                      />
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      versionManager={versionManager}
                      threshold={threshold}
                      isCurrentSequence={selectedSequence === currentSequence}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};
