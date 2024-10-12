import type { IPicture } from "music-metadata";

export type TrackInfo = {
  artists: string[];
  album?: string;
  title?: string;
  picture?: IPicture[];
};

export type UpdatedTrackInfo = TrackInfo & {
  coverArtUri?: string;
  coverArtPath?: string;
};

export type Track = {
  id: string;
  fileName: string;
  folder: string;
  trackInfo: TrackInfo;
  updatedTrackInfo?: UpdatedTrackInfo;
};
