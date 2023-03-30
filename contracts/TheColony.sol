// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

/// Contract @title: The Colony
/// Contract @author: Stinky (@nomamesgwei)
/// Description @dev: Artist OᗷᒪOᗰOᐯ project
/// Version @notice: 0.2

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TheColony is ERC721A, Ownable {


    /// @dev baseURI for NFT Metadata
    string public baseURI;
    /// @dev Beneficiary Address
    address public beneficiary;
    /// @dev Max Supply
    uint256 immutable public maxSupply = 999;
    /// @dev Mint Shutoff
    bool public mintOpen;
    /// @dev Price to Mint an NFT
    uint256 public mintPrice = 0.01 ether;
    /// @dev Public mint switch
    bool public publicMint;
    /// @dev Whitelist per Token
    mapping (address => bool) whitelist;

    /// @dev Throw when payment is too low
    error InsufficientFunds();
    /// @dev Throw when minting during Mint Close
    error MintClosed();
    /// @dev Throw if NFT is Minted Out
    error MintedOut();
    /// @dev Throw if not in public mint phase
    error NotPublicMint();
    /// @dev Throw if not on whitelist
    error NotWhitelisted();

    constructor(string memory uri, address benef) ERC721A('The Colony', 'COLON') {
        beneficiary = benef;
        baseURI = uri;
        mintOpen = true;
        publicMint = false;
    }

    /// @dev This Project starts at ID 1
    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    /// @dev Whitelist claim NFTs
    function claim() external payable {
        if(!mintOpen) { revert MintClosed(); }
        if(!whitelist[_msgSender()]) { revert NotWhitelisted(); }
        if(_totalMinted() + 1 > maxSupply) { revert MintedOut(); }
        _mint(_msgSender(), 1); 
        whitelist[_msgSender()] = false;
    }

    /// @dev Public Mint NFTs
    /// @param quantity Number of NFTs to mint
    function mint(uint256 quantity) external payable {
        if(!mintOpen) { revert MintClosed(); }
        if(!publicMint) { revert NotPublicMint(); }
        if(_totalMinted() + quantity > maxSupply) { revert MintedOut(); }
        if(mintPrice * quantity < msg.value) { revert InsufficientFunds(); }
        _mint(_msgSender(), quantity);
    }

    /// @dev Add whitelist per tokenID
    /// @param winners The list of address to whitelit
    function addWhitelist(address[] calldata winners) external onlyOwner {
        uint256 length = winners.length;
        for (uint i; i < length;) {
            whitelist[winners[i]] = true;
            // Cannot possibly overflow due to size of array
            unchecked {++i;}            
        }
    }

    /// @dev Oblomov is Crypto Oprah
    /// @param winners The list of address receive airdrop
    function airdrop(address[] calldata winners) external onlyOwner {
        uint256 length = winners.length;
        if(_totalMinted() + length > maxSupply) { revert MintedOut(); }
        for (uint i; i < length;) {
            _mint(winners[i], 1);
            // Cannot possibly overflow due to size of array
            unchecked {++i;}            
        }
    }

    /// @dev Retreive whitelist status for user
    /// @param user The address to check
    function isWhitelisted(address user) public view returns(bool) {
        return whitelist[user];
    }

    /// @dev Returns TokenURI for Marketplaces
    /// @param tokenId The ID of the Token you want Metadata for
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        return string(abi.encodePacked(baseURI, _toString(tokenId), ".json"));
    }

    /// @dev Update the public mint switch
    function updateMintState() public onlyOwner {
        publicMint = !publicMint;
    }

    /// @dev Mint Open Toggle
    function updateMintStatus() public onlyOwner {
        mintOpen = !mintOpen;
    }

    /// @dev Change the price of mint (create promos)
    function updatePrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    /// @dev Withdraw funds from Contract
    function withdraw() external onlyOwner {
        payable(beneficiary).transfer(address(this).balance);
    }
}