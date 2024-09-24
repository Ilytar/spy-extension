import { ApiTypes } from "./messagesTypes";
import { ContentScriptApi } from "./contentScriptMessages";
import { PopupScriptApi } from "./popupScriptMessages";

export type Response<T> = (response: T) => void;

export type MessageAPI<Type, Payload, ResponseData = boolean> = {
  type: Type;
  payload: Payload;
  onResponse: Response<ResponseData>;
  sendResponse: Response<ResponseData>;
};

export type Payload<T extends ApiTypes> = Extract<API, { type: T }>["payload"];

export type SendResponse<T extends ApiTypes> = Extract<
  API,
  { type: T }
>["sendResponse"];

export type MessageListener<Type extends ApiTypes> = (
  message: { type: Type; payload: Payload<Type> },
  sender: chrome.runtime.MessageSender,
  sendResponse: SendResponse<Type>
) => void;

export type ListenerTuple<T extends ApiTypes> = [T, MessageListener<T>];

type API = PopupScriptApi | ContentScriptApi;
