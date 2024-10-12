import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { downloadCoverArt } from "./downloadFile.ts";
import { checkTrackInfo } from "./checkTrackInfo.ts";
import { updateTrackInfo } from "./updateTrackInfo.ts";

const ONLY_ONE = false;
const MUSIC_FOLDER = "/<folder>";

const listFiles = async (): Promise<string[]> => {
  const files = await readdir(MUSIC_FOLDER);

  return files
    .filter((fileName) => fileName !== ".DS_Store")
    .map((fileName) => join(MUSIC_FOLDER, fileName));
};

(async () => {
  const filePaths = await listFiles();

  for (const filePath of filePaths) {
    console.log("Processing: ", filePath);

    const newTrackInfo = await checkTrackInfo(filePath);
    console.log(newTrackInfo);

    const coverArtPath = await downloadCoverArt(newTrackInfo);
    newTrackInfo.coverArtPath = coverArtPath;

    await updateTrackInfo(newTrackInfo);

    if (ONLY_ONE) break;
  }

  console.log("finished");
})();
