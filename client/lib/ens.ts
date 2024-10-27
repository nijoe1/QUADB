import { ethers } from "ethers";

// Function to generate token node
export const getTokenNode = (_parentNode:string, subNode:string) => {
  const abi = new ethers.utils.AbiCoder();
  const parentNode = ethers.utils.namehash(_parentNode);
  let subNodeBytes = stringToBytes(subNode);
  const LabelHash = ethers.utils.keccak256(subNodeBytes);

  let newSubNodeBytes = abi.encode(
    ["bytes32", "bytes32"],
    [parentNode, LabelHash],
  );
  const newSubNode = ethers.utils.keccak256(newSubNodeBytes);
  return newSubNode;
};

// Function to convert string to bytes
export const stringToBytes = (str:string) => {
  let bytes = Buffer.from(str);
  return (
    "0x" +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
  );
};

export const getInstanceID = (instanceID:string, IPNS:string) => {
  const abi = new ethers.utils.AbiCoder();
  console.log(ethers.utils.namehash("fil"));

  const ipnsBytes = stringToBytes(IPNS);
  const ipnsHash = ethers.utils.keccak256(ipnsBytes);

  let newInstanceID = abi.encode(["bytes32", "bytes32"], [instanceID, ipnsHash]);
  const _newInstanceID = ethers.utils.keccak256(newInstanceID);
  return _newInstanceID;
};
