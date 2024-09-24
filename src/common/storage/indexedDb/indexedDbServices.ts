import { Author, VerificationResultsByAuthor } from "../types/db";
import { STORE_NAMES } from "./indexedDb.class";
import { IndexedDbObjectStoreService } from "./indexedDbObjectStoreService.class";

class AuthorService extends IndexedDbObjectStoreService<Author> {
  constructor() {
    super(STORE_NAMES.AUTHORS_DATA_STORE);
  }
}

export const authorService = new AuthorService();

class VerificationResultsByAuthorService extends IndexedDbObjectStoreService<VerificationResultsByAuthor> {
  constructor() {
    super(STORE_NAMES.VERIFICATION_RESULTS_BY_AUTHOR_STORE);
  }
}

export const verificationResultsService =
  new VerificationResultsByAuthorService();
