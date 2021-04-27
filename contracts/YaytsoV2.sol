pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YaytsoV2 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => bytes32) public idToPattern;

    event YaytsoLaid(address indexed _recipient, uint256 _tokenId);

    constructor() public ERC721("yaytso", "яйцо") {
        _setBaseURI("ipfs://");
    }

    function checkDupe(bytes32 _patternHash) public view returns (bool) {
        bool isDupe = false;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            bytes32 _hash = idToPattern[i];
            if (_patternHash == _hash) {
                isDupe = true;
            }
        }
        return isDupe;
    }

    function yaytsosOfOwner(address _owner)
        public
        view
        returns (uint256[] memory ownerYaytsos)
    {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalYaytsos = totalSupply();
            uint256 resultIndex = 0;

            uint256 yaytsoId;

            for (yaytsoId = 1; yaytsoId <= totalYaytsos; yaytsoId++) {
                if (ownerOf(yaytsoId) == _owner) {
                    result[resultIndex] = yaytsoId;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function layYaytso(
        address _recipient,
        bytes32 _patternHash,
        string memory _tokenURI
    ) public payable {
        require(!checkDupe(_patternHash), "no dupes");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(_recipient, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        idToPattern[newTokenId] = _patternHash;
        emit YaytsoLaid(_recipient, newTokenId);
    }
}
