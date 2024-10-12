import { beforeEach, expect, test } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import {
  mockOnDragDropEvent,
  dispatchDragDropEvent,
} from "../tests/mocks/onDragDropEventMock";
import App from "./App";
import DragDropEventProvider from "./providers/dragDropEventProvider";
import TracksProvider from "./providers/tracksProvider";
import { TauriEvent } from "@tauri-apps/api/event";
import { MockTrack } from "../tests/mocks/mock-types";

const tracks: MockTrack[] = [
  {
    path: "/songs/track1.mp3",
    title: "track1",
    album: "album1",
    artists: ["artist1a", "artist1b"],
  },
  {
    path: "/songs/track2.mp3",
    title: "track2",
    album: "album2",
    artists: ["artist2a", "artist2b"],
  },
  {
    path: "/songs/track3.mp3",
    title: "track3",
    album: "album3",
    artists: ["artist3a", "artist3b"],
  },
];

beforeEach(() => {
  mockOnDragDropEvent(tracks);

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
    expect(within(listItems[i]).getByText(track.title));
    expect(within(listItems[i]).getByText(track.album));
    expect(within(listItems[i]).getByText(track.artists.join(", ")));
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
