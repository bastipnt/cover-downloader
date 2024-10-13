import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { clearMocks, mockWindows } from "@tauri-apps/api/mocks";
import { mockMusicMetadata } from "./mocks/musicMetadataMock";
import { mockMusicBrainzApi } from "./mocks/musicBrainzApiMock";

beforeEach(() => {
  mockWindows("main");
  mockMusicMetadata();
  mockMusicBrainzApi();

  vi.stubGlobal("URL", {
    createObjectURL: vi.fn().mockReturnValue("mock-url"),
    revokeObjectURL: vi.fn(),
    toString: () => "URL",
    valueOf: () => "URL",
  });
});

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  clearMocks();
});
