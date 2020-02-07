import fs from "fs"
import util from "util"
import Antenna from "iotex-antenna";
import axios from 'axios'

const EXCLUSION_ZONES_LOCATION = "./exclusion-zones"
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

// Converts from the GPS data format in Pebble to GEOJson style decimal
const degToDec = data => {
    let decimal = 0.0
    const _data = data.match(/(\d{2,3})(\d{2}[.]\d+),([NSWE])/).slice(1)
    const deg = _data[0]
    const min = _data[1]
    const sign = _data[2]
    decimal = parseFloat(deg) + parseFloat(min) / 60
    if (sign === 'S' || sign === 'W') {
        decimal *= -1
    }
    return decimal
}

const getLonLat = pebbleLocation => {
    let data = pebbleLocation.GPS.split(",");
    let lat = degToDec(`${data[2]},${data[3]}`);
    let lon = degToDec(`${data[4]},${data[5]}`);
    return [lon, lat]
}
// Loops over GEOJSON object and gets polygons inside it. Using filesystem for now but will use arweave/ipfs when ready
const getPolygons = async (polygonLocations) => {
    let polygons = {}
    try {
        let files = await readdir(polygonLocations)
        for (const file of files) {
            let temp = []
            let geoJSON = await readFile(`${polygonLocations}/${file}`);
            geoJSON = await JSON.parse(geoJSON)

            for (const feat of geoJSON.features) {
                temp.push(feat.geometry.coordinates[0])
            }
            // Object is in the format "jurisdiction.json" : [polygon coordinates]
            polygons[file] = temp
        }

    } catch (err) {
        console.log(err)
    }
    return polygons
};

( async () => {
    // Start enclave script
    const SecureWorker = require('./secureworker');
    const worker = new SecureWorker('enclave.so', 'enclave-point-polygon-check.js');

    // Set up Antenna
    const antenna = new Antenna("http://api.testnet.iotex.one:80");
    const sender = antenna.iotx.accounts.privateKeyToAccount(
        "eec04109aab7af268a1158b88717bd6f62026895920aeb296d4150a7a309dec8"
    );

    // Ping for data from s3 bucket
    let pebbleLocation = {"GPS":"$GPGGA,021628.73,3727.12347,N,12209.97035,W,1,05,14.80,-29.45,M,0,,*17"} // Default point for now

    // Convert it to a lon,lat point
    let point = getLonLat(pebbleLocation)

    // Pull polygons from smart contract
    const polygons = await getPolygons(EXCLUSION_ZONES_LOCATION) // Default data for now

    // Make GeoJSON object from point and check if its inside any polygon
    worker.postMessage({
        type: 'pointInPolygonCheck',
        point: [-0.098653, 51.516060], // [-0.098653, 51.516060] this is a point in london, to verify that True works
        polygons: polygons
    });
    
    worker.onMessage(async (message) => {
        if (message.type === "pointInPolygonResponse") {
           console.log(`${message.jurisdiction}: ${message.inPolygon}`)
            if (message.inPolygon) {
                console.log("Point in polygon found, slashing!")

                // Find out which IMEI the data belongs to, then use that to get its DID document URI
                // getImei() in practice, but for now we don't know how
                let IMEI = "12345678910"

                // Resolve DID to get the document URI, then find owner of device
                const didURI = await antenna.iotx.readContractByMethod({
                    from: sender.address,
                    contractAddress: "io12nww6gtruugzgpse5rkt0qwcggne47p0wz3sa8",
                    abi: [
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "did",
                                    "type": "string"
                                },
                                {
                                    "name": "uri",
                                    "type": "string"
                                }
                            ],
                            "name": "updateURI",
                            "outputs": [],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "did",
                                    "type": "string"
                                }
                            ],
                            "name": "deleteDID",
                            "outputs": [],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [
                                {
                                    "name": "did",
                                    "type": "string"
                                }
                            ],
                            "name": "getHash",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bytes32"
                                }
                            ],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "did",
                                    "type": "string"
                                },
                                {
                                    "name": "hash",
                                    "type": "bytes32"
                                }
                            ],
                            "name": "updateHash",
                            "outputs": [],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [
                                {
                                    "name": "did",
                                    "type": "string"
                                }
                            ],
                            "name": "getURI",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "string"
                                }
                            ],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "hash",
                                    "type": "bytes32"
                                },
                                {
                                    "name": "uri",
                                    "type": "string"
                                },
                                {
                                    "name": "imei",
                                    "type": "string"
                                }
                            ],
                            "name": "createDID",
                            "outputs": [],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [
                                {
                                    "name": "imei",
                                    "type": "string"
                                }
                            ],
                            "name": "getDocumentUriFromIMEI",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "string"
                                }
                            ],
                            "payable": false,
                            "stateMutability": "view",
                            "type": "function"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "name": "id",
                                    "type": "string"
                                },
                                {
                                    "indexed": false,
                                    "name": "didString",
                                    "type": "string"
                                }
                            ],
                            "name": "CreateDID",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "name": "didString",
                                    "type": "string"
                                },
                                {
                                    "indexed": false,
                                    "name": "hash",
                                    "type": "bytes32"
                                }
                            ],
                            "name": "UpdateHash",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "name": "didString",
                                    "type": "string"
                                },
                                {
                                    "indexed": false,
                                    "name": "uri",
                                    "type": "string"
                                }
                            ],
                            "name": "UpdateURI",
                            "type": "event"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": true,
                                    "name": "didString",
                                    "type": "string"
                                }
                            ],
                            "name": "DeleteDID",
                            "type": "event"
                        }
                    ],
                    method: "getDocumentUriFromIMEI",
                    gasPrice: "1",
                    gasLimit: "1",
                    amount: "0",
                }, "12345678910");
                console.log("Retrieving DID document to slash")
                let res = await axios.get(didURI)
                console.log("DID document retrieved:", res.data)
                let vehicleID = res.id
                let ownerID = res.creator

                // console.log("VehicleID:", vehicleID)
                // console.log("OwnerID:", ownerID)

                // Slash() the owner's stake

            } else {
                console.log("Point not in polygon, no action taken!")
            }
    }

    });

})();

