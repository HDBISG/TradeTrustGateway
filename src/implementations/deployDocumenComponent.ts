import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";
import { getWallet } from "./utils/wallet";


export default async function deployDocumentStore( 
     encryptedWalletPath:string, encryptedWalletJson:string,
     password:string, ): Promise< string > {

    console.log("deployDocumentStore begin.");

    var storeName = 'MyFirstDocumentStore';
    var gasPriceScale = 1;

    const wallet = await getWallet({ key: '', keyFile: '', "password":password
        , network: "ropsten", "encryptedWalletPath": encryptedWalletPath
        , "encryptedWalletJson":encryptedWalletJson });

    const gasPrice = await wallet.provider.getGasPrice();

    const factory = new DocumentStoreFactory(wallet);
    signale.await(`Sending transaction to pool`);
    const transaction = await factory.deploy(storeName, { gasPrice: gasPrice.mul(gasPriceScale)  });

    console.log("Tx hash: " + transaction.deployTransaction.hash );
    console.log("Block Number: " + transaction.deployTransaction.blockNumber);

    signale.await(`Waiting for transaction ${transaction.deployTransaction.hash} to be mined`);

    const documentStore = await transaction.deployTransaction.wait();
    console.log("contractAddress: " + documentStore );
    console.log("contractAddress: " + documentStore.contractAddress );
    return documentStore.contractAddress;

}