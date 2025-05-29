"use client";

import { useMutation } from "@tanstack/react-query";
import * as Client from "@web3-storage/w3up-client";
import * as Delegation from "@web3-storage/w3up-client/delegation";
import { useAccount } from "wagmi";

import { storeDelegationInDB, deleteClientFromDB } from "./db-helpers";
import { get, setupDB } from "./indexDB";

const dbName = "storacha";
const storeName = "user-client";

export const useCreateClient = () => {
  return useMutation({
    mutationFn: async () => {
      const { client } = await createClientWithNewDelegation();
      return client;
    },
  });
};

const createClientWithNewDelegation = async () => {
  const client = await Client.create();

  // Fetch the delegation from the backend
  const response = await fetch(`/api/storacha/w3up-delegation`, {
    method: "POST",
    body: JSON.stringify({
      did: client.did(),
    }),
  });
  const data = await response.json();

  // Deserialize the delegation
  // Convert the archive object back to Uint8Array
  const archiveArray = Array.isArray(data.archive)
    ? new Uint8Array(data.archive)
    : new Uint8Array(Object.values(data.archive));

  const delegation = await Delegation.extract(archiveArray);
  if (!delegation.ok) {
    throw new Error("Failed to extract delegation");
  }

  // Add proof that this agent has been delegated capabilities on the space
  const space = await client.addSpace(delegation.ok);
  client.setCurrentSpace(space.did());

  console.log("Created client with new delegation");
  return { client, delegationArchive: Array.from(archiveArray) };
};

// ------------------------------------------------------------

const getClient = async (account: string) => {
  // Ensure the database and object store are properly set up
  const db = await setupDB(dbName, storeName);
  try {
    const cachedData = (await get(db, storeName, account)) as
      | {
          delegation?: {
            archive: number[];
          };
          lastUpdated?: number;
        }
      | undefined;

    const client = await Client.create();

    if (cachedData && cachedData.delegation) {
      try {
        console.log("Using cached delegation to recreate client");

        // Recreate delegation from cached data
        const archiveArray = new Uint8Array(cachedData.delegation.archive);
        const delegation = await Delegation.extract(archiveArray);

        if (delegation.ok) {
          const space = await client.addSpace(delegation.ok);
          client.setCurrentSpace(space.did());

          console.log("Successfully recreated client with cached delegation");
          return {
            client,
            lastUpdated: cachedData.lastUpdated || Date.now(),
          };
        } else {
          console.warn("Failed to extract delegation from cache, creating new one");
        }
      } catch (error) {
        console.warn("Error using cached delegation, creating new one:", error);
      }
    }

    // If no cached delegation or failed to use it, create new delegation
    console.log("Creating fresh client with new delegation");
    const { client: newClient, delegationArchive } = await createClientWithNewDelegation();
    await storeDelegationInDB(account, delegationArchive);

    return {
      client: newClient,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error("Error in getClient:", error);
    return undefined;
  }
};

// ------------------------------------------------------------

export const useGetClient = () => {
  const { address: account } = useAccount();
  return useMutation({
    mutationFn: getClient,
    onError: async (error): Promise<Client.Client | undefined> => {
      console.error(error);
      try {
        if (account) {
          await deleteClientFromDB(account);
          const { client, delegationArchive } = await createClientWithNewDelegation();
          await storeDelegationInDB(account, delegationArchive);
          return client;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
};
