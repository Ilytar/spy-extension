import { Api } from "@common/api/api.class";
import {
  POPUP_SCRIPT_LISTENERS_TYPES,
  POPUP_SCRIPT_SENDERS_TYPES,
} from "@common/api/types/messagesTypes";

export const popupApi = new Api<
  POPUP_SCRIPT_SENDERS_TYPES,
  POPUP_SCRIPT_LISTENERS_TYPES
>();
