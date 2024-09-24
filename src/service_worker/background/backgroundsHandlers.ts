import {
  calculateRowsPerPage,
  dataEnteredHandler,
  generatePageLink,
  getCount,
  getTab,
  sendRequestToUpdatePopupData,
  sendResponseToAgentToSyncData,
  sendResponseToFundMetrologyTab,
  setDataInStorage,
  waitContentScriptReady,
} from "./backgroundFunctions";

import { NULL, READY } from "@common/utils/extensionConstants";

import {
  getKeyValueFromStorage,
  setValueInStorage,
} from "@common/utils/functions";

import {
  ARMMETROLOG_URL,
  ROSACCREDITATION_URL,
  FUNDMETROLOGY_URL,
} from "@common/utils/urls";

import {
  KEY_CONTENT_ARMMETROLOG_STATUS,
  KEY_CONTENT_FUNDMETROLOGY_STATUS,
  KEY_CONTENT_ROSACCREDITATION_STATUS,
  KEY_COUT_DATA_TO_SYNC_ROSACCREDITATION,
  KEY_COUT_DATA_TO_SYNC_ARMMETROLOG,
  KEY_CURRENT_NUMBER_OF_TABLE,
  KEY_DATA_FOR_ROSACCREDITATION,
  KEY_DATA_FOR_ARMMETROLOG,
  KEY_USER_DATA,
  LAST_NAME,
  MIDDLE_NAME,
  USER_EMAIL,
  FIRST_NAME,
} from "@common/utils/storageKeys";

async function getDataHandler() {
  let tab = await getTab(FUNDMETROLOGY_URL);
  // первый скрипт будет внедрён на страницу номер 1
  await waitContentScriptReady(KEY_CONTENT_FUNDMETROLOGY_STATUS + 1);
  const actualNumber = await getCount(tab);
  //   let currentNumberOfTable = await getKeyValueFromStorage(
  //     KEY_CURRENT_NUMBER_OF_TABLE
  //   );
  let currentNumberOfTable = 10700;
  // Происходит при первом запуске синхронизации
  if (!currentNumberOfTable) {
    setValueInStorage(KEY_CURRENT_NUMBER_OF_TABLE, actualNumber);
  }
  const countOfMissingRows = actualNumber - currentNumberOfTable;
  if (countOfMissingRows === 0) {
    return;
  }
  if (countOfMissingRows <= 100) {
    const responseData = {
      countOfMissingRows,
      currentNumberOfTable,
    };
    await sendResponseToFundMetrologyTab(tab, responseData);
  }
  if (countOfMissingRows > 100) {
    const rows = calculateRowsPerPage(countOfMissingRows).reverse();
    const maxPageNumber = rows.length;
    for (let i = maxPageNumber; i >= 1; i--) {
      const link = generatePageLink(FUNDMETROLOGY_URL, i);

      let count = rows[i - 1];
      const responseData = {
        countOfMissingRows: count,
        currentNumberOfTable,
      };
      tab = await getTab(link);
      await waitContentScriptReady(KEY_CONTENT_FUNDMETROLOGY_STATUS + i);
      await sendResponseToFundMetrologyTab(tab, responseData);
      currentNumberOfTable += count;
    }
  }
  if (currentNumberOfTable) {
    setValueInStorage(KEY_CURRENT_NUMBER_OF_TABLE, actualNumber);
  }
  //   sendRequestToUpdatePopupData();
}

function pageFundMetrologyCloseHandler(data) {
  setValueInStorage(KEY_CONTENT_FUNDMETROLOGY_STATUS + data, NULL);
}
function contentFundMetrologyScriptReadyHandler(data) {
  setValueInStorage(KEY_CONTENT_FUNDMETROLOGY_STATUS + data, READY);
}
function pageRosaccreditationCloseHandler() {
  setValueInStorage(KEY_CONTENT_ROSACCREDITATION_STATUS, NULL);
}
function contentRosaccreditationScriptReadyHandler() {
  setValueInStorage(KEY_CONTENT_ROSACCREDITATION_STATUS, READY);
}

function pageARMmetrologCloseHandler() {
  setValueInStorage(KEY_CONTENT_ARMMETROLOG_STATUS, NULL);
}
function contentARMmetrologScriptReadyHandler() {
  setValueInStorage(KEY_CONTENT_ARMMETROLOG_STATUS, READY);
}

async function dataRosaccreditationEnteredHandler(senderTab, enteredKey) {
  dataEnteredHandler(senderTab, enteredKey, KEY_DATA_FOR_ROSACCREDITATION);
}

async function dataARMmetrologEnteredHandler(senderTab, enteredKey) {
  dataEnteredHandler(senderTab, enteredKey, KEY_DATA_FOR_ARMMETROLOG);
}

async function dataFundMetrologyHandler(data) {
  const currentDataFSA =
    (await getKeyValueFromStorage(KEY_DATA_FOR_ROSACCREDITATION)) || [];
  const currentDataARMmetrolog =
    (await getKeyValueFromStorage(KEY_DATA_FOR_ARMMETROLOG)) || [];
  const currentDataSizeFSA = Object.keys(currentDataFSA).length;
  const currentDataSizeARMmetrolog = Object.keys(currentDataARMmetrolog).length;

  setValueInStorage(
    KEY_COUT_DATA_TO_SYNC_ROSACCREDITATION,
    currentDataSizeFSA + Object.keys(data).length
  );
  setValueInStorage(
    KEY_COUT_DATA_TO_SYNC_ARMMETROLOG,
    currentDataSizeARMmetrolog + Object.keys(data).length
  );
  setDataInStorage(data, KEY_DATA_FOR_ROSACCREDITATION);
  setDataInStorage(data, KEY_DATA_FOR_ARMMETROLOG);
  sendRequestToUpdatePopupData();
}

async function syncRosaccreditationHandler() {
  sendResponseToAgentToSyncData(
    ROSACCREDITATION_URL,
    KEY_CONTENT_ROSACCREDITATION_STATUS,
    KEY_DATA_FOR_ROSACCREDITATION
  );
}

function storageChangeHandler(changes) {
  sendRequestToUpdatePopupData();
}

function defaultBackgroundHandler(request) {}

async function syncARMmetrologHandler() {
  sendResponseToAgentToSyncData(
    ARMMETROLOG_URL,
    KEY_CONTENT_ARMMETROLOG_STATUS,
    KEY_DATA_FOR_ARMMETROLOG
  );
}

async function handleInstalled(details) {
  // Срабатывает при установке или обновления расширения
  const userData = await getKeyValueFromStorage(KEY_USER_DATA);
  if (!userData) {
    const data = {};
    data[FIRST_NAME] = "";
    data[LAST_NAME] = "";
    data[MIDDLE_NAME] = "";
    data[USER_EMAIL] = "";
    setValueInStorage(KEY_USER_DATA, data);
  }
}

export {
  getDataHandler,
  dataFundMetrologyHandler,
  syncRosaccreditationHandler,
  dataRosaccreditationEnteredHandler,
  pageFundMetrologyCloseHandler,
  pageRosaccreditationCloseHandler,
  contentFundMetrologyScriptReadyHandler,
  contentRosaccreditationScriptReadyHandler,
  storageChangeHandler,
  defaultBackgroundHandler,
  syncARMmetrologHandler,
  pageARMmetrologCloseHandler,
  contentARMmetrologScriptReadyHandler,
  dataARMmetrologEnteredHandler,
  handleInstalled,
};
