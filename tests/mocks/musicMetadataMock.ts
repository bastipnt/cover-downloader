import { vi } from "vitest";

export const mockMusicMetadata = () => {
  vi.mock("@tauri-apps/plugin-fs", () => {
    const readFile = async (trackPath: string): Promise<Uint8Array> => {
      return new TextEncoder().encode(trackPath);
    };

    return { readFile };
  });

  vi.mock("music-metadata", () => {
    const parseBuffer = async (file: Uint8Array) => ({
      common: {
        artists: ["Artist1", "Artist2"],
        title: new TextDecoder().decode(file),
        album: "Album1",
      },
    });

    return { parseBuffer };
  });
};
