import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { clearMocks, mockWindows } from "@tauri-apps/api/mocks";

beforeEach(() => {
  mockWindows("main");
  // Object.defineProperty(window, "__TAURI_INTERNALS__", {
  //   value: {
  //     metadata: {
  //       currentWebview: {
  //         label: "Hello",
  //       },
  //     },
  //   },
  // });
});

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  clearMocks();
});
