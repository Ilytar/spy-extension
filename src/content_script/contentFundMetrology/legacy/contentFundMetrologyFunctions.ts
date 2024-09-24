import {
  DATE_OF_VERIFICATION,
  MODIFICATION_OF_MI,
  NAME_OF_MI,
  REGISTRATION_NUMBER_OF_MI,
  TYPE_OF_MI,
  VALID_UNTIL,
  VERIFICATION_NUMBER,
} from "@common/utils/storageKeys";

const rosaccreditationColumns = {
  [REGISTRATION_NUMBER_OF_MI]: "Регистрационный номер типа СИ",
  [TYPE_OF_MI]: "Тип СИ",
  [DATE_OF_VERIFICATION]: "Дата поверки",
  [VERIFICATION_NUMBER]: "Номер свидетельства/ Номер извещения",
  [NAME_OF_MI]: "Наименование типа СИ",
  [MODIFICATION_OF_MI]: "Модификация СИ",
  [VALID_UNTIL]: "Действительна до",
};

function getTableRowsCount() {
  const paginationStatElement = document.querySelector(
    ".block_pagination_stat span"
  );
  if (!paginationStatElement) {
    return null;
  }
  const paginationStatText = paginationStatElement.textContent;
  const parts = paginationStatText.split("из");
  const tableRowsCount = parts[parts.length - 1].trim();
  return tableRowsCount;
}

function getTableBodyAndHead() {
  const tableBody = document.querySelector(".table tbody");
  const tableHead = document.querySelector(".table thead tr");
  if (!tableHead && !tableBody) {
    throw new Error(ERR_NOT_LOADED_DATA);
  }
  const tableRows = [...tableBody.children];
  if (tableRows.length < 1) {
    throw new Error(ERR_NOT_LOADED_DATA);
  }
  return [tableBody, tableHead];
}

function getPageNumber() {
  const urlSearchParams = new URLSearchParams(window.location.href);
  const pageNumber = urlSearchParams.get("page");
  return parseInt(pageNumber);
}

function getTableData(
  tableBody,
  tableHead,
  countOfMissingRows,
  currentNumberOfTable
) {
  const data = {};
  // объект, который хранит индекс интересующего нас столбца из таблицы
  const headColumns = getHeadColumns(tableHead.cells);
  const tableRows = [...tableBody.children];
  const RosaccreditationColumnsTitles = Object.keys(headColumns);
  const startIndex = countOfMissingRows - 1;
  currentNumberOfTable++;
  for (let i = startIndex; i >= 0; i--) {
    data[currentNumberOfTable] = getRowData(
      tableRows[i].children,
      RosaccreditationColumnsTitles,
      headColumns
    );
    currentNumberOfTable++;
  }
  return data;
}

function getData(countOfMissingRows, currentNumberOfTable) {
  // в этой функции отслеживается, загружены ли данные из таблицы на сайт
  const [tableBody, tableHead] = getTableBodyAndHead();
  const result = getTableData(
    tableBody,
    tableHead,
    countOfMissingRows,
    currentNumberOfTable
  );
  return result;
}

function getHeadColumns(tableHead) {
  let result = {};
  const tableHeadArray = [...tableHead];
  for (let index = 0; index < tableHeadArray.length; index++) {
    for (let key in rosaccreditationColumns) {
      if (rosaccreditationColumns[key] === tableHeadArray[index].innerText) {
        result[key] = index;
      }
    }
  }
  return result;
}

function getRowData(row, keys, keysPosition) {
  const data = {};
  for (let key of keys) {
    data[key] = row[keysPosition[key]].innerText;
  }
  return data;
}

export { getPageNumber, getTableRowsCount, getTableBodyAndHead, getData };
