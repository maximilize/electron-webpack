import * as path from "path";
export function configureVue(configurator) {
  if (!configurator.hasDependency("vue")) {
    return;
  }

  configurator.extensions.push(".vue");
  Object.assign(configurator.config.resolve.alias, {
    vue$: "vue/dist/vue.esm.js",
    "vue-router$": "vue-router/dist/vue-router.esm.js"
  });

  if (!configurator.isProduction && configurator.type === "main") {
    configurator.entryFiles.push(path.join(__dirname, "vue-main-dev-entry.js"));
  }
}
export function configureVueRenderer(configurator) {
  configurator.entryFiles.push(path.join(__dirname, "../../../vue-renderer-entry.js"));
  configurator.debug("Vue detected");
  configurator.rules.push({
    test: /\.html$/,
    use: "vue-html-loader"
  }, {
    test: /\.vue$/,
    use: {
      loader: "vue-loader",
      options: {
        loaders: {
          sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax=1",
          scss: "vue-style-loader!css-loader!sass-loader"
        }
      }
    }
  });

  const VueLoaderPlugin = require("vue-loader/lib/plugin");

  configurator.plugins.push(new VueLoaderPlugin());
} 
// __ts-babel@6.0.4
//# sourceMappingURL=vue.js.map