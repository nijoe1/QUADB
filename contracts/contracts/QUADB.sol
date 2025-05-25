// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Core} from "./libraries/Core.sol";

/**
 * @title QUADB
 * @dev Create a decentralized Database NameSpaces
 * Where space and subSpaces can get created and anyone can
 * create instances inside a space and contribute to the public
 * this is possible by integrating tableland SQL in solidity
 * FNS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 */
contract QUADB is Core {
    constructor(
        address _registry,
        address _registrar,
        address _publicResolver,
        bytes32 _baseNode,
        address _gateImplementation,
        address _subscriptionImplementation
    )
        Core(
            _registry,
            _registrar,
            _publicResolver,
            _baseNode,
            _gateImplementation,
            _subscriptionImplementation
        )
    {}

    mapping(bytes32 => mapping(address => uint256)) public instanceStakes;

    error InsufficientStakeClaim();

    /**
     * @dev Create a new space under the given node
     * @param _name The name of the new space
     */
    function createDBSpace(string calldata _name) public {
        bytes32 _newDBSpace = createSubNode(QUADB_NODE, _name);

        isType[_newDBSpace] = Types.SUBNODE;

        spaceInsertion(_newDBSpace, QUADB_NODE, _name);
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
     * @param _threshold The threshold of the new instance
     * @param _metadataCID The metadataCID of the new instance
     * @param _IPNS The IPNS of the new instance
     * @param _IPNSEncryptedKey The IPNSEncryptedKey of the new instance
     */
    function createSpaceInstance(
        bytes32 _node,
        uint256 _price,
        address[] calldata _members,
        uint256 _threshold,
        string calldata _metadataCID,
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
            _threshold,
            _metadataCID,
            _IPNS,
            _IPNSEncryptedKey
        );
    }

    /**
     * @dev Stake on an instance
     * @param _instance The instance to stake on
     * @param _note The note of the stake
     * @notice The stake is stored in the instanceStakes mapping and the tableland table
     */
    function stakeOnInstance(
        bytes32 _instance,
        string calldata _note
    ) external payable {
        instanceStakes[_instance][msg.sender] += msg.value;
        stakeInsertion(
            _instance,
            msg.sender,
            instanceStakes[_instance][msg.sender],
            _note
        );
    }

    /**
     * @dev Unstake from an instance
     * @param _instance The instance to unstake from
     * @param _amount The amount to unstake
     * @param _note The note of the unstake
     * @notice The stake is stored in the instanceStakes mapping and the tableland table
     */
    function unstakeFromInstance(
        bytes32 _instance,
        uint256 _amount,
        string calldata _note
    ) external {
        if (instanceStakes[_instance][msg.sender] < _amount) {
            revert InsufficientStakeClaim();
        }
        instanceStakes[_instance][msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        stakeUpdate(
            _instance,
            msg.sender,
            instanceStakes[_instance][msg.sender],
            _note
        );
    }

    /**
     * @dev Create a new instance under the given node
     * @param _instance The parent node
     * @param _name The name of the new instance
     * @param _about The about of the new instance
     * @param _codeIPNS The IPNS of the new instance
     */
    function createInstanceCode(
        bytes32 _instance,
        string calldata _name,
        string calldata _about,
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
            _codeIPNS,
            _IPNSEncryptedKey
        );
    }

    /**
     * @dev Purchase a subscription for an instance
     * @param _instanceID The instance to purchase a subscription for
     */
    function purchaseInstanceSubscription(
        bytes32 _instanceID
    ) external payable {
        purchaseSubscription(_instanceID);
        insertSubscription(_instanceID, msg.sender, getTime() + MONTH);
    }

    /**
     * @dev Extend a subscription for an instance
     * @param _instanceID The instance to extend a subscription for
     */
    function extendInstanceSubscription(bytes32 _instanceID) external payable {
        uint256 remaining = getRemainingSubscriptionTime(
            _instanceID,
            msg.sender
        );

        extendSubscription(_instanceID);

        updateSubscription(_instanceID, msg.sender, remaining + MONTH);
    }

    /**
     * @dev Update a code
     * @param _codeID The code to update
     * @param _name The name of the code
     * @param _about The about of the code
     */
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

    /**
     * @dev Update an instance
     * @param _instanceID The instance to update
     * @param _metadataCID The metadataCID of the instance
     */
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
