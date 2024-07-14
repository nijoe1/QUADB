require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  defaultNetwork: "sepolia",
  // defaultNetwork: "calibration",

  networks: {
    sepolia: {
      chainId: 11155111,
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [PRIVATE_KEY],
    },
    calibration: {
      url: "https://rpc.ankr.com/filecoin_testnet",

      // url: "https://filecoin-calibration.chainup.net/rpc/v1	",
      accounts: [PRIVATE_KEY],
    },
    "local-tableland": {
      url: "http://127.0.0.1:8545",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    // apiKey: "JYMKRTHHFUSX4X11I1NQRNW6X7K2FJFJUU",
    apiKey: "KNVT7KRT9B15Z5UTXZT8TG8HNMIJXWXRMY",

    customChains: [],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    scripts: "./scripts",
  },
};