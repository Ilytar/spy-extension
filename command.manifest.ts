import ncp from "ncp";
import { promisify } from "util";
import { BUILD_FOLDER, PUBLIC_FOLDER } from "./files";

const copyAsync = promisify(ncp) as (from: string, to: string) => Promise<void>;

async function copyPublicFolder() {
  try {
    await copyAsync(PUBLIC_FOLDER, BUILD_FOLDER);
    console.log("Манифест и файлы из [public] успешно добавлены в сборку");
  } catch (error) {
    console.error("Ошибка при копировании [public]", error);
    process.exit(1);
  }
}

await copyPublicFolder();
