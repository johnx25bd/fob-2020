


# Interfaces:

Vessel owners sign up to participate.
  - Register vessel DIDs
  - Stake funds (ETH, DAI, IOTEX) for each vessel
  - What do they get out of it?
    - `CleanCatch = True` (?) on fishing catch
  - *Graphical interface - form fill*

Governments register MPA boundaries
  - Upload file with Geojson FeatureCollection - polygons of MPA boundaries.
  - Arweave deploy (+ IPFS?) (https://medium.com/@arweave/arweave-ipfs-persistence-for-the-interplanetary-file-system-9f12981c36c3)
  - Register IPFS address and / or arweave reference within smart contract (`SpatialRegistry.sol?`).
  - *Graphical interface - form fill / file drop basically*


~~WHO?~~ Runs Cloud Node program

  - Fetch current boundaries (query smart contract)
  - Check for new data into S3 cloud bucket every minute
  - Check to see if points are within MPA boundaries
    - If TRUE:
      - Submit transaction slashing that vessel's stake
      - Set `bool CleanCatch = False` (?).
  *This means that the Node service has private keys to sign tx. Who is administering this? Etc?*


## Externally-owned accounts / Roles:

### Government

#### Government Root Account

- Constructs `Jurisdiction` contracts
  - Registers boundaries
- Registers and deregisters border officials

✅ Hard code registration  

#### Border Officials EOAs

✅ Human interface
- View complete list of shipments in country
- View appropriate container metadata


### Manufacturer

✅ Human interface
- Submit verification that shipment is ok


### Buyer

✅ Human interface
- Submit verification that shipment was received ok


### Shipper



### Container

✅ Machine interface
- Register ownership of device?





## NodeJS

```javascript

// on tracker ping:


// fetch data from Redis - or stream





  // Check which jurisdiction the tracker is in

  // Check which jurisdiction tracker is registered in on-chain

  // if different:
    // Revoke access to prior jurisdiction
    // Grant access to current jurisdiction
    // AND execute enter(jurisdiction);
  // Check if tracker is still in that jurisdiction
    // If yes:

    // Else:
      // Check if tracker is inside another jurisdiction

```



## Solidity

```javascript

contract Tracker {

  address currentJurisdiction; // < contract address

  construction () {

    // register DID on iotex registry with msg.sender as owner
  }




  crossBorder(_departingJurisdiction, _enteringJurisdiction) {


    // revoke _departingJurisdiction officers access to location information


    // pay _enteringJurisdiction money.
    // grant _enteringJurisdiction officers access to location information


    // update currentJurisdiction


  }


}



contract Jurisdiction {
  boundaries;
  uint importTaxPct;
  did; // did:io:_contractaddress_

  struct Officer {
    address,


  }
  mapping (address => Officer) officers;



  constructor (_boundaries) {
    // register DID with boundaries
    //
  }



  // list of border officers
  function registerOfficer () {

  }

  function removeOfficer () {

  }

  function updateBoundaries (_newBoundaries) {
    // replace boundaries with new boundaries
  }






  function enterJurisdiction (_trackerId) payable {

    // confirm signatures
    // accept payment ...


  }


  function departJurisdiction (_trackerId) {

  }



}



contract JurisdictionRegistry {

}
```



### DIDs

```json

// Tracker




// Jurisdiction

{
    "@context": "https://w3id.org/did/v1",
    "id": "did:io:<<Government's wallet address>>",
    "publicKey": [{
        "id": "did:io:<<public key>>#keys-1",
        "type": "RsaVerificationKey2018",
        "controller": "did:io:0x56d0B5eD3D525332F00C9BC938f93598ab16AAA7",
        "publicKeyPem": "-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n" }],
    "authentication": [{
        "type": "RsaSignatureAuthentication2018",
        "publicKey": "did:io:0x5576E95935366Ebd2637D9171E4C92e60598be10#keys-1" }],
    "service": [{
        "id": "did:io:0x88C36867cffB66197812a9385A038cc6Dd75244b;fetch_boundaries",
        "type": "FetchBoundaries",
        "serviceEndpoint": "https://gateway.ipfs.io/ipfs/QmTeW79w7QQ6Npa3b1d5tANreCDxF2iDaAPsDvW6KtLmfB/" }],
        // a signed hash of the boundaries for verification in SGX enclave.
    "created": "2018-02-08T16:03:00Z",
    "proof": {
        "type": "LinkedDataSignature2015",
        "created": "2018-02-08T16:02:20Z",
        "creator": "did:io:0x5576E95935366Ebd2637D9171E4C92e60598be10#keys-1",
        "signatureValue": "QNB13Y7Q9...1tzjn4w=="
    }
}    


//

```




### Rust

```rust
// In SGX enclave on the cloud:


// point in polygon {
  // confirm validity of jurisdictional boundaries (verify signed hash)\
  // confirm validity of tracker location (verify signed coordinates)
  // calculate if point in polygon

}


// Obvs not rust but ...
function toBeChecked (_trackerId, _jurisdiction)
  returns (bool performCheck_) {
  // If temperature has stayed below max
  // and
  // trackers[_trackerId].Value > x
  // and
  // No controlled ingredients
    return False;
  } Else {
    return True;
  }
}
```
