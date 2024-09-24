import { update } from "./popupFunctions.js";

function popupUpdateDataStatusHandler() {
    update();
}

function defaultPopupHandler(request) {
    console.log(
        "Был получен запрос, но он не был обработан, так как его тип неопознан",
        request
    );
}

function headerTabsClickHandler(clickedTab, headerTabsContainer) {
    if (clickedTab.classList.contains("header__button")) {
        const headerTabs =
            headerTabsContainer.querySelectorAll(".header__button");

        headerTabs.forEach((tab) => {
            tab.classList.remove("header__button_active");
        });

        clickedTab.classList.add("header__button_active");
    }
}
export {
    popupUpdateDataStatusHandler,
    defaultPopupHandler,
    headerTabsClickHandler,
};
