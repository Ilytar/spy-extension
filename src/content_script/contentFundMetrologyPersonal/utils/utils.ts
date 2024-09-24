import { QueryParams } from "@common/storage/types/query";

export function createQueryParams(params: QueryParams): string {
  const queryParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(String(value));
      return `${encodedKey}=${encodedValue}`;
    })
    .join("&");
  return queryParams ? `?${queryParams}` : "";
}
