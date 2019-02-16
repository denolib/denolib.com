import { IncomingMessage, ServerResponse } from "http";
import axios from "axios";

/**
 * Group 1: scope
 * Group 2: repo
 * Group 3: @
 * Group 4: rest
 * Group 5: expension
 */
const MATCHER = /^\/([^\/]+)\/([^\/@]+)(@)?([^\.]*)\.(.*)/;

export default (req: IncomingMessage, resp: ServerResponse) => {
  try {
    if (req.url === "/") {
      resp.statusCode = 301;
      resp.setHeader("Location", "https://github.com/denolib/denolib.com");
      resp.end();
    }
    if (!MATCHER.test(req.url)) {
      throw new InvalidUrlException();
    }
    const [, scope, repo, versionSpecified, rest, expension] = MATCHER.exec(
      req.url
    );
    if (!scope || !repo) {
      throw new InvalidUrlException();
    }
    axios
      .get(
        `https://raw.githubusercontent.com/${scope}/${repo}/${
          versionSpecified ? "" : "master"
        }${rest}.${expension}`
      )
      .then(body => {
        resp.setHeader("Content-Type", "text/plain");
        resp.statusCode = 200;
        resp.end(body.data);
      })
      .catch(err => {
        if (expension === "js") {
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
