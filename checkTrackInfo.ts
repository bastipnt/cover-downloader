import {
  type IRecording,
  MusicBrainzApi,
  CoverArtArchiveApi,
  type ICoverInfo,
} from "musicbrainz-api";
import type { TrackInfo } from "./types.js";
import { parseFile } from "music-metadata";

const mbApi = new MusicBrainzApi({
  appName: "my-app",
  appVersion: "0.1.0",
  appContactInfo: "user@mail.org",
});

const coverArtArchiveApiClient = new CoverArtArchiveApi();

const getTrackInfo = async (trackPath: string): Promise<TrackInfo> => {
  const metadata = await parseFile(trackPath);
  const { artist, artists, picture, title, album } = metadata.common;

  const fileName = trackPath.split("/").pop() || "";
  const folder = trackPath.match(/^(.+)(?:\/)/)?.[1] || "";

  return {
    fileName,
    folder,
    metadata: { artist, artists, picture, title, album },
  };
};

const getArtists = (trackInfo: TrackInfo) =>
  [trackInfo.metadata.artist || "", ...(trackInfo.metadata.artists || [])]
    .reduce((artists: string[], curr) => [...artists, ...curr.split(",")], [])
    .map((artist) => artist.trim())
    .filter((artist, index, artists) => artists.indexOf(artist) === index);

const getCoverArtUri = async (
  onlineTrackInfo: IRecording
): Promise<string | undefined> => {
  const releases = onlineTrackInfo.releases;
  if (!releases || releases.length === 0) return;
  const release = releases[0];

  console.log("lol1", releases.length, release.id);

  let coverInfo: ICoverInfo | undefined;

  try {
    coverInfo = await coverArtArchiveApiClient.getReleaseCovers(release.id);
  } catch (error) {
    console.log("Error downloading cover art", error);
  }

  if (!coverInfo || coverInfo.images.length === 0) return;

  const frontImage = coverInfo.images.find(({ front }) => front);
  if (frontImage) return frontImage.thumbnails[500];

  return coverInfo.images[0].thumbnails[500];
};

const getOnlineTrackInfo = async (
  trackInfo: TrackInfo
): Promise<IRecording | undefined> => {
  const { title } = trackInfo.metadata;
  const artists = getArtists(trackInfo);

  const recording = await mbApi.search("recording", {
    query: {
      title,
      artist: artists.join(" & "),
    },
    limit: 1,
  });

  if (!recording || !recording.count) {
    return;
  }

  return recording.recordings[0];
};

const mergeTrackInfos = async (
  savedTrackInfo: TrackInfo,
  onlineTrackInfo: IRecording
): Promise<TrackInfo> => {
  let artists =
    onlineTrackInfo["artist-credit"]?.map(({ artist }) => artist.name) || [];
  if (artists.length === 0) artists = getArtists(savedTrackInfo);

  const coverArtUri = await getCoverArtUri(onlineTrackInfo);
  const { fileName, folder, metadata } = savedTrackInfo;
  const album = onlineTrackInfo.releases?.[0].title;

  return {
    fileName,
    folder,
    metadata: {
      artist: artists[0],
      artists,
      album,
      title: onlineTrackInfo.title,
      picture: metadata.picture,
    },
    coverArtUri,
  };
};

export const checkTrackInfo = async (trackPath: string): Promise<TrackInfo> => {
  const savedTrackInfo = await getTrackInfo(trackPath);
  const onlineTrackInfo = await getOnlineTrackInfo(savedTrackInfo);

  if (!onlineTrackInfo) return savedTrackInfo;

  const mergedTrackInfo = await mergeTrackInfos(
    savedTrackInfo,
    onlineTrackInfo
  );

  return mergedTrackInfo;
};
