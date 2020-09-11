import issueDocument  from "../../src/components/issueDocument";

import {
    Status,
    IssueRequest,
    IssueResponse,
    getWallet,
    log,
  } from "../../src/share/share";

  
var issueRequest: IssueRequest = { wrappedHash:"0x08d57133d071d9023eed8870ea525c00aa766240bb00da83c747af1057c537b7", network:"ropsten"
, wallet:{ accountId:"accn1", password:"", address:"", jsonEncrpyted:"", privateKey:"6e717130450d364860f18581434c763fe83a6abf26d348a8548c919b0becad89" }
, documentStore:{ "accountId":"accn1", "storeName":"Test", "address":"0xB74B195fd7a7006A60221Db6DABe2cab97D91d48", "network":"ropsten"
  ,renderName: "",
  renderType: "",
  renderUrl:"",
  name:"",
  issuerName: "",
  issuerType: "",
  issuerLocation: "",
  remark:"" } };


issueDocument( issueRequest );
