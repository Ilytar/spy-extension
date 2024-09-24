import { VerificationOfMeasuringInstrument } from "@common/storage/types/verificationOfMeasuringInstrument";
import { AuthorName } from "@common/storage/types/db";
import { VerificationResultsTableColumns } from "./VerificationResultsTableColumns";
import { BaseTable } from "../../../../../Base/Components/BaseTables";
import { popupApi } from "@popup/popupApi";
import {
  POPUP_SCRIPT_LISTENERS_TYPES,
  POPUP_SCRIPT_SENDERS_TYPES,
} from "@common/api/types/messagesTypes";
import { useEffect, useState } from "react";
import { useToast } from "@popup/hooks/toast/useToast";
import { Box, Button, Typography } from "@mui/material";
import storageLocal from "@common/storage/storageLocal/storageLocal.class";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface VerificationResultsTableProps {
  authorName: AuthorName;
}

export const VerificationResultsTable = ({
  authorName,
}: VerificationResultsTableProps) => {
  const [verificationResults, setVerificationResults] = useState<
    VerificationOfMeasuringInstrument[]
  >([]);

  const showToast = useToast();

  const getMetrologyRecordsByAuthoreName = async () => {
    try {
      popupApi.sendMessageInRuntime(
        POPUP_SCRIPT_SENDERS_TYPES.GET_VERIFICATION_RESULTS,
        authorName,
        (verificationResults) => {
          setVerificationResults(verificationResults);
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
    getMetrologyRecordsByAuthoreName();

    popupApi.addMessageListener(
      POPUP_SCRIPT_LISTENERS_TYPES.SEND_VERIFICATION_RESULTS,
      async ({ payload: authors }) => {
        try {
          setVerificationResults(authors);
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
      popupApi.deleteListener(
        POPUP_SCRIPT_LISTENERS_TYPES.SEND_VERIFICATION_RESULTS
      );
    };
  }, []);

  return (
    <BaseTable<VerificationOfMeasuringInstrument>
      data={verificationResults}
      columns={VerificationResultsTableColumns}
      tableUpdateHandler={getMetrologyRecordsByAuthoreName}
      enableRowSelection={false}
      renderTopToolbarCustomActions={() => (
        <Button
          onClick={() => {
            storageLocal.setActiveAuthor(null);
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <ArrowBackIcon />
            <Typography>Назад</Typography>
          </Box>
        </Button>
      )}
    />
  );
};
