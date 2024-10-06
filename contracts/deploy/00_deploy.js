require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("@nomiclabs/hardhat-etherscan");

const { ethers } = require("hardhat");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  const REGISTRY = "0x916915d0d41EaA8AAEd70b2A5Fb006FFc213961b";
  const REGISTRAR = "0x45d9d6408d5159a379924cf423cb7e15C00fA81f";
  const PUBLIC_RESOLVER = "0xed9bd04b1BB87Abe2EfF583A977514940c95699c";
  const BASE_NODE =
    "0x78f6b1389af563cc5c91f234ea46b055e49658d8b999eeb9e0baef7dbbc93fdb";

  const GATED_IMPLEMENTATION = await deploy("GatedInstance", {
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
      REGISTRY,
      REGISTRAR,
      PUBLIC_RESOLVER,
      BASE_NODE,
      GATED_IMPLEMENTATION.address,
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

  tx = await QUADB.tables(4);
  console.log(tx);

  tx = await QUADB.DOMAIN_ID();
  console.log(tx);

  tx = await QUADB.QUADB_NODE();
  console.log(tx);

  const tokenId =
    "26039416339109659085808192207636894780389231748327146290141181226018817704302";
  const node =
    "0x3991c990740f74d9d194f79fecfb031206f5f8c77698f634d04f484f2904016e";

  tx = await QUADB.setQUADBNode(tokenId, BASE_NODE, node, {
    gasLimit: 40000000,
  });

  await tx.wait();

  tx = await QUADB.DOMAIN_ID();
  console.log(tx);

  tx = await QUADB.QUADB_NODE();
  console.log(tx);

  console.log(ethers.utils.namehash("fevmquadb.fil"));

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
  //   address: QUADB.address,
  //   constructorArguments: [
  //     NAME_WRAPPER,
  //     PUBLIC_RESOLVER,
  //     IMPLEMENTATION.address,
  //     SUBSCRIPTION_IMPLEMENTATION.address,
  //   ],
  // });
  // const transferDomain = await QUADB.transferDomain(wallet.address);
  // await transferDomain.wait();};
};
