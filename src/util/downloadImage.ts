import { http, https } from "follow-redirects";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Track } from "../types";

const maxLength = 10; // 10mb

const download = (uri: string, path: string) =>
  new Promise((resolve, reject) => {
    const httpFunction = uri.split(":")[0] === "https" ? https : http;

    httpFunction
      .request(uri)
      .on("response", (res) => {
        if (!res) reject(new Error("Something went wrong"));
        if (
          res.headers["content-length"] &&
          Number(res.headers["content-length"]) > maxLength * 1024 * 1024
        ) {
          reject(new Error("Image too large."));
        } else if (!~[200, 304].indexOf(Number(res.statusCode))) {
          reject(new Error("Received an invalid status code."));
        } else if (
          !res.headers["content-type"] ||
          !res.headers["content-type"].match(/image/)
        ) {
          reject(new Error("Not an image."));
        } else {
          let body = "";
          res.setEncoding("binary");
          res
            .on("error", function (err) {
              reject(err);
            })
            .on("data", function (chunk) {
              body += chunk;
            })
            .on("end", async () => {
              await writeFile(path, body, "binary");
              resolve(null);
            });
        }
      })
      .on("error", function (err) {
        reject(err);
      })
      .end();
  });

export const downloadCoverArt = async (
  track: Track
): Promise<string | undefined> => {
  if (!track.updatedTrackInfo?.coverArtUri) return;

  const { album, title } = track.trackInfo;
  const filename = (album || title || "cover").replaceAll(" ", "-") + ".jpg";
  const { coverArtUri } = track.updatedTrackInfo;

  const destination = resolve("./cover-art", filename);
  await download(coverArtUri, destination);
  return destination;
};
