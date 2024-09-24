import { AuthorName } from "./db";
import { TableStoredData } from "./tableData";
import { User } from "./user";

export const enum STORAGE_KEYS {
  USER_DATA = "USER_DATA",
  AUTHORIZATION_TOKEN = "AUTHORIZATION_TOKEN",
  DATA_ROSACCREDITATION = "DATA_ROSACCREDITATION",
  COUT_DATA_TO_SYNC_ROSACCREDITATION = "COUT_DATA_TO_SYNC_ROSACCREDITATION",
  ACTIVE_AUTHOR = "ACTIVE_AUTHOR",
}

export interface Storage {
  [STORAGE_KEYS.USER_DATA]: User;
  [STORAGE_KEYS.AUTHORIZATION_TOKEN]: string;
  [STORAGE_KEYS.DATA_ROSACCREDITATION]: TableStoredData;
  [STORAGE_KEYS.COUT_DATA_TO_SYNC_ROSACCREDITATION]: number;
  [STORAGE_KEYS.ACTIVE_AUTHOR]: AuthorName | null;
}

export type StorageKeys = keyof Storage;

export type StorageValueByKey<T extends StorageKeys> = Storage[T];

export type StorageValues = Storage[keyof Storage];

export type StorageDataEntry = {
  [K in keyof Storage]: { key: K; value: Storage[K] };
}[keyof Storage];

export type StorageValuesTuple<T extends StorageKeys[]> = {
  [K in keyof T]: StorageValueByKey<T[K]> | undefined;
};
