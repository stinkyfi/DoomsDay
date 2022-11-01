// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// @title DoomsDay
// @notice ERC-1155 Art Collection by Oblomov
contract DoomsDay is ERC1155, AccessControl {

    string public name = "Doomsday: Adventure Into The Gloomyverse";
    string public symbol = "GMVS";
    mapping (uint256 => mapping(address => bool)) whitelist;

    error NotAuthorized(); 
    constructor(string memory uri) ERC1155(uri) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setURI(string memory newuri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newuri);
    }

    // @notice Mint Token if you are whitelist
    // @param tokenId The token ID to mint
    // @param data ERC-1155
    function mint(uint256 tokenId, bytes memory data) external {
        if(!whitelist[tokenId][_msgSender()]) { revert NotAuthorized(); }
        whitelist[tokenId][_msgSender()] = false;
        _mint(_msgSender(), tokenId, 1, data);
    }

    function addWhitelist(uint256 tokenId, address[] calldata winners) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 length = winners.length;
        for (uint i; i < length;) {
            whitelist[tokenId][winners[i]] = true;
            // Cannot possibly overflow due to size of array
            unchecked {++i;}            
        }
    }

    function isWhitelisted(uint256 tokenId, address user) public view returns(bool) {
        return whitelist[tokenId][user];
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}