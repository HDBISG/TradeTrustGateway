
import fetch from "node-fetch";
import signale from "signale";

export default async function topupWallet(walletAddress: string): Promise<string> {

    console.log("topup address : " + walletAddress);
    console.log("topup address : " + 'https://faucet.ropsten.be/donate/' + walletAddress );
    var url = 'https://faucet.ropsten.be/donate/' + walletAddress;
    console.log("topup address : " + url);

    const response = await fetch(url).then((res) => res.json());

    if (response.message) {
        var msg = '[ropsten] Adding fund to ' + walletAddress + 'failed: ' + response.message;
        //signale.warn(`[ropsten] Adding fund to ${walletAddress} failed: ${response.message}`);
        signale.warn( msg);
        return msg;
    } else {
        var msg = '[ropsten] Added fund to ' + walletAddress;
        signale.info( msg);
        return msg;
    }
}
