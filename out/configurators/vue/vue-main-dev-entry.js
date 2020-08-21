import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"; // install vue-devtools

require("electron").app.on("ready", () => {
  installExtension(VUEJS_DEVTOOLS).catch(error => {
    console.log("Unable to install `vue-devtools`: \n", error);
  });
}); 
// __ts-babel@6.0.4
//# sourceMappingURL=vue-main-dev-entry.js.map