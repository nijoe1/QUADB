import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import * as Name from "w3name";
import {
  getJWT,
  generate,
  saveShards,
  recoverShards,
  recoverKey,
} from "@lighthouse-web3/kavach";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { CONTRACT_ADDRESSES } from "@/constants/contracts";
import { getInstanceID } from "./ENS";
const LighthouseChains = {
  11155111: {
    name: "Sepolia",
  },
  314159: {
    name: "Calibration",
  },
};

const dealParams = {
  num_copies: 3,
};

export const resolveIPNSName = async (IPNS) => {
  const name = Name.parse(IPNS);
  const revision = await Name.resolve(name);
  console.log("Resolved value:", revision.value);
  return revision.value;
};

export const UploadFileEncrypted = async (
  file,
  apiKey,
  address,
  jwt,
  spaceID
) => {
  let cid = await uploadFileEncrypted(file, apiKey, address, jwt);
  cid = await applyAccessConditions(
    cid,
    314159,
    spaceID,
    address,
    jwt,
    CONTRACT_ADDRESSES
  );
  return cid;
};

export const createIPNSName = async (
  file,
  apiKey,
  address,
  jwt,
  spaceID,
  isEncrypted
) => {
  let cid;
  if (isEncrypted) {
    cid = await uploadFileEncrypted(file, apiKey, address, jwt);
    cid = await applyAccessConditions(
      cid,
      314159,
      spaceID,
      address,
      jwt,
      CONTRACT_ADDRESSES
    );
  } else {
    cid = (await uploadFile(file, apiKey)).Hash;
  }
  console.log("CID", cid);
  // https://www.npmjs.com/package/w3name
  const name = await Name.create();
  console.log("created new name: ", name.toString());
  const instanceID = getInstanceID(spaceID, name.toString());
  const revision = await Name.v0(name, cid);
  await Name.publish(revision, name.key);

  const byteString = uint8ArrayToString(name.key.bytes, "base64");

  const KEY = await encryptIPNSKey(byteString, apiKey, address, jwt);

  console.log("KEY", KEY[0].Hash);
  let ecid = await applyAccessConditions(
    KEY[0].Hash,
    314159,
    instanceID,
    address,
    jwt,
    "0x573Ddd3536cF4eF58d5386D6829c9e38cbe977e0"
  );
  return {
    instanceID: instanceID,
    name: name.toString(),
    cid: ecid,
  };
};

export const renewIPNSName = async (
  cid,
  IPNS,
  EncryptedKeyCID,
  address,
  jwt
) => {
  const name = Name.parse(IPNS);

  const jsonBlob = await decrypt(EncryptedKeyCID, address, jwt);

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });

  const key = JSON.parse(await jsonFile.text()).key;
  console.log("KEY", key);

  const revision = await Name.resolve(name);
  console.log("Resolved value:", revision.value);

  let nextRevision = await Name.increment(revision, cid);

  const IPNSKey = uint8ArrayFromString(key, "base64");

  const nameKey = await Name.from(IPNSKey);

  await Name.publish(nextRevision, nameKey.key);
};

export const resolveIPNS = async (IPNS) => {
  const name = Name.parse(IPNS);
  const revision = await Name.resolve(name);
  return revision.value;
};

