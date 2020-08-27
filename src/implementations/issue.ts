import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";

import { getWallet } from "./utils/wallet";


class Issue {

    async issueDocument ( address:string, hash:string): Promise<{ contractAddress: string }>{

        var storeName = 'MyFirstDocumentStore';
        var gasPriceScale = 1;
        // var nework = "ropsten"

        const wallet = await getWallet({ key:'', keyFile:'', network:"ropsten", encryptedWalletPath:"wallet.json" });

      
        const gasPrice = await wallet.provider.getGasPrice();
        signale.await(`Sending transaction to pool`);
        const transaction = await DocumentStoreFactory.connect(address, wallet).issue(hash, {
          gasPrice: gasPrice.mul(gasPriceScale),
        });
        
        console.log("Tx hash: " + transaction.hash );
        console.log(("Block Number: " + transaction.blockNumber );

        signale.await(`Waiting for transaction ${transaction.hash} to be mined`);
        return transaction.wait();
    }
}