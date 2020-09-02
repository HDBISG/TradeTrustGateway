import createWallet  from "../../src/components/createWallet";
import { Status, WalletRequest, WalletResponse, log } from "../../src/share/share";

var walletRequest: WalletRequest = { accountId:"accn1", password:"pwd1"};

var walletJson =  createWallet( walletRequest );

walletJson.then( function( walletResponse:WalletResponse ) {

    console.log(  walletResponse );
})
