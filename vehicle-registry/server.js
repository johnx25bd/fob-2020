//jshint esversion:8
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import Antenna from "iotex-antenna";
import {
    Contract
} from "iotex-antenna/lib/contract/contract";
import {
    contractAddress,
    abi
} from "./contractInfo";

import {
    generateDocument,
    saveToArweave,
    readDocument
} from './didDocument';

import web3 from "web3";


const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));


const antenna = new Antenna("http://api.testnet.iotex.one:80");
const sender = antenna.iotx.accounts.privateKeyToAccount(
    "151867bc6bf01284c5d2e7b9d3e8573e50316a3d5de1b5ef0489932cf6420f37"
);
const contract = new Contract(abi, contractAddress, {
    provider: antenna.iotx
});

//main page
app.get('/', function (request, response) {



    response.send('Main page');
});

//government-registration
app.get('/government-registeration', function (req, res) {
    res.send('government registeration');
});

//vehicle_registration
app.get('/vehicle_registration', function (req, res) {

    res.sendFile(path.join(__dirname, "src", "vehicle_registration.html"));

});

app.post('/vehicle_registration', function (req, res) {
    let address, entity, imei;
    ({
        address,
        entity,
        imei
    } = req.body);

    (async () => {

        try {
            //creating document and sending it to aweave for prepartion of DID registration
            let document = generateDocument(entity, "did:io:" + address, imei);
            console.log('generate doc', document);
            //this hash will be used for did smart contract
            console.log('fist hash', web3.utils.keccak256(document));
            let url = await saveToArweave(document);
            console.log(url);

            res.send(url);


        } catch (err) {
            console.log(err);
        }


    })();



});



app.listen(3000, function () {
    console.log('server is listening');
});


// const createDID = async () => {
//     try {
//         await contract.methods.createDID(id, "0x6b22041934973b8dc2d68181b87f18ef085f739c793a99dd72062f97ec4e3c4f",
//             "aaa", "bbb", {
//                 account: sender,
//                 gasLimit: "1000000",
//                 gasPrice: "3"
//             });
//     } catch (err) {
//         return err;
//     }
// };
//reads the document
// readDocument('https://arweave.net/tx/DWtToURw5mt2isf_VYO-iqNPbFWQ3txv-ldxQZlfzTY/data.txt').then(data => {
//     console.log(data);
//     console.log('hash ', web3.utils.keccak256(data));

// }).catch(console.log);

//aweave
//https://arweave.net/tx/DWtToURw5mt2isf_VYO-iqNPbFWQ3txv-ldxQZlfzTY/data.txt