# Vehicle Registry 

Steps to including DID into VehicleRegistry.sol (Already implemented, this is just explanation)

1. Implement a DID smart contract, based on IoTeX's implementation here: https://github.com/iotexproject/iotex-did/blob/master/smartcontracts/contracts/IoTeXDID.sol
    * In addition to ALL of the above DID methods, add a method getDocumentUriFromIMEI(string IMEI) to get the location of the DID document based only on the IMEI of the device
    * For this to work it means we also have an additional mapping(string => string) where string1 is an IMEI and string2 is a DID id string e.g. did:io:0x2323....4039
    * Note, we should store the DID document on Arweave, for the sake of the challenge prize.

2. Add an additional field to the DID document called "creator", which is a DID string pointing to the owner of the device, so that we can slash them when needed.
    * This means that one owner can have multiple devices pointing to it, e.g. in the case where a person has multiple cars, or multiple ships in his/her fleet

3. How to slash?
    * When we receive data from a device (either through streaming, or through pinging the S3 bucket), we get the GPS coordinates, and convert them to a turfJS point
    * We then query the JurisdictionRegistry.sol to get the polygon boundaries
    * We pass the point, and the polygon boundaries into the enclave which checks whether the point is in the polygon
    * If it isn't we don't need to do anything. If it is, we get the device's IMEI (it would be passed to us in the data), then we use that IMEI to get the DID document as described by the getDocumentUriFromIMEI() smart contract method
    described in point number 1. We read creator field from the DID document (which is stored on Arweave), and then make a slash() smart contract call with that creator's DID.

* To begin with, the DID document should be in the format:

    ```        
      {
        "@context": "https://w3id.org/did/v1",
        "created": "2018-02-08T16:02:20Z",
        "entity": "Individual"
        "creator": "did:io:0x5576E95935366Ebd2637D9171E4C92e60598be10",
        "imei": "3489075349087539087894"
      }
    ```
* What does each field mean?:
    ```      
     * "@context": always the same as above.
     * "created": timestamp of when the DID is created.
     * "entity": can be "device", "company:company name", or "individual".
     * "creator": optional, only used if its a device DID.
     * "imei": optional, only use if its a pebble tracker
     ```

How does VehicleRegistry.sol work?

  * The contract method names are self explanatory. The main things to note about the contract:
    * One "owner" can have multiple vehicles assigned to them. Each vehicle has its own stake amount and expiry date,
    which means each vehicle can be penalised individually.
    * The contract does not really care about addresses, it works with DIDs. DIDs should be passed in as a string in the format, for example, did:io:0x5576E95935366Ebd2637D9171E4C92e60598be10
    * Right now for testing purposes the `lockTime` input variable during registration is in minutes as its easy to test that staking works correctly then. Once the web forms are complete we can easily extend to support multiple units e.g. seconds, minutes and days

### Requirements

02/02/2020: We need a web form to register a PERSON to give them a DID and store the DID document on Arweave (Leo).
02/02/2020: We need a web form to register a DEVICE to give it a DID and store the DID document on Arweave (Leo).
02/02/2020: We need a web form to register VEHICLES using VehicleRegistry.sol (Tony?).
