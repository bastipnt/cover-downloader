import { Track } from "../types";
import { Command } from "@tauri-apps/plugin-shell";
// import { downloadCoverArt } from "../util/downloadImage";

const useUpdateTrackLocally = () => {
  const downloadTrackInfo = async (track: Track): Promise<Track> => {
    // const coverArtPath = await downloadCoverArt(track);
    return {
      ...track,
      updatedTrackInfo: {
        ...track.updatedTrackInfo,
        // coverArtPath,
      },
    } as Track;
  };

  const escape = (str: string) => {
    // return str.replaceAll(" ", "\\ ");
    return `'${str}'`;
  };

  const updateTrackLocally = async (track: Track) => {
    const { fileName, folder, updatedTrackInfo } = track;
    if (!updatedTrackInfo) return;

    const { coverArtPath, artists, album, title } = updatedTrackInfo;

    const inputPath = escape(`${folder}/${fileName}`);
    const outputPath = escape(`${folder}/outputs/${fileName}`);

    let command = `ffmpeg -hide_banner -loglevel error -y -i ${inputPath}`;

    // Cover Art
    if (coverArtPath) command += ` -i ${coverArtPath} -c copy -map 0 -map 1`;
    else command += ` -c copy -map 0`;

    // Metadata
    if (title) command += ` -metadata title=${escape(title)}`;
    if (album) command += ` -metadata album=${escape(album)}`;
    if (artists && artists.length > 0) command += ` -metadata artist=${escape(artists.join(", "))}`;

    command += ` ${outputPath}`;

    let res = await Command.create("exec-sh", ["-c", command]).execute();
    return res;
  };

  return { downloadTrackInfo, updateTrackLocally };
};

export default useUpdateTrackLocally;
