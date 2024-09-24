import storageLocal from "@common/storage/storageLocal/storageLocal.class";
import { createQueryParams } from "@content_script/contentFundMetrologyPersonal/utils/utils";
import { contentApi } from "./contentFundMetrologyPersonalApi";
import {
  CONTENT_SCRIPT_LISTENERS_TYPES,
  CONTENT_SCRIPT_SENDERS_TYPES,
} from "@common/api/types/messagesTypes";
import {
  AuthorName,
  VerificationResultsByAuthor,
} from "@common/storage/types/db";
import { VerificationOfMeasuringInstrumentOrigin } from "@common/storage/types/verificationOfMeasuringInstrument";

const BASE_URL =
  "https://fgis.gost.ru/fundmetrology/cm/lk/api/rgsprepvriview/1304";

async function getQueryResult(authorName: AuthorName) {
  const token = await storageLocal.getAuthToken();
  if (token) {
    const url = `${BASE_URL}${createQueryParams({
      author: authorName,
      year: 2024,
      sortBy: "lastChanged_desc",
      limit: 9999999,
    })}`;

    const response = await fetch(url, {
      headers: {
        authorization: token,
      },
    });
    return (await response.json()) as Promise<{
      rgsPrepVriViews: VerificationOfMeasuringInstrumentOrigin[];
      totalAmount: number;
    }>;
  }
}

console.log("contentFundMetrologyPersonal ", new Date());

contentApi.addMessageListener(
  CONTENT_SCRIPT_LISTENERS_TYPES.GET_VERIFICATION_RESULTS_OF_WEBSITE,
  async ({ payload: targetAuthorsNames }) => {
    const result: VerificationResultsByAuthor[] = [];

    for (const authorName of targetAuthorsNames) {
      const queryResult = await getQueryResult(authorName);
      const verificationData = queryResult?.rgsPrepVriViews;

      if (verificationData) {
        const resultByAuthor: VerificationResultsByAuthor = {
          authorName: authorName,
          verificationResults: verificationData.map(
            ({
              author,
              documentTitle,
              mitypeNumber,
              mitypeTitle,
              verificationDate,
            }) => ({
              author,
              documentTitle,
              mitypeNumber,
              mitypeTitle,
              verificationDate,
            })
          ),
        };
        result.push(resultByAuthor);
      }
    }

    contentApi.sendMessageInRuntime(
      CONTENT_SCRIPT_SENDERS_TYPES.SEND_VERIFICATION_RESULTS_OF_WEBSITE,
      result
    );
  },
  false
);
