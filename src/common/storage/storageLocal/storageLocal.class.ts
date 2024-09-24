import {
  StorageKeys,
  StorageDataEntry,
  StorageValueByKey,
  STORAGE_KEYS,
  StorageValuesTuple,
} from "@common/storage/types/storageLocal";
import { AuthorName } from "../types/db";

abstract class StrogeLocalApiBase {
  private storage: chrome.storage.LocalStorageArea = chrome.storage.local;

  protected async setValue({ key, value }: { key: string; value: unknown }) {
    try {
      return await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error(error);
    }
  }

  protected async getValue<T extends StorageKeys>(
    key: T
  ): Promise<StorageValueByKey<T> | undefined> {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key];
    } catch (error) {
      console.error(error);
    }
  }

  protected getQuotaBytes() {
    return this.storage.QUOTA_BYTES;
  }

  protected async getButesInUse(): Promise<number> {
    return await this.storage.getBytesInUse();
  }

  public clearStorage() {
    this.storage.clear();
  }

  protected async deleteDataForKey(key: StorageKeys) {
    await this.storage.remove(key);
  }
}

class StorageLocalApi extends StrogeLocalApiBase {
  constructor() {
    super();
  }

  public async setValueInStorage({ key, value }: StorageDataEntry) {
    return await this.setValue({ key, value });
  }

  public async getValueFromStorage<T extends StorageKeys>(key: T) {
    return await this.getValue(key);
  }

  public async getSomeValuesFromStorage<T extends StorageKeys[]>(
    ...storageKeys: T
  ): Promise<StorageValuesTuple<T>> {
    const values = await Promise.all(
      storageKeys.map((key) => this.getValueFromStorage(key))
    );
    return values as StorageValuesTuple<T>;
  }

  public async getMemoryUsage() {
    const maxBytes = this.getQuotaBytes();
    const bytesInUse = await this.getButesInUse();
    return Number(((bytesInUse / maxBytes) * 100).toFixed(4));
  }
}

class StorageLocal extends StorageLocalApi {
  private static INSTANCE: null | StorageLocal = null;

  constructor() {
    if (StorageLocal.INSTANCE) {
      return StorageLocal.INSTANCE;
    }
    super();
    StorageLocal.INSTANCE = this;
  }

  public async setUserData(value: StorageValueByKey<STORAGE_KEYS.USER_DATA>) {
    return await this.setValueInStorage({
      key: STORAGE_KEYS.USER_DATA,
      value,
    });
  }

  public getUserData() {
    return this.getValueFromStorage(STORAGE_KEYS.USER_DATA);
  }

  public async setAuthToken(
    value: StorageValueByKey<STORAGE_KEYS.AUTHORIZATION_TOKEN>
  ) {
    return await this.setValueInStorage({
      key: STORAGE_KEYS.AUTHORIZATION_TOKEN,
      value,
    });
  }

  public getAuthToken() {
    return this.getValueFromStorage(STORAGE_KEYS.AUTHORIZATION_TOKEN);
  }

  public async setActiveAuthor(value: AuthorName | null) {
    return await this.setValueInStorage({
      key: STORAGE_KEYS.ACTIVE_AUTHOR,
      value,
    });
  }

  public async getActiveAuthor() {
    return await this.getValueFromStorage(STORAGE_KEYS.ACTIVE_AUTHOR);
  }
}

const storageLocal = new StorageLocal();

export default storageLocal;
