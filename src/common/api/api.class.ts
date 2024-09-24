import {
  ListenerTuple,
  MessageListener,
  Payload,
  SendResponse,
} from "@common/api/types/api";
import { ApiTypes } from "@common/api/types/messagesTypes";
import { sleep } from "@common/utils/functions";

export class Api<SenderTypes extends ApiTypes, ListenerTypes extends ApiTypes> {
  private registeredListeners: Record<
    ListenerTypes,
    MessageListener<ListenerTypes> | undefined
  > = {} as Record<ListenerTypes, MessageListener<ListenerTypes>>;

  constructor(listeners?: ListenerTuple<ListenerTypes>[]) {
    if (listeners) {
      for (const [type, listener] of listeners) {
        this.addMessageListener(type, listener);
      }
    }
  }

  public sendMessageInRuntime<Type extends SenderTypes>(
    type: Type,
    payload: Payload<Type>,
    onResponse?: SendResponse<Type>
  ) {
    return chrome.runtime.sendMessage(
      { type, payload },
      onResponse as () => undefined
    );
  }

  public sendMessageToTab<Type extends SenderTypes>(
    tabId: number,
    type: Type,
    payload: Payload<Type>,
    onResponse?: SendResponse<Type>
  ) {
    return chrome.tabs.sendMessage(
      tabId,
      { type, payload },
      onResponse as () => undefined
    );
  }

  public async sendMessageToActiveTabAsync<Type extends SenderTypes>(
    type: Type,
    payload: Payload<Type>,
    onResponse?: SendResponse<Type>
  ) {
    const activeTab = await this.getActiveTabAsync();
    if (activeTab.id) {
      this.sendMessageToTab(activeTab.id, type, payload, onResponse);
    } else {
      console.warn("Не найдено id активной вкладки");
    }
  }

  public sendMessageToActiveTab<Type extends SenderTypes>(
    type: Type,
    payload: Payload<Type>,
    onResponse?: SendResponse<Type>
  ) {
    chrome.tabs.query({ active: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        this.sendMessageToTab(activeTab.id, type, payload, onResponse);
      } else {
        console.warn("Не найдено id активной вкладки");
      }
    });
  }

  addMessageListener<T extends ListenerTypes>(
    type: T,
    listener: MessageListener<T>,
    isAsync: boolean = true
  ) {
    if (!this.registeredListeners[type]) {
      const messageListener: MessageListener<T> = (
        message,
        sender,
        sendResponse
      ) => {
        if (message.type === type) {
          listener(message, sender, sendResponse);
        }

        if (isAsync) {
          return true;
        }
      };

      this.registeredListeners[type] =
        messageListener as unknown as MessageListener<ListenerTypes>;
      chrome.runtime.onMessage.addListener(messageListener);
    } else {
      console.warn(
        `Нельзя добавлять более одного обработчика на событие ${type}. Будет активен первый зарегистрированный обработчик`
      );
    }
  }

  public deleteListener<T extends ListenerTypes>(type: T) {
    const listener = this.registeredListeners[type];
    if (listener) {
      chrome.runtime.onMessage.removeListener(listener);
      delete this.registeredListeners[type];
    }
  }

  public async getActiveTabAsync() {
    const [tab] = await chrome.tabs.query({ active: true });
    return tab;
  }

  public async getTabByUrlAsync(url: string) {
    const tab = await chrome.tabs.query({ url });
    if (tab[0]) {
      return tab[0];
    } else {
      const tabId = await chrome.tabs.create({ url });
      await sleep(500);
      return tabId;
    }
  }
}
