import axios from "axios";
import { tables } from "@/constants/TablelandTables";
const TablelandGateway =
  "https://testnets.tableland.network/api/v1/query?statement=";

export const getSpaces = async () => {
  const getAllSchemasQuery =
    TablelandGateway +
    `SELECT
         *
      FROM
          ${tables.spaces}`;

  try {
    const result = await axios.get(getAllSchemasQuery);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const getSpaceInstances = async (spaceID) => {
  const query = `SELECT 
      json_object(
          'paidPrivateInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (
              SELECT DISTINCT row_data 
              FROM (
                SELECT 
                  json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
                  FROM ${tables.spaceInstances} WHERE instanceType = '1' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
              WHERE row_data IS NOT NULL)), '[]'),
          'openPrivateInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (SELECT DISTINCT row_data FROM (
              SELECT json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
              FROM ${tables.spaceInstances} 
              WHERE instanceType = '2' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
            WHERE row_data IS NOT NULL)), '[]'),
          'paidInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (SELECT DISTINCT row_data 
              FROM (
                SELECT json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
                FROM ${tables.spaceInstances} 
              WHERE instanceType = '3' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
            WHERE row_data IS NOT NULL)), '[]'),
          'openInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (SELECT DISTINCT row_data 
              FROM (
                SELECT json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
                FROM ${tables.spaceInstances} WHERE instanceType = '4' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
              WHERE row_data IS NOT NULL)), '[]')
      ) AS instances
    FROM (SELECT DISTINCT instanceOfSpace FROM ${tables.spaceInstances}) AS unique_instances;
`;

  try {
    const fullUrl = `${TablelandGateway}${encodeURIComponent(query)}`;

    const result = await axios.get(fullUrl);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUserInstances = async (address) => {
  const query = `
  SELECT
    json_object(
        'createdInstances', COALESCE((
            SELECT json_group_array(row_data)
            FROM (
                SELECT DISTINCT row_data
                FROM (
                    SELECT
                        json_object(
                            'InstanceID', s.InstanceID,
                            'instanceOfSpace', s.instanceOfSpace,
                            'IPNS', s.IPNS,
                            'IPNSEncryptedKey', s.IPNSEncryptedKey,
                            'chatID', s.chatID,
                            'creator', s.creator,
                            'gatedContract', s.gatedContract,
                            'metadataCID', s.metadataCID,
                            'price', s.price
                        ) AS row_data
                    FROM ${tables.spaceInstances} AS s
                    WHERE s.creator = '${address?.toLowerCase()}'
                ) AS subquery
                WHERE row_data IS NOT NULL
            )
        ), '[]'),

        'memberInstances', COALESCE((
            SELECT json_group_array(row_data)
            FROM (
                SELECT DISTINCT row_data
                FROM (
                    SELECT
                        json_object(
                            'InstanceID', s.InstanceID,
                            'instanceOfSpace', s.instanceOfSpace,
                            'IPNS', s.IPNS,
                            'IPNSEncryptedKey', s.IPNSEncryptedKey,
                            'chatID', s.chatID,
                            'creator', s.creator,
                            'gatedContract', s.gatedContract,
                            'metadataCID', s.metadataCID,
                            'price', s.price
                        ) AS row_data
                    FROM ${tables.spaceInstances} AS s
                    INNER JOIN ${tables.members} AS m ON s.InstanceID = m.InstanceID
                    WHERE m.member = '${address?.toLowerCase()}'
                ) AS subquery
                WHERE row_data IS NOT NULL
            )
        ), '[]'),

        'subscribedInstances', COALESCE((
            SELECT json_group_array(row_data)
            FROM (
                SELECT DISTINCT row_data
                FROM (
                    SELECT
                        json_object(
                            'InstanceID', s.InstanceID,
                            'instanceOfSpace', s.instanceOfSpace,
                            'IPNS', s.IPNS,
                            'IPNSEncryptedKey', s.IPNSEncryptedKey,
                            'chatID', s.chatID,
                            'creator', s.creator,
                            'gatedContract', s.gatedContract,
                            'metadataCID', s.metadataCID,
                            'price', s.price
                        ) AS row_data
                    FROM ${tables.spaceInstances} AS s
                    INNER JOIN ${tables.subscriptions} AS sub ON s.InstanceID = sub.InstanceID
                    WHERE sub.subscriber = '${address?.toLowerCase()}'
                ) AS subquery
                WHERE row_data IS NOT NULL
            )
        ), '[]')
    ) AS instances
FROM
    (SELECT DISTINCT instanceOfSpace FROM ${tables.spaceInstances}) AS unique_instances;

`;

  try {
    const fullUrl = `${TablelandGateway}${encodeURIComponent(query)}`;

    const result = await axios.get(fullUrl);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getInstance = async (instanceID) => {
  const query = `SELECT * FROM ${tables.spaceInstances} WHERE InstanceID = '${instanceID}'`;
  try {
    const result = await axios.get(
      TablelandGateway + encodeURIComponent(query)
    );
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getHasAccess = async (instanceID, address) => {
  const query = `
  SELECT MAX(hasAccess) AS hasAccess
  FROM (
      SELECT 1 AS hasAccess
      FROM ${tables.subscriptions}
      WHERE InstanceID = '${instanceID.toLowerCase()}' AND subscriber = '${address.toLowerCase()}'
      UNION ALL
      SELECT 1 AS hasAccess
      FROM ${tables.members}
      WHERE InstanceID = '${instanceID.toLowerCase()}' AND member = '${address.toLowerCase()}'
  ) AS combinedAccess;`;
  try {
    const result = await axios.get(
      TablelandGateway + encodeURIComponent(query)
    );
    return result.data[0].hasAccess === 1;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getInstanceMembers = async (instanceID) => {
  const query = `SELECT ${tables.members}.member FROM ${tables.members} WHERE InstanceID = '${instanceID}'`;
  try {
    const result = await axios.get(
      TablelandGateway + encodeURIComponent(query)
    );
    console.log(result.data);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getInstanceCodes = async (instanceID) => {
  const query = `SELECT * FROM ${tables.codes} WHERE InstanceID = '${instanceID}'`;
  try {
    const result = await axios.get(
      TablelandGateway + encodeURIComponent(query)
    );
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUserCodes = async (address) => {
  const query = `SELECT * FROM ${tables.codes} WHERE creator = '${address?.toLowerCase()}'`;
  try {
    const result = await axios.get(
      TablelandGateway + encodeURIComponent(query)
    );
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Function to recursively build children
async function buildChildren(parentID, parentHierarchy, sampleSpacesData) {
  const children = [];
  sampleSpacesData = sampleSpacesData ? sampleSpacesData : [];
  for (const node of sampleSpacesData) {
    if (node.DBSubSpaceOfID.toLowerCase() === parentID.toLowerCase()) {
      const childHierarchy = parentHierarchy
        ? `${node.DBSubSpaceName}.${parentHierarchy}`
        : node.DBSubSpaceName;
      const childChildren = await buildChildren(
        node.DBSpaceID,
        childHierarchy,
        sampleSpacesData
      );
      const nodeType = childChildren.length ? "branch" : "leaf"; // Determine node type
      const childObject = {
        name: childHierarchy + ".quadb.eth",
        id: node.DBSpaceID,
        attributes: { nodeType: nodeType },
        children: childChildren,
      };
      children.push(childObject);
    }
  }
  return children;
}

export const constructObject = async () => {
  const sampleSpacesData = await getSpaces();

  const rootObject = {
    name: "quadb.eth",
    id: "0x7a2c09049961bf43db89e836f4138a4116134572ead5883a5c06c1feec99dfd2",
    attributes: { nodeType: "root" },
    children: await buildChildren(
      "0x7a2c09049961bf43db89e836f4138a4116134572ead5883a5c06c1feec99dfd2",
      "",
      sampleSpacesData
    ), // Start with null as the parentID and empty string as the parentHierarchy
  };
  return rootObject;
};
