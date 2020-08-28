import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";
import { NetworkOption, WalletOption } from "../commands/shared";
import { DeployDocumentStoreCommand } from "../commands/deploy/deploy.types";
//import { getLogger } from "../../../logger";
import { getWallet } from "./utils/wallet";
//import { dryRunMode } from "../../utils/dryRun";

class DocumentStore {

    async deployDocumentStore(): Promise<{ contractAddress: string }> {
        console.log("deployDocumentStore begin.");

        var storeName = 'MyFirstDocumentStore';
        var gasPriceScale = 1;

        const wallet = await getWallet({ key: '', keyFile: '', network: "ropsten", encryptedWalletPath:"wallet.json" });

        const gasPrice = await wallet.provider.getGasPrice();

        const factory = new DocumentStoreFactory(wallet);
        signale.await(`Sending transaction to pool`);
        const transaction = await factory.deploy(storeName, { gasPrice: gasPrice.mul(gasPriceScale)  });

        console.log("Tx hash: " + transaction.deployTransaction.hash );
        console.log("Block Number: " + transaction.deployTransaction.blockNumber);

        signale.await(`Waiting for transaction ${transaction.deployTransaction.hash} to be mined`);

        const documentStore = await transaction.deployTransaction.wait();
        console.log("contractAddress: " + documentStore.contractAddress );
        return documentStore.contractAddress;

    }
} 

var contractAddress = new DocumentStore().deployDocumentStore();
console.log("documentStore: " + contractAddress);