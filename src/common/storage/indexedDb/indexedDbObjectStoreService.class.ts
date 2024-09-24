import { IndexedDB, StoreKeys } from "./indexedDb.class";

export abstract class IndexedDbObjectStoreService<T> {
  private db: IndexedDB;
  private storeName: StoreKeys;

  constructor(storeName: StoreKeys) {
    this.db = IndexedDB.getInstance();
    this.storeName = storeName;
  }

  public async putData(data: T) {
    await this.db.putDataInStore<T>(this.storeName, data);
  }

  public async getDataByKey(key: IDBValidKey | IDBKeyRange) {
    return await this.db.getDataFromStoreByKey<T>(this.storeName, key);
  }

  public async getAllData() {
    return await this.db.getAllDataInfoFromStore<T>(this.storeName);
  }

  public async clearData() {
    await this.db.clearStore(this.storeName);
  }

  public async getAllKeys() {
    return await this.db.getAllKeysOfStore(this.storeName);
  }

  public async deleteDataByKey(key: IDBValidKey | IDBKeyRange) {
    return await this.db.deleteDataByKey(this.storeName, key);
  }
}
