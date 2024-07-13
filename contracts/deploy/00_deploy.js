require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { ethers } = require("hardhat");
const { Console } = require("console");
const { get } = require("http");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  // // Calibration Testnet
  const NAME_WRAPPER = "0x0635513f179D50A207757E05759CbD106d7dFcE8";
  const PUBLIC_RESOLVER = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";

  const IMPLEMENTATION = await deploy("GatedInstance", {
    from: wallet.address,
    args: [],
    log: true,
  });

  const SUBSCRIPTION_IMPLEMENTATION = await deploy("SubscriptionNFTs", {
    from: wallet.address,
    args: [],
    log: true,
  });
  const _QUADB = await deploy("QUADB", {
    from: wallet.address,
    args: [
      NAME_WRAPPER,
      PUBLIC_RESOLVER,
      IMPLEMENTATION.address,
      SUBSCRIPTION_IMPLEMENTATION.address,
    ],
    log: true,
  });
  // 0xd115d13d491885909a0E21CA90B9406790F1502e
  const QUADB_INSTANCE = await ethers.getContractFactory("QUADB");
  const QUADB = QUADB_INSTANCE.attach(_QUADB.address);
  // const QUADB = QUADB_INSTANCE.attach("0x020a9DcD8FeDbb28aAF92C44Da860f9135351cdF");

  let tx = await QUADB.tables(0);
  console.log(tx);
  tx = await QUADB.tables(1);
  console.log(tx);
  tx = await QUADB.tables(2);
  console.log(tx);
  tx = await QUADB.tables(3);
  console.log(tx);

  // const QUADB = QUADB_INSTANCE.attach(
  //   "0xd115d13d491885909a0E21CA90B9406790F1502e"
  // );

  // let tx = await QUADB.tables(0)
  // console.log(tx);

  // tx = await QUADB.createDBSpace("nick5", { gasLimit: 40000000 });

  // await tx.wait();

  // console.log(tx);

  // console.log(tx);

  //   function createSpaceInstance(
  //     bytes32 _node,
  //     uint256 _hatID,
  //     uint256 _price,
  //     string memory _name,
  //     string memory _about,
  //     string memory _img,
  //     string memory _chatID,
  //     string memory _IPNS
  // )

  // let tx = await QUADB.createSpaceInstance(
  //   "0xe5b025831fde2b59d12c45b640cee0b6590bbb8b0a140e5d4dc04f90aaee3d8a",
  //   2,
  //   ["0x044b595c9b94a17adc489bd29696af40ccb3e4d2"],
  //   "metadataCI3D",
  //   "3",
  //   "IPNS"
  // );

  // await tx.wait();

  // let tx = await QUADB.createInstanceCode(
  //   "0x30584450898765ea045173802f60dea66b5c4a444e58fb72ceafe93f2d2d2ec2",
  //   "name",
  //   "about",
  //   "chatID",
  //   "codeIPNS"
  // );
  // await tx.wait();

  // let tx = await QUADB.purchaseInstanceSubscription(
  //   "0x30584450898765ea045173802f60dea66b5c4a444e58fb72ceafe93f2d2d2ec2",
  //   { value: 2 }
  // );
  // await tx.wait();

  // let tx = await QUADB.removeMembers(
  //   "0x30584450898765ea045173802f60dea66b5c4a444e58fb72ceafe93f2d2d2ec2",
  //   [wallet.address]
  // );
  // await tx.wait();

  // Verify the contract
  // await hre.run("verify:verify", {
  //   address: QUADB2.address,
  //   constructorArguments: [NAME_WRAPPER, PUBLIC_RESOLVER],
  // });
};
