import { useUploadFile, useUploadFolder } from "./useStorachaUpload";
import { useToast } from "@/hooks/useToast";

type UploadOptions = {
  onUploadSuccess?: (cid: string) => void;
  onUploadError?: (error: any) => void;
};

export const useFileUpload = (
  options?: UploadOptions
): ((file: string | File | Blob) => Promise<string>) => {
  const mutation = useUploadFile();
  const { toast } = useToast();
  const uploadFile = async (file: string | File | Blob) => {
    try {
      toast({
        title: "Uploading file...",
        description: "Please wait while we upload the file...",
        duration: 5000,
      });

      const cid = await mutation.mutateAsync(file);

      toast({
        title: "File uploaded successfully!",
        description: "Your file has been uploaded successfully.",
        duration: 5000,
      });

      return cid;
    } catch (error: any) {
      toast({
        title: "File upload failed",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
        duration: 5000,
      });

      if (options?.onUploadError) {
        options.onUploadError(error);
      }
    }
  };

  return uploadFile;
};

export const useFolderUpload = (
  options?: UploadOptions
): ((files: string[] | File[] | Blob[]) => Promise<string>) => {
  const mutation = useUploadFolder();
  const { toast } = useToast();

  const uploadFolder = async (files: string[] | File[] | Blob[]) => {
    try {
      toast({
        title: "Uploading folder...",
        description: "Please wait while we upload the folder...",
        duration: 5000,
      });

      const cid = await mutation.mutateAsync(files);

      toast({
        title: "Folder uploaded successfully!",
        description: "Your folder has been uploaded successfully.",
        duration: 5000,
      });

      return cid;
    } catch (error: any) {
      toast({
        title: "Folder upload failed",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
        duration: 5000,
      });

      if (options?.onUploadError) {
        options.onUploadError(error);
      }
    }
  };

  return uploadFolder;
};
