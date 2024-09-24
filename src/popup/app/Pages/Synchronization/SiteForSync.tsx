import { Box, Button, Typography } from "@mui/material";
import { CircularProgressWithLabel } from "./CircularProgressWithLabel";
import { Progress } from "./Synchronization";

interface Props {
  siteName: string;
  siteUrl: string;
  type: string;
  progress: Progress;
}

export const SiteForSync = ({ siteName, progress, type }: Props) => {
  console.log(progress);
  const { allCount, completedCount } = progress;

  const isButtonDisabled = allCount === completedCount || allCount < 1;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "1.5em" }}>{siteName}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              chrome.runtime.sendMessage({
                type,
                body: {},
              });
            }}
            disabled={isButtonDisabled}
          >
            Синхронизировать
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CircularProgressWithLabel
              value={(completedCount / allCount) * 100}
            />
            <Typography>
              Синхронизировано {completedCount} из {allCount}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
