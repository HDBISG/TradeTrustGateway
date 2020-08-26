
import fetch from "node-fetch";
import signale from "signale";

class TopupImplement {

    async topupWallet(walletAddress: string): Promise<void> {

        console.log("topup address : " + walletAddress);
        console.log("topup address : " + 'https://faucet.ropsten.be/donate/${walletAddress}' );
        var url = 'https://faucet.ropsten.be/donate/' + walletAddress;
        console.log("topup address : " + url);

        const response = await fetch(url).then((res) => res.json());

        if (response.message) {
            signale.warn(`[ropsten] Adding fund to ${walletAddress} failed: ${response.message}`);
        } else {
            signale.info(`[ropsten] Added fund to ${walletAddress}`);
        }
    }
}
export default TopupImplement;