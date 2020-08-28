import createWallet  from "../src/implementations/walletComponent";

var walletJson =  createWallet("abc");

walletJson.then( function(result:string) {

    var walletJsonObj = JSON.parse( result );
    console.log(walletJsonObj.address);
})
