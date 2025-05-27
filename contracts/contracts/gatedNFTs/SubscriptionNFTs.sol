// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SubscriptionNFTs is ERC721, Initializable {
    address public admin;

    mapping(address => uint256) public instanceSubscriptions;

    uint256 public constant MONTH = 30 days;

    // Constructor
    constructor() ERC721("SubscriptionTokens", "ST") {}

    function initialize(address _admin) public initializer {
        admin = _admin;
    }

    function subscribe(address newMember) public {
        require(msg.sender == admin, "Only admin can issue subscription");
        instanceSubscriptions[newMember] = getTime() + MONTH;
        _mint(newMember, uint256(keccak256(abi.encode(newMember))));
    }

    function extendSubscription(address member) public {
        require(msg.sender == admin, "Only admin can issue subscription");
        instanceSubscriptions[member] = getTime() + MONTH;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 /* firstTokenId */,
        uint256 /* batchSize*/
    ) internal pure override {
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred."
        );
    }

    function balanceOf(address owner) public view override returns (uint256) {
        if (instanceSubscriptions[owner] > getTime()) {
            return 1;
        } else {
            return 0;
        }
    }

    function getTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getRemainingTime(address owner) public view returns (uint256) {
        if (instanceSubscriptions[owner] > getTime()) {
            return instanceSubscriptions[owner] - getTime();
        } else {
            return 0;
        }
    }
}
