import deployDocumentStore  from "../../src/components/deployDocumentStore";

import {
    Status,
    DeployRequest,
    DeployResponse,
    getWallet,
    log,
  } from "../../src/share/share";


var deployRequest: DeployRequest = { accountId:"accn1", docStoreName:"MyTestStore", network:"ropsten"
    , wallet:{ accountId:"accn1", password:"abc", address:"", jsonEncrpyted:"" } };

const document = require("../resource/wallet.json");
log(document);
// log(JSON.parse( document ) ) ;

deployRequest.wallet.jsonEncrpyted = JSON.stringify( document );
deployRequest.wallet.address = document.address;

log(JSON.stringify( deployRequest) ) ;

var deployDocument = deployDocumentStore( deployRequest );

deployDocument.then( function(result:DeployResponse) {

    console.log( result );
});
