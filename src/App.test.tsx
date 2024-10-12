import { beforeEach, expect, test } from "vitest";
import { act, render, screen } from "@testing-library/react";
import {
  mockOnDragDropEvent,
  dispatchDragDropEvent,
} from "../tests/mocks/onDragDropEventMock";
import App from "./App";
import DragDropEventProvider from "./providers/dragDropEventProvider";
import TracksProvider from "./providers/tracksProvider";

beforeEach(() => {
  mockOnDragDropEvent();
});

test("lists added tracks", async () => {
  act(() => {
    render(
      <DragDropEventProvider>
        <TracksProvider>
          <App />
        </TracksProvider>
      </DragDropEventProvider>
    );
  });

  // screen.debug();

  expect(await screen.queryAllByRole("list").length).toBe(0);

  act(() => {
    dispatchDragDropEvent();
  });

  await screen.findByRole("list");

  expect(await screen.queryAllByRole("list").length).toBe(1);
  expect(screen.getByText(/track.mp3/));
});
