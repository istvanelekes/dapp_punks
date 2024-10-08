// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public maxMintAmount;
    uint256 public allowMintingOn;
    bool public isPaused = false;

    mapping(address => bool) private whitelist;

    event Mint(uint256 amount, address minter);
    event Withdraw(uint256 amount, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _maxMintAmount,
        uint256 _allowMintingOn,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        maxMintAmount = _maxMintAmount;
        allowMintingOn = _allowMintingOn;
        baseURI = _baseURI;
    }

    function mint(uint256 _mintAmount) public payable {
        // Only allow minting after specified time
        require(block.timestamp >= allowMintingOn);
        // Must mint at least 1 token and less than maxMintAmount
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount, "Mint less than the max minting amount");
        // Require enough payment
        require(msg.value >= cost * _mintAmount);
        // Require to be not paused
        require(isPaused == false);
        // Require to be on the whitelist
        require(whitelist[msg.sender], "Minter must be whitelisted");

        uint256 supply = totalSupply();

        // Do not let them mint more tokens than available
        require(supply + _mintAmount <= maxSupply);

        // Create tokens
        for (uint i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
            
        }

        // Emit event
        emit Mint(_mintAmount, msg.sender);
    }

    // Return metadata IPFS url
    // EG: 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/1.json'
    function tokenURI(uint256 _tokenId) public view virtual override returns(string memory) {

        require(_exists(_tokenId), 'token does not exist');

        return string(
            abi.encodePacked(baseURI, _tokenId.toString(), baseExtension)
        );
    }

    function walletOfOwner(address _owner) public view returns(uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);

        for (uint i = 0; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function isWhitelisted(address _user) public view returns (bool) {
        return whitelist[_user];
    }

    // Owner functions

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        (bool succes, ) = payable(msg.sender).call{value: balance}("");
        require(succes);

        emit Withdraw(balance, msg.sender);
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function pauseMinting(bool _isPaused) public onlyOwner {
        isPaused = _isPaused;
    }

    function addToWhitelist(address _user) public onlyOwner{
        whitelist[_user] = true;
    }
}