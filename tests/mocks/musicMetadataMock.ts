import { vi } from "vitest";
import { MockTrack } from "./mock-types";
import { IAudioMetadata, IFormat, IPicture } from "music-metadata";

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
    const parseBuffer = async (file: Uint8Array): Promise<IAudioMetadata> => {
      const { title, artists, album } = JSON.parse(
        new TextDecoder().decode(file)
      ) as MockTrack;

      const picture: IPicture[] = [{ data: new Uint8Array(), format: "" }];

      return {
        common: {
          artists,
          title,
          album,
          picture,
          disk: { no: 1, of: 1 },
          track: { no: 1, of: 3 },
          movementIndex: { no: 2, of: 4 },
        },
        format: {} as IFormat,
        native: {} as IAudioMetadata["native"],
        quality: {} as IAudioMetadata["quality"],
      };
    };

    return { parseBuffer };
  });
};
