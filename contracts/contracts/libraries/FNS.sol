// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IFNSResolver, IFNS, IFNSRegistrar} from "../interfaces/IENSResolver.sol";

/**
 * @title FNS
 * @dev Interface for the FNS system to support a decentralized Namespace of Database spaces
 * IPNS and Push protocol for code and space discussions
 * Tableland SQL in solidity for the databases and subspaces
 */

abstract contract FNS is IERC721Receiver, Ownable {
    IFNS public immutable REGISTRY;
    IFNSRegistrar public immutable REGISTRAR;
    IFNSResolver public immutable PUBLIC_RESOLVER;

    bytes32 public QUADB_NODE;
    bytes32 private BASE_NODE;
    uint256 public DOMAIN_ID;

    error NoInstanceAccess();
    error InvalidTokenAmount();
    error InvalidTokenSender();

    constructor(
        address _registry,
        address _registrar,
        address _publicResolver,
        bytes32 _baseNode
    ) {
        REGISTRY = IFNS(_registry);
        REGISTRAR = IFNSRegistrar(_registrar);
        PUBLIC_RESOLVER = IFNSResolver(_publicResolver);
        BASE_NODE = _baseNode;
    }

    /*
     * @dev Function to create a new subnode.
     * @param {bytes32} node - Parent node.
     * @param {string} subNode - Subnode name.
     * @return {bytes32} - New subnode.
     */
    function createSubNode(
        bytes32 parentNode,
        string memory subNode
    ) internal returns (bytes32 newSubNode) {
        bytes32 label = keccak256(bytes(subNode));

        REGISTRY.setSubnodeRecord(
            // Gaming character subnode
            parentNode,
            // Character tokenID as sub.subdomain to the gaming character subdomain
            label,
            // Owner
            address(this),
            // Resolver
            address(PUBLIC_RESOLVER),
            // TTL
            0
        );

        newSubNode = _makeNode(parentNode, label);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external view returns (bytes4) {
        if (msg.sender != address(REGISTRAR)) {
            revert InvalidTokenSender();
        }
        return IERC721Receiver.onERC721Received.selector;
    }

    function setQUADBNode(
        uint256 tokenId,
        bytes32 baseNode,
        bytes32 node
    ) external onlyOwner {
        DOMAIN_ID = tokenId;
        BASE_NODE = baseNode;
        QUADB_NODE = node;
    }

    function safeTransferDomainOwnership(
        address newOwner
    ) external onlyOwner{
        REGISTRAR.safeTransferFrom(address(this), newOwner, DOMAIN_ID);
        QUADB_NODE = bytes32(0);
    }

    function transferDomainOwnership(
        address newOwner
    ) external onlyOwner {
        REGISTRAR.transferFrom(address(this), newOwner, DOMAIN_ID);
        QUADB_NODE = bytes32(0);
    }

    function _makeNode(
        bytes32 node,
        bytes32 labelhash
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(node, labelhash));
    }
}