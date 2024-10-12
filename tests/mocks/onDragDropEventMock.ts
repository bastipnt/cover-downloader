import { LogicalPosition } from "@tauri-apps/api/dpi";
import { Event, TauriEvent, UnlistenFn } from "@tauri-apps/api/event";
import { DragDropEvent } from "@tauri-apps/api/webviewWindow";
import { vi } from "vitest";

declare global {
  const dragDropCallbackFns: ((e: Event<DragDropEvent>) => void)[];
}

const createEvent = (eventType: TauriEvent): Event<DragDropEvent> => {
  if (eventType === TauriEvent.DRAG_DROP) {
    return {
      id: Object.values(TauriEvent).indexOf(eventType),
      event: eventType,
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
  } else if (eventType === TauriEvent.DRAG_ENTER) {
    return {
      id: Object.values(TauriEvent).indexOf(eventType),
      event: eventType,
      payload: {
        paths: ["mock-path/track.mp3"],
        position: {
          type: "physical",
          x: 0,
          y: 0,
          toLogical: () => ({} as LogicalPosition),
        },
        type: "enter",
      },
    };
  } else if (eventType === TauriEvent.DRAG_OVER) {
    return {
      id: Object.values(TauriEvent).indexOf(eventType),
      event: eventType,
      payload: {
        type: "over",
        position: {
          type: "physical",
          x: 0,
          y: 0,
          toLogical: () => ({} as LogicalPosition),
        },
      },
    };
  } else {
    return {
      id: Object.values(TauriEvent).indexOf(eventType),
      event: eventType,
      payload: {
        type: "leave",
      },
    };
  }
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

export const dispatchDragDropEvent = (eventType: TauriEvent) => {
  dragDropCallbackFns.forEach((fn) => fn(createEvent(eventType)));
};
