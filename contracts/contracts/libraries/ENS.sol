// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {IERC1155Receiver, IENSResolver, INameWrapper, IERC165} from "../interfaces/interfaces.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ENS
 * @dev Interface for the ENSsystem to support a decentralized Namespace of Database spaces
 * IPNS protocol for code
 * Tableland SQL in solidity for the databases and subspaces
 */

abstract contract ENS is Ownable {

    IENSResolver public immutable PUBLIC_RESOLVER;
    INameWrapper public immutable NAME_WRAPPER;

    bytes32 public BASE_NODE;
    uint256 public BASE_NODE_ID;
    uint256 public DOMAIN_ID;

    error NoInstanceAccess();
    error InvalidTokenAmount();
    error InvalidTokenSender();

    constructor(
        address _nameWrapper,
        address _publicResolver
    ) {
        NAME_WRAPPER = INameWrapper(_nameWrapper);
        PUBLIC_RESOLVER = IENSResolver(_publicResolver);
    }

    /*
     * @dev Function to create a new subnode.
     * @param {bytes32} node - Parent node.
     * @param {string} label - Subnode name label.
     * @return {bytes32} - New subnode.
     */

    function createSubNode(
        bytes32 node,
        string memory label
    ) internal returns (bytes32 newSubNode) {
        newSubNode = NAME_WRAPPER.setSubnodeRecord(
            // The node to create a subnode 
            node,
            // The label of the subnode
            label,
            // Owner
            address(this),
            // Resolver
            address(PUBLIC_RESOLVER),
            // TTL
            0,
            // Fuses
            0,
            // EXPIRY
            0
        );
    }


    function onERC1155Received(
        address,
        address /* from */,
        uint256 tokenId,
        uint256 value,
        bytes calldata
    ) external returns (bytes4) {
        if (msg.sender != address(NAME_WRAPPER)) {
            revert InvalidTokenSender();
        }
        if (value != 1) {
            revert InvalidTokenAmount();
        }

        if (BASE_NODE == 0) {
            BASE_NODE_ID = tokenId;
            BASE_NODE = bytes32(tokenId);
        }

        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        revert();
    }
    
    function transferDomain(address recipient) public onlyOwner {
        PUBLIC_RESOLVER.setAddr(BASE_NODE, recipient);
        NAME_WRAPPER.safeTransferFrom(
            address(this),
            recipient,
            BASE_NODE_ID,
            1,
            ""
        );
    }
}
