import deployDocumentStore  from "../../src/components/deployDocumentStore";

import {
    Status,
    DeployRequest,
    DeployResponse,
    getWallet,
    log,
  } from "../../src/share/share";


var deployRequest: DeployRequest = { accountId:"accn1", docStoreName:"MyTestStore", network:"ropsten"
    , wallet:{ accountId:"accn1", password:"", address:"", jsonEncrpyted:""
    , privateKey:"6e717130450d364860f18581434c763fe83a6abf26d348a8548c919b0becad896e717130450d364860f18581434c763fe83a6abf26d348a8548c919b0becad89" } };


log(JSON.stringify( deployRequest) ) ;

var deployDocument = deployDocumentStore( deployRequest );

deployDocument.then( function(result:DeployResponse) {

    console.log( result );
});
