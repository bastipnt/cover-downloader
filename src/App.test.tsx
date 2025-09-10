import { beforeEach, expect, test } from "vitest";
import { act, fireEvent, render, screen, within } from "../tests/helpers/test-utils";
import App from "./App";
import { TauriEvent } from "@tauri-apps/api/event";
import { mockMusicBrainzApiTracks } from "../tests/mocks/musicBrainzApiMock";
import { TrackState } from "./types.d";
import { dispatchDragDropEvent } from "../tests/mocks/onDragDropEventMock";
import { onlineTracks, tracks } from "../tests/data/mockTracks";

beforeEach(() => {
  mockMusicBrainzApiTracks(onlineTracks);

  act(() => {
    render(<App />);
  });
});

test("lists added tracks", async () => {
  // screen.debug();

  expect(screen.queryAllByRole("list").length).toBe(0);
  expect(screen.queryAllByRole("listitem").length).toBe(0);

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP, tracks);
  });

  await screen.findByRole("list");

  expect(screen.queryAllByRole("listitem").length).toBe(3);

  const listItems = screen.getAllByRole("listitem");

  tracks.forEach((track, i) => {
    expect(within(listItems[i]).queryAllByAltText(`cover picture - ${track.title}`).length).toBe(1);
    expect(within(listItems[i]).getByText(track.title));
    if (track.album) expect(within(listItems[i]).getByText(track.album));
    expect(within(listItems[i]).getByText(track.artists.join(", ")));
  });
});

test("lists updated track information", async () => {
  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP, tracks);
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

  expect(within(listItems[0]).getByAltText(`cover picture - ${onlineTracks[0].title}`));
  expect(within(listItems[1]).getByAltText(`cover picture - ${onlineTracks[1].title}`));
  expect(
    within(listItems[2]).queryAllByAltText(`cover picture - ${onlineTracks[2].title}`).length
  ).toBe(0);

  tracks.forEach((_, i) => {
    const onlineTrack = onlineTracks[i];

    expect(within(listItems[i]).getByText(onlineTrack.title));
    if (onlineTrack.album) expect(within(listItems[i]).getByText(onlineTrack.album));
    expect(within(listItems[i]).getByText(onlineTrack.artists.join(", ")));
  });
});

test("shows drag overlay on dragEnter", () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_ENTER, tracks);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");
});

test("shows drag overlay on dragOver", () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_OVER, tracks);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");
});

test("hides drag overlay on dragLeave", () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_ENTER, tracks);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_LEAVE, tracks);
  });

  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");
});

test("hides drag overlay on dragDrop", async () => {
  expect(screen.getByTestId("dragArea").classList).toContain("dragArea");
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_ENTER, tracks);
  });

  expect(screen.getByTestId("dragArea").classList).toContain("dragOver");

  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP, tracks);
  });

  // already hides before analyzing tracks
  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");

  await screen.findByRole("list");

  expect(screen.getByTestId("dragArea").classList).not.toContain("dragOver");
});

test("shows update finished indicator after updating", async () => {
  act(() => {
    dispatchDragDropEvent(TauriEvent.DRAG_DROP, tracks);
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
