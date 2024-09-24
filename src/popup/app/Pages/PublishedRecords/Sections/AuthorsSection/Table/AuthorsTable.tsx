import { Author, AuthorName } from "@common/storage/types/db";
import { BaseTable } from "../../../../../Base/Components/BaseTables";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Delete, PersonAdd, Update } from "@mui/icons-material";
import {
  createAutorsTableColumns,
  SetActiveAuthor,
} from "./AuthorTableColumns";
import React, { useEffect, useState } from "react";
import { useToast } from "@popup/hooks/toast/useToast";
import { popupApi } from "@popup/popupApi";
import {
  POPUP_SCRIPT_LISTENERS_TYPES,
  POPUP_SCRIPT_SENDERS_TYPES,
} from "@common/api/types/messagesTypes";

export interface AuthorsTableProps {
  handleOpen: () => void;
  setActiveAuthor: SetActiveAuthor;
}

export const AuthorsTable = ({
  handleOpen,
  setActiveAuthor,
}: AuthorsTableProps) => {
  const columns = createAutorsTableColumns(setActiveAuthor);

  const [authorsData, setAuthorsData] = useState<Author[]>([]);

  const showToast = useToast();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getAuthors = async () => {
    try {
      popupApi.sendMessageInRuntime(
        POPUP_SCRIPT_SENDERS_TYPES.GET_AUTHORS,
        undefined,
        (authorsData) => {
          setAuthorsData(authorsData);
        }
      );
    } catch {
      showToast({
        type: "error",
        content: "Произошла ошибка при загрузке данных",
      });
    }
  };

  useEffect(() => {
    getAuthors();

    popupApi.addMessageListener(
      POPUP_SCRIPT_LISTENERS_TYPES.SEND_AUTHORS,
      async ({ payload: authors }) => {
        try {
          setAuthorsData(authors);
        } catch (e) {
          console.error(e);
          showToast({
            type: "error",
            content: "Произошла ошибка при загрузке данных",
          });
        }
      }
    );

    return () => {
      popupApi.deleteListener(POPUP_SCRIPT_LISTENERS_TYPES.SEND_AUTHORS);
    };
  }, []);

  return (
    <BaseTable<Author>
      data={authorsData}
      columns={columns}
      tableUpdateHandler={getAuthors}
      renderTopToolbarCustomActions={({ table }) => {
        const isSomeUsersSelected =
          table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

        const handeDeleteAuthors = () => {
          const selectedAuthors: AuthorName[] = [];
          table.getSelectedRowModel().flatRows.map((row) => {
            selectedAuthors.push(row.original.authorName);
          });

          popupApi.sendMessageInRuntime(
            POPUP_SCRIPT_SENDERS_TYPES.DELETE_AUTHORS,
            selectedAuthors
          );
        };

        const handleUpdateAuthors = (authors: AuthorName[] | null) => {
          popupApi.sendMessageInRuntime(
            POPUP_SCRIPT_SENDERS_TYPES.UPDATE_AUTHORS,
            authors
          );
        };

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              zIndex: 3,
            }}
          >
            <Tooltip title="Добавить автора">
              <IconButton onClick={handleOpen}>
                <PersonAdd />
              </IconButton>
            </Tooltip>

            <>
              <Tooltip title="Обновить авторов">
                <IconButton onClick={handleClick}>
                  <Update />
                </IconButton>
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleUpdateAuthors(null);
                    handleClose();
                  }}
                >
                  Обновить всех авторов
                </MenuItem>
                {isSomeUsersSelected && (
                  <MenuItem
                    onClick={() => {
                      const selectedAuthors: AuthorName[] = [];
                      table.getSelectedRowModel().flatRows.map((row) => {
                        selectedAuthors.push(row.original.authorName);
                      });

                      handleUpdateAuthors(selectedAuthors);
                      handleClose();
                    }}
                  >
                    Обновить выбранных авторов
                  </MenuItem>
                )}
              </Menu>
              {isSomeUsersSelected && (
                <Tooltip title="Удалить авторов">
                  <IconButton onClick={handeDeleteAuthors}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </>
          </Box>
        );
      }}
    />
  );
};
