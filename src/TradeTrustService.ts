import createWallet  from "../src/implementations/walletComponent";
import topupWallet  from "../src/implementations/topupComponent";

export default class TradeTrustService {

    // 1: 
    async createWallet( password:string ): Promise<string> {

        var walletJson = await createWallet( password );

        return walletJson;
    }

    // 1: 
    async topupWallet( walletAddress:string ): Promise<string> {

        var topUpresult = await topupWallet( walletAddress );
        
        return topUpresult;
    }
}