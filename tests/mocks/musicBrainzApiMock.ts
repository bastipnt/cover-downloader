import { vi } from "vitest";
import {
  AreaIncludes,
  IArtistCredit,
  ICoverInfo,
  IImage,
  ILinkedEntitiesArea,
  IRecordingList,
  IRecordingMatch,
  IRelease,
  ISearchQuery,
} from "musicbrainz-api";
import { MockOnlineTrack } from "./mock-types";

export const mockMusicBrainzApi = () => {
  vi.stubGlobal("mockOnlineTracks", []);

  vi.mock("musicbrainz-api", () => {
    const createdDate = new Intl.DateTimeFormat("en-US");

    class MusicBrainzApi {
      async search(
        entity: string,
        query: ISearchQuery<AreaIncludes> & ILinkedEntitiesArea
      ): Promise<IRecordingList | undefined> {
        if (entity !== "recording") return;

        const queryObject = query.query;

        if (!queryObject || typeof queryObject !== "object") return;
        if (!queryObject.title) return;

        const onlineTrack = mockOnlineTracks.find(
          ({ title }) =>
            title.toLowerCase() === queryObject.title.toString().toLowerCase()
        );

        if (!onlineTrack) return;

        const release = {
          id: `${onlineTrack.album}-id`,
          title: onlineTrack.album || "",
        } as IRelease;

        if (onlineTrack.pictureUrl) {
          release["cover-art-archive"] = {
            artwork: true,
            back: false,
            front: true,
            count: 1,
            darkened: false,
          };
        }

        const recording: IRecordingMatch = {
          id: `${onlineTrack.title}-id`,
          disambiguation: "test",
          length: 1,
          score: 0.6,
          title: onlineTrack.title || "",
          video: false,
          releases: [release],
          "artist-credit": onlineTrack.artists.map(
            (artist) =>
              ({
                artist: { name: artist },
              } as IArtistCredit)
          ),
        };

        return {
          "recordings-count": 1,
          recordings: [recording],
          count: 1,
          created: createdDate,
          offset: 0,
        };
      }
    }

    class CoverArtArchiveApi {
      async getReleaseCovers(releaseId: string): Promise<ICoverInfo> {
        const album = releaseId.split("-")[0];
        if (!album)
          return {
            images: [],
            release: releaseId,
          };

        const onlineTrack = mockOnlineTracks.find(
          ({ album: a }) => a === album
        );

        if (!onlineTrack || !onlineTrack.pictureUrl) {
          return {
            images: [],
            release: releaseId,
          };
        }

        return {
          images: [
            {
              front: true,
              thumbnails: {
                "500": onlineTrack.pictureUrl,
              } as IImage["thumbnails"],
            } as IImage,
          ],
          release: releaseId,
        };
      }
    }

    return { MusicBrainzApi, CoverArtArchiveApi };
  });
};

export const mockMusicBrainzApiTracks = (onlineTracks: MockOnlineTrack[]) => {
  mockOnlineTracks = onlineTracks;
};
