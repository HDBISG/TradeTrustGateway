import topupWallet  from "../src/implementations/topupComponent";

var topUpresult =  topupWallet("9f5553bec2be0e583841119946f70944d5bf9e25");

topUpresult.then( function(result:string) {

    console.log( result );
})
