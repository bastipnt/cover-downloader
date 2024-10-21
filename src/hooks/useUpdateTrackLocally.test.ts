import { describe, expect, test, vi } from "vitest";
import useUpdateTrackLocally from "./useUpdateTrackLocally";
// import { writeFile } from "node:fs/promises";
import { Track } from "../types";
import { Command } from "@tauri-apps/plugin-shell";
// import { https } from "follow-redirects";

const track = {
  fileName: "tracks/track1.mp3",
  folder: "music",
  trackInfo: {
    album: "album1",
    title: "track1",
  },
  updatedTrackInfo: {
    coverArtUri: "https://example.com/picture.jpeg",
    album: "album-updated1",
    title: "titleee",
    artists: ["Artist1", "Artist2"],
  },
} as Track;

const updatedTrack = {
  ...track,
  updatedTrackInfo: {
    ...track.updatedTrackInfo,
    coverArtPath: `${process.cwd()}/cover-art/album1.jpg`,
  },
} as Track;

// describe("downloadTrackInfo", () => {
//   test("it calls https with the correct uri", async () => {
//     const { downloadTrackInfo } = useUpdateTrackLocally();

//     expect(await downloadTrackInfo(track)).toStrictEqual(updatedTrack);

//     expect(writeFile).toHaveBeenCalledTimes(1);
//     // expect(https.request).toHaveBeenCalledWith(
//     //   track.updatedTrackInfo?.coverArtUri
//     // );
//   });
// });

describe("updateTrack", () => {
  test("it calls the update track function in the backend with the correct values", async () => {
    const { updateTrackLocally } = useUpdateTrackLocally();
    const command = `ffmpeg -hide_banner -loglevel error -y -i 'music/tracks/track1.mp3' -i ${process.cwd()}/cover-art/album1.jpg -c copy -map 0 -map 1 -metadata title='titleee' -metadata album='album-updated1' -metadata artist='Artist1, Artist2' 'music/outputs/tracks/track1.mp3'`;
    await updateTrackLocally(updatedTrack);
    expect(Command.create).toHaveBeenCalledWith("exec-sh", ["-c", command]);
  });
});
