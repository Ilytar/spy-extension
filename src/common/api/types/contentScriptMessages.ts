import { MessageAPI } from "./api";
import {
  CONTENT_SCRIPT_LISTENERS_TYPES,
  CONTENT_SCRIPT_SENDERS_TYPES,
} from "./messagesTypes";
import {
  AuthorName,
  VerificationResultsByAuthor,
} from "@common/storage/types/db";

type GetVerificationResultsFromWebsite = MessageAPI<
  CONTENT_SCRIPT_LISTENERS_TYPES.GET_VERIFICATION_RESULTS_OF_WEBSITE,
  AuthorName[],
  VerificationResultsByAuthor[]
>;

export type ContentScriptListeners = GetVerificationResultsFromWebsite;

type SendVerificationResultsFromWebsite = MessageAPI<
  CONTENT_SCRIPT_SENDERS_TYPES.SEND_VERIFICATION_RESULTS_OF_WEBSITE,
  VerificationResultsByAuthor[],
  boolean
>;

export type ContentScriptSenders = SendVerificationResultsFromWebsite;

export type ContentScriptApi = ContentScriptSenders | ContentScriptListeners;
