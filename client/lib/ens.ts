import { ethers } from "ethers";
import { encodePacked, Hex } from "viem";

// Function to generate token node
export const getTokenNode = (_parentNode: string, subNode: string) => {
  const abi = new ethers.utils.AbiCoder();
  const parentNode = ethers.utils.namehash(_parentNode);
  const subNodeBytes = stringToBytes(subNode);
  const LabelHash = ethers.utils.keccak256(subNodeBytes);

  const newSubNodeBytes = abi.encode(["bytes32", "bytes32"], [parentNode, LabelHash]);
  const newSubNode = ethers.utils.keccak256(newSubNodeBytes);
  return newSubNode;
};

// Function to convert string to bytes
export const stringToBytes = (str: string) => {
  // eslint-disable-next-line no-undef
  const bytes = Buffer.from(str);
  return "0x" + bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
};

export const getInstanceID = (instanceID: Hex, IPNS: string) => {
  const _newInstanceID = ethers.utils.keccak256(
    encodePacked(["bytes32", "string"], [instanceID, IPNS]),
  );
  return _newInstanceID;
};
