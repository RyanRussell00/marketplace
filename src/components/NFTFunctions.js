import Web3 from "web3";

require("dotenv").config();

window.web3 = new Web3(window.ethereum);
const web3 = window.web3;

const contract = require("../contracts/MyNFT.json");
const contractAddress = "0x2a6a0c23f060e8d1d4d1f61fba9555b2badc2f76"; // Get from the deployement of the NFT
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

export async function mintNFT(fromAddress, tokenURI) {
    const nonce = await web3.eth.getTransactionCount(fromAddress, "latest"); //get latest nonce

    //the transaction
    const tx = {
        from: fromAddress,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(fromAddress, tokenURI).encodeABI(),
    };

    // const private_key_from_web3 = Web3.eth.accounts.privateKeyToAccount()

    window.ethereum.request({
        method: 'eth_sendTransaction',
        tx,
    }).then((resp) => {
        console.log("mintNFT returned success");
        console.log(resp);
    }).catch((err) => {
        console.log("mintNFT failed.")
        console.log(err);
    });

    // const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    // signPromise
    //     .then((signedTx) => {
    //         web3.eth.sendSignedTransaction(
    //             signedTx.rawTransaction,
    //             function (err, hash) {
    //                 if (!err) {
    //                     console.log(
    //                         "The hash of your transaction is: ",
    //                         hash,
    //                         "\nCheck Alchemy's Mempool to view the status of your transaction!"
    //                     );
    //                 } else {
    //                     console.log(
    //                         "Something went wrong when submitting your transaction:",
    //                         err
    //                     );
    //                 }
    //             }
    //         );
    //     })
    //     .catch((err) => {
    //         console.log(" Promise failed:", err);
    //     });
}


// function mintNFT2() {
//     let params: [
//         {
//             from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
//             to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
//             gas: '0x76c0', // 30400
//             gasPrice: '0x9184e72a000', // 10000000000000
//             value: '0x9184e72a', // 2441406250
//             data:
//                 '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
//         },
//     ];
//     window.ethereum.request({
//         method: 'eth_sendTransaction',
//         params,
//     });
// }