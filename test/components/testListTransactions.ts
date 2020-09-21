import FindWallet  from "../../src/components/FindWallet";
import ListTransactions  from "../../src/components/ListTransactions";

import {
    Status,
    FindWaletRequest,
    FindWalletResponse,
    getWallet,
    log,
  } from "../../src/share/share";


var findWaletRequest: FindWaletRequest = { accountId:"vcc"  };



var findWalletResponse = FindWallet( findWaletRequest );

findWalletResponse.then( function(result:FindWalletResponse) {

    console.log( result );

    let walletAddress:string = result.walletDetails.address;

    const srvResponse = ListTransactions( {  walletAddress } )

    srvResponse.then( function(rst:any) {

      console.log( rst );
      console.log( JSON.stringify( rst ) );
    });
});
