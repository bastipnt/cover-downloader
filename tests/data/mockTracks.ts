import { Track, TrackState } from "../../src/types.d";
import { MockOnlineTrack, MockTrack } from "../mocks/mock-types";

export const fullInitialTrack1: Track = {
  id: "track-1",
  fileName: "track1.mp3",
  folder: "/music/newSongs",
  trackInfo: {
    title: "track1",
    artists: ["Artist1a", "Artist1b"],
    album: "Album1",
    picture: "picture1",
  },
  state: TrackState.INITIAL,
};

export const notFullInitialTrack2: Track = {
  id: "track-2",
  fileName: "track2.mp3",
  folder: "/music/newSongs",
  trackInfo: {
    title: "track2",
    artists: ["Artist2a", "Artist2b"],
  },
  state: TrackState.INITIAL,
};

export const fullInitialTrack3: Track = {
  id: "track-3",
  fileName: "track3.mp3",
  folder: "/music/newSongs",
  trackInfo: {
    title: "track3",
    artists: ["Artist3a", "Artist3b"],
    album: "Album3",
    picture: "picture3",
  },
  state: TrackState.INITIAL,
};

export const excludedFullInitialTrack4: Track = {
  id: "track-4",
  fileName: "track4.mp3",
  folder: "/music/newSongs",
  trackInfo: {
    title: "track4",
    artists: ["Artist4a", "Artist4b"],
    album: "Album4",
    picture: "picture4",
  },
  state: TrackState.INITIAL,
};

export const initialMockTracks: Track[] = [
  fullInitialTrack1,
  notFullInitialTrack2,
  fullInitialTrack3,
];

export const tracks: MockTrack[] = [
  {
    path: "/songs/track1.mp3",
    title: "track1",
    album: "album1",
    artists: ["artist1a", "artist1b"],
    picture: true,
  },
  {
    path: "/songs/track2.mp3",
    title: "track2",
    artists: ["artist2a", "artist2b"],
    picture: false,
  },
  {
    path: "/songs/track3.mp3",
    title: "trAcK3",
    artists: ["artist3a", "aRtIst3b"],
    picture: false,
  },
];

export const onlineTracks: MockOnlineTrack[] = [
  {
    title: "track1",
    album: "album1",
    artists: ["artist1a", "artist1b"],
    pictureUrl: "picture-url-1",
  },
  {
    title: "track2",
    album: "album2",
    artists: ["artist2a", "artist2b"],
    pictureUrl: "picture-url-2",
  },
  {
    title: "track3",
    album: "album3",
    artists: ["artist3a", "artist3b"],
  },
];
