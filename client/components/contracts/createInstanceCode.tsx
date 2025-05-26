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
import { Card, CardContent } from "@/ui-shadcn/card";
import { Upload } from "lucide-react";
import { CodeFormData, useCreateInstanceCode } from "@/hooks/contracts";
import { Alert } from "@/primitives/Alert/Alert";
import { toast } from "sonner";
import { Hex } from "viem";

const CreateNewInstanceCode = ({
  isOpen,
  onClose,
  instanceID,
}: {
  isOpen: boolean;
  onClose: () => void;
  instanceID: Hex;
}) => {
  const [formData, setFormData] = React.useState<CodeFormData>({
    name: "",
    about: "",
    file: null as unknown as File,
  });

  const create = useCreateInstanceCode({
    instanceID,
    onClose: () => {
      toast.success("Your code has been created successfully!");
      onClose();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.about || !formData.file) {
      toast.error("Please fill all fields");
      return;
    }

    toast.info("Creating code...");

    await create.mutation.mutateAsync({
      name: formData.name,
      about: formData.about,
      file: formData.file,
    });
  };

  if (create.mutation.isSuccess) {
    return (
      <Alert variant="success" title="Code Created!">
        Your code has been successfully created.
      </Alert>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-grey-300 bg-[#333333] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Code</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Card className="border-none bg-transparent">
            <CardContent className="space-y-4 p-0">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Name</label>
                <Input
                  name="name"
                  placeholder="Enter code name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-grey-600 bg-[#424242] text-white placeholder:text-grey-400 focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">About</label>
                <Input
                  name="about"
                  placeholder="Enter code description"
                  value={formData.about}
                  onChange={handleChange}
                  className="border-grey-600 bg-[#424242] text-white placeholder:text-grey-400 focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Code</label>
                <div className="relative">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    id="_file-upload"
                    className="hidden"
                    accept=".ipynb"
                  />
                  <label
                    htmlFor="_file-upload"
                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-grey-600 bg-[#424242] p-3 text-white transition-colors hover:border-white"
                  >
                    <span className="text-sm text-grey-400">
                      Upload Model Code
                    </span>
                    <Upload className="h-4 w-4" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-row justify-end space-x-2">
          <Button
            onClick={handleSubmit}
            disabled={create.isLoading || create.mutation.isPending}
            value={
              create.isLoading
                ? "Creating..."
                : create.mutation.isPending
                  ? "Processing..."
                  : "Create"
            }
          />
          <Button onClick={onClose} value="Cancel" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewInstanceCode;
