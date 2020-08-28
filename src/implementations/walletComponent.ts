import { ethers } from "ethers";
import { progress as defaultProgress } from "./utils/progress";
import  TopupImplement  from "./topup";



export default  async function createWallet( password:string ): Promise<string> {
    console.log("createWallet begin.");

    var progress = defaultProgress("Encrypting Wallet");

    const wallet = ethers.Wallet.createRandom();
    console.log("wallet.address : " + wallet.address );

    const walletJson = await wallet.encrypt(password, progress);

    console.log(" wallet json: " +  walletJson );

    console.log("createWallet end.");

    return walletJson;
}
