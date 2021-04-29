pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract Carton {
    using Counters for Counters.Counter;
    Counters.Counter private _boxIds;
    ERC721 public YaytsoInterface;

    struct Box {
        uint256 id;
        string lat;
        string lon;
        bool locked;
        uint256 nonce;
    }

    mapping(uint256 => Box) public idToBox;
    mapping(uint256 => address) public idToKey;
    mapping(uint256 => uint256) public boxIdToTokenId;

    constructor(address _YaytsoAddress) public {
        YaytsoInterface = ERC721(_YaytsoAddress);
    }

    function createBox(string memory _lat, string memory _lon) public {
        _boxIds.increment();
        uint256 _boxId = _boxIds.current();
        Box memory _box = Box(_boxId, _lat, _lon, false, 0);
        idToBox[_boxId] = _box;
    }

    function fillBox(
        uint256 _boxId,
        address _key,
        uint256 _tokenId
    ) public {
        Box memory _box = idToBox[_boxId];
        require(_box.locked == false, "BOX_IS_LOCKED");
        address _tokenOwner = YaytsoInterface.ownerOf(_tokenId);
        require(_tokenOwner == _key, "KEY_MUST_BE_OWNER");
        _box.locked = true;
        idToKey[_boxId] = _key;
        idToBox[_boxId] = _box;
        boxIdToTokenId[_boxId] = _tokenId;
    }

    function getMessageHash(uint256 _id, uint256 _nonce)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_id, _nonce));
    }

    function verify(
        address _signer,
        uint256 _id,
        uint256 _nonce,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_id, _nonce);
        bytes32 ethSignedMessageHash =
            ECDSA.toEthSignedMessageHash(messageHash);

        return ECDSA.recover(ethSignedMessageHash, signature) == _signer;
    }

    function claimYaytso(
        uint256 _boxId,
        address _finder,
        uint256 _nonce,
        bytes memory signature
    ) public {
        Box memory _box = idToBox[_boxId];
        require(_box.locked == true, "BOX_NOT_LOCKED");
        uint256 _yaytsoId = boxIdToTokenId[_boxId];

        address _yaytsoOwner = YaytsoInterface.ownerOf(_yaytsoId);
        address _key = idToKey[_boxId];

        require(_yaytsoOwner == _key);

        require(verify(_key, _boxId, _nonce, signature), "WRONG_SIGNATURE");
        YaytsoInterface.transferFrom(_key, _finder, _yaytsoId);
    }
}
