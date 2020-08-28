import deployDocumentStore  from "../src/implementations/deployDocumenComponent";

var deployDocument = deployDocumentStore("abc","./resource/wallet.json");

deployDocument.then( function(result:string) {

    console.log( result );
});
