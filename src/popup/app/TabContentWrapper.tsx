import { Box } from "@mui/material";
import { HEADER_BORDER_HEIGHT, HEADER_HEIGHT, POPUP_HEIGHT } from "./App";

interface TabContentWrapperProps {
  children: React.ReactNode;
}

export const TabContentWrapper = ({ children }: TabContentWrapperProps) => {
  return (
    <Box
      sx={{
        height: POPUP_HEIGHT - HEADER_BORDER_HEIGHT - HEADER_HEIGHT,
        width: "100%",
        marginTop: `${HEADER_BORDER_HEIGHT + HEADER_HEIGHT}px`,
      }}
    >
      {children}
    </Box>
  );
};
