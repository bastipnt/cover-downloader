import { vi } from "vitest";
import {
  AreaIncludes,
  IArtistCredit,
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
          id: crypto.randomUUID(),
          title: onlineTrack.album || "",
        } as IRelease;

        const recording: IRecordingMatch = {
          id: crypto.randomUUID(),
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

    return { MusicBrainzApi };
  });
};

export const mockMusicBrainzApiTracks = (onlineTracks: MockOnlineTrack[]) => {
  mockOnlineTracks = onlineTracks;
};
