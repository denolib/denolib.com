import { IncomingMessage, ServerResponse } from "http";
import axios from "axios";
import * as qs from "querystring";
import * as url from "url";

/**
 * Group 1: scope
 * Group 2: repo
 * Group 3: @
 * Group 4: branch
 * Group 5: rest
 */
export const MATCHER = /^\/([^\/]+)\/([^\/@]+)(@)?([^\/]*)(.*)/;

export default (req: IncomingMessage, resp: ServerResponse) => {
  try {
    if (req.url.startsWith("/badge")) {
      const query = url.parse(req.url).query;
      const { scope, repo, style } = qs.parse(query);
      if (!scope || !repo) {
        throw new InvalidUrlException();
      }
      const styleParameter = style ? `&style=${style}` : '';
      resp.statusCode = 301;
      resp.setHeader(
        "Location",
        `https://img.shields.io/badge/dynamic/json.svg?label=DenoLib&query=$.name${styleParameter}&url=https://raw.githubusercontent.com/${scope}/${repo}/master/denolib.json`
      );
      resp.end();
    }

    if (req.url === "/") {
      resp.statusCode = 301;
      resp.setHeader("Location", "https://github.com/denolib/denolib.com");
      resp.end();
    }
    if (!MATCHER.test(req.url)) {
      throw new InvalidUrlException();
    }
    const [, scope, repo, versionSpecified, branch, rest] = MATCHER.exec(
      req.url
    );
    if (!scope || !repo) {
      throw new InvalidUrlException();
    }
    axios
      .get(
        `https://raw.githubusercontent.com/${scope}/${repo}/${
          versionSpecified ? branch : "master"
        }${rest}`
      )
      .then(body => {
        resp.setHeader("Content-Type", "text/plain");
        resp.statusCode = 200;
        resp.end(body.data);
      })
      .catch(err => {
        resp.statusCode = 404;
        resp.end("Not Found");
        if (rest.endsWith(".js")) {
          // TODO: https://github.com/denoland/registry/issues/39
        }
      });
  } catch (err) {
    resp.statusCode = err.status;
    resp.end(err.message);
  }
};

class InvalidUrlException extends Error {
  message = "Invalid URL";
  status = 500;
}
