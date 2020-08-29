import createWallet  from "../src/implementations/walletComponent";
import topupWallet  from "../src/implementations/topupComponent";
import deployDocumentStore  from "../src/implementations/deployDocumenComponent";
import issueComponent  from "../src/implementations/issueComponent";

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

    // 4: 
    wrapFileJson( rawFileJson: any ): string {

        var wrapper = require('../src/implementations/wrapperComponent').default;
        var wrapDocument = new wrapper();
        const wrappedDocumentJson = wrapDocument.wrapFileJson( rawFileJson );

        return wrappedDocumentJson;
    }
    // 5: 
    async issue( walletJson:string, walletPassword:string,
        documentStoreAddress:string, wrappedHash:string ): Promise<string> {
    
        var issueResult = await issueComponent( "", walletJson, walletPassword
        , documentStoreAddress, wrappedHash );

        return JSON.stringify( issueResult );
    }
}