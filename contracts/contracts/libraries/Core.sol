// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FNS} from "./FNS.sol";

import {Gated, IGated} from "./Gated.sol";

import {Tableland} from "./Tableland.sol";

/**
 * @title Core
 * @dev Interface for the Ens system to support a decentralized Namespace of Database spaces
 * IPNS for dynamic code and space updates
 * Tableland SQL in solidity for the databases and subspaces
 */

abstract contract Core is FNS, Gated, Tableland {
    
    enum Types {
        NULL,
        PAID_PRIVATE_INSTANCE,
        OPEN_PRIVATE_INSTANCE,
        PAID_INSTANCE,
        OPEN_INSTANCE,
        SUBNODE,
        CODE
    }

    struct SpaceInstance {
        address gatedContract;
        uint256 price;
        address creator;
    }

    mapping(bytes32 => SpaceInstance) public instances;

    mapping(bytes32 => address) public codeOwner;

    mapping(bytes32 => Types) public isType;

    error NoCodeOwner();

    error InstanceAlreadyExists();

    constructor(
        address _registry,
        address _registrar,
        address _publicResolver,
        bytes32 _baseNode,
        address _gatedImplementation,
        address _subscriptionImplementation
    )
        FNS(_registry, _registrar, _publicResolver, _baseNode)
        Gated(_gatedImplementation, _subscriptionImplementation)
        Tableland()
    {}

    /**
     * @dev createInstanceType
     * @param _newDBInstance The new instance
     * @param _gatedContract The gatedContract of the new instance
     * @param _price The price of the new instance
     */
    function createInstanceType(
        bytes32 _newDBInstance,
        address _gatedContract,
        uint _price
    ) internal {
        bool _isPrivate = _gatedContract != address(0);
        if (!_isPrivate && _price > 0) {
            isType[_newDBInstance] = Types.PAID_INSTANCE;
            createSubscription(_price, _newDBInstance);
        } else if (_isPrivate && _price > 0) {
            isType[_newDBInstance] = Types.PAID_PRIVATE_INSTANCE;
            createSubscription(_price, _newDBInstance);
        } else if (_isPrivate) {
            isType[_newDBInstance] = Types.OPEN_PRIVATE_INSTANCE;
        } else {
            isType[_newDBInstance] = Types.OPEN_INSTANCE;
        }
    }

    /**
     * @dev Check if the sender has access to the given instance
     * @param _instance The instance to check
     * @param _sender The sender to check
     * @return bool
     */
    function hasViewAccess(
        bytes32 _instance,
        address _sender
    ) public view returns (bool) {
        address _gatedAddress = instances[_instance].gatedContract;
        if (isType[_instance] == Types.PAID_INSTANCE) {
            return hasActiveSubscription(_instance, _sender);
        } else if (isType[_instance] == Types.PAID_PRIVATE_INSTANCE) {
            return
                getAccess(_sender, _gatedAddress) ||
                hasActiveSubscription(_instance, _sender);
        } else if (
            isType[_instance] == Types.OPEN_PRIVATE_INSTANCE ||
            isType[_instance] == Types.OPEN_INSTANCE
        ) {
            return true;
        } else {
            return false;
        }
    }

    function hasMutateAccess(
        bytes32 _instance,
        address _sender
    ) public view returns (bool access) {
        address _gatedAddress = instances[_instance].gatedContract;
        Types _instanceType = isType[_instance];
        if (_instanceType == Types.PAID_INSTANCE) {
            access = instances[_instance].creator == _sender;
        } else if (_instanceType == Types.PAID_PRIVATE_INSTANCE) {
            access =
                getAccess(_sender, _gatedAddress) ||
                instances[_instance].creator == _sender;
        } else if (_instanceType == Types.OPEN_PRIVATE_INSTANCE) {
            access = getAccess(_sender, _gatedAddress);
        } else if (_instanceType == Types.OPEN_INSTANCE) {
            access = true;
        }
        uint8 _isType = uint8(_instanceType);
        if (_isType > 4 || _instanceType == Types.NULL) {
            access = false;
        }
    }

    function insertNewMembers(
        bytes32 _instance,
        address[] memory _members
    ) external {
        address _gatedAddress = instances[_instance].gatedContract;
        address _owner = instances[_instance].creator;
        require(_owner == msg.sender, "No access");
        if (_gatedAddress != address(0)) {
            IGated(_gatedAddress).mint(_members);
        }
        _insertMembers(_instance, _members);
    }

    function removeMembers(
        bytes32 _instance,
        address[] memory _members
    ) external {
        address _gatedAddress = instances[_instance].gatedContract;
        address _owner = instances[_instance].creator;
        require(_owner == msg.sender, "No access");
        if (_gatedAddress != address(0)) {
            IGated(_gatedAddress).burn(_members);
        }
        _removeMembers(_instance, _members);
    }

    function updateInstanceThreshold(
        bytes32 _instance,
        uint256 _threshold
    ) external {
        address _owner = instances[_instance].creator;
        require(_owner == msg.sender, "No access");
        _updateInstanceThreshold(_instance, _threshold);
    }
}