// import { CoverArtArchiveApi, MusicBrainzApi } from "musicbrainz-api";
import { parseBuffer } from "music-metadata";
import { TrackInfo } from "../types";
import { readFile } from "@tauri-apps/plugin-fs";

// const mbApi = new MusicBrainzApi({
//   appName: "my-app",
//   appVersion: "0.1.0",
//   appContactInfo: "user@mail.org",
// });

// const coverArtArchiveApiClient = new CoverArtArchiveApi();

const useMusicbrainzApi = () => {
  const analyzeTrack = async (trackPath: string): Promise<TrackInfo> => {
    const track = await readFile(trackPath);
    const metadata = await parseBuffer(track);
    const { artists, picture, title, album } = metadata.common;

    // const fileName = trackPath.split("/").pop() || "";
    // const folder = trackPath.match(/^(.+)(?:\/)/)?.[1] || "";

    return {
      artists: artists || [],
      album,
      picture,
      title,
    };
  };

  return { analyzeTrack };
};

export default useMusicbrainzApi;
