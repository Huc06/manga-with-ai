// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MangaNFT
 * @notice ERC-721 NFT for AI-generated manga creations on Celo.
 *         Creators mint their stories/panels as NFTs with on-chain royalties (ERC-2981).
 */
contract MangaNFT is ERC721, ERC721URIStorage, ERC721Royalty, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;

    // Platform fee on primary sales (basis points, e.g. 250 = 2.5%)
    uint96 public constant PLATFORM_FEE_BPS = 250;

    // Default creator royalty on secondary sales (basis points)
    uint96 public constant DEFAULT_ROYALTY_BPS = 500; // 5%

    // Mint fee in native token (0 for free minting, can be set by owner)
    uint256 public mintFee;

    // Mapping from tokenId to original creator
    mapping(uint256 => address) public creators;

    event Minted(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event MintFeeUpdated(uint256 newFee);

    constructor() ERC721("MangaWithAI", "MANGA") Ownable(msg.sender) {}

    /**
     * @notice Mint a new manga NFT
     * @param to Recipient address (usually the creator)
     * @param uri IPFS/Arweave URI for metadata
     * @return tokenId The minted token ID
     */
    function mint(address to, string calldata uri) external payable nonReentrant returns (uint256) {
        require(msg.value >= mintFee, "Insufficient mint fee");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Set creator royalty (ERC-2981)
        _setTokenRoyalty(tokenId, to, DEFAULT_ROYALTY_BPS);

        creators[tokenId] = to;

        emit Minted(tokenId, to, uri);
        return tokenId;
    }

    /**
     * @notice Batch mint multiple NFTs (e.g., all panels in a chapter)
     */
    function batchMint(address to, string[] calldata uris) external payable nonReentrant returns (uint256[] memory) {
        require(msg.value >= mintFee * uris.length, "Insufficient mint fee");

        uint256[] memory tokenIds = new uint256[](uris.length);
        for (uint256 i = 0; i < uris.length; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uris[i]);
            _setTokenRoyalty(tokenId, to, DEFAULT_ROYALTY_BPS);
            creators[tokenId] = to;
            tokenIds[i] = tokenId;

            emit Minted(tokenId, to, uris[i]);
        }
        return tokenIds;
    }

    /**
     * @notice Update mint fee (owner only)
     */
    function setMintFee(uint256 _fee) external onlyOwner {
        mintFee = _fee;
        emit MintFeeUpdated(_fee);
    }

    /**
     * @notice Withdraw collected fees
     */
    function withdraw() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    /**
     * @notice Total supply of minted NFTs
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // --- Overrides ---

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
