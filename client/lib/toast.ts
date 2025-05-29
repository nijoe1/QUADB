import { toast } from "@/hooks/useToast";

export const showToast = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "success",
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
      variant: "warning",
    });
  },
  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "info",
    });
  },
};
