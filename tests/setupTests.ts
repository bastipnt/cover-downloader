import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { clearMocks } from "@tauri-apps/api/mocks";
import { mockMusicMetadata } from "./mocks/musicMetadataMock";
import { mockMusicBrainzApi } from "./mocks/musicBrainzApiMock";
// import { mockFollowRedirects } from "./mocks/followRedirectsMock";
import { mockFs } from "./mocks/mockFs";
import { mockTauriPluginShell } from "./mocks/mockTauriPluginShell";

beforeEach(() => {
  mockFs();
  mockMusicMetadata();
  mockMusicBrainzApi();
  mockTauriPluginShell();
  // mockFollowRedirects();

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
  vi.clearAllMocks();
});
