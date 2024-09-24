import {
  CONTENT_FUNDMETROLOGY_SCRIPT_READY,
  CONTENT_ROSACCREDITATION_SCRIPT_READY,
  DATA_FUNDMETROLOGY,
  DATA_ROSACCREDITATION_ENTERED,
  NULL,
  PAGE_ROSACCREDITATION_CLOSE,
  BG_SYNC_ROSACCREDITATION,
  BG_GET_DATA,
  BG_SYNC_ARMMETROLOG,
  PAGE_ARMMETRLOG_CLOSE,
  CONTENT_ARMMETROLOG_SCRIPT_READY,
  DATA_ARMMETROLOG_ENTERED,
  PAGE_FUNDMETROLOGY_CLOSE,
} from "@common/utils/extensionConstants";

import {
  KEY_CONTENT_FUNDMETROLOGY_STATUS,
  KEY_CONTENT_ROSACCREDITATION_STATUS,
  KEY_CONTENT_ARMMETROLOG_STATUS,
} from "@common/utils/storageKeys";

import { setValueInStorage } from "@common/utils/functions";

import {
  contentARMmetrologScriptReadyHandler,
  contentFundMetrologyScriptReadyHandler,
  contentRosaccreditationScriptReadyHandler,
  dataARMmetrologEnteredHandler,
  dataFundMetrologyHandler,
  dataRosaccreditationEnteredHandler,
  defaultBackgroundHandler,
  getDataHandler,
  handleInstalled,
  pageARMmetrologCloseHandler,
  pageRosaccreditationCloseHandler,
  storageChangeHandler,
  syncARMmetrologHandler,
  pageFundMetrologyCloseHandler,
  syncRosaccreditationHandler,
} from "./backgroundsHandlers";

function legacyBackground() {
  // URL страницы содержит номер страницы, поэтому для страницы с page=n будет существовать скрипт с именем+n (конкатенация)
  // По умолчанию обрабатывается страница с номером 1
  setValueInStorage(KEY_CONTENT_FUNDMETROLOGY_STATUS + 1, NULL);
  setValueInStorage(KEY_CONTENT_ROSACCREDITATION_STATUS, NULL);
  setValueInStorage(KEY_CONTENT_ARMMETROLOG_STATUS, NULL);

  chrome.runtime.onInstalled.addListener(handleInstalled);
  chrome.runtime.onMessage.addListener(handleMessage);
  chrome.storage.local.onChanged.addListener(storageChangeHandler);

  async function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
      case PAGE_FUNDMETROLOGY_CLOSE:
        pageFundMetrologyCloseHandler(request.body);
        break;
      case CONTENT_FUNDMETROLOGY_SCRIPT_READY:
        contentFundMetrologyScriptReadyHandler(request.body);
        break;
      case BG_GET_DATA:
        getDataHandler();
        break;

      case PAGE_ROSACCREDITATION_CLOSE:
        pageRosaccreditationCloseHandler();
        break;
      case CONTENT_ROSACCREDITATION_SCRIPT_READY:
        contentRosaccreditationScriptReadyHandler();
        break;
      case DATA_ROSACCREDITATION_ENTERED:
        dataRosaccreditationEnteredHandler(sender.tab, request.body);
        break;

      case PAGE_ARMMETRLOG_CLOSE:
        pageARMmetrologCloseHandler();
        break;
      case CONTENT_ARMMETROLOG_SCRIPT_READY:
        contentARMmetrologScriptReadyHandler();
        break;
      case DATA_ARMMETROLOG_ENTERED:
        dataARMmetrologEnteredHandler(sender.tab, request.body);
        break;

      case DATA_FUNDMETROLOGY:
        dataFundMetrologyHandler(request.body);
        break;
      case BG_SYNC_ROSACCREDITATION:
        syncRosaccreditationHandler();
        break;
      case BG_SYNC_ARMMETROLOG:
        syncARMmetrologHandler();
        break;
      default:
        defaultBackgroundHandler(request);
        break;
    }
  }
}

export default legacyBackground;
