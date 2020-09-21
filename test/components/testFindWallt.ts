import FindWallet  from "../../src/components/FindWallet";

import {
    Status,
    FindWaletRequest,
    FindWalletResponse,
    getWallet,
    log,
  } from "../../src/share/share";


var findWaletRequest: FindWaletRequest = { accountId:"accn1"  };



var findWalletResponse = FindWallet( findWaletRequest );

findWalletResponse.then( function(result:FindWalletResponse) {

    console.log( result );
});
