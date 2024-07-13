// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract GatedInstance is ERC721, Initializable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public admin;
    // Constructor
    constructor() ERC721("GatedInstance", "GI") {}

    function initialize(address[] memory _members) public initializer {
        admin = msg.sender;
        uint256 size = _members.length;
        for (uint256 i = 0; i < size; i++) {
            _tokenIds.increment();
            _mint(_members[i], uint256(keccak256(abi.encode(_members[i]))));
        }
    }

    function mint(address[] memory newMembers) public {
        require(msg.sender == admin, "Only admin can mint");
        for (uint256 i = 0; i < newMembers.length; i++) {
            _tokenIds.increment();
            _mint(newMembers[i], uint256(keccak256(abi.encode(newMembers[i]))));
        }
    }

    function burn(address[] memory _members) public {
        require(msg.sender == admin, "Only admin can burn");
        for (uint256 i = 0; i < _members.length; i++) {
            _burn(uint256(keccak256(abi.encode(_members[i]))));
        }
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
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
}
