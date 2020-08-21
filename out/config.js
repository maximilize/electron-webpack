import { readJson } from "fs-extra";
import { Lazy } from "lazy-val";
import * as path from "path";
import { getConfig } from "read-config-file";
import { orNullIfFileNotExist } from "./util";
export function getPackageMetadata(projectDir) {
  return new Lazy(() => orNullIfFileNotExist(readJson(path.join(projectDir, "package.json"))));
}
export function getDefaultRelativeSystemDependentCommonSource() {
  return path.join("src", "common");
}
/**
 * Return configuration with resolved staticSourceDirectory / commonDistDirectory / commonSourceDirectory.
 */

export async function getElectronWebpackConfiguration(context) {
  const result = await getConfig({
    packageKey: "electronWebpack",
    configFilename: "electron-webpack",
    projectDir: context.projectDir,
    packageMetadata: context.packageMetadata
  });
  const configuration = result == null || result.result == null ? {} : result.result;

  if (configuration.staticSourceDirectory == null) {
    configuration.staticSourceDirectory = "static";
  }

  if (configuration.commonDistDirectory == null) {
    configuration.commonDistDirectory = "dist";
  }

  if (configuration.commonSourceDirectory == null) {
    configuration.commonSourceDirectory = getDefaultRelativeSystemDependentCommonSource();
  }

  configuration.commonDistDirectory = path.resolve(context.projectDir, configuration.commonDistDirectory);
  configuration.commonSourceDirectory = path.resolve(context.projectDir, configuration.commonSourceDirectory);

  if (configuration.renderer === undefined) {
    configuration.renderer = {};
  }

  if (configuration.main === undefined) {
    configuration.main = {};
  }

  if (configuration.projectDir == null) {
    configuration.projectDir = context.projectDir;
  }

  return configuration;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=config.js.map