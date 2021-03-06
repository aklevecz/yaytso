pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Yaytso is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public owner;

    mapping(uint256 => string) public idToPattern;

    event YaytsoMinted(address indexed _recipient, uint256 _tokenId);

    constructor() public ERC721("yaytso", "яйцо") {
        owner = msg.sender;
        _setBaseURI("ipfs://");
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function checkDupe(string memory _patternHash) public view returns (bool) {
        bool isDupe = false;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            string memory _hash = idToPattern[i];
            if (
                keccak256(abi.encodePacked((_patternHash))) ==
                keccak256(abi.encodePacked((_hash)))
            ) {
                isDupe = true;
            }
        }
        return isDupe;
    }

    function mintEgg(
        address _recipient,
        string memory _patternHash,
        string memory _tokenURI
    ) public payable {
        require(!checkDupe(_patternHash), "no dupes");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(_recipient, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        idToPattern[newTokenId] = _patternHash;
        emit YaytsoMinted(_recipient, newTokenId);
    }
}
