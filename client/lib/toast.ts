import { toast } from "@/hooks/use-toast";

export const showToast = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  },
  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  },
  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  },
  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  },
};
