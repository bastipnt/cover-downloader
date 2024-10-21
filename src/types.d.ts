import type { IPicture } from "music-metadata";

export enum TrackState {
  INITIAL = "initial-state",
  UPDATING = "is-updating",
  UPDATE_FOUND = "update-found",
  UPDATE_NOT_FOUND = "update-not-found",
  DOWNLOADING = "update-downloading",
  FINISHED = "update-finished",
}

export type TrackInfo = {
  artists: string[];
  album?: string;
  title?: string;
  picture?: string;
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
  state: TrackState;
  updatedTrackInfo?: UpdatedTrackInfo;
};
