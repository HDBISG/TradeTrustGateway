import createWallet  from "../src/implementations/walletComponent";

export default class TradeTrustService {

    async createWallet( password:string ): Promise<string> {

        var walletJson = await createWallet( password );

        return walletJson;
    }

}