import createWallet  from "../src/implementations/walletComponent";
import topupWallet  from "../src/implementations/topupComponent";
import deployDocumentStore  from "../src/implementations/deployDocumenComponent";

export default class TradeTrustService {

    // 1: 
    async createWallet( password:string ): Promise<string> {

        var walletJson = await createWallet( password );

        return walletJson;
    }

    // 2: 
    async topupWallet( walletAddress:string ): Promise<string> {

        var topUpresult = await topupWallet( walletAddress );
        
        return topUpresult;
    }

    // 3: 
    async deployDocumentStore( walletJson:string, walletPassword:string ): Promise<string> {
    
        var deployDocumentJson = await deployDocumentStore( "", walletJson, walletPassword);

        return deployDocumentJson;
    }
}