import {
  DATA_RECEIVED,
  ERR_NOT_LOADED_DATA,
  GET_DATA,
  GET_DATA_COUNT,
  PAGE_READY_FOR_DATA_ENTERED,
  POPUP_UPDATE_DATA_STATUS,
  READY,
} from "@common/utils/extensionConstants";

import { KEY_USER_DATA } from "@common/utils/storageKeys";
import {
  getKeyValueFromStorage,
  setValueInStorage,
  sleep,
} from "@common/utils/functions";

function sendRequestToUpdatePopupData() {
  chrome.runtime
    .sendMessage({
      type: POPUP_UPDATE_DATA_STATUS,
      body: {},
    })
    .then(() => {})
    .catch(() => {});
}

async function sendResponseToFundMetrologyTab(tab, data) {
  while (true) {
    const response = await sendMessageToTab(tab, GET_DATA, data);
    switch (response.type) {
      case ERR_NOT_LOADED_DATA:
        await sleep(1000);
        break;
      case DATA_RECEIVED:
        return;
      default:
        break;
    }
  }
}
async function sendMessageToTab(tab, type = "", body = "") {
  return chrome.tabs.sendMessage(tab.id, {
    type,
    body,
  });
}

async function getTab(url) {
  let tabs = await chrome.tabs.query({ url });
  if (tabs?.length > 0) {
    // await chrome.tabs.update(tabs[0].id, { active: true });
    return tabs[0];
  } else {
    let newTab = await chrome.tabs.create({ url });
    return newTab;
  }
}

async function waitContentScriptReady(contentScriptStatusKey) {
  while (true) {
    const contentStatus = await getKeyValueFromStorage(contentScriptStatusKey);

    if (contentStatus === READY) {
      return;
    } else {
      await sleep(1000);
    }
  }
}

async function closeTabByURL(tabURL) {
  try {
    const tab = await getTab(tabURL);
    if (tab) {
      await new Promise((resolve) => {
        chrome.tabs.remove(tab.id, function () {
          resolve();
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function generatePageLink(currentURL, pageNumber) {
  const urlParts = currentURL.split("?");
  if (urlParts.length > 1) {
    const params = urlParts[1].split("&");
    for (let i = 0; i < params.length; i++) {
      if (params[i].startsWith("page=")) {
        params[i] = `page=${pageNumber}`;
        break;
      }
    }
    const newURL = urlParts[0] + "?" + params.join("&");
    return newURL;
  } else {
    return "";
  }
}

function calculateRowsPerPage(missingRows, pageSize = 100) {
  const totalPages = Math.ceil(missingRows / pageSize);
  const rowsPerPage = [];
  let currentPage = totalPages;
  for (let i = totalPages; i >= 1; i--) {
    const rowsOnPage = i === currentPage ? missingRows % pageSize : pageSize;
    rowsPerPage.push(rowsOnPage);
  }
  return rowsPerPage;
}

async function getCount(tab, data) {
  while (true) {
    const response = await sendMessageToTab(tab, GET_DATA_COUNT, data);
    switch (response.type) {
      case ERR_NOT_LOADED_DATA:
        await sleep(1000);
        break;
      case DATA_RECEIVED:
        return response.body;
      default:
        break;
    }
  }
}

async function sendResponseToTabToEnterData(tab, data) {
  while (true) {
    const response = await sendMessageToTab(tab, "", data);
    switch (response.type) {
      case ERR_NOT_LOADED_DATA:
        await sleep(1000);
        break;
      case PAGE_READY_FOR_DATA_ENTERED:
        return;
      default:
        break;
    }
  }
}

async function sendResponseToAgentToSyncData(url, agent, keyData) {
  const tab = await getTab(url);
  const data = await getKeyValueFromStorage(keyData);
  const userData = await getKeyValueFromStorage(KEY_USER_DATA);

  let keys = Object.keys(data);
  if (keys.length > 0) {
    const key = keys[0];
    const metrologyData = data[key];
    await waitContentScriptReady(agent);
    sendResponseToTabToEnterData(tab, {
      metrologyData,
      userData,
      key,
    });
  }
}

async function dataEnteredHandler(senderTab, enteredKey, keyData) {
  let data = await getKeyValueFromStorage(keyData);
  let userData = await getKeyValueFromStorage(KEY_USER_DATA);
  let newData = { ...data };
  delete newData[enteredKey];

  setValueInStorage(keyData, newData);
  data = await getKeyValueFromStorage(keyData);
  sendRequestToUpdatePopupData();
  const keys = Object.keys(data);
  if (keys.length > 0) {
    let key = keys[0];
    let metrologyData = data[key];
    // небольшая задержка чтобы страница успела перейти в исходное состояние
    await sleep(1000);
    sendMessageToTab(senderTab, "", {
      metrologyData,
      userData,
      key,
    });
  }
}

async function setDataInStorage(data, storageKey) {
  const currentData = (await getKeyValueFromStorage(storageKey)) || {};
  const newData = Object.assign(currentData, data);
  setValueInStorage(storageKey, newData);
}

export {
  sendRequestToUpdatePopupData,
  sendResponseToFundMetrologyTab,
  getCount,
  calculateRowsPerPage,
  closeTabByURL,
  generatePageLink,
  waitContentScriptReady,
  sendResponseToTabToEnterData,
  sendMessageToTab,
  getTab,
  sendResponseToAgentToSyncData,
  dataEnteredHandler,
  setDataInStorage,
};
