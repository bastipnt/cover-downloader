import { vi } from "vitest";
import { MockTrack } from "./mock-types";

export const mockMusicMetadata = () => {
  vi.mock("@tauri-apps/plugin-fs", () => {
    const readFile = async (trackPath: string): Promise<Uint8Array> => {
      if (!mockTracks || mockTracks.length === 0)
        throw new Error("Mocking tracks went wrong");

      const track = mockTracks.find(({ path }) => path === trackPath);

      return new TextEncoder().encode(JSON.stringify(track));
    };

    return { readFile };
  });

  vi.mock("music-metadata", () => {
    const parseBuffer = async (file: Uint8Array) => {
      const { title, artists, album } = JSON.parse(
        new TextDecoder().decode(file)
      ) as MockTrack;

      return {
        common: {
          artists,
          title,
          album,
        },
      };
    };

    return { parseBuffer };
  });
};
