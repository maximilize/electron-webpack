import { getElectronWebpackConfiguration } from "./config";
export default async function (context) {
  const electronWebpackConfig = await getElectronWebpackConfiguration(context);
  const distDir = electronWebpackConfig.commonDistDirectory;
  return {
    extraMetadata: {
      main: "main.js"
    },
    files: [{
      from: ".",
      filter: ["package.json"]
    }, {
      from: `${distDir}/main`
    }, {
      from: `${distDir}/renderer`
    }, {
      from: `${distDir}/renderer-dll`
    }],
    extraResources: [{
      from: electronWebpackConfig.staticSourceDirectory,
      to: electronWebpackConfig.staticSourceDirectory
    }]
  };
} 
// __ts-babel@6.0.4
//# sourceMappingURL=electron-builder.js.map