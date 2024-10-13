// import { CoverArtArchiveApi, MusicBrainzApi } from "musicbrainz-api";
import { parseBuffer } from "music-metadata";
import { TrackInfo, UpdatedTrackInfo } from "../types";
import { readFile } from "@tauri-apps/plugin-fs";
import { CoverArtArchiveApi, MusicBrainzApi } from "musicbrainz-api";

const mbApi = new MusicBrainzApi({
  appName: "my-app",
  appVersion: "0.1.0",
  appContactInfo: "user@mail.org",
});

const coverArtArchiveApiClient = new CoverArtArchiveApi();

const getArtists = (artists?: string[]) =>
  (artists || [])
    .reduce((artists: string[], curr) => [...artists, ...curr.split(",")], [])
    .map((artist) => artist.trim())
    .filter((artist, index, artists) => artists.indexOf(artist) === index);

const useMusicbrainzApi = () => {
  const analyzeTrack = async (trackPath: string): Promise<TrackInfo> => {
    const track = await readFile(trackPath);
    const metadata = await parseBuffer(track);
    const { artists, picture: picturesData, title, album } = metadata.common;

    let picture: string | undefined = undefined;

    if (picturesData && picturesData.length > 0) {
      picture = URL.createObjectURL(
        new Blob([picturesData[0].data], { type: "image/png" })
      );
    }

    return {
      artists: getArtists(artists),
      album,
      picture,
      title,
    };
  };

  const getOnlineTrackInfo = async (
    trackInfo: TrackInfo
  ): Promise<UpdatedTrackInfo | undefined> => {
    const { title, artists } = trackInfo;

    const query = {
      title,
      artist: artists.join(" & "),
    };

    // @ts-ignore
    const recordingList = await mbApi.search("recording", {
      query,
      limit: 1,
    });

    if (
      !recordingList ||
      !recordingList.count ||
      recordingList.recordings.length === 0
    )
      return;

    const recording = recordingList.recordings[0];

    if (!recording.releases || recording.releases.length === 0) return;

    const release = recording.releases[0];

    const album = release.title;
    const updatedTitle = recording.title;
    let updatedArtists: string[];

    if (recording["artist-credit"] && recording["artist-credit"].length > 0) {
      updatedArtists = recording["artist-credit"].map(
        ({ artist: { name } }) => name
      );
    } else {
      updatedArtists = artists;
    }

    let coverArtUri;

    const coverInfo = await coverArtArchiveApiClient.getReleaseCovers(
      release.id
    );

    if (coverInfo && coverInfo.images.length > 0) {
      const frontImage = coverInfo.images.find(({ front }) => front);
      if (frontImage) coverArtUri = frontImage.thumbnails[500];
      else coverArtUri = coverInfo.images[0].thumbnails[500];
    }

    return {
      artists: updatedArtists,
      album,
      title: updatedTitle,
      coverArtUri,
    };
  };

  return { analyzeTrack, getOnlineTrackInfo };
};

export default useMusicbrainzApi;
