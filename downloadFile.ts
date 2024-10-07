import { http, https } from "follow-redirects";
import { writeFile } from "node:fs/promises";

const maxLength = 10; // 10mb

export const download = (uri: string, path: string) =>
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
