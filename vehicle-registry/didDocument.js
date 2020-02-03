//jshint esversion:8
import Arewave from "arweave/node";
import jwk from "./ArweaveKey.json";
import web3 from "web3";
import request from "request-promise";



//creates did document 
const generateDocument = (entity, creator = "", imei = "") => {
    const document = {
        "@context": "https://w3id.org/did/v1",
        "created": new Date(),
        "entity": entity,
        "creator": creator,
        "imei": imei
    };
    return JSON.stringify(document, null, 2);
};

//saves the document to arweave and returns the url that will point to it 
const saveToArweave = async (document) => {

    //initialize arewave
    let arw = Arewave.init({
        host: 'arweave.net', // Hostname or IP address for a Arweave host
        port: 443, // Port
        protocol: 'https', // Network protocol http or https
        timeout: 20000, // Network request timeouts in milliseconds
        logging: false, // Enable network request logging
    });

    let arewaveURL;
    try {
        //create new transation 
        let transaction = await arw.createTransaction({
            data: document
        }, jwk);

        //document to be rendered as txt
        transaction.addTag('Content-Type', 'text/plain');

        //sign transaction
        await arw.transactions.sign(transaction, jwk);

        //submit transaction
        try {
            const response = await arw.transactions.post(transaction);
        } catch (err) {
            console.log("err occured on submit", err);
            console.log("status: ", response.status);
        }

        arewaveURL = "https://arweave.net/tx/" + transaction.id + "/data.txt";
        return Promise.resolve(arewaveURL);
    } catch (err) {
        return Promise.reject(err);
    }

};


//returns the document in string form given the arweave url
const readDocument = async (url) => {

    let options = {
        method: "GET",
        url: url
    };
    let document = await request(options);
    if (document) {
        console.log(web3.utils.keccak256(document));
        return Promise.resolve(document);
    }
    return Promise.reject(err);
};




export {
    generateDocument,
    saveToArweave,
    readDocument
};


















// fs.writeFile("./document", handleDocument.generate(
//     entity = "individual",
//     creator = "did:io:0x5576E95935366Ebd2637D9171E4C92e60598be10",
//     imei = "3489075349087539087894"), (err) => {
//     if (err) console.log(err);
// });


//https://arweave.net/tx/S-XM_tKzVMK2swK67qNCAgjkK5hBCyYrJjzNHNR2v1Q/data.txt



// let options = {
//     method: 'GET',
//     url: 'https://arweave.net/tx/S-XM_tKzVMK2swK67qNCAgjkK5hBCyYrJjzNHNR2v1Q/data.txt'
// };

// request(options, function (error, response, body) {
//     if (error) {
//         console.error(error);
//     }
//     console.log(body);
//     console.log(typeof body)
//     console.log(web3.utils.keccak256(body));

// });
// const arw = Arewave.init({
//     host: 'arweave.net', // Hostname or IP address for a Arweave host
//     port: 443, // Port
//     protocol: 'https', // Network protocol http or https
//     timeout: 20000, // Network request timeouts in milliseconds
//     logging: false, // Enable network request logging
// });
// arw.transactions.getData('S-XM_tKzVMK2swK67qNCAgjkK5hBCyYrJjzNHNR2v1Q', {
//     decode: true,
//     string: true
// }).then(data => {
//     console.log(data);
//     console.log(typeof data);
//     console.log(web3.utils.keccak256(data));
// })

// let d = {
//     "@context": "https://w3id.org/did/v1",
//     "created": "2020-02-02T17:51:27.043Z",
//     "entity": "individual",
//     "creator": "aother did",
//     "imei": "another imei"
// };
// console.log("second ", d);
// console.log("second ", web3.utils.keccak256(JSON.stringify(d, null, 3)));