export const PUBLIC_FOLDER = "./public";
export const BUILD_FOLDER = "./dist";

type FilesAliases = Record<string, string>;

export const FILES_ALIASES: FilesAliases = {
  popup: "index.html",
  contentARMmetrolog:
    "src/content_script/contentARMmetrolog/contentARMmetrolog.ts",
  contentFundMetrology:
    "src/content_script/contentFundMetrology/contentFundMetrology.ts",
  contentRosaccreditation:
    "src/content_script/contentRosaccreditation/contentRosaccreditation.ts",
  service: "src/service_worker/service_worker.ts",
  contentFundMetrologyPersonal:
    "src/content_script/contentFundMetrologyPersonal/contentFundMetrologyPersonal.ts",
};

export const ALL_FILES_STRING = Object.values(FILES_ALIASES).join(" ");
