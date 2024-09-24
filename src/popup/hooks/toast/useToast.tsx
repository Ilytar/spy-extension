import { useTheme } from "@mui/material";
import { toast, ToastContent, ToastOptions, TypeOptions } from "react-toastify";

interface ShowToast {
  type: Exclude<TypeOptions, "default">;
  content: ToastContent;
  options?: ToastOptions;
}

export const useToast = () => {
  const {
    palette: { mode: theme },
  } = useTheme();

  const showToast = ({ type, content, options = {} }: ShowToast) => {
    const toastOptions: ToastOptions = {
      theme,
    };

    toast[type](content, { ...options, ...toastOptions });
  };

  return showToast;
};