export const getIpfsGatewayUri = (cid) => {
  const LIGHTHOUSE_IPFS_GATEWAY =
    "https://gateway.lighthouse.storage/ipfs/{cid}";
  return LIGHTHOUSE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const getIpfsCID = (ipfsCIDLink) => {
  const LIGHTHOUSE_IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/";
  return ipfsCIDLink.replace(LIGHTHOUSE_IPFS_GATEWAY, "");
};

export const uploadFile = async (file, apiKey) => {
  const output = await lighthouse.upload(
    [file],
    apiKey,
    false,
    null,
    null,
    dealParams
  );
  await registerCIDtoRAAS(output.data.Hash);

  return output.data;
};

/* Deploy file along with encryption */
export const encryptIPNSKey = async (IPNSPK, apiKey, address, jwt) => {
  // Create JSON object
  const json = {
    key: IPNSPK,
  };

  const jsonBlob = new Blob([JSON.stringify(json)], {
    type: "application/json",
  });

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });
  const output = await lighthouse.uploadEncrypted(
    [jsonFile],
    apiKey,
    address,
    jwt,
    null,
    null,
    dealParams
  );

  const { masterKey, keyShards } = await generate();

  const { isSuccess } = await saveShards(
    address,
    output.data[0].cid,
    jwt,
    keyShards
  );

  await registerCIDtoRAAS(output.data[0].cid);

  return output.data;
};

/* Deploy file along with encryption */
export const uploadFileEncrypted = async (file, apiKey, address, jwt) => {
  const output = await lighthouse.uploadEncrypted(
    [file],
    apiKey,
    address,
    jwt,
    null,
    null,
    dealParams
  );
  console.log("output", output.data[0].Hash);

  const { masterKey, keyShards } = await generate();

  const { isSuccess } = await saveShards(
    address,
    output.data[0].Hash,
    jwt,
    keyShards
  );

  await registerCIDtoRAAS(output.data[0].Hash);

  return output.data[0].Hash;
};

const registerCIDtoRAAS = async (cid) => {
  const formData = new FormData();

  const defaultEndDate = new Date();
  defaultEndDate.setMonth(defaultEndDate.getMonth() + 12);
  const defaultReplicationTarget = 3;
  const defaultEpochs = 4;

  formData.append("cid", cid);
  formData.append("endDate", defaultEndDate);
  formData.append("replicationTarget", defaultReplicationTarget);
  formData.append("epochs", defaultEpochs);

  try {
    const response = await axios.post(
      "https://calibration.lighthouse.storage/api/register_job",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering job:", error);
  }
};

export const getDealStatusByCID = async (cid) => {
  const endpoint = `https://calibration.lighthouse.storage/api/deal_status?cid=${cid}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch deal status. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deal status:", error.message);
    return null;
  }
};

export const generateLighthouseJWT = async (address, signEncryption) => {
  const response = await getJWT(address, signEncryption);
  if (response.JWT) {
    localStorage.setItem(`lighthouse-jwt-${address}`, response.JWT);
    return response.JWT;
  }

  if (response.error) {
    return null;
  }
};

export const decrypt = async (cid, address, jwt) => {
  const conditions = await lighthouse.getAccessConditions(cid);
  let decrypted;
  const { error, shards } = await recoverShards(address, cid, jwt, 3);
  try {
    const { masterKey } = await recoverKey(shards);
    const fileType = "application/json";
    decrypted = await lighthouse.decryptFile(cid, masterKey, fileType);
  } catch {}
  /*
    Response: blob
  */
  return decrypted;
};

export const applyAccessConditions = async (
  cid,
  chainID,
  instanceID,
  address,
  jwt,
  QUADB
) => {
  const conditions = [
    {
      id: 1,
      chain: LighthouseChains[chainID].name,
      method: "hasViewAccess",
      standardContractType: "Custom",
      contractAddress: QUADB,
      returnValueTest: {
        comparator: "==",
        value: "true",
      },
      parameters: [instanceID, ":userAddress"],
      inputArrayType: ["bytes32", "address"],
      outputType: "bool",
    },
  ];
  const aggregator = "([1])";

  const response = await lighthouse.applyAccessCondition(
    address,
    cid,
    jwt,
    conditions,
    aggregator
  );

  // let RAAS_Response = await registerCIDtoRAAS(cid);

  const { masterKey, keyShards } = await generate();

  const { isSuccess } = await saveShards(
    address,
    response.data.cid,
    jwt,
    keyShards
  );
  return response.data.cid;
};
