// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

interface IGated {
    function mint(address[] memory newMembers) external;

    function burn(address[] memory _members) external;

    function getRemainingTime(address owner) external view returns (uint256);

    function subscribe(address newMember) external;

    function extendSubscription(address member) external;

    function balanceOf(address owner) external view returns (uint256);
}

abstract contract Gated {
    address internal gatedImplementation;
    address internal subscriptionImplementation;
    uint256 internal constant MONTH = 30 days;

    struct SubscriptionStruct {
        IGated subscriptionContract;
        address creator;
        uint256 prize;
    }

    mapping(bytes32 => SubscriptionStruct) public instanceSubscription;

    // Constructor
    constructor(
        address _gatedImplementation,
        address _subscriptionImplementation
    ) {
        gatedImplementation = _gatedImplementation;
        subscriptionImplementation = _subscriptionImplementation;
    }

    function createSubscription(uint _keyPrice, bytes32 _instanceID) internal {
        instanceSubscription[_instanceID] = SubscriptionStruct({
            subscriptionContract: IGated(
                creatSubscriptionContract(_instanceID)
            ),
            creator: msg.sender,
            prize: _keyPrice
        });
    }

    // Function to create a new OptimisticResolver contract and associate it with a schema
    function createGatedContract(
        address[] memory _members,
        bytes32 salt
    ) internal returns (address accessControlClone) {
        // Create new resolver contract
        accessControlClone = Clones.cloneDeterministic(
            gatedImplementation,
            salt
        );

        (bool success, ) = accessControlClone.call(
            abi.encodeWithSignature("initialize(address[])", _members)
        );

        require(success, "error deploying");
    }

    // Function to create a new OptimisticResolver contract and associate it with a schema
    function creatSubscriptionContract(
        bytes32 salt
    ) internal returns (address accessControlClone) {
        // Create new resolver contract
        accessControlClone = Clones.cloneDeterministic(
            subscriptionImplementation,
            salt
        );

        (bool success, ) = accessControlClone.call(
            abi.encodeWithSignature("initialize(address)", address(this))
        );

        require(success, "error deploying");
    }

    function getDeterministicAddress(
        bytes32 _salt
    ) public view returns (address) {
        return Clones.predictDeterministicAddress(gatedImplementation, _salt);
    }

    function getSuscriptionDeterministicAddress(
        bytes32 _salt
    ) public view returns (address) {
        return
            Clones.predictDeterministicAddress(
                subscriptionImplementation,
                _salt
            );
    }

    function getAccess(
        address _sender,
        address _gatedContract
    ) public view returns (bool) {
        return
            _gatedContract == address(0)
                ? false
                : IERC721(_gatedContract).balanceOf(_sender) > 0;
    }

    function getRemainingSubscriptionTime(
        bytes32 _instanceID,
        address _owner
    ) public view returns (uint256) {
        return
            instanceSubscription[_instanceID]
                .subscriptionContract
                .getRemainingTime(_owner);
    }

    function hasActiveSubscription(
        bytes32 _instanceID,
        address _subscriber
    ) public view returns (bool) {
        return
            instanceSubscription[_instanceID].subscriptionContract.balanceOf(
                _subscriber
            ) > 0;
    }

    /**
     * @dev PurchaseSubscription function for an agentID
     * @param _instanceID to subscribe
     */
    function purchaseSubscription(bytes32 _instanceID) internal {
        uint256 _priceToPay = instanceSubscription[_instanceID].prize;
        require(
            _priceToPay == msg.value,
            "QUADB: No price set for this instance"
        );

        instanceSubscription[_instanceID].subscriptionContract.subscribe(
            msg.sender
        );

        Address.sendValue(
            payable(instanceSubscription[_instanceID].creator),
            (msg.value * 99) / 100
        );
    }

    function extendSubscription(bytes32 _instanceID) internal {
        uint256 _priceToPay = instanceSubscription[_instanceID].prize;

        require(
            _priceToPay == msg.value,
            "QUADB: No price set for this instance"
        );

        instanceSubscription[_instanceID]
            .subscriptionContract
            .extendSubscription(msg.sender);

        Address.sendValue(
            payable(instanceSubscription[_instanceID].creator),
            (msg.value * 99) / 100
        );
    }

    function getTime() public view returns (uint256) {
        return block.timestamp;
    }

    // Function to receive Ethers
    receive() external payable {}
}
