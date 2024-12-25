import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { QUADB, QUADB__factory } from "../typechain-types";
import { QUADBInterface } from "../typechain-types/contracts/QUADB";
import { keccak256 } from "ethers/crypto";

/**
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployQUADB: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const [deployerSigner] = await hre.ethers.getSigners();
  const deployer = await deployerSigner.getAddress();

  const { deploy } = hre.deployments;

  const REGISTRY = "0x916915d0d41EaA8AAEd70b2A5Fb006FFc213961b";
  const REGISTRAR = "0x45d9d6408d5159a379924cf423cb7e15C00fA81f";
  const PUBLIC_RESOLVER = "0xed9bd04b1BB87Abe2EfF583A977514940c95699c";
  const BASE_NODE = ethers.namehash("fil");
  const QUADB_NODE = ethers.namehash("testquadb.fil");
  // convert bytes32 to uint

  const QUADB_TOKEN_ID = BigInt(keccak256(Buffer.from("testquadb")));

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
  // 0xd115d13d491885909a0E21CA90B9406790F1502e
  const QUADB_INSTANCE = await ethers.getContractFactory("QUADB");

  const QUADB = QUADB_INSTANCE.attach(_QUADB.address) as unknown as QUADB;

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

  const setQUADBNode = await QUADB.setQUADBNode(
    QUADB_TOKEN_ID,
    BASE_NODE,
    QUADB_NODE
  );

  await setQUADBNode.wait();

  console.log("🚀 QUADB deployed at: ", await QUADB.getAddress());
  const QUADBAddress = await QUADB.getAddress();

  //   const transferDomainOwnership = await QUADB.safeTransferDomainOwnership(
  //     QUADBAddress,
  //     "0x9C5e3cAC8166eD93F76BC0469b8Bf3ca715bA6B7"
  //   );
  //   await transferDomainOwnership.wait();

  // Timeout for 10 Seconds to wait for the contract to be indexed on explorer
  console.log(
    "⏳ Waiting for 15 seconds for the contract to be indexed on the explorer..."
  );
  await new Promise((resolve) => setTimeout(resolve, 15000));

  console.log("🕵️‍♂️ Verifying the contract on the explorer...");

  const filecoinNetworks = ["calibration", "filecoin"];
  if (filecoinNetworks.includes(hre.network.name)) {
    // Verify the contract on the filfox explorer
    await hre.run("verify-contract", {
      contractName: "QUADB",
    });
  } else {
    await hre.run("verify:verify", {
      address: QUADBAddress,
      constructorArguments: [],
    });
  }
};

export default deployQUADB;
