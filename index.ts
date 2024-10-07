import { parseFile, type IAudioMetadata } from "music-metadata";
import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  CoverArtArchiveApi,
  MusicBrainzApi,
  type IImage,
  type IRecording,
} from "musicbrainz-api";
import { download } from "./downloadFile.ts";
import { addCoverArt } from "./addCoverArt.ts";

const ONLY_ONE = true;
const MUSIC_FOLDER = "/Users/basti/Music/Downloads/old";

type FileData = {
  fileName: string;
  metadata: Pick<
    IAudioMetadata["common"],
    "artist" | "artists" | "album" | "title" | "picture"
  >;
};

const listFiles = async (): Promise<string[]> => {
  const files = await readdir(MUSIC_FOLDER);

  return files.filter((fileName) => fileName !== ".DS_Store");
};

const analyzeFile = async (fileName: string): Promise<FileData> => {
  const metadata = await parseFile(join(MUSIC_FOLDER, fileName));
  const { artist, artists, picture, title, album } = metadata.common;

  // console.log(
  //   `${title} - ${artist}, Album: ${album}, has cover? ${
  //     picture ? "yes" : "no"
  //   }`
  // );

  return {
    fileName,
    metadata: { artist, artists, picture, title, album },
  };
};

const analyzeFiles = async (fileNames: string[]): Promise<FileData[]> => {
  let count = 0;
  const filesData = [];

  for (const fileName of fileNames) {
    if (ONLY_ONE && count >= 1) break;
    count += 1;
    const fileData = await analyzeFile(fileName);
    filesData.push(fileData);
  }

  console.log(`Analyzed ${count} files, downloading...`);

  return filesData;
};

const browseFile = async (
  mbApi: MusicBrainzApi,
  fileData: FileData
): Promise<IRecording | undefined> => {
  // const artistsRes = await mbApi.search("artist", {
  //   query: fileData.metadata.artist,
  //   limit: 1,
  // });

  const { title, artist } = fileData.metadata;
  const firstArtist = artist?.split(",").at(0);

  // console.log("searching for:", title, artist);

  const recording = await mbApi.search("recording", {
    query: {
      title,
      artist: firstArtist,
      // title: "Oostend, Oostend",
      // artist: "Cos",
    },
    limit: 1,
  });

  if (!recording || !recording.count) {
    // console.log(recording.count);
    return;
  }

  // console.log(fileData.metadata.artist, artistsRes.artists[0].name);
  // console.log(recording.recordings[0]);

  return recording.recordings[0];
};

const getReleaseCoverArt = async (
  coverArtArchiveApiClient: CoverArtArchiveApi,
  releaseMbid: string,
  coverType?: "front" | "back"
): Promise<IImage | undefined> => {
  const coverInfo = await coverArtArchiveApiClient.getReleaseCovers(
    releaseMbid,
    coverType
  );

  if (coverInfo.images.length === 0) return;

  const coverArt = coverInfo.images[0];
  // console.log(coverArt);

  return coverArt;
};

const downloadCoverArt = async (uri: string, album: string): string => {
  // console.log(uri);
  const filename = album.replaceAll(" ", "-") + ".jpg";

  const destination = resolve("./cover-art", filename);
  await download(uri, destination);
  return destination;
};

(async () => {
  const mbApi = new MusicBrainzApi({
    appName: "my-app",
    appVersion: "0.1.0",
    appContactInfo: "user@mail.org",
  });

  const coverArtArchiveApiClient = new CoverArtArchiveApi();
  const filePaths = await listFiles();
  let filesData: FileData[] = [];

  try {
    filesData = await analyzeFiles(filePaths);
  } catch (_error) {
    const error = _error as { message: String };
    console.error("Error parsing metadata:", error.message);
  }

  for (const fileData of filesData) {
    const recording = await browseFile(mbApi, fileData);
    if (!recording || !recording.releases || recording.releases.length === 0)
      continue;

    const release = recording.releases[0];
    const releaseMbid = release.id;
    const album = release.title;
    if (!releaseMbid) continue;
    const coverArt = await getReleaseCoverArt(
      coverArtArchiveApiClient,
      releaseMbid
    );
    if (!coverArt || !coverArt.id) continue;
    const uri = coverArt.thumbnails[250];
    const coverArtPath = await downloadCoverArt(uri, album);
    await addCoverArt(MUSIC_FOLDER, fileData.fileName, coverArtPath);
    // console.log("downloaded art:", coverArt.id);
  }

  // await analyzeFile(filePath3);

  console.log("finished");

  // const metadata = await parseFile(filePath2);

  // // Output the parsed metadata to the console in a readable format
})();
