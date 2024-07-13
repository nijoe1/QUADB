// import { after, before } from "mocha";
// import chai from "chai";
// import chaiAsPromised from "chai-as-promised";
// import { ethers } from "hardhat";
// import {
//   LocalTableland,
//   getAccounts,
//   getDatabase,
//   getValidator,
// } from "@tableland/local";
// import { Database, Validator } from "@tableland/sdk";

// chai.use(chaiAsPromised);

// const lt = new LocalTableland({ silent: true });
// const accounts = getAccounts();

// describe("fork", function () {
//   this.timeout(30000);
//   const lt = new LocalTableland({
//     silent: false,
//     forkUrl: "https://polygon-mainnet.g.alchemy.com/v2/<your_alchemy_api_key>",
//     forkBlockNumber: "53200000", // Block to fork at
//     forkChainId: "137", // Chain ID for the `forkUrl`
//   });
//   const [, signer] = getAccounts(lt);
//   const db = getDatabase(signer) as Database;
//   const validator = getValidator(db.config.baseUrl) as Validator;

//   before(async function () {
//     // Depending on the chain, this could take a while—adjust timeout
//     // for startup, in case it's longer than the top-level timeout
//     this.timeout(90000);
//     await lt.start();

//     // Deploy a TablelandVoter
//     const TablelandVoterFactory = await ethers.getContractFactory(
//       "TablelandVoter"
//     );
//     const voter = await TablelandVoterFactory.deploy();
//     await voter.deployed();
//     // After calling `start`, forked chain data must be materialized—you
//     // must set this timeout to wait until all state is materialized
//     await new Promise((resolve) =>
//       setTimeout(() => {
//         resolve(undefined);
//       }, 60000)
//     );
//     // Deploy an ExampleToken contract.
//     const ExampleTokenFactory = await ethers.getContractFactory("ExampleToken");

//     const exampleToken = await ExampleTokenFactory.deploy();
//     const tokenContract = await exampleToken.deployed();

//     // Mint a token for the first 5 accounts.
//     for (let i = 0; i < 5; i++) {
//       const tx = await tokenContract.mint(accounts[i].address);
//       await tx.wait();
//     }

//     const questions0 = await validator.queryByStatement({
//       statement: `select * from questionsTable;`,
//     });
//   });

//   after(async function () {
//     await lt.shutdown();
//   });

//   // Tests here...
// });

import {
  LocalTableland,
  getDatabase,
  getRegistry,
  getValidator,
  getAccounts,
} from "@tableland/local";

// Create an instance of Local Tableland.
const lt = new LocalTableland({
  silent: false,
  forkUrl: "https://polygon-mainnet.g.alchemy.com/v2/<your_alchemy_api_key>",
  forkBlockNumber: "53200000", // Block to fork at
  forkChainId: "137", // Chain ID for the `forkUrl`
});

const go = async function () {
  // Start up Local Tableland and make sure it's ready to be interacted with.
  lt.start();
  await lt.isReady();

  // Get wallets aka signers for all 25 of the public Hardhat accounts.
  const accounts = getAccounts();

  // Get a Database instance that's connected to the passed in account.
  const db = getDatabase(accounts[1]);
  const response = await db
    .prepare(`CREATE TABLE my_table (id integer primary key, name text);`)
    .all();
  console.log(response);

  // Get an instance of the Registry class; more details here:
  // https://docs.tableland.xyz/sdk/core/registry-api
  const registry = getRegistry(accounts[1]);
  // List the tables owned by `accounts[1]`
  const myTables = await registry.listTables();
  console.log(myTables);

  // Get an instance of the Validator class; more details here:
  // https://docs.tableland.xyz/sdk/core/validator-api
  const validator = getValidator(db.config.baseUrl);
  const tableData = await validator.getTableById({
    chainId: 31337,
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
