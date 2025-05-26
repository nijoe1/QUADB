import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui-shadcn/dialog";
import { Input } from "@/ui-shadcn/input";
import { Button } from "@/primitives/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-shadcn/tabs";
import { Card, CardContent } from "@/ui-shadcn/card";
import { Upload } from "lucide-react";
import { useCSVHandler } from "@/hooks/helpers";
import { useUpdateCodeManager } from "@/hooks/ipns";

export const UpdateCode = ({
  isOpen,
  onClose,
  IPNS,
}: {
  isOpen: boolean;
  onClose: () => void;
  IPNS: string;
}) => {
  const { file, handleUploadCSV } = useCSVHandler();

  const { isUpdating, handleUpdateCode, canUpdate } = useUpdateCodeManager({
    IPNS,
  });

  const onUpdateCode = async () => {
    if (!file) return;
    await handleUpdateCode(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-grey-300 bg-gradient-to-br from-[#333333] to-[#222222] text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white">Update Code</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="update" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-1 bg-[#424242]">
              <TabsTrigger
                value="update"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Update Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="update">
              <Card className="border-none bg-transparent">
                <CardContent className="space-y-4 p-0">
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
                        <span className="text-white">Upload Code file</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={onUpdateCode}
                    variant="primary"
                    disabled={isUpdating || !file || !canUpdate}
                    className="w-full"
                    value={isUpdating ? "Updating..." : "Update Code"}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button onClick={onClose} value="Close" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
