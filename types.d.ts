import type { IAudioMetadata } from "music-metadata";

export type TrackInfo = {
  fileName: string;
  folder: string;
  metadata: Pick<
    IAudioMetadata["common"],
    "artist" | "artists" | "album" | "title" | "picture"
  >;
  coverArtUri?: string;
  coverArtPath?: string;
};
