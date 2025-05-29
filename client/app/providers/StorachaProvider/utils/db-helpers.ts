import { put, setupDB, deleteItem } from "./indexDB";

const dbName = "storacha";
const storeName = "user-client";

export const storeDelegationInDB = async (account: string, delegationArchive: number[]) => {
  const db = await setupDB(dbName, storeName);

  // Store only the delegation data needed to recreate the client
  const delegationData = {
    account,
    delegation: {
      archive: delegationArchive,
    },
    lastUpdated: Date.now(),
  };

  await put(db, storeName, account, delegationData);
};

export const deleteClientFromDB = async (account: string) => {
  const db = await setupDB(dbName, storeName);
  await deleteItem(db, storeName, account);
};
