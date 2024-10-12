import { join } from "node:path";
import type { TrackInfo } from "./src/types.js";

export const addCoverArt = async (
  inputFolder: string,
  fileName: string,
  coverArt: string
) => {
  const command = [
    "ffmpeg",
    "-i",
    join(inputFolder, fileName),
    "-i",
    coverArt,
    "-c",
    "copy",
    "-map",
    "0",
    "-map",
    "1",
    join(inputFolder, "outputs", fileName),
  ];

  const proc = Bun.spawn(command);

  await proc.exited;
};

export const updateTrackInfo = async (trackInfo: TrackInfo) => {
  const {
    fileName,
    folder,
    coverArtPath,
    metadata: { artists, album },
  } = trackInfo;

  if (coverArtPath) {
    const command = [
      "ffmpeg",
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      join(folder, fileName),
      "-i",
      coverArtPath,
      "-c",
      "copy",
      "-map",
      "0",
      "-map",
      "1",
      "-metadata",
      `artist=${artists?.join(", ")}`,
      "-metadata",
      `album=${album}`,
      join(folder, "outputs", fileName),
    ];

    const proc = Bun.spawn(command);

    await proc.exited;
  }
};
