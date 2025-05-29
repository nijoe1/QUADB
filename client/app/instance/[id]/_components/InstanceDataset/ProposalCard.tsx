"use client";

import React from "react";

import { Clock, CheckCircle, XCircle, Users } from "lucide-react";

import { ProgressModal } from "@/components/ProgressModal";
import { Proposal } from "@/hooks/backend/queries";
import { Button } from "@/primitives/Button/Button";
import { Badge } from "@/ui-shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui-shadcn/card";
import { Progress } from "@/ui-shadcn/progress";

import { useVersionManager } from "./hooks";

interface ProposalCardProps {
  proposal: Proposal;
  versionManager: ReturnType<typeof useVersionManager>;
  threshold: number;
  isCurrentSequence: boolean;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  versionManager,
  threshold,
  isCurrentSequence,
}) => {
  const {
    hasSigned,
    hasReachedQuorum,
    isProposalExecuted,
    signProposalMutation,
    executeProposalMutation,
    signModalProps,
    executeModalProps,
  } = versionManager;

  const proposalSigned = hasSigned(proposal);
  const quorumReached = hasReachedQuorum(proposal);
  const isExecuted = isProposalExecuted(proposal);

  // Determine proposal status
  const getProposalStatus = () => {
    if (isExecuted) return { label: "Executed", variant: "default" as const, icon: CheckCircle };
    if (quorumReached)
      return { label: "Ready to Execute", variant: "default" as const, icon: CheckCircle };
    if (proposalSigned) return { label: "Signed", variant: "secondary" as const, icon: Clock };
    return { label: "Pending", variant: "destructive" as const, icon: XCircle };
  };

  const status = getProposalStatus();
  const StatusIcon = status.icon;

  const handleSign = () => {
    signProposalMutation.mutate(proposal.cid);
  };

  const handleExecute = () => {
    executeProposalMutation.mutate(proposal);
  };

  return (
    <>
      <Card className="border border-grey-600 bg-[#333333] transition-all hover:border-grey-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">Version Proposal</CardTitle>
            <Badge variant={status.variant} className="flex items-center gap-1">
              <StatusIcon className="size-3" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Proposal Description */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-grey-300">Description</h4>
            <p className="text-sm text-white">{proposal.proposal_description}</p>
          </div>

          {/* CID */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-grey-300">Content ID</h4>
            <p className="break-all font-mono text-xs text-grey-400">{proposal.cid}</p>
          </div>

          {/* Signatures Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium text-grey-300">Signatures</h4>
              <div className="flex items-center gap-1 text-sm text-grey-400">
                <Users className="size-3" />
                {proposal.signatures.length}/{threshold}
              </div>
            </div>
            <Progress value={(proposal.signatures.length / threshold) * 100} className="h-2" />
          </div>

          {/* Created Date */}
          <div>
            <h4 className="mb-1 text-sm font-medium text-grey-300">Created</h4>
            <p className="text-xs text-grey-400">
              {new Date(proposal.created_at).toLocaleDateString()} at{" "}
              {new Date(proposal.created_at).toLocaleTimeString()}
            </p>
          </div>

          {/* Action Buttons */}
          {isCurrentSequence && !isExecuted && (
            <div className="flex gap-2 pt-2">
              {!proposalSigned && (
                <Button
                  onClick={handleSign}
                  disabled={signProposalMutation.isPending}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  value={signProposalMutation.isPending ? "Signing..." : "Sign Proposal"}
                />
              )}
              {quorumReached && (
                <Button
                  onClick={handleExecute}
                  disabled={executeProposalMutation.isPending}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  value={executeProposalMutation.isPending ? "Executing..." : "Execute Proposal"}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Modals */}
      <ProgressModal {...signModalProps} isOpen={signProposalMutation.isPending} />
      <ProgressModal {...executeModalProps} isOpen={executeProposalMutation.isPending} />
    </>
  );
};
