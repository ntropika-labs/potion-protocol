const shell = require("shelljs");

module.exports = {
    istanbulFolder: "./reports/coverage",
    istanbulReporter: ["text", "html", "lcov", "json"],
    onCompileComplete: async function (_config) {
        await run("typechain");
    },
    onIstanbulComplete: async function (_config) {
        // We need to do this because solcover generates bespoke artifacts.
        shell.rm("-rf", "./artifacts");
        shell.rm("-rf", "./typechain");
    },
    providerOptions: {
        mnemonic: process.env.DEPLOYER_MNEMONIC,
    },
    skipFiles: ["mocks", "test", "packages/opyn", "test", "PotionTestToken.sol", "packages/SageMath.sol"],
    configureYulOptimizer: true,
};
