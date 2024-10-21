import { vi } from "vitest";

export const mockTauriPluginShell = () => {
  vi.mock("@tauri-apps/plugin-shell", () => {
    class Command {
      static create = vi.fn((_program: string, _args: string[]) => {
        const execute = () => {};
        return { execute };
      });
    }

    return { Command };
  });
};
