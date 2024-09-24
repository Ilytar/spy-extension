import { Author } from "@common/storage/types/db";
import { Button } from "@mui/material";
import { createMRTColumnHelper } from "material-react-table";

const columnHelper = createMRTColumnHelper<Author>();

export type SetActiveAuthor = (activeAuthorName: string) => void;

export const createAutorsTableColumns = (setActiveAuthor: SetActiveAuthor) => [
  columnHelper.accessor("authorName", {
    header: "Имя пользователя",
    Cell: ({ row }) => {
      const {
        original: { authorName },
      } = row;
      return (
        <Button
          onClick={() => {
            setActiveAuthor(authorName);
          }}
        >
          {authorName}
        </Button>
      );
    },
  }),
  columnHelper.accessor("dateOfCreation", {
    header: "Дата создания",
  }),
  columnHelper.accessor("dateOfUpdate", {
    header: "Последнее обновление",
  }),
  columnHelper.accessor("resultsCount", {
    header: "Количество записей",
  }),
];
