import { vi } from "vitest";

export const mockFs = () => {
  vi.mock("node:fs/promises", () => {
    const writeFile = vi.fn();

    return { writeFile, default: { writeFile } };
  });
};
