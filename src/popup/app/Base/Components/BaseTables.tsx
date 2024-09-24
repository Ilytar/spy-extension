import {
  MaterialReactTable,
  MRT_RowData,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_TableOptions,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";

import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import Download from "@mui/icons-material/Download";
import React from "react";
import {
  createWorkbook,
  downloadWorkbook,
  generateFileName,
} from "@common/utils/excelHelpers";

interface BaseTableProps<TableData extends MRT_RowData> {
  data: MRT_TableOptions<TableData>["data"];
  columns: MRT_TableOptions<TableData>["columns"];
  tableUpdateHandler?: () => void;
  enableRowSelection?: boolean;
  renderTopToolbarCustomActions?:
    | ((props: { table: MRT_TableInstance<TableData> }) => React.ReactNode)
    | undefined;
}

export const BaseTable = <TableData extends MRT_RowData>({
  data,
  columns,
  tableUpdateHandler,
  enableRowSelection = true,
  renderTopToolbarCustomActions = () => <div></div>,
}: BaseTableProps<TableData>) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const table = useMaterialReactTable({
    columns,
    enableRowSelection: enableRowSelection,
    data: data,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: false,
    },
    enableFullScreenToggle: false,
    enableColumnResizing: true,
    localization: MRT_Localization_RU,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    muiTablePaperProps: {
      sx: {
        width: "100%",
        display: "grid",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        flex: "0 0 auto",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        flex: "0 0 auto",
      },
    },

    renderTopToolbarCustomActions: renderTopToolbarCustomActions,

    renderToolbarInternalActions: ({ table }) => (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          zIndex: 3,
        }}
      >
        <Tooltip title="Скачать данные">
          <IconButton onClick={handleClick}>
            <Download />
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
              const dataForDownloading = [
                columns.map((column) => column.header),
              ];

              data.forEach((data) => {
                const rowData = [];
                const colNames = Object.keys(data);
                for (const col of colNames) {
                  rowData.push(data[col]);
                }
                dataForDownloading.push(rowData);
              });

              downloadWorkbook(
                createWorkbook(dataForDownloading),
                generateFileName()
              );
              handleClose();
            }}
          >
            Скачать все данные
          </MenuItem>
          <MenuItem
            onClick={() => {
              const filteredData = table.getFilteredRowModel().rows;
              const selectedRows = table.getVisibleLeafColumns();
              const targetColumns: Record<string, string | null> = {};

              const getHeader = (id: string) => {
                let result: null | string = null;
                columns.forEach((column) => {
                  if (column.id === id) {
                    result = column.header;
                  }
                });
                return result;
              };

              selectedRows.forEach((row) => {
                targetColumns[row.id] = getHeader(row.id);
              });

              const titles: string[] = [];
              Object.keys(targetColumns).forEach((key) => {
                if (targetColumns[key]) {
                  titles.push(targetColumns[key]);
                }
              });

              const dataForDownloading = [titles];

              filteredData.forEach((row) => {
                const rowOriginalData = row.original;
                const rowData = [];
                const colNames = Object.keys(rowOriginalData);
                for (const col of colNames) {
                  if (targetColumns[col]) {
                    rowData.push(rowOriginalData[col]);
                  }
                }
                dataForDownloading.push(rowData);
              });

              downloadWorkbook(
                createWorkbook(dataForDownloading),
                generateFileName()
              );
            }}
          >
            Скачать отфильтрованные данные
          </MenuItem>
        </Menu>

        {tableUpdateHandler && (
          <Tooltip title="Обновить таблицу">
            <IconButton onClick={tableUpdateHandler}>
              <Refresh />
            </IconButton>
          </Tooltip>
        )}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};
