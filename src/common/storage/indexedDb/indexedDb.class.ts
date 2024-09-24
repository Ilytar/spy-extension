export const STORE_NAMES = {
  VERIFICATION_RESULTS_BY_AUTHOR_STORE: "VERIFICATION_RESULTS_BY_AUTHOR",
  AUTHORS_DATA_STORE: "AUTHORS_DATA",
} as const;

export type StoreKeys = (typeof STORE_NAMES)[keyof typeof STORE_NAMES];

export class IndexedDB {
  private static INSTANCE: IndexedDB | null = null;

  private DB_NAME = "VERIFICATION_OF_MEASURING_INSTRUMENT" as const;
  private DATABASE_VERSION: number;
  private DATABASE: IDBDatabase | null = null;

  private openRequest!: IDBOpenDBRequest;
  public onSuccessOpened: (() => void) | null = null;

  private keyPath = "authorName" as const;

  private constructor(version: number) {
    this.DATABASE_VERSION = version;
    this.openRequest = indexedDB.open(this.DB_NAME, this.DATABASE_VERSION);
    this.openRequest.onupgradeneeded = this.handleUpgradeNeeded;
    this.openRequest.onsuccess = this.handleSuccessOpened;
  }

  public static getInstance(version = 1): IndexedDB {
    if (!this.INSTANCE) {
      this.INSTANCE = new IndexedDB(version);
    }
    return this.INSTANCE;
  }

  private handleUpgradeNeeded = () => {
    const database = this.openRequest.result;

    for (const storeName of Object.values(STORE_NAMES)) {
      this.checkObjectStore(database, storeName);
    }

    this.DATABASE = database;
  };

  private checkObjectStore(database: IDBDatabase, objectStoreName: string) {
    if (!database.objectStoreNames.contains(objectStoreName)) {
      database.createObjectStore(objectStoreName, { keyPath: this.keyPath });
    }
  }

  private handleSuccessOpened = () => {
    const database = this.openRequest.result;
    this.DATABASE = database;
    this.onSuccessOpened?.();
  };

  private getStore(storeName: StoreKeys) {
    if (!this.DATABASE) {
      return;
    }

    const transaction = this.DATABASE.transaction(storeName, "readwrite");

    return transaction.objectStore(storeName);
  }

  private executeStoreMethod<R>(
    storeName: StoreKeys,
    method: (store: IDBObjectStore) => IDBRequest<R>
  ): Promise<R | undefined> {
    return new Promise((resolve) => {
      const store = this.getStore(storeName);

      if (!store) {
        console.error("Store not found");
        resolve(undefined);
        return;
      }

      const request = method(store);

      request.onsuccess = (event) => {
        const target = event.target as IDBRequest<R>;
        resolve(target.result);
      };

      request.onerror = () => {
        console.error("Request failed");
        resolve(undefined);
      };
    });
  }

  // === Доступные методы для работы с IDBObjectStore ===

  public putDataInStore<T>(
    storeName: StoreKeys,
    data: T
  ): Promise<IDBValidKey | undefined> {
    return this.executeStoreMethod(storeName, (store) => store.put(data));
  }

  public getAllDataInfoFromStore<T>(
    storeName: StoreKeys
  ): Promise<T[] | undefined> {
    return this.executeStoreMethod(storeName, (store) => store.getAll());
  }

  public getDataFromStoreByKey<T>(
    storeName: StoreKeys,
    key: IDBValidKey | IDBKeyRange
  ): Promise<T | undefined> {
    return this.executeStoreMethod(storeName, (store) => store.get(key));
  }

  public async getAllKeysOfStore(
    storeName: StoreKeys,
    key?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ): Promise<IDBValidKey[] | undefined> {
    return this.executeStoreMethod(storeName, (store) =>
      store.getAllKeys(key, count)
    );
  }

  public clearStore(storeName: StoreKeys): Promise<void | undefined> {
    return this.executeStoreMethod(storeName, (store) => store.clear());
  }

  public deleteDataByKey(
    storeName: StoreKeys,
    key: IDBValidKey | IDBKeyRange
  ): Promise<void | undefined> {
    return this.executeStoreMethod(storeName, (store) => store.delete(key));
  }
}

export const database = IndexedDB.getInstance();
