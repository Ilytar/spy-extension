import {
  CONTENT_ROSACCREDITATION_SCRIPT_READY,
  DATA_ROSACCREDITATION_ENTERED,
  ERR_NOT_LOADED_DATA,
  ERR_UNKNOWN,
  PAGE_READY_FOR_DATA_ENTERED,
  PAGE_ROSACCREDITATION_CLOSE,
} from "@common/utils/extensionConstants";
import {
  closeStatusOfSendedData,
  getForm,
  isDataSendedToServer,
  modalWindowIsVisible,
  prepareDOM,
  setValuesInIpnputs,
} from "./legacy/contentRosaccreditationFunctions";
import { sleep } from "@common/utils/functions";

chrome.runtime.sendMessage({
  type: CONTENT_ROSACCREDITATION_SCRIPT_READY,
});

// Метод для получения данных
chrome.runtime.onMessage.addListener(contentListener);
// Сообщаем, что страница закрыта, и скрипт больше не существует
window.addEventListener("beforeunload", function (event) {
  chrome.runtime.sendMessage({ type: PAGE_ROSACCREDITATION_CLOSE });
});

function contentListener(request, sender, sendResponse) {
  try {
    const { metrologyData, userData, key } = request.body;

    if (!modalWindowIsVisible()) {
      prepareDOM();
    }

    const form = getForm();
    if (!form) {
      throw new Error(ERR_NOT_LOADED_DATA);
    }
    sendResponse({
      type: PAGE_READY_FOR_DATA_ENTERED,
    });
    setValuesInIpnputs(userData, metrologyData, form);
    const buttonSubmit = document.querySelector("#metrology-report-submit");
    const clickHandler = async () => {
      // удаляем обработчик чтобы не накапливались chrome.runtime.sendMessage
      buttonSubmit.removeEventListener("click", clickHandler);
      let isDataNotSended = true;
      while (isDataNotSended) {
        if (isDataSendedToServer()) {
          closeStatusOfSendedData();
          chrome.runtime.sendMessage({
            type: DATA_ROSACCREDITATION_ENTERED,
            body: key,
          });
          isDataNotSended = false;
          return;
        } else {
          await sleep(100);
        }
      }
    };
    buttonSubmit.addEventListener("click", clickHandler);
    return;
  } catch (error) {
    switch (error.message) {
      case ERR_NOT_LOADED_DATA:
        sendResponse({ type: ERR_NOT_LOADED_DATA });
        break;
      default:
        sendResponse({ type: ERR_UNKNOWN });
    }
    return;
  }
}
