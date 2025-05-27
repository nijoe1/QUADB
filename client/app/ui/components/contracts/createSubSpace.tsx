import React, { useState } from "react";

import { Hex } from "viem";

import { useCreateSpace } from "@/hooks/contracts";
import { Button } from "@/primitives/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/primitives/Dialog";
import { Spinner } from "@/primitives/Spinner";
import { Input } from "@/ui-shadcn/input";

const CreateSubSpaceModal = ({
  isOpen,
  onClose,
  isRoot,
  clickedID,
}: {
  isOpen: boolean;
  onClose: () => void;
  isRoot: boolean;
  clickedID: Hex;
}) => {
  const [newNodeName, setNewNodeName] = useState("");
  const { mutateAsync: createNewSubSpace, isPending: isProcessingTransaction } = useCreateSpace();

  async function handleCreate() {
    await createNewSubSpace({
      isRoot,
      newNodeName,
      clickedID,
    });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-grey-300 bg-[#333333] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Subspace</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Input
            placeholder="Enter subnode name"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            className="border-grey-500 bg-[#333333] text-white placeholder:text-grey-400 focus:border-white"
          />
        </div>

        <DialogFooter className="flex flex-row justify-end space-x-2">
          <Button
            variant="primary"
            onClick={handleCreate}
            value="Create"
            disabled={isProcessingTransaction || !newNodeName.trim()}
            icon={isProcessingTransaction ? <Spinner /> : null}
          />
          <Button onClick={onClose} value="Cancel" disabled={isProcessingTransaction} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubSpaceModal;
