import { after, before, describe, test } from "mocha";
import {
  LocalTableland,
  getDatabase,
  getRegistry,
  getValidator,
  getAccounts,
} from "@tableland/local";

import { ethers, network } from "hardhat";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// Create an instance of Local Tableland.
const lt = new LocalTableland({
  silent: false,
  forkUrl: "https://sepolia.infura.io/v3/",
  forkBlockNumber: "5428517", // Block to fork at
  forkChainId: "11155111", // Chain ID for the `forkUrl`
});

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

const go = async function () {
  // Start up Local Tableland and make sure it's ready to be interacted with.
  lt.start();
  await lt.isReady();

  // Get a Database instance that's connected to the passed in account.
  const db = getDatabase(wallet);
  const response = await db
    .prepare(`CREATE TABLE my_table (id integer primary key, name text);`)
    .all();
  console.log(response);

  // Get an instance of the Registry class; more details here:
  // https://docs.tableland.xyz/sdk/core/registry-api
  const registry = getRegistry(wallet);
  // List the tables owned by `accounts[1]`
  const myTables = await registry.listTables();
  console.log(myTables);

  // Get an instance of the Validator class; more details here:
  // https://docs.tableland.xyz/sdk/core/validator-api
  const validator = getValidator(db.config.baseUrl);
  const tableData = await validator.getTableById({
    chainId: 11155111,
    tableId: "1",
  });
  console.log(tableData);

  // Stop Local Tableland.
  await stop();
};

// Code to shutdown the Tableland and Hardhat nodes.
const stop = async function () {
  await lt.shutdown();
};

// Catch errors and log them.
go().catch((err) => console.log(err));
