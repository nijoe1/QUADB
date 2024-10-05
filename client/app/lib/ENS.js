import { ethers } from "ethers";

// Function to generate token node
export const getTokenNode = (_parentNode, characterName) => {
  const abi = new ethers.utils.AbiCoder();
  const parentNode = ethers.utils.namehash(_parentNode);
  let subNodeBytes = stringToBytes(characterName);
  const LabelHash = ethers.utils.keccak256(subNodeBytes);

  let newSubNodeBytes = abi.encode(
    ["bytes32", "bytes32"],
    [parentNode, LabelHash],
  );
  const newSubNode = ethers.utils.keccak256(newSubNodeBytes);
  return newSubNode;
};

// Function to convert string to bytes
export const stringToBytes = (str) => {
  let bytes = Buffer.from(str);
  return (
    "0x" +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
  );
};

export const getInstanceID = (instanceID, IPNS) => {
  const abi = new ethers.utils.AbiCoder();
  console.log(ethers.utils.namehash("fil"));

  let newInstanceID = abi.encode(["bytes32", "string"], [instanceID, IPNS]);
  const _newInstanceID = ethers.utils.keccak256(newInstanceID);
  return _newInstanceID;
};
