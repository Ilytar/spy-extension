import {
    BG_SYNC_ROSACCREDITATION,
    BG_GET_DATA,
    POPUP_UPDATE_DATA_STATUS,
    BG_SYNC_ARMMETROLOG,
} from "../utils/extensionConstants.js";
import {
    loadDataFromStorage,
    removeDisplayNoneOfElement,
    setDisplayNoneOfElement,
    update,
} from "./popupFunctions.js";

import settingsInputsData from "./settingsForm/formData.js";

import {
    defaultPopupHandler,
    headerTabsClickHandler,
    popupUpdateDataStatusHandler,
} from "./popupHandlers.js";
import createSettingsForm from "./settingsForm/settingsForm.js";

const buttonGetData = document.getElementById("get-data");
const buttonSyncFSA = document.getElementById("fsa-sync");
const buttonSyncARMmetrolog = document.getElementById("ARMmetrolog-sync");
buttonSyncFSA.setAttribute("disabled", "true");
buttonSyncARMmetrolog.setAttribute("disabled", "true");

const synchronizerId = "synchronizer-root";
const profileSettingsFormId = "settings-form";
const content = document.querySelector(".content");
content.appendChild(
    createSettingsForm(
        profileSettingsFormId,
        settingsInputsData,
        "Настройки пользователя"
    )
);
loadDataFromStorage(settingsInputsData);
setDisplayNoneOfElement(profileSettingsFormId);

const buttonGoMain = document.querySelector("#go-main");
const buttonGoProfile = document.querySelector("#go-profile");

buttonGoMain.addEventListener("click", () => {
    removeDisplayNoneOfElement(synchronizerId);
    setDisplayNoneOfElement(profileSettingsFormId);
});
buttonGoProfile.addEventListener("click", () => {
    removeDisplayNoneOfElement(profileSettingsFormId);
    setDisplayNoneOfElement(synchronizerId);
});

const buttonClosePopup = document.querySelector("#close-popup");
buttonClosePopup.addEventListener("click", () => {
    window.close();
});

const headerTabsContainer = document.querySelector(".header__tabs");
headerTabsContainer.addEventListener("click", (event) => {
    headerTabsClickHandler(event.target, headerTabsContainer);
});

buttonGetData.addEventListener("click", async (e) => {
    chrome.runtime.sendMessage({
        type: BG_GET_DATA,
        body: {},
    });
});

buttonSyncFSA.addEventListener("click", (e) => {
    chrome.runtime.sendMessage({
        type: BG_SYNC_ROSACCREDITATION,
        body: {},
    });
});

buttonSyncARMmetrolog.addEventListener("click", (e) => {
    chrome.runtime.sendMessage({
        type: BG_SYNC_ARMMETROLOG,
        body: {},
    });
});

chrome.runtime.onMessage.addListener(handleMessage);
function handleMessage(request, sender, sendResponse) {
    switch (request.type) {
        case POPUP_UPDATE_DATA_STATUS:
            popupUpdateDataStatusHandler();
            break;
        default:
            defaultPopupHandler(request);
            break;
    }
}

update();
