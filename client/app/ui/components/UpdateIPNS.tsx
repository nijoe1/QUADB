import React, { useState } from "react";

import { Upload } from "lucide-react";

import { useCSVHandler } from "@/hooks/helpers";
import { useUpdateIPNSManager } from "@/hooks/ipns";
import { toast } from "@/hooks/useToast";
import { ObjectMatcher } from "@/lib/merge";
import { Button } from "@/primitives/Button";
import { Spinner } from "@/primitives/Spinner";
import { TextArea } from "@/primitives/TextArea";
import { Badge } from "@/ui-shadcn/badge";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/ui-shadcn/dialog";
import { Input } from "@/ui-shadcn/input";
import { Progress } from "@/ui-shadcn/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui-shadcn/select";
import { Separator } from "@/ui-shadcn/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-shadcn/tabs";

export const UpdateIPNS = ({
  isOpen,
  onClose,
  isDataset,
  IPNS,
  EncryptedKeyCID,
  currentCSV,
  spaceID,
  threshold,
  currentIPNSValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDataset: boolean;
  IPNS: string;
  EncryptedKeyCID: string;
  currentCSV: string;
  spaceID: string;
  threshold: number;
  currentIPNSValue: string;
}) => {
  const [proposalDescription, setProposalDescription] = useState<string>("");
  const [activeTab, setActiveTab] = useState("proposals");

  const { file, newRows, setNewRows, handleUploadCSV, downloadCsv, csvToObjectArray } =
    useCSVHandler();

  const {
    // Data
    currentSequence,
    historicalSequences,
    selectedSequence,
    proposals,

    // Loading states
    isLoadingProposals,
    isCreatingProposal,
    isSigningProposal,
    isUpdatingIPNS,

    // Actions
    setSelectedSequence,
    handleCreateProposal,
    handleSignProposal,
    handleUpdateIPNS,
    refetchProposals,

    // Helper functions
    hasSigned,
    hasReachedQuorum,
    isProposalExecuted,
  } = useUpdateIPNSManager({
    IPNS,
    spaceID,
    threshold,
    EncryptedKeyCID,
  });

  const handleMergeArrays = () => {
    const matcher = new ObjectMatcher(csvToObjectArray(currentCSV)[0]);
    const merged = matcher.mergeMatching(newRows, csvToObjectArray(currentCSV)) as any;
    setNewRows(merged);
    downloadCsv(merged, "merged.csv");
  };

  const onCreateProposal = async () => {
    if (!file) return;

    try {
      toast({
        title: "Sign the proposal to execute it",
        description: "Please wait while we create the proposal",
        variant: "default",
      });
      await handleCreateProposal(file, proposalDescription);
      await refetchProposals();
      toast({
        title: "Proposal created successfully",
        description: "Please wait while we fetch the proposals",
        variant: "default",
      });
      setActiveTab("proposals");
      setProposalDescription("");
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const renderProposal = (proposal: any) => (
    <Card key={proposal.id} className="border border-grey-600 bg-[#333333] p-4">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">CID: {proposal.cid}</span>
          <Badge variant={hasSigned(proposal) ? "default" : "secondary"}>
            {hasSigned(proposal) && !isProposalExecuted(proposal)
              ? "Signed"
              : isProposalExecuted(proposal)
                ? "Executed"
                : "Not Signed"}
          </Badge>
        </div>
        <p className="text-white">{proposal.proposal_description}</p>
        <div>
          <p className="mb-2 text-white">
            Signatures: {proposal.signatures.length}/{threshold}
          </p>
          <Progress
            value={(proposal.signatures.length / threshold) * 100}
            className={`w-full ${hasReachedQuorum(proposal) ? "bg-green-500" : "bg-blue-500"}`}
          />
        </div>
        {!hasSigned(proposal) && selectedSequence === currentSequence && (
          <Button
            onClick={() => handleSignProposal(proposal.cid)}
            className="w-full bg-black text-white"
            disabled={isSigningProposal}
            icon={isSigningProposal ? <Spinner /> : null}
            value={isSigningProposal ? "Signing..." : "Sign Proposal"}
          />
        )}
        {hasReachedQuorum(proposal) && selectedSequence === currentSequence && (
          <Button
            onClick={() => handleUpdateIPNS(proposal)}
            disabled={isUpdatingIPNS}
            className="w-full bg-black text-white"
            value="Execute Proposal"
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-grey-300 bg-gradient-to-br from-[#333333] to-[#222222] text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white">Update {isDataset ? "dataset" : "code"}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className={`grid w-full ${isDataset ? "grid-cols-3" : "grid-cols-2"} mb-4 bg-[#424242]`}
            >
              <TabsTrigger
                value="proposals"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Proposals
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Create New
              </TabsTrigger>
              {isDataset && (
                <TabsTrigger
                  value="merge"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Merge Data
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="proposals">
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-white">Current IPNS Value</p>
                  <p className="text-sm text-grey-400">{currentIPNSValue}</p>
                </div>

                <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                  <SelectTrigger className="border-grey-600 bg-grey-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-grey-600 bg-grey-700 text-white">
                    {historicalSequences.map((seq) => (
                      <SelectItem
                        key={seq}
                        value={seq}
                        className="bg-black text-white hover:bg-white"
                      >
                        Sequence {seq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Separator className="bg-grey-600" />

                {isLoadingProposals ? (
                  <p className="text-white">Loading proposals...</p>
                ) : proposals?.length === 0 ? (
                  <p className="text-white">No proposals found</p>
                ) : (
                  <div className="space-y-4">{proposals?.map(renderProposal)}</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="file"
                      onChange={handleUploadCSV}
                      className="hidden"
                      id="__file-upload"
                      accept="*"
                    />
                    <label
                      htmlFor="__file-upload"
                      className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-grey-600 p-4 transition-colors hover:border-grey-500"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      <span className="text-white">
                        {file ? file.name : `Upload new dataset file`}
                      </span>
                    </label>
                  </div>
                </div>

                <TextArea
                  placeholder="Proposal description"
                  value={proposalDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setProposalDescription(e.target.value)
                  }
                  className="border-grey-600 bg-grey-700 text-black placeholder:text-grey-400"
                />

                <Button
                  onClick={onCreateProposal}
                  variant="primary"
                  disabled={isCreatingProposal || !file}
                  className="w-full"
                  value="Create Proposal"
                />
              </div>
            </TabsContent>

            {isDataset && (
              <TabsContent value="merge">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-white">Current Data</p>
                    <p className="text-sm text-grey-400">
                      {currentCSV ? "Current data loaded" : "No current data"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="file"
                        onChange={handleUploadCSV}
                        className="hidden"
                        id="__merge-file-upload"
                        accept="*"
                      />
                      <label
                        htmlFor="__merge-file-upload"
                        className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-grey-600 p-4 transition-colors hover:border-grey-500"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        <span className="text-white">Upload new data to merge</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleMergeArrays}
                    variant="secondary"
                    disabled={!currentCSV || !file}
                    className="w-full"
                    value="Merge & Download"
                  />

                  <p className="text-sm text-grey-400">
                    After merging and downloading, you can upload the merged file in the Create New
                    tab to create a proposal.
                  </p>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <DialogFooter>
          <Button onClick={onClose} value="Close" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
