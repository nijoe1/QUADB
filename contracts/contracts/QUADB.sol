// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Core} from "./libraries/Core.sol";

/**
 * @title QUADB
 * @dev Create a decentralized Database NameSpaces
 * Where space and subSpaces can get created and anyone can
 * create instances inside a space and contribute to the public
 * this is possible by integrating tableland SQL in solidity
 * ENSsystem to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 */
contract QUADB is Core {
    constructor(
        address _nameWrapper,
        address _publicResolver,
        address _gateImplementation,
        address _subscriptionImplementation
    )
        Core(
            _nameWrapper,
            _publicResolver,
            _gateImplementation,
            _subscriptionImplementation
        )
    {}

    /**
     * @dev Create a new space under the given node
     * @param _name The name of the new space
     */
    function createDBSpace(string calldata _name) public {
        bytes32 _newDBSpace = createSubNode(BASE_NODE, _name);

        isType[_newDBSpace] = Types.SUBNODE;

        spaceInsertion(_newDBSpace, BASE_NODE, _name);
    }

    /**
     * @dev Create a new subnode under the given node
     * @param _DBSpace The parent node
     * @param _name The name of the new subnode
     */
    function createDBSubSpace(
        bytes32 _DBSpace,
        string calldata _name
    ) external {
        require(
            isType[_DBSpace] == Types.SUBNODE,
            "QUADB: Node is not a subnode"
        );

        bytes32 _newDBSubSpace = createSubNode(_DBSpace, _name);

        isType[_newDBSubSpace] = Types.SUBNODE;

        spaceInsertion(_newDBSubSpace, _DBSpace, _name);
    }

    /**
     * @dev Create a new instance under the given node
     * @param _node The parent node
     * @param _members The hatID of the new instance
     * @param _metadataCID The name of the new instance
     * @param _chatID The chatID of the new instance
     * @param _IPNS The IPNS of the new instance
     */
    function createSpaceInstance(
        bytes32 _node,
        uint256 _price,
        address[] calldata _members,
        string calldata _metadataCID,
        string calldata _chatID,
        string calldata _IPNS,
        string calldata _IPNSEncryptedKey
    ) external {
        require(isType[_node] == Types.SUBNODE, "QUADB: Node is not a subnode");

        bytes32 _newDBInstance = keccak256(abi.encodePacked(_node, _IPNS));

        if (isType[_newDBInstance] != Types.NULL) {
            revert InstanceAlreadyExists();
        }
        address _gatedContract;
        if (_members.length > 0) {
            _gatedContract = createGatedContract(_members, _newDBInstance);
            _insertMembers(_newDBInstance, _members);
        }

        instances[_newDBInstance] = SpaceInstance(
            _gatedContract,
            _price,
            msg.sender
        );

        createInstanceType(_newDBInstance, _gatedContract, _price);

        instanceInsertion(
            _newDBInstance,
            uint8(isType[_newDBInstance]),
            _node,
            _gatedContract,
            _price,
            _metadataCID,
            _chatID,
            _IPNS,
            _IPNSEncryptedKey
        );
    }

    /**
     * @dev Create a new instance under the given node
     * @param _instance The parent node
     * @param _name The name of the new instance
     * @param _about The about of the new instance
     * @param _chatID The chatID of the new instance
     * @param _codeIPNS The IPNS of the new instance
     */
    function createInstanceCode(
        bytes32 _instance,
        string calldata _name,
        string calldata _about,
        string calldata _chatID,
        string calldata _codeIPNS,
        string calldata _IPNSEncryptedKey
    ) external {
        if (!hasMutateAccess(_instance, msg.sender)) {
            revert NoInstanceAccess();
        }

        bytes32 _newDBInstanceCode = keccak256(
            abi.encodePacked(_instance, _codeIPNS)
        );

        if (isType[_newDBInstanceCode] != Types.NULL) {
            revert InstanceAlreadyExists();
        }
        codeOwner[_newDBInstanceCode] = msg.sender;
        isType[_newDBInstanceCode] = Types.CODE;

        InsertInstanceCode(
            _instance,
            _newDBInstanceCode,
            _name,
            _about,
            _chatID,
            _codeIPNS,
            _IPNSEncryptedKey
        );
    }

    function purchaseInstanceSubscription(
        bytes32 _instanceID
    ) external payable {
        purchaseSubscription(_instanceID);
        insertSubscription(_instanceID, msg.sender, getTime() + MONTH);
    }

    function extendInstanceSubscription(bytes32 _instanceID) external payable {
        uint256 remaining = getRemainingSubscriptionTime(
            _instanceID,
            msg.sender
        );

        extendSubscription(_instanceID);

        updateSubscription(_instanceID, msg.sender, remaining + MONTH);
    }

    function updateCode(
        bytes32 _codeID,
        string calldata _name,
        string calldata _about
    ) external {
        if (codeOwner[_codeID] != msg.sender) {
            revert NoCodeOwner();
        }
        updateInstanceCode(_codeID, _name, _about);
    }

    function updateInstance(
        bytes32 _instanceID,
        string calldata _metadataCID
    ) external {
        if (instances[_instanceID].creator != msg.sender) {
            // revert NoInstanceAccess();
            revert("QUADB: No instance access");
        }
        updateInstanceMetadata(_instanceID, _metadataCID);
    }
}
