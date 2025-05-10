import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { QUADB, QUADB__factory } from "../typechain-types";
import { QUADBInterface } from "../typechain-types/contracts/QUADB";
import { keccak256 } from "ethers/crypto";
import { FNS_ABI } from "./fns.ts";
/**
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployQUADB = async (hre: HardhatRuntimeEnvironment) => {
  const [deployerSigner] = await hre.ethers.getSigners();
  const deployer = await deployerSigner.getAddress();

  const { deploy } = hre.deployments;

  const REGISTRY = "0x916915d0d41EaA8AAEd70b2A5Fb006FFc213961b";
  const REGISTRAR = "0x45d9d6408d5159a379924cf423cb7e15C00fA81f";
  const PUBLIC_RESOLVER = "0xed9bd04b1BB87Abe2EfF583A977514940c95699c";
  const BASE_NODE = ethers.namehash("fil");
  const QUADB_NODE = ethers.namehash("testquadb.fil");

  console.log("QUADB_NODE : ", QUADB_NODE);
  // convert bytes32 to uint

  const QUADB_TOKEN_ID = BigInt(keccak256(Buffer.from("testquadb")));
  console.log("QUADB_TOKEN_ID: ", QUADB_TOKEN_ID);

  //   const GATED_IMPLEMENTATION = await deploy("GatedInstance", {
  //     from: deployer,
  //     args: [],
  //     log: true,
  //   });

  //   const SUBSCRIPTION_IMPLEMENTATION = await deploy("SubscriptionNFTs", {
  //     from: deployer,
  //     args: [],
  //     log: true,
  //   });
  const _QUADB = await deploy("QUADB", {
    from: deployer,
    args: [
      REGISTRY,
      REGISTRAR,
      PUBLIC_RESOLVER,
      BASE_NODE,
      "0xC26343744c74cf342b18Ee6a2bA0D3D8bf780ca1",
      "0xC38db51d09E0C01B7d9d039F072d1393fba97476",
    ],
    log: true,
  });

  console.log("🚀 QUADB deployed at: ", _QUADB.address);

  // 0xd115d13d491885909a0E21CA90B9406790F1502e
  const QUADB_INSTANCE = await ethers.getContractFactory("QUADB");

  const QUADB = QUADB_INSTANCE.attach(
    // "0x80821b27eb1e7C49ff3C63c495c2C0D917b85bd1"
    _QUADB.address
  ) as unknown as QUADB;

  //   const QUADB = QUADB_INSTANCE.attach(
  //     "0x120948a3df0eae291ac71c5d7297c3c710075c0f"
  //   );
  // const QUADB = QUADB_INSTANCE.attach("0x020a9DcD8FeDbb28aAF92C44Da860f9135351cdF");

  let tx = await QUADB.tables(0);
  console.log(tx);
  tx = await QUADB.tables(1);
  console.log(tx);
  tx = await QUADB.tables(2);
  console.log(tx);
  tx = await QUADB.tables(3);
  console.log(tx);

  tx = await QUADB.tables(4);
  console.log(tx);

  tx = await QUADB.QUADB_NODE();
  console.log("QUADB_NODE: ", tx);
  tx = await QUADB.DOMAIN_ID();
  console.log("DOMAIN_ID: ", tx);

  const FNS_INSTANCE = await ethers.getContractAt(
    FNS_ABI as any,
    "0x45d9d6408d5159a379924cf423cb7e15C00fA81f"
  );

  const FNS_ADDRESS = await FNS_INSTANCE.getAddress();
  console.log("FNS_ADDRESS: ", FNS_ADDRESS);

  const FNS_OWNER = await FNS_INSTANCE.ownerOf(QUADB_TOKEN_ID);
  console.log("FNS_OWNER: ", FNS_OWNER);

  const OLD_QUADB_INSTANCE = QUADB_INSTANCE.attach(
    "0xAD93f0AAf57E40531e14d65bb62D3006480121D4"
  ) as unknown as QUADB;

  const transferDomainOwnershipBack =
    await OLD_QUADB_INSTANCE.safeTransferDomainOwnership(
      "0xAD93f0AAf57E40531e14d65bb62D3006480121D4",
      "0x0D1781F0b693b35939A49831A6C799B938Bd2F80",
      {
        gasLimit: 100000000,
      }
    );
  await transferDomainOwnershipBack.wait();

  console.log("transferDomainOwnership to me back done");

  const FNS_RECLAIM = await FNS_INSTANCE.reclaim(
    QUADB_TOKEN_ID,
    await QUADB.getAddress(),
    {
      gasLimit: 100000000,
    }
  );
  await FNS_RECLAIM.wait();
  console.log("FNS_RECLAIM done");

  const FNS_OWNER_ADDRESS = await FNS_INSTANCE.transferFrom(
    "0x0D1781F0b693b35939A49831A6C799B938Bd2F80",
    await QUADB.getAddress(),
    QUADB_TOKEN_ID,
    {
      gasLimit: 100000000,
    }
  );
  await FNS_OWNER_ADDRESS.wait();
  console.log("FNS_OWNER_ADDRESS done");
  const FNS_OWNER_ADDRESS_2 = await FNS_INSTANCE.ownerOf(QUADB_TOKEN_ID);
  console.log("FNS_OWNER_ADDRESS_2: ", FNS_OWNER_ADDRESS_2);
  const setQUADBNode = await QUADB.setQUADBNode(
    QUADB_TOKEN_ID,
    BASE_NODE,
    QUADB_NODE,
    {
      gasLimit: 100000000,
    }
  );

  await setQUADBNode.wait();

  console.log("🚀 QUADB node set");

  const SET_SPACE_INSTANCE = await QUADB.createDBSpace("ai", {
    gasLimit: 100000000,
  });

  await SET_SPACE_INSTANCE.wait();

  console.log("SET_SPACE_INSTANCE done");
  // const QUADB_old = QUADB_INSTANCE.attach(
  //   "0x80821b27eb1e7C49ff3C63c495c2C0D917b85bd1"
  // ) as unknown as QUADB;

  // const setQUADBNode = await QUADB_old.setQUADBNode(
  //   QUADB_TOKEN_ID,
  //   BASE_NODE,
  //   QUADB_NODE,
  //   {
  //     gasLimit: 100000000,
  //   }
  // );

  // await setQUADBNode.wait();

  // console.log("🚀 QUADB node set");
  // const transferDomainOwnership = await QUADB_old.safeTransferDomainOwnership(
  //   "0x80821b27eb1e7C49ff3C63c495c2C0D917b85bd1",
  //   // "0x0D1781F0b693b35939A49831A6C799B938Bd2F80",
  //   _QUADB.address,
  //   {
  //     gasLimit: 100000000,
  //   }
  // );
  // await transferDomainOwnership.wait();
  // const FNS_OWNER_ADDRESS_2 = await FNS_INSTANCE.ownerOf(QUADB_TOKEN_ID);
  // console.log("FNS_OWNER_ADDRESS_2: ", FNS_OWNER_ADDRESS_2);
  // // console.log("🚀 QUADB deployed at: ", await QUADB.getAddress());
  // const QUADBAddress = "0x80821b27eb1e7C49ff3C63c495c2C0D917b85bd1";

  // const QUADBOWNER = await QUADB.owner();
  // console.log("QUADBOWNER: ", QUADBOWNER);

  // const QUADB_NODE2 = await QUADB.QUADB_NODE();
  // console.log("QUADB_NODE: ", QUADB_NODE2);
  // console.log("QUADB_NODE: ", QUADB_NODE.toString());

  // const transferDomainOwnership = await QUADB.safeTransferDomainOwnership(
  //   QUADBAddress,
  //   "0x0D1781F0b693b35939A49831A6C799B938Bd2F80",
  //   {
  //     gasLimit: 72150913,
  //   }
  // );
  // await transferDomainOwnership.wait();

  // Timeout for 10 Seconds to wait for the contract to be indexed on explorer
  // console.log(
  //   "⏳ Waiting for 15 seconds for the contract to be indexed on the explorer..."
  // );
  // await new Promise((resolve) => setTimeout(resolve, 15000));

  // console.log("🕵️‍♂️ Verifying the contract on the explorer...");

  const filecoinNetworks = ["calibration", "filecoin"];
  if (filecoinNetworks.includes(hre.network.name)) {
    // Verify the contract on the filfox explorer
    await hre.run("verify-contract", {
      contractName: "QUADB",
    });
  } else {
    await hre.run("verify:verify", {
      address: _QUADB.address,
      constructorArguments: [],
    });
  }
};

export default deployQUADB;
