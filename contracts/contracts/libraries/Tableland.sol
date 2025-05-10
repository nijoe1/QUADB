// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";

import {ITablelandTables} from "@tableland/evm/contracts/interfaces/ITablelandTables.sol";

import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

abstract contract Tableland {
    ITablelandTables public immutable TABLELAND;

    string[] internal createTableStatements;

    string[] public tables;

    uint256[] public tableIDs;

    string internal constant DBSPACES_TABLE_PREFIX = "db_spaces";

    string internal constant DBSPACES_SCHEMA =
        "DBSpaceID text, DBSubSpaceOfID text, DBSubSpaceName text";

    string internal constant DBSPACES_INSTANCES_TABLE_PREFIX =
        "db_spaces_instances";

    string internal constant DBSPACES_INSTANCES_SCHEMA =
        "InstanceID text, instanceOfSpace text, instanceType text, metadataCID text, IPNS text, IPNSEncryptedKey text, gatedContract text, price text, creator text, threshold text";
    
    string internal constant DB_INSTANCES_CODES_TABLE_PREFIX =
        "instances_codes";

    string internal constant DB_INSTANCES_CODES_SCHEMA =
        "InstanceID text, codeID text, name text, about text, IPNS text, IPNSEncryptedKey text, creator text";

    string internal constant SUBSCRIPTIONS_TABLE_PREFIX = "subscriptions";

    string internal constant SUBSCRIPTIONS_SCHEMA =
        "InstanceID text, subscriber text, endsAt text";

    string internal constant DB_INSTANCES_MEMBERS_TABLE_PREFIX = "members";

    string internal constant DB_INSTANCES_MEMBERS_SCHEMA =
        "InstanceID text, member text";

    constructor() {
        TABLELAND = TablelandDeployments.get();

        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                DBSPACES_SCHEMA,
                DBSPACES_TABLE_PREFIX
            )
        );
        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                DBSPACES_INSTANCES_SCHEMA,
                DBSPACES_INSTANCES_TABLE_PREFIX
            )
        );

        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                DB_INSTANCES_CODES_SCHEMA,
                DB_INSTANCES_CODES_TABLE_PREFIX
            )
        );

        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                SUBSCRIPTIONS_SCHEMA,
                SUBSCRIPTIONS_TABLE_PREFIX
            )
        );

        createTableStatements.push(
            SQLHelpers.toCreateFromSchema(
                DB_INSTANCES_MEMBERS_SCHEMA,
                DB_INSTANCES_MEMBERS_TABLE_PREFIX
            )
        );

        tableIDs = TABLELAND.create(address(this), createTableStatements);

        tables.push(
            SQLHelpers.toNameFromId(DBSPACES_TABLE_PREFIX, tableIDs[0])
        );
        tables.push(
            SQLHelpers.toNameFromId(
                DBSPACES_INSTANCES_TABLE_PREFIX,
                tableIDs[1]
            )
        );
        tables.push(
            SQLHelpers.toNameFromId(
                DB_INSTANCES_CODES_TABLE_PREFIX,
                tableIDs[2]
            )
        );

        tables.push(
            SQLHelpers.toNameFromId(SUBSCRIPTIONS_TABLE_PREFIX, tableIDs[3])
        );

        tables.push(
            SQLHelpers.toNameFromId(
                DB_INSTANCES_MEMBERS_TABLE_PREFIX,
                tableIDs[4]
            )
        );
    }

    /*
     * @dev Internal function to insert a new space.
     * @param {bytes32} DBSpaceID - DBSpace ID.
     * @param {bytes32} DBSubSpaceOfID - DBSubSpaceOf ID.
     * @param {string} DBSpaceName - Name of the space.
     * @param {string} DBSubSpaceOfName - Name of the sub space.
     */

    function spaceInsertion(
        bytes32 DBSpaceID,
        bytes32 DBSubSpaceOfID,
        string memory DBSubSpaceName
    ) internal {
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                DBSPACES_TABLE_PREFIX,
                tableIDs[0],
                "DBSpaceID, DBSubSpaceOfID, DBSubSpaceName",
                string.concat(
                    SQLHelpers.quote(bytes32ToString(DBSpaceID)),
                    ",",
                    SQLHelpers.quote(bytes32ToString(DBSubSpaceOfID)),
                    ",",
                    SQLHelpers.quote(DBSubSpaceName)
                )
            )
        );
    }

    /*
     * @dev Internal function to insert a new instance.
     * @param {bytes32} InstanceID - Instance ID.
     * @param {bytes32} instanceOfSpace - DBSpace ID.
     * @param {string} name - Name of the instance.
     * @param {string} about - About of the instance.
     * @param {string} img - Image of the instance.
     * @param {string} IPNS - IPNS of the instance.
     * @param {string} IPNSEncryptedKey - Creator of the instance.
     */

    function instanceInsertion(
        bytes32 _instanceID,
        uint8 _lockType,
        bytes32 _instanceOfSpace,
        address _gatedContract,
        uint256 price,
        uint256 threshold,
        string memory metadataCID,
        string memory IPNS,
        string memory IPNSEncryptedKey
    ) internal {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                DBSPACES_INSTANCES_TABLE_PREFIX,
                tableIDs[1],
                "InstanceID, instanceOfSpace, instanceType, metadataCID, IPNS, IPNSEncryptedKey, gatedContract, price, creator, threshold",
                string.concat(
                    SQLHelpers.quote(bytes32ToString(_instanceID)),
                    ",",
                    SQLHelpers.quote(bytes32ToString(_instanceOfSpace)),
                    ",",
                    SQLHelpers.quote(Strings.toString(_lockType)),
                    ",",
                    SQLHelpers.quote(metadataCID),
                    ",",
                    SQLHelpers.quote(IPNS),
                    ",",
                    SQLHelpers.quote(IPNSEncryptedKey),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(_gatedContract)),
                    ",",
                    SQLHelpers.quote(Strings.toString(price)),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender)),
                    ",",
                    SQLHelpers.quote(Strings.toString(threshold))
                )
            )
        );
    }

    /*
     * @dev Internal function to insert a new instance code.
     * @param {bytes32} InstanceID - Instance ID.
     * @param {string} name - Name of the instance code.
     * @param {string} about - About of the instance code.
     * @param {string} codeIPNS - IPNS of the instance code.
     * @param {string} IPNSEncryptedKey - Creator of the instance code.
     */

    function InsertInstanceCode(
        bytes32 _instanceID,
        bytes32 _codeID,
        string memory name,
        string memory about,
        string memory codeIPNS,
        string memory IPNSEncryptedKey
    ) internal {
        mutate(
            tableIDs[2],
            SQLHelpers.toInsert(
                DB_INSTANCES_CODES_TABLE_PREFIX,
                tableIDs[2],
                "InstanceID, codeID, name, about, IPNS, IPNSEncryptedKey, creator",
                string.concat(
                    SQLHelpers.quote(bytes32ToString(_instanceID)),
                    ",",
                    SQLHelpers.quote(bytes32ToString(_codeID)),
                    ",",
                    SQLHelpers.quote(name),
                    ",",
                    SQLHelpers.quote(about),
                    ",",
                    SQLHelpers.quote(codeIPNS),
                    ",",
                    SQLHelpers.quote(IPNSEncryptedKey),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender))
                )
            )
        );
    }

    function updateInstanceMetadata(
        bytes32 InstanceID,
        string memory metadataCID
    ) internal {
        mutate(
            tableIDs[1],
            SQLHelpers.toUpdate(
                DBSPACES_INSTANCES_TABLE_PREFIX,
                tableIDs[1],
                string.concat("metadataCID = ", SQLHelpers.quote(metadataCID)),
                string.concat(
                    "InstanceID = ",
                    SQLHelpers.quote(bytes32ToString(InstanceID))
                )
            )
        );
    }

    function updateInstanceCode(
        bytes32 codeID,
        string memory name,
        string memory about
    ) internal {
        mutate(
            tableIDs[2],
            SQLHelpers.toUpdate(
                DB_INSTANCES_CODES_TABLE_PREFIX,
                tableIDs[2],
                string.concat(
                    "name = ",
                    SQLHelpers.quote(name),
                    ", about = ",
                    SQLHelpers.quote(about)
                ),
                string.concat(
                    "codeID = ",
                    SQLHelpers.quote(bytes32ToString(codeID))
                )
            )
        );
    }

    /*
     * @dev Internal function to insert a new subscription.
     * @param {bytes32} InstanceID - Instance ID.
     * @param {address} subscriber - Subscriber address.
     * @param {uint256} tokenID - Subscription token ID.
     * @param {uint256} endsAt - Subscription end date.
     */
    function insertSubscription(
        bytes32 InstanceID,
        address subscriber,
        uint256 endsAt
    ) internal {
        mutate(
            tableIDs[3],
            SQLHelpers.toInsert(
                SUBSCRIPTIONS_TABLE_PREFIX,
                tableIDs[3],
                "InstanceID, subscriber, endsAt",
                string.concat(
                    SQLHelpers.quote(bytes32ToString(InstanceID)),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(subscriber)),
                    ",",
                    SQLHelpers.quote(Strings.toString(endsAt))
                )
            )
        );
    }

    function updateSubscription(
        bytes32 InstanceID,
        address subscriber,
        uint256 endsAt
    ) internal {
        mutate(
            tableIDs[3],
            SQLHelpers.toUpdate(
                SUBSCRIPTIONS_TABLE_PREFIX,
                tableIDs[3],
                string.concat(
                    "endsAt = ",
                    SQLHelpers.quote(Strings.toString(endsAt))
                ),
                string.concat(
                    "InstanceID = ",
                    SQLHelpers.quote(bytes32ToString(InstanceID)),
                    " AND subscriber = ",
                    SQLHelpers.quote(Strings.toHexString(subscriber))
                )
            )
        );
    }

    /*
     * @dev Internal function to insert the members.
     * @param {bytes32} InstanceID - Instance ID.
     * @param {address[]} members - Members address array.
     */
    function _insertMembers(
        bytes32 InstanceID,
        address[] memory members
    ) internal {
        string memory id = bytes32ToString(InstanceID);
        for (uint256 i = 0; i < members.length; i++) {
            mutate(
                tableIDs[4],
                SQLHelpers.toInsert(
                    DB_INSTANCES_MEMBERS_TABLE_PREFIX,
                    tableIDs[4],
                    "InstanceID, member",
                    string.concat(
                        SQLHelpers.quote(id),
                        ",",
                        SQLHelpers.quote(Strings.toHexString(members[i]))
                    )
                )
            );
        }
    }

    function _removeMembers(
        bytes32 InstanceID,
        address[] memory members
    ) internal {
        string memory id = bytes32ToString(InstanceID);
        for (uint256 i = 0; i < members.length; i++) {
            mutate(
                tableIDs[4],
                SQLHelpers.toDelete(
                    DB_INSTANCES_MEMBERS_TABLE_PREFIX,
                    tableIDs[4],
                    string.concat(
                        "InstanceID = ",
                        SQLHelpers.quote(id),
                        " AND member = ",
                        SQLHelpers.quote(Strings.toHexString(members[i]))
                    )
                )
            );
        }
    }

    function _updateInstanceThreshold(
        bytes32 InstanceID,
        uint256 threshold
    ) internal {
        mutate(tableIDs[1], SQLHelpers.toUpdate(DBSPACES_INSTANCES_TABLE_PREFIX, tableIDs[1], string.concat("threshold = ", SQLHelpers.quote(Strings.toString(threshold))), string.concat("InstanceID = ", SQLHelpers.quote(bytes32ToString(InstanceID)))));
    }

    /*
     * @dev Internal function to convert bytes32 to string.
     * @param {bytes32} data - Data to convert.
     * @return {string} - Converted data.
     */

    function bytes32ToString(
        bytes32 data
    ) internal pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(data.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < data.length; i++) {
            converted[i * 2] = _base[uint8(data[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(data[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }

    /*
     * @dev Internal function to execute a mutation on a table.
     * @param {uint256} tableId - Table ID.
     * @param {string} statement - Mutation statement.
     */
    function mutate(uint256 tableId, string memory statement) internal {
        TABLELAND.mutate(address(this), tableId, statement);
    }
}
