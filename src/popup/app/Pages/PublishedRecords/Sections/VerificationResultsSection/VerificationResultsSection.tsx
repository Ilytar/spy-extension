import { Box, Typography } from "@mui/material";
import { AuthorName } from "@common/storage/types/db";
import { VerificationResultsTable } from "./Table/VerificationResultsTable";

interface MetrologyTableWrapperProps {
  authorName: AuthorName;
  setActiveAuthor: (authorName: null) => void;
}

export const MetrologyRecordsSection = ({
  authorName,
}: MetrologyTableWrapperProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          padding: "0.5em",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          style={{ width: "100%", textAlign: "center", fontSize: "1.5em" }}
          component={"h2"}
        >
          Результаты для {authorName}
        </Typography>
      </Box>
      <VerificationResultsTable authorName={authorName} />
    </Box>
  );
};
