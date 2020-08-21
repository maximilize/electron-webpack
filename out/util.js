import * as BluebirdPromise from "bluebird";
import { stat } from "fs-extra";
import { createServer } from "net";
import * as path from "path";
export async function statOrNull(file) {
  return orNullIfFileNotExist(stat(file));
}
export function orNullIfFileNotExist(promise) {
  return orIfFileNotExist(promise, null);
}
export function orIfFileNotExist(promise, fallbackValue) {
  return promise.catch(e => {
    if (e.code === "ENOENT" || e.code === "ENOTDIR") {
      return fallbackValue;
    }

    throw e;
  });
}
export function getFirstExistingFile(names, rootDir) {
  return BluebirdPromise.filter(names.map(it => rootDir == null ? it : path.join(rootDir, it)), it => statOrNull(it).then(it => it != null)).then(it => it.length > 0 ? it[0] : null);
}
export function getFreePort(defaultHost, defaultPort) {
  return new Promise((resolve, reject) => {
    const server = createServer({
      pauseOnConnect: true
    });
    server.addListener("listening", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });

    function doListen(port) {
      server.listen({
        host: defaultHost,
        port,
        backlog: 1,
        exclusive: true
      });
    }

    server.on("error", e => {
      if (e.code === "EADDRINUSE") {
        server.close(() => doListen(0));
      } else {
        reject(e);
      }
    });
    doListen(defaultPort);
  });
} 
// __ts-babel@6.0.4
//# sourceMappingURL=util.js.map