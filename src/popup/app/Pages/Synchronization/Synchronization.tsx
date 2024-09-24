import { Button, Container } from "@mui/material";
import { SiteForSync } from "./SiteForSync";
import {
  BG_GET_DATA,
  BG_SYNC_ARMMETROLOG,
  BG_SYNC_ROSACCREDITATION,
  POPUP_UPDATE_DATA_STATUS,
} from "@common/utils/extensionConstants";
import { useEffect, useState } from "react";

import storageLocal from "@common/storage/storageLocal/storageLocal.class";
import { STORAGE_KEYS } from "@common/storage/types/storageLocal";

export interface Progress {
  completedCount: number;
  allCount: number;
}

export const Synchronization = () => {
  const [progress, setProgress] = useState<Progress>({
    completedCount: 0,
    allCount: 0,
  });

  useEffect(() => {
    const updater = () => {
      storageLocal
        .getSomeValuesFromStorage(
          STORAGE_KEYS.DATA_ROSACCREDITATION,
          STORAGE_KEYS.COUT_DATA_TO_SYNC_ROSACCREDITATION
        )
        .then(([data, allCount]) => {
          if (data && allCount) {
            const keys = Object.keys(data);
            const completedCount = allCount - keys.length;
            setProgress({ allCount, completedCount });
          }
        });
    };

    updater();

    const handleMessage = (request: { type: string }) => {
      switch (request.type) {
        case POPUP_UPDATE_DATA_STATUS:
          updater();
          break;
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <Container
      sx={{
        paddingTop: "40px",
        paddingBottom: "40px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "40px",
        height: "100%",
        overflowY: "scroll",
      }}
    >
      <SiteForSync
        type={BG_SYNC_ROSACCREDITATION}
        progress={progress}
        siteName="Федеральная служба по аккредитации"
        siteUrl=""
      />
      <SiteForSync
        type={BG_SYNC_ARMMETROLOG}
        progress={progress}
        siteName="АРМ Метролог"
        siteUrl=""
      />
      <Button
        onClick={() => {
          chrome.runtime.sendMessage({
            type: BG_GET_DATA,
            body: {},
          });
        }}
        variant="contained"
        sx={{ fontSize: "1.5em", marginTop: "20px" }}
      >
        Получить данные
      </Button>
    </Container>
  );
};
