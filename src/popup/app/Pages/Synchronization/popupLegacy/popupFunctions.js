import { getKeyValueFromStorage, getPercent } from "../utils/functions.js";
import {
    KEY_COUT_DATA_TO_SYNC_ROSACCREDITATION,
    KEY_COUT_DATA_TO_SYNC_ARMMETROLOG,
    KEY_DATA_FOR_ROSACCREDITATION,
    KEY_DATA_FOR_ARMMETROLOG,
    KEY_USER_DATA,
} from "../utils/storageKeys.js";

async function loadDataFromStorage(inputsData) {
    let userData = await getKeyValueFromStorage(KEY_USER_DATA);
    if (userData) {
        inputsData.forEach(function (inputData) {
            let key = inputData.id;
            let input = document.getElementById(key);
            if (input) {
                input.value = userData[key] || "";
            }
        });
    }
}

async function update() {
    const buttonSyncFSA = document.getElementById("fsa-sync");
    const buttonSyncARMmetrolog = document.getElementById("ARMmetrolog-sync");
    const completedNodeFSA = document.querySelector("#fsa-completed");
    const allNodeFSA = document.querySelector("#fsa-all");
    const progressNodeFSA = document.querySelector("#fsa-progress");
    const completedNodeARMmetrolog = document.querySelector(
        "#ARMmetrolog-completed"
    );
    const allNodeARMmetrolog = document.querySelector("#ARMmetrolog-all");
    const progressNodeARMmetrolog = document.querySelector(
        "#ARMmetrolog-progress"
    );

    const dataForFSA = await getKeyValueFromStorage(
        KEY_DATA_FOR_ROSACCREDITATION
    );
    const dataForARMmetrolog = await getKeyValueFromStorage(
        KEY_DATA_FOR_ARMMETROLOG
    );

    updateStatus(
        dataForFSA,
        buttonSyncFSA,
        KEY_COUT_DATA_TO_SYNC_ROSACCREDITATION,
        completedNodeFSA,
        allNodeFSA,
        progressNodeFSA
    );

    updateStatus(
        dataForARMmetrolog,
        buttonSyncARMmetrolog,
        KEY_COUT_DATA_TO_SYNC_ARMMETROLOG,
        completedNodeARMmetrolog,
        allNodeARMmetrolog,
        progressNodeARMmetrolog
    );
}

async function updateStatus(
    data,
    button,
    keyCountToSync,
    completedNode,
    allNode,
    progressNode
) {
    if (data) {
        const keys = Object.keys(data);
        if (keys.length > 0) {
            button.removeAttribute("disabled");
        }
        const dataCount = await getKeyValueFromStorage(keyCountToSync);

        completedNode.innerHTML = dataCount - keys.length;

        allNode.innerHTML = dataCount;
        progressNode.setProgress(
            getPercent(dataCount - keys.length, dataCount)
        );
    }
}

function setDisplayNoneOfElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = "none";
    }
}

function removeDisplayNoneOfElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = "";
    }
}
export {
    loadDataFromStorage,
    update,
    setDisplayNoneOfElement,
    removeDisplayNoneOfElement,
};
