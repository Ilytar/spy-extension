import { useEffect, useState } from "react";
import { AuthorsSection } from "./Sections/AuthorsSection/AuthorsSection";
import { MetrologyRecordsSection } from "./Sections/VerificationResultsSection/VerificationResultsSection";
import { AuthorName } from "@common/storage/types/db";
import storageLocal from "@common/storage/storageLocal/storageLocal.class";
import { STORAGE_KEYS } from "@common/storage/types/storageLocal";

export const PublishedRecords = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<
    null | undefined | string
  >(null);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    storageLocal.getActiveAuthor().then((authorName) => {
      if (authorName) {
        setSelectedAuthor(authorName);
      } else {
        setSelectedAuthor(null);
      }
      setIsUpdated(true);
    });

    const listener = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes[STORAGE_KEYS.ACTIVE_AUTHOR]) {
        setSelectedAuthor(changes[STORAGE_KEYS.ACTIVE_AUTHOR].newValue);
      }
    };

    chrome.storage.local.onChanged.addListener(listener);

    return () => {
      chrome.storage.local.onChanged.removeListener(listener);
    };
  }, []);

  const handleSelectAuthor = (authorName: AuthorName | null) => {
    setSelectedAuthor(authorName);
    storageLocal.setActiveAuthor(authorName);
  };

  if (!isUpdated) {
    return null;
  }

  return selectedAuthor ? (
    <MetrologyRecordsSection
      authorName={selectedAuthor}
      setActiveAuthor={handleSelectAuthor}
    />
  ) : (
    <AuthorsSection setActiveAuthor={handleSelectAuthor} />
  );
};
