import topupWallet  from "../src/components/topupWallet";
import { Status, TopUpRequest, TopUpResponse, log } from "../src/share/share";

var topUpRequest: TopUpRequest = { accountId:"accn1", walletAddress:"dff784202117153847401c522c733e25bb976f66",ether:1 };

var topUpresult =  topupWallet( topUpRequest );

topUpresult.then( function(result:TopUpResponse) {

    console.log( result );
})
