import { Api } from "@common/api/api.class";
import {
  CONTENT_SCRIPT_LISTENERS_TYPES,
  CONTENT_SCRIPT_SENDERS_TYPES,
} from "@common/api/types/messagesTypes";

export const contentApi = new Api<
  CONTENT_SCRIPT_SENDERS_TYPES,
  CONTENT_SCRIPT_LISTENERS_TYPES
>();
