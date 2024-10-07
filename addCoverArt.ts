import { join } from "node:path";

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
