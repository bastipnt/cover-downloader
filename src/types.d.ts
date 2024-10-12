export type TrackInfo = {};

export type UpdatedTrackInfo = TrackInfo & {};

export type Track = {
  id: string;
  path: string;
  trackInfo: TrackInfo;
  updatedTrackInfo?: UpdatedTrackInfo;
};
