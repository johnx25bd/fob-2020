//jshint esversion:8
import Antenna from "iotex-antenna";
import {
    Contract
} from "iotex-antenna/lib/contract/contract";
import Web3 from "web3";

//load the contract address and abi
import contractInfo from "./contract";

//load the inputs for event to decode the log
import eventABI from "./eventABIs";




//initializes by connecting to the user wallet/did contract
const init = async () => {

    //connect to the test network
    antenna = new Antenna("http://api.testnet.iotex.one:80");

    //USER'S IOTEX PRIVATE KEY
    //did:io:0xd29694ef9654e7296ebbfcfd7f5aba2050fc0b80
    unlockedWallet = await antenna.iotx.accounts.privateKeyToAccount(
        "56e162d5f462d58ee39b7169e50996a544c068e0bbea1284e4c392d5e4bf4ad2"
    );

    //connect to the DIDsmartcontract
    contract = new Contract(contractInfo.abi, contractInfo.contractAddress, {
        provider: antenna.iotx
    });
};

//returns the account details of the user
const getAccountDetails = async () => {
    return await antenna.iotx.getAccount({
        address: unlockedWallet.address
    });
};

//returns the didString of the caller
const remindDID = async () => {
    try {
        let did = await antenna.iotx.readContractByMethod({
            from: unlockedWallet.address,
            contractAddress: contractInfo.contractAddress,
            abi: contractInfo.abi,
            method: "remindDIDString"
        });
        return did;
    } catch (err) {
        console.log(err);
    }

};

//given the documentHash, uri, imei(optional), createsDID
// and returns the actionHash(the address of the transaction) 
//emits evnet
const createDID = async (documentHash, uri, imei = "") => {
    try {
        let actionHash = await contract.methods.createDID(documentHash, uri, imei, {
            account: unlockedWallet,
            gasLimit: "1000000",
            gasPrice: "1000000000000"
        });
        return actionHash;
    } catch (err) {
        console.log(err);
        console.log(err);
    }

};

//given didString and the updated documentHash, 
//updates hash of the did and returns the actionHash
//emits event
const updateHash = async (didString, documentHash) => {
    try {
        let actionHash = await contract.methods.updateHash(didString, documentHash, {
            account: unlockedWallet,
            gasLimit: "1000000",
            gasPrice: "1000000000000"
        });
        return actionHash;
    } catch (err) {
        console.log(err);
    }
};

//same as above but updates uri
const updateURI = async (didString, documentURI) => {
    try {
        let actionHash = await contract.methods.updateURI(didString, documentURI, {
            account: unlockedWallet,
            gasLimit: "1000000",
            gasPrice: "1000000000000"
        });
        return actionHash;
    } catch (err) {
        console.log(err);
    }
};

//delteDID only if it was sent by the owner
//returns the actionHash if successful
//emits event
const delteDID = async (didString) => {
    try {
        let actionHash = await contract.methods.deleteDID(didString, {
            account: unlockedWallet,
            gasLimit: "1000000",
            gasPrice: "1000000000000"
        });
        return actionHash;
    } catch (err) {
        console.log(err);
    }
};

//given the didstring, returns hash
const getHash = async (didString) => {
    try {
        let hash = await antenna.iotx.executeContract({
            from: unlockedWallet.address,
            contractAddress: contractInfo.contractAddress,
            abi: contractInfo.abi,
            method: "getHash"
        }, didString);

        return "0x" + hash.toString('hex');
    } catch (err) {
        console.log(err);
    }
};

//given the didstring, returns hash
const getURI = async (didString) => {
    let uri = await antenna.iotx.executeContract({
        from: unlockedWallet.address,
        contractAddress: contractInfo.contractAddress,
        abi: contractInfo.abi,
        method: "getURI"
    }, didString);
    return uri.toString('hex');
};

//get document from IMEI 
//assuming imei is all uniquie
const getDocUriFromImei = async (imei) => {
    try {
        let uri = await antenna.iotx.executeContract({
            from: unlockedWallet.address,
            contractAddress: contractInfo.contractAddress,
            abi: contractInfo.abi,
            method: "getDocumentUriFromIMEI"
        }, imei);
        return uri.toString('hex');
    } catch (err) {
        console.log(err);
    }
};

//decode the log, given the abi and actionHash
let readLog = async (abi, actionHash) => {
    const web3 = new Web3();

    try {
        const receipt = await antenna.iotx.getReceiptByAction({
            actionHash: actionHash
        });


        let log = receipt.receiptInfo.receipt.logs[0];
        let decodedData = log.data.toString('hex');

        let decodedTopics = [];
        log.topics.forEach(element => {
            decodedTopics.push(element.toString('hex'));
        });

        let decodedLog = await web3.eth.abi.decodeLog(abi, decodedData, decodedTopics);
        return decodedLog;
    } catch (err) {
        console.log(err);
    }

};

