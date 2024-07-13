const { ethers } = require("hardhat");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

async function main() {
  console.log("Wallet+ Ethereum Address:", wallet.address);

  const ResolverABI = ["function setAddr(bytes32 node,address a) external"];
  const REGISTRAR_ABI = [
    "function safeTransferFrom(address from,address to,uint256 id) external",
    "function reclaim(uint256 id, address _owner) external",
    "function balanceOf(address owner) public view returns (uint256)",
    "function ownerOf(uint256 id) public view returns (address)",
  ];

  const REGISTRAR_ = "0xf816135728163012f8D1fB5A112b349771bbE025";

  const PUBLIC_RESOLVER = "0x55608172cD23E7e1c2BD939f1C3210027EbD031a";

  const RESOLVER = new ethers.Contract(PUBLIC_RESOLVER, ResolverABI, wallet);

  const REGISTRAR = new ethers.Contract(REGISTRAR_, REGISTRAR_ABI, wallet);

  const QUADB_NODE =
    "0x20e0a4da469e71d29eabcf7bb6acc0c259464788429ea49afcec57d99803d4d2";
  const RECIPIENT = "0x573Ddd3536cF4eF58d5386D6829c9e38cbe977e0";
  const DOMAIN_ID =
    "0xae60d4a6ad4fa09751ecd65492de156d58afece317b4fb9c1607d895c0c74a94";

  // -------------------------------- DEPLOY --------------------------------

  // let tx = await RESOLVER.setAddr(QUADB_NODE, RECIPIENT);
  // let receipt = await tx.wait();
  let tx = await REGISTRAR.ownerOf(BigInt(DOMAIN_ID));
  console.log(tx);
  // console.log("Domain Reclaim Complete");
  // let tx = await REGISTRAR.reclaim(BigInt(DOMAIN_ID), RECIPIENT,{gasLimit: 1000000});
  // receipt = await tx.wait();

  // console.log("Domain Reclaim Complete");

  tx = await REGISTRAR.safeTransferFrom(
    wallet.address,
    RECIPIENT,
    BigInt(DOMAIN_ID),
    { gasLimit: 1000000 }
  );

  receipt = await tx.wait();

  tx = await REGISTRAR.ownerOf(BigInt(DOMAIN_ID));
  console.log(tx);

  // console.log("Domain Transfer Complete");
}

main();
