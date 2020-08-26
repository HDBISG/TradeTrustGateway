import { ethers } from "ethers";
import { progress as defaultProgress } from "./utils/progress";
import  TopupImplement  from "./topup";

class WalletImplement {

    async createWallet(): Promise<String> {
        console.log("createWallet begin.");

        var password = "abc";
        var progress = defaultProgress("Encrypting Wallet");

        const wallet = ethers.Wallet.createRandom();
        console.log("wallet.address : " + wallet.address );

        const json = await wallet.encrypt(password, progress);

        console.log(" wallet json: " +  json );
        // console.log(" wallet json: " + JSON.stringify( json ) );

        new TopupImplement().topupWallet(wallet.address );

        console.log("createWallet end.");

        return wallet.address;
    }
} 

var walletAddressPromise: Promise<String> = new WalletImplement().createWallet();

// var walletAddress: string = await new WalletImplement().createWallet();



