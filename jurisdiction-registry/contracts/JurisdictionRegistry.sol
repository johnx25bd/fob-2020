// This is not working yet but it does compile.

// Task: Create a contract where we can fetch all the URLs registered with a query into our node program.
// We'll then loop through, requesting the geojson - which will give us our geometries.

// Then we test whether or not each point is inside the geometries.


pragma solidity ^0.5.12;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/ownership/Ownable.sol";
  // ^^ does it need to be ownable?
  // Yes probably - countries should own control of their boundaries if they are within their sovereign jurisdiction.

contract JurisdictionRegistry is Ownable {

    struct Zone {
        string jurisdiction;
        address jurisdictionAddress;
        string arweaveID;
        string ipfsAddress;
        bool exists;

    }

    bytes32[] public zoneIds;
    mapping(bytes32 => Zone) public zones; // Country address
    mapping(address => string) countries; // Country names


    constructor () public {

    }

    function addCountryName (string memory _countryName) public {
        countries[msg.sender] = _countryName;
    }

    function registerZone (
        // string memory _countryName,
        string memory _jurisdiction,
        string memory _arweaveID,
        string memory _ipfsAddress ) public {

        // Check if country is already in the system. If not, add it.
        // if (~countries[msg.sender]) {
        //     addCountryName(_countryName);
        // }

        bytes32 arweaveHash = keccak256(abi.encodePacked(_arweaveID));

        zoneIds.push(arweaveHash);

        Zone memory zoneToRegister = Zone({
            jurisdiction: _jurisdiction,
            jurisdictionAddress: msg.sender,
            arweaveID: _arweaveID,
            ipfsAddress: _ipfsAddress,
            exists: true });

        zones[arweaveHash] = zoneToRegister;


    }

}
