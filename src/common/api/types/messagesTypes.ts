export const enum CONTENT_SCRIPT_LISTENERS_TYPES {
  GET_VERIFICATION_RESULTS_OF_WEBSITE = "GET_VERIFICATION_RESULTS_OF_WEBSITE",
}

export const enum CONTENT_SCRIPT_SENDERS_TYPES {
  SEND_VERIFICATION_RESULTS_OF_WEBSITE = "SEND_VERIFICATION_RESULTS_OF_WEBSITE",
}

export const enum POPUP_SCRIPT_SENDERS_TYPES {
  GET_AUTHORS = "GET_AUTHORS",
  GET_VERIFICATION_RESULTS = "GET_VERIFICATION_RESULTS",
  SEND_NEW_AUTHOR = "SEND_NEW_AUTHOR",
  DELETE_AUTHORS = "DELETE_AUTHORS",
  UPDATE_AUTHORS = "UPDATE_AUTHORS",
}

export const enum POPUP_SCRIPT_LISTENERS_TYPES {
  SEND_AUTHORS = "SEND_AUTHORS",
  SEND_VERIFICATION_RESULTS = "SEND_VERIFICATION_RESULTS",
}

export type ApiTypes =
  | CONTENT_SCRIPT_LISTENERS_TYPES
  | CONTENT_SCRIPT_SENDERS_TYPES
  | POPUP_SCRIPT_LISTENERS_TYPES
  | POPUP_SCRIPT_SENDERS_TYPES;
