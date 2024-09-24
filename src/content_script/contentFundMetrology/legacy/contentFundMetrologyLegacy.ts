import {
  CONTENT_FUNDMETROLOGY_SCRIPT_READY,
  DATA_FUNDMETROLOGY,
  DATA_RECEIVED,
  ERR_NOT_LOADED_DATA,
  ERR_UNKNOWN,
  GET_DATA,
  GET_DATA_COUNT,
  PAGE_FUNDMETROLOGY_CLOSE,
} from "@common/utils/extensionConstants";
import {
  getData,
  getPageNumber,
  getTableRowsCount,
} from "./contentFundMetrologyFunctions";

export function contentFundMetrologyLegacy() {
  // Сообщаем о готовности скрипта для передачи данных и получаем его id=номер страницы
  const pageNumber = getPageNumber();
  chrome.runtime.sendMessage({
    type: CONTENT_FUNDMETROLOGY_SCRIPT_READY,
    body: pageNumber,
  });

  // Метод для получения данных
  chrome.runtime.onMessage.addListener(contentListener);

  // Сообщаем, что страница закрыта, и скрипт больше не существует
  window.addEventListener("beforeunload", function () {
    chrome.runtime.sendMessage({
      type: PAGE_FUNDMETROLOGY_CLOSE,
      body: pageNumber,
    });
  });

  function contentListener(request, sender, sendResponse) {
    try {
      switch (request.type) {
        case GET_DATA:
          {
            const { countOfMissingRows, currentNumberOfTable } = request.body;
            const data = getData(countOfMissingRows, currentNumberOfTable);
            // Отправляем popup, что данные были получены
            sendResponse({
              type: DATA_RECEIVED,
            });
            // Отправляем данные фоновому скрипту
            chrome.runtime.sendMessage({
              type: DATA_FUNDMETROLOGY,
              body: data,
            });
          }
          break;
        case GET_DATA_COUNT:
          {
            const count = getTableRowsCount();
            if (!count) {
              throw new Error(ERR_NOT_LOADED_DATA);
            }
            sendResponse({
              type: DATA_RECEIVED,
              body: count,
            });
          }
          break;
      }
    } catch (error) {
      switch (error.message) {
        case ERR_NOT_LOADED_DATA:
          sendResponse({ type: ERR_NOT_LOADED_DATA });
          break;
        default:
          sendResponse({ type: ERR_UNKNOWN });
      }
    }
  }
}
