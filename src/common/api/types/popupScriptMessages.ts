import { MessageAPI } from "./api";
import {
  POPUP_SCRIPT_LISTENERS_TYPES,
  POPUP_SCRIPT_SENDERS_TYPES,
} from "./messagesTypes";
import { Author, AuthorName } from "@common/storage/types/db";
import { VerificationOfMeasuringInstrument } from "@common/storage/types/verificationOfMeasuringInstrument";

type SendAuthorsToPopup = MessageAPI<
  POPUP_SCRIPT_LISTENERS_TYPES.SEND_AUTHORS,
  Author[],
  boolean
>;

type SendVerificationResultsToPopup = MessageAPI<
  POPUP_SCRIPT_LISTENERS_TYPES.SEND_VERIFICATION_RESULTS,
  VerificationOfMeasuringInstrument[],
  boolean
>;

export type PopupScriptListeners =
  | SendAuthorsToPopup
  | SendVerificationResultsToPopup;

type GetAuthors = MessageAPI<
  POPUP_SCRIPT_SENDERS_TYPES.GET_AUTHORS,
  undefined,
  Author[]
>;

type CreateNewAuthor = MessageAPI<
  POPUP_SCRIPT_SENDERS_TYPES.SEND_NEW_AUTHOR,
  AuthorName,
  boolean
>;

type GetVerificationResults = MessageAPI<
  POPUP_SCRIPT_SENDERS_TYPES.GET_VERIFICATION_RESULTS,
  AuthorName,
  VerificationOfMeasuringInstrument[]
>;

type DeleteAuthors = MessageAPI<
  POPUP_SCRIPT_SENDERS_TYPES.DELETE_AUTHORS,
  AuthorName[],
  boolean
>;

type UpdateAuthors = MessageAPI<
  POPUP_SCRIPT_SENDERS_TYPES.UPDATE_AUTHORS,
  AuthorName[] | null,
  boolean
>;

export type PopupScriptSenders =
  | GetAuthors
  | GetVerificationResults
  | CreateNewAuthor
  | DeleteAuthors
  | UpdateAuthors;

export type PopupScriptApi = PopupScriptListeners | PopupScriptSenders;
