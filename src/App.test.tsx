import { beforeEach, expect, test } from "vitest";
import { act, render, screen } from "@testing-library/react";
import {
  mockOnDragDropEvent,
  dispatchDragDropEvent,
} from "../tests/mocks/onDragDropEventMock";
import App from "./App";
import DragDropEventProvider from "./providers/dragDropEventProvider";
import TracksProvider from "./providers/tracksProvider";
import { TauriEvent } from "@tauri-apps/api/event";

beforeEach(() => {
  mockOnDragDropEvent();

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

  expect(screen.queryAllByRole("listitem").length).toBe(1);
  expect(screen.getByText(/track.mp3/));
  expect(screen.getByText(/Artist1/));
  expect(screen.getByText(/Artist2/));
  expect(screen.getByText(/Album1/));
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
