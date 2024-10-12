import { LogicalPosition } from "@tauri-apps/api/dpi";
import { Event, UnlistenFn } from "@tauri-apps/api/event";
import { DragDropEvent } from "@tauri-apps/api/webviewWindow";
import { vi } from "vitest";

declare global {
  const dragDropCallbackFns: ((e: Event<DragDropEvent>) => void)[];
}

const event: Event<DragDropEvent> = {
  id: 2,
  event: "tauri://drag-drop",
  payload: {
    paths: ["mock-path/track.mp3"],
    position: {
      type: "physical",
      x: 0,
      y: 0,
      toLogical: () => ({} as LogicalPosition),
    },
    type: "drop",
  },
};

export const mockOnDragDropEvent = async () => {
  vi.mock("@tauri-apps/api/webview", () => {
    vi.stubGlobal("dragDropCallbackFns", []);

    const onDragDropEvent = async (
      callbackFn: (e: Event<DragDropEvent>) => void
    ): Promise<UnlistenFn> => {
      dragDropCallbackFns.push(callbackFn);
      return () => {};
    };

    const getCurrentWebview = () => ({
      onDragDropEvent,
      dragDropCallbackFns,
    });
    return { getCurrentWebview };
  });
};

export const dispatchDragDropEvent = () => {
  dragDropCallbackFns.forEach((fn) => fn(event));
};
