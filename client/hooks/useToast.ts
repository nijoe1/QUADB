import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Toast {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    ({ title, message, type, duration }: Omit<Toast, "id">) => {
      const id = uuidv4();
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, title, message, type, duration },
      ]);
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, duration);
    },
    []
  );

  return addToast;
};
