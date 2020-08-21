import Crocket from "crocket";

const debug = require("debug")("electron-webpack:dev-runner");

export class HmrServer {
  constructor() {
    this.state = false;
    this.ipc = new Crocket();
  }

  listen() {
    return new Promise((resolve, reject) => {
      const socketPath = `/tmp/electron-main-ipc-${process.pid.toString(16)}.sock`;
      this.ipc.listen({
        path: socketPath
      }, error => {
        if (error != null) {
          reject(error);
        }

        if (debug.enabled) {
          debug(`HMR Server listening on ${socketPath}`);
        }

        resolve(socketPath);
      });
    });
  }

  beforeCompile() {
    this.state = false;
  }

  built(stats) {
    this.state = true;
    setImmediate(() => {
      if (!this.state) {
        return;
      }

      const hash = stats.toJson({
        assets: false,
        chunks: false,
        children: false,
        modules: false
      }).hash;

      if (debug.enabled) {
        debug(`Send built: hash ${hash}`);
      }

      this.ipc.emit("/built", {
        hash
      });
    });
  }

} 
// __ts-babel@6.0.4
//# sourceMappingURL=HmrServer.js.map