//returns timestamp
const getTimeStamp = async (actionHash) => {
    try {
        const action = await antenna.iotx.getActions({
            byHash: {
                actionHash: actionHash,
                checkingPending: true
            }
        });

        console.log(JSON.stringify(action.actionInfo[0].timestamp));
        return JSON.stringify(action.actionInfo[0].timestamp);
    } catch (err) {
        console.log(err);
    }

};



let antenna;
let unlockedWallet;
let contract;
(async () => {

    async function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
    //test the above function
    //see if it interacts with smart contract correctly
    //smart contract address is io1kxhm35frtzqmxct899c2zpnp8c2mh28lwcsk0m
    //you can manually interact with it here too: https://testnet.iotexscan.io/wallet/smart-contract/interact

    await init();


    console.log("---------------------------------- crating did test -----------------------------------------");
    //CREATES DID, returns actionhash!
    let actionHashForCreation = await createDID("0x2afeca511b4a2c809225196c40ff0c1db5d1da243428c9ece2c60d256b7d2a92", "someUri", "someIMEI");
    console.log(actionHashForCreation);


    //wait till the block is mined
    await wait(15000);

    //READ LOG
    //IF YOU READ LOG too early before the createDID's transaction is approved, we get an err,
    let testActionHash = actionHashForCreation;
    let log = await readLog(eventABI.createEvent, testActionHash);
    console.log("LOG when new did is created: ", log);
    // didstring decoded successfully as did:io:0xd29694ef9654e7296ebbfcfd7f5aba2050fc0b80
    //however the id, (msg.sender) doesnt return my account "io162tffmuk2nnjjm4mln7h7k46ypg0czuqymcj0h"
    // instead it returns "edcad282d2fc969322aa68caeb2b9bf9de762094ec288a9965535b8968dca17f"
    //probalby due to the decoding method but it deosnt matter


    //reading values from iotx blckchain
    console.log("---------------------------- reading values from blockchain test-----------------------------");
    let didString = await remindDID();
    console.log("remind did string: ", didString); //did:io:0xd29694ef9654e7296ebbfcfd7f5aba2050fc0b80

    let hash = await getHash(didString);
    console.log("Get document hash: ", hash); //0x2afeca511b4a2c809225196c40ff0c1db5d1da243428c9ece2c60d256b7d2a92
    let uri = await getURI(didString);
    console.log("get uri: ", uri); //someUri
    let uriFromIMEI = await getDocUriFromImei("someImei");
    console.log("getURI from IMEI: ", uriFromIMEI); //someUri

    // let uriFromIMEI = await getDocUriFromImei("");
    // console.log("getIMEI from empty uri: ", uriFromIMEI);


    //updating values;
    console.log("---------------------------- uploading values to blockchain test-----------------------------");

    let actionHashForUpdateHash = await updateHash("did:io:0xd29694ef9654e7296ebbfcfd7f5aba2050fc0b80", "0x6b22041934973b8dc2d68181b87f18ef085f739c793a99dd72062f97ec4e3c4f");
    console.log("action hash for updateHash: ", actionHashForUpdateHash);
    await wait(15000);
    let logForupdatHash = await readLog(eventABI.updateHashEvent, actionHashForUpdateHash);
    console.log("log for action hash: ", logForupdatHash); //0x6b22041934973b8dc2d68181b87f18ef085f739c793a99dd72062f97ec4e3c4f


    let actionHashForUpdateURI = await updateURI("did:io:0xd29694ef9654e7296ebbfcfd7f5aba2050fc0b80", "new updated uri!");
    console.log(actionHashForUpdateURI);
    await wait(15000);
    let logForupdatURI = await readLog(eventABI.updateURIEvent, actionHashForUpdateURI);
    console.log("action hash for updateURI", logForupdatURI); //new updated uri!

    console.log("---------------------------- deleting values from blockchain test-----------------------------");

    let actionHashForDelete = await delteDID("did:io:0xd29694ef9654e7296ebbfcfd7f5aba2050fc0b80");
    console.log("action hash for delte", actionHashForDelete);
    await wait(15000);
    let logForDelete = await readLog(eventABI.deleteEvent, actionHashForDelete);
    console.log("Log when did is deleted! ", logForDelete);
    //again the log didString is weird? not sure why but it doesnt matter really

})();