// base configuration for tsup
import { Options } from "tsup";

// base tsup config for packaging "normal" packages (like this one)
export const baseConfig: Options = {
  entry: ["src/index.ts"], // default entrypoint
  target: "node18", // we're targeting node18 everywhere (also in Lambda)
  sourcemap: true, // sourcemaps help in error detection
  clean: true,
  // See: https://github.com/evanw/esbuild/issues/1921
  format: "cjs",
};

/* this is for lambda, so it will be packaged up into a ZIP and needs to contain everything
 * hence we have a noExternal in there to get node_modules packaged up
 */
export const lambdaConfig: Options = {
  ...baseConfig,
  // noExternal: [/^(?!@aws-sdk).*$/], // TODO: Test aws-sdk v3 in lambda runtime
  noExternal: [/(.*)/], // we're in a lambda so it should be complete...
  minify: true,
};


/* this is for cdk constructs
 */
export const cdkConstructConfig: Options = {
  ...baseConfig,
  entry: ["lib/index.ts"],
};
