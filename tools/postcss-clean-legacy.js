module.exports = function cleanLegacyPostCss() {
  return {
    postcssPlugin: "clean-legacy-postcss",
    Declaration(decl) {
      if (decl.prop === "-webkit-text-size-adjust" || decl.prop === "text-size-adjust") {
        decl.remove();
      }
    },
  };
};
module.exports.postcss = true;
