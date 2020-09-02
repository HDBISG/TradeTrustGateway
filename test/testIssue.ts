import issueDocument  from "../src/components/issueDocument";

import {
    Status,
    IssueRequest,
    IssueResponse,
    getWallet,
    log,
  } from "../src/share/share";

  
var issueRequest: IssueRequest = { wrappedHash:"0x876d09feddf23bdcb3adb9f3958ba513971c0efc6ad0f06edc31cfbd7460bd94", network:"ropsten"
, wallet:{ accountId:"accn1", password:"abc", address:"", jsonEncrpyted:"" }
, documentStore:{ "accountId":"accn1", "storeName":"Test", "address":"0xa3D1419975B497a52ba8be71091dCa412D094FA2", "network":"ropsten" } };

const document = require("../resource/wallet.json");
log(document);
// log(JSON.parse( document ) ) ;

issueRequest.wallet.jsonEncrpyted = JSON.stringify( document );
issueRequest.wallet.address = document.address;

issueDocument( issueRequest );
