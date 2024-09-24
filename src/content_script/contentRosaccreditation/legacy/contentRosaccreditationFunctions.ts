import {
  DATE_OF_VERIFICATION,
  FIRST_NAME,
  LAST_NAME,
  MIDDLE_NAME,
  MODIFICATION_OF_MI,
  NAME_OF_MI,
  REGISTRATION_NUMBER_OF_MI,
  USER_EMAIL,
  VALID_UNTIL,
  VERIFICATION_NUMBER,
} from "@common/utils/storageKeys";

const RA_RU = 311211;

function getDate(date) {
  // преобразует дату из запроса в требуемый вид для подстановки в форму
  let dateValue = date.split(".");
  let [day, mouth, year] = dateValue;
  return `${year}-${mouth}-${day}`;
}

function getForm() {
  const select = document.querySelector(
    "#modal-metrology-report #metrologyReportForm select[name=alType]"
  );
  select.value = "measurements";
  select.dispatchEvent(new Event("change"));
  return document.querySelector("#measurementsForm");
}

function prepareDOM() {
  const firstLink = document.querySelector("#menu div[data-t=for_metrology]");
  firstLink.click();
  const secondLink = document.querySelector("#btnmenu #metrology-report");
  secondLink.click();
}

function isDataSendedToServer() {
  const UKnotification = document.querySelector(
    ".uk-notification.uk-notification-top-right"
  );
  if (UKnotification) {
    const messageBlock = UKnotification.querySelector(
      ".uk-notification-message.uk-notification-message-success"
    );
    if (messageBlock) {
      const messageText = messageBlock.childNodes[3].innerHTML;
      if (
        messageBlock.childNodes[3].innerHTML ===
        "Данные отправляются. <br> Пожалуйста, ожидайте..."
      ) {
        closeStatusOfSendedData();
      }
      if (messageText === "Данные отправлены!") {
        return true;
      }
    }
  }
  return false;
}

function closeStatusOfSendedData() {
  const UKnotification = document.querySelector(
    ".uk-notification.uk-notification-top-right"
  );
  const messageBlock = UKnotification.querySelector(
    ".uk-notification-message.uk-notification-message-success"
  );
  const button = messageBlock.childNodes[1];
  button.click();
}

function modalWindowIsVisible() {
  const modalMetrologyReport = document.querySelector(
    "#modal-metrology-report"
  );
  if (modalMetrologyReport.classList.contains("uk-open")) {
    return true;
  }
  return false;
}

function setValuesInIpnputs(userData, metrologyData, form) {
  const metrologyReportForm = document.querySelector("#metrologyReportForm");

  const raru = metrologyReportForm.querySelector("input[name=alNumber]");
  const email = metrologyReportForm.querySelector("input[name=email]");
  const registationNumber = form.childNodes[0].querySelector("input");
  const date = form.childNodes[1].querySelector("input");
  const validateUntil = form.childNodes[2].querySelector("input");
  const type = form.childNodes[3].querySelector("input");
  const documentNumber = form.childNodes[4].querySelector("input");
  const userInputs = form.childNodes[5];
  const lasNameInput = userInputs.childNodes[1].querySelector("input");
  const firstNameInput = userInputs.childNodes[2].querySelector("input");
  const middleNameInput = userInputs.childNodes[3].querySelector("input");

  registationNumber.value = metrologyData[REGISTRATION_NUMBER_OF_MI];
  type.value =
    metrologyData[NAME_OF_MI] + " " + metrologyData[MODIFICATION_OF_MI];
  date.value = getDate(metrologyData[DATE_OF_VERIFICATION]);
  validateUntil.value = metrologyData[VALID_UNTIL];
  documentNumber.value = metrologyData[VERIFICATION_NUMBER];
  raru.value = RA_RU;
  lasNameInput.value = userData[LAST_NAME];
  firstNameInput.value = userData[FIRST_NAME];
  middleNameInput.value = userData[MIDDLE_NAME];
  email.value = userData[USER_EMAIL];
}

export {
  setValuesInIpnputs,
  modalWindowIsVisible,
  closeStatusOfSendedData,
  isDataSendedToServer,
  getForm,
  prepareDOM,
};
