// @ts-nocheck

/**
 * Lit Action that recovers the threshold of addresses from a w3name record
 * Parameters:
 * - newCid: the new CID to point the w3name record to
 *
 * @param {string} newCid - The new CID to check and update the IPNS record with
 * @param {string} accessControlConditions - The access control conditions to decrypt the API key
 * @param {string} ciphertext - The ciphertext to decrypt the API key
 * @param {string} dataToEncryptHash - The data to encrypt the API key
 * @param {string[]} signatures - The signatures to check and update the IPNS record with
 *
 * This action will:
 * 1. Decrypt the API key
 * 2. Verify signatures against the provided addresses
 * 3. Check if threshold is met
 * 4. Update the w3name record if threshold is met
 */

// TODO: Make this code able to be used also as an optional way to encrypt the API Key using a new Lit Action rules again with the same code
// But with different parameters add a check to see the nonce of the Lit Action to not allow old nonce to be used to dectypt the private key of the IPNS record

(async () => {
  let stringifiedApiKey;
  let namePrivateKey;

  // REPLACE THESE VALUES
  const threshold = $threshold;
  const ipns = $ipns;
  const instanceID = $instanceID;
  const tables = $tables;
  let addresses = [];
  try {
    const baseUrl = "https://tableland.network/api/v1/query?statement=";
    const query = `SELECT DISTINCT address FROM (
    SELECT member as address FROM ${tables.members} WHERE InstanceID = '${instanceID}'
    UNION ALL
    SELECT creator as address FROM ${tables.spaceInstances} WHERE InstanceID = '${instanceID}'
  )`;
    const url = baseUrl + encodeURIComponent(query);
    const resp = await fetch(url).then((response) => response.json());
    console.log(resp);
    addresses = resp.map((address) => address.address);
  } catch (error) {
    console.error(error);
  }

  try {
    try {
      stringifiedApiKey = await Lit.Actions.decryptAndCombine({
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig: null,
        chain: "ethereum",
      });
      namePrivateKey = new Uint8Array(Buffer.from(stringifiedApiKey, "base64"));
    } catch (error) {
      console.error(error);
      Lit.Actions.setResponse({
        response: JSON.stringify({
          success: false,
          message: "Failed to decrypt the API key",
        }),
      });
    }

    const res = await Lit.Actions.runOnce(
      {
        waitForResponse: true,
        name: "conditional-threshold-check-ipns-record-update",
      },
      async () => {
        const usedAddresses = [];
        const name = W3Name.parse(ipns);
        const revision = await W3Name.resolve(name);
        const sequence = revision.sequence;

        for (const signature of signatures) {
          const recoveredAddress = ethers.utils.verifyMessage(
            `I acknowledge updating the current ipns record : ${ipns} contents to point to this new ipfs cid : ${newCid} and the previous sequence number is ${sequence}`,
            signature
          );
          if (
            addresses.includes(recoveredAddress.toLowerCase()) &&
            !usedAddresses.includes(recoveredAddress.toLowerCase())
          ) {
            usedAddresses.push(recoveredAddress.toLowerCase());
          }
        }
        const nextRevision = await W3Name.increment(
          revision,
          newCid.replace("\n", "")
        );
        if (usedAddresses.length >= threshold) {
          const nameKey = await W3Name.from(namePrivateKey);
          const resp = await W3Name.publish(nextRevision, nameKey.key);
          return `Threshold reached, updated IPNS record ${ipns} with new CID ${newCid.replace("\n", "")}`;
        } else {
          return `Threshold not reached, required: ${threshold}, got: ${usedAddresses.length}`;
        }
      }
    );

    Lit.Actions.setResponse({
      response: JSON.stringify({
        success: true,
        message: JSON.stringify(res),
      }),
    });
  } catch (error) {
    console.error(error);
    Lit.Actions.setResponse({
      response: JSON.stringify({
        success: false,
        message: JSON.stringify(error.message),
        stack: JSON.stringify(error.stack),
      }),
    });
  }
})();
