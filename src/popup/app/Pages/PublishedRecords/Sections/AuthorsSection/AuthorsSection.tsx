import { Box } from "@mui/material";

import { useState } from "react";
import { NewAuthorModal } from "./NewAuthorModal";
import { SetActiveAuthor } from "./Table/AuthorTableColumns";
import { AuthorsTable } from "./Table/AuthorsTable";

interface AuthorsTable {
  setActiveAuthor: SetActiveAuthor;
}

export const AuthorsSection = ({ setActiveAuthor }: AuthorsTable) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <NewAuthorModal open={open} handleClose={handleClose} />
      <AuthorsTable handleOpen={handleOpen} setActiveAuthor={setActiveAuthor} />
    </Box>
  );
};
