import chalk from "chalk";
import * as path from "path";
import { createConfigurator } from "../main";
import { statOrNull } from "../util";
import { ChildProcessManager, PromiseNotifier, run } from "./ChildProcessManager";
import { logError, logProcess, logProcessErrorOutput } from "./devUtil";

const debug = require("debug")("electron-webpack");

function runWds(projectDir, env) {
  const isWin = process.platform === "win32";

  const webpackDevServerPath = require.resolve(path.join(".bin", "webpack-dev-server" + (isWin ? ".cmd" : "")));

  debug(`Start renderer WDS ${webpackDevServerPath} on ${env.ELECTRON_WEBPACK_WDS_PORT} port`);
  return run(webpackDevServerPath, ["--color", "--env.autoClean=false", "--config", path.join(__dirname, "../../webpack.renderer.config.js")], {
    env,
    cwd: projectDir
  });
} // 1. in another process to speedup compilation
// 2. some loaders detect webpack-dev-server hot mode only if run as CLI


export async function startRenderer(projectDir, env) {
  const webpackConfigurator = await createConfigurator("renderer", {
    production: false,
    configuration: {
      projectDir
    }
  });
  const sourceDir = webpackConfigurator.sourceDir; // explicitly set to null - do not handle at all and do not show info message

  if (sourceDir === null) {
    return;
  }

  const dirStat = await statOrNull(sourceDir);

  if (dirStat == null || !dirStat.isDirectory()) {
    logProcess("Renderer", `No renderer source directory (${path.relative(projectDir, sourceDir)})`, chalk.blue);
    return;
  }

  if (webpackConfigurator.hasDependency("electron-next")) {
    debug(`Renderer WDS is not started - there is electron-next dependency`);
    return;
  }

  const lineFilter = new CompoundRendererLineFilter([new OneTimeLineFilter("Project is running at "), new OneTimeLineFilter("webpack output is served from ")]);
  return await new Promise((resolve, reject) => {
    let devServerProcess;

    try {
      devServerProcess = runWds(projectDir, env);
    } catch (e) {
      reject(e);
      return;
    } //tslint:disable-next-line:no-unused-expression


    new ChildProcessManager(devServerProcess, "Renderer WDS", new PromiseNotifier(resolve, reject));
    devServerProcess.on("error", error => {
      if (reject == null) {
        logError("Renderer", error);
      } else {
        reject(error);
        reject = null;
      }
    });
    devServerProcess.stdout.on("data", data => {
      logProcess("Renderer", data, chalk.blue, lineFilter);
      const r = resolve; // we must resolve only after compilation, otherwise devtools disconnected

      if (r != null && (data.includes(": Compiled successfully.") || data.includes(": Compiled with warnings."))) {
        resolve = null;
        r();
      }
    });
    logProcessErrorOutput("Renderer", devServerProcess);
  });
}

class OneTimeLineFilter {
  constructor(prefix) {
    this.prefix = prefix;
    this.filtered = false;
  }

  filter(line) {
    if (!this.filtered && line.startsWith(this.prefix)) {
      this.filtered = true;
      return false;
    }

    return true;
  }

}

class CompoundRendererLineFilter {
  constructor(filters) {
    this.filters = filters;
  }

  filter(line) {
    return !this.filters.some(it => !it.filter(line));
  }

} 
// __ts-babel@6.0.4
//# sourceMappingURL=WebpackDevServerManager.js.map