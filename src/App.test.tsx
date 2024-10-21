import { beforeEach, expect, test } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import {
  mockOnDragDropEvent,
  dispatchDragDropEvent,
} from "../tests/mocks/onDragDropEventMock";
import App from "./App";
import DragDropEventProvider from "./providers/dragDropEventProvider";
import TracksProvider from "./providers/tracksProvider";
import { TauriEvent } from "@tauri-apps/api/event";
import { MockOnlineTrack, MockTrack } from "../tests/mocks/mock-types";
import { mockMusicBrainzApiTracks } from "../tests/mocks/musicBrainzApiMock";
import { TrackState } from "./types.d";

const tracks: MockTrack[] = [
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

const onlineTracks: MockOnlineTrack[] = [
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

beforeEach(() => {
  mockOnDragDropEvent(tracks);
  mockMusicBrainzApiTracks(onlineTracks);

  act(() => {
    render(
      <DragDropEventProvider>
        <TracksProvider>
          <App />
        </TracksProvider>
      </DragDropEventProvider>
    );
  });
});

test("lists added tracks", async () => {
  // screen.debug();

  expect(screen.queryAllByRole("list").length).toBe(0);
  expect(screen.queryAllByRole("listitem").length).toBe(0);

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP);
  });

  await screen.findByRole("list");

  expect(screen.queryAllByRole("listitem").length).toBe(3);

  const listItems = screen.getAllByRole("listitem");

  tracks.forEach((track, i) => {
    expect(
      within(listItems[i]).queryAllByAltText(`cover picture - ${track.title}`)
        .length
    ).toBe(track.picture ? 1 : 0);
    expect(within(listItems[i]).getByText(track.title));
    if (track.album) expect(within(listItems[i]).getByText(track.album));
    expect(within(listItems[i]).getByText(track.artists.join(", ")));
  });
});

test("lists updated track information", async () => {
  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP);
  });

  await screen.findByRole("list");

  act(() => {
    fireEvent.click(screen.getByText("Get online info"));
  });

  const listItems = screen.getAllByRole("listitem");

  if (!onlineTracks[1].album) throw new Error("Test setup is wrong");
  expect(await within(listItems[1]).findByText(onlineTracks[1].album));

  if (!onlineTracks[2].album) throw new Error("Test setup is wrong");
  expect(await within(listItems[2]).findByText(onlineTracks[2].album));

  expect(
    within(listItems[0]).getByAltText(
      `cover picture - ${onlineTracks[0].title}`
    )
  );
  expect(
    within(listItems[1]).getByAltText(
      `cover picture - ${onlineTracks[1].title}`
    )
  );
  expect(
    within(listItems[2]).queryAllByAltText(
      `cover picture - ${onlineTracks[2].title}`
    ).length
  ).toBe(0);

  tracks.forEach((_, i) => {
    const onlineTrack = onlineTracks[i];

    expect(within(listItems[i]).getByText(onlineTrack.title));
    if (onlineTrack.album)
      expect(within(listItems[i]).getByText(onlineTrack.album));
    expect(within(listItems[i]).getByText(onlineTrack.artists.join(", ")));
  });
});

test("shows drag overlay on dragEnter", () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_ENTER);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");
});

test("shows drag overlay on dragOver", () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_OVER);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");
});

test("hides drag overlay on dragLeave", () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_ENTER);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_LEAVE);
  });

  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");
});

test("hides drag overlay on dragDrop", async () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_ENTER);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP);
  });

  // already hides before analyzing tracks
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  await screen.findByRole("list");

  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");
});

test("shows update finished indicator after updating", async () => {
  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP);
  });

  await screen.findByRole("list");

  act(() => {
    fireEvent.click(screen.getByText("Get online info"));
  });

  const album = onlineTracks[1].album;
  if (!album) throw new Error("Something went wrong in the test setup");

  await screen.findByText(album);

  act(() => {
    fireEvent.click(screen.getByText("Update Track"));
  });

  await screen.findByTestId(TrackState.FINISHED);
});
