import {
  CONTENT_SCRIPT_LISTENERS_TYPES,
  CONTENT_SCRIPT_SENDERS_TYPES,
  POPUP_SCRIPT_LISTENERS_TYPES,
  POPUP_SCRIPT_SENDERS_TYPES,
} from "@common/api/types/messagesTypes";
import { database } from "@common/storage/indexedDb/indexedDb.class";
import legacyBackground from "./background/background";
import storageLocal from "@common/storage/storageLocal/storageLocal.class";
import {
  authorService,
  verificationResultsService,
} from "@common/storage/indexedDb/indexedDbServices";
import { serviceWorkerApi } from "./serviceWorkerApi";
import { Author, AuthorName } from "@common/storage/types/db";
import {
  FUND_METROLOGY_PERSONAL_URL_REGEXP,
  PUBLISHED_RESULTS_URL,
} from "@common/constants/urls";
import { getFormatedDate } from "@common/utils/date";

console.log("SERVICE WORKER ACTIVE");

const getVerificationResultsOfWebsiteSender = async (
  authorsNames: AuthorName[]
) => {
  const tab = await serviceWorkerApi.getTabByUrlAsync(PUBLISHED_RESULTS_URL);
  if (tab.id) {
    serviceWorkerApi.sendMessageToTab(
      tab.id,
      CONTENT_SCRIPT_LISTENERS_TYPES.GET_VERIFICATION_RESULTS_OF_WEBSITE,
      authorsNames
    );
  }
};

database.onSuccessOpened = async () => {
  legacyBackground();

  serviceWorkerApi.addMessageListener(
    POPUP_SCRIPT_SENDERS_TYPES.GET_AUTHORS,
    async (_, __, sendResponse) => {
      try {
        const authorsData = await authorService.getAllData();
        if (authorsData) {
          sendResponse(authorsData);
        }
      } catch (e) {
        console.error(e);
      }
    }
  );

  serviceWorkerApi.addMessageListener(
    CONTENT_SCRIPT_SENDERS_TYPES.SEND_VERIFICATION_RESULTS_OF_WEBSITE,
    async ({ payload: verificationResultItems }) => {
      try {
        if (verificationResultItems) {
          for (const verificationResultItem of verificationResultItems) {
            const authorName = verificationResultItem.authorName;
            const authorData = await authorService.getDataByKey(authorName);

            if (authorData) {
              await authorService.putData({
                ...authorData,
                dateOfUpdate: getFormatedDate(),
                resultsCount: verificationResultItem.verificationResults.length,
              });

              await verificationResultsService.putData({
                authorName: authorName,
                verificationResults: verificationResultItem.verificationResults,
              });
            }
          }
        }

        sendRequestToUpdateAuthorsInPopup();
      } catch (e) {
        console.error(e);
      }
    },
    false
  );

  serviceWorkerApi.addMessageListener(
    POPUP_SCRIPT_SENDERS_TYPES.GET_VERIFICATION_RESULTS,
    async ({ payload }, __, sendResponse) => {
      try {
        const verificationResults =
          await verificationResultsService.getDataByKey(payload);
        if (verificationResults) {
          sendResponse(verificationResults.verificationResults);
        }
      } catch (e) {
        console.error(e);
      }
    }
  );

  serviceWorkerApi.addMessageListener(
    POPUP_SCRIPT_SENDERS_TYPES.SEND_NEW_AUTHOR,
    async ({ payload: authorName }) => {
      try {
        const newAuthor: Author = {
          authorName: authorName,
          dateOfCreation: getFormatedDate(),
          dateOfUpdate: getFormatedDate(),
          resultsCount: 0,
        };

        await authorService.putData(newAuthor);
        await verificationResultsService.putData({
          authorName: authorName,
          verificationResults: [],
        });

        getVerificationResultsOfWebsiteSender([authorName]);
      } catch (e) {
        console.error(e);
      }
    },
    false
  );

  serviceWorkerApi.addMessageListener(
    POPUP_SCRIPT_SENDERS_TYPES.DELETE_AUTHORS,
    async ({ payload: authors }, _, sendRespone) => {
      try {
        for (const author of authors) {
          await authorService.deleteDataByKey(author);
          await verificationResultsService.deleteDataByKey(author);
        }

        sendRequestToUpdateAuthorsInPopup();

        sendRespone(true);
      } catch (e) {
        console.error(e);
      }
    }
  );

  serviceWorkerApi.addMessageListener(
    POPUP_SCRIPT_SENDERS_TYPES.UPDATE_AUTHORS,
    async ({ payload: authorsNames }) => {
      try {
        if (!authorsNames) {
          const allAuthorsNames =
            (await authorService.getAllKeys()) as string[];
          if (allAuthorsNames) {
            getVerificationResultsOfWebsiteSender(allAuthorsNames);
          }
        } else {
          getVerificationResultsOfWebsiteSender(authorsNames);
        }
      } catch (e) {
        console.error(e);
      }
    },
    false
  );
};

function userAuthTokenHandler(
  details: chrome.webRequest.WebRequestHeadersDetails
) {
  if (details.requestHeaders) {
    const authHeader = details.requestHeaders.find(
      (header) => header.name.toLowerCase() === "authorization"
    );

    const newAuthToken = authHeader?.value;
    if (newAuthToken) {
      console.log("onSendHeaders Authorization Header :", authHeader.value);

      storageLocal
        .getAuthToken()
        .then((token) => {
          if (newAuthToken !== token) {
            storageLocal.setAuthToken(newAuthToken);
          }
        })
        .catch(console.error);
    }
  }

  return details;
}

chrome.webRequest.onSendHeaders.addListener(
  userAuthTokenHandler,
  { urls: [FUND_METROLOGY_PERSONAL_URL_REGEXP] },
  ["requestHeaders"]
);

async function sendRequestToUpdateAuthorsInPopup() {
  const updatedAuthors = await authorService.getAllData();

  if (updatedAuthors) {
    serviceWorkerApi.sendMessageInRuntime(
      POPUP_SCRIPT_LISTENERS_TYPES.SEND_AUTHORS,
      updatedAuthors
    );
  }
}

// async function sendRequestToUpdateVerificationResultsInPopup(
//   authorName: AuthorName
// ) {
//   const verificationResults = await verificationResultsService.getDataByKey(
//     authorName
//   );

//   if (verificationResults) {
//     serviceWorkerApi.sendMessageInRuntime(
//       POPUP_SCRIPT_LISTENERS_TYPES.SEND_VERIFICATION_RESULTS,
//       verificationResults.verificationResults
//     );
//   }
// }
