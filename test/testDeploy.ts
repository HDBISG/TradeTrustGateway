import deployDocumentStore  from "../src/implementations/deployDocumenComponent";

var deployDocument = deployDocumentStore("./resource/wallet.json","","abc");

deployDocument.then( function(result:string) {

    console.log( result );
});
