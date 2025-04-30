// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
contract CryptoCollectibles is ERC721, Ownable {
    uint256 private _nextTokenId; // Tracks the next tokenId
    string private _baseTokenURI; // Base URI for metadata
    mapping(uint256 => string) private _tokenNames; // tokenId => Name
    constructor(string memory baseURI_) ERC721("CryptoCollectibles", "CCOL") Ownable(msg.sender) {
        _baseTokenURI = baseURI_;
        _nextTokenId = 1; // Start token IDs from 1
    }

    
        function mint(address to, string memory name_) external onlyOwner {
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId); // Mint safely
        _tokenNames[tokenId] = name_; // Save name
        _nextTokenId++; // Increment counter
    }
       function getTokenName(uint256 tokenId) external view returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenNames[tokenId];
    }

    /// @notice Override tokenURI to build from base URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");

            return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), ".json"));

    }

    /// @notice Update the base URI (optional feature)
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }


}
