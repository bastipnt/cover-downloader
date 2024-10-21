import { vi } from "vitest";

const responseOn = (type: string, callbackFn: (chunk?: string) => {}) => {
  if (type === "data") callbackFn("chunk-string");
  else if (type === "end") callbackFn();
  return { on: vi.fn(responseOn) };
};

const response = {
  headers: {
    "content-length": 1000,
    "content-type": "image",
  },
  statusCode: "200",
  setEncoding: () => {},
  on: vi.fn(responseOn),
};

const requestEnd = () => {};
const requestOn = (
  type: string,
  callbackFn: (res?: typeof response) => void
) => {
  if (type === "response") callbackFn(response);
  return { on: vi.fn(requestOn), end: vi.fn(requestEnd) };
};

export const mockFollowRedirects = () => {
  vi.mock("follow-redirects", () => {
    const on = vi.fn(requestOn);

    const httpFunction = {
      request: vi.fn(() => {
        return { on };
      }),
    };

    const http = httpFunction;

    const https = httpFunction;

    return { http, https };
  });
};
