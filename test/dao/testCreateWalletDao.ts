
import TradeTrustService from "../../src/service/TradeTrustService";


import {
    WalletRequest,
    ServiceResponse,
    log,
    Status,
    WalletDetails,
    WalletResponse,
    TopUpRequest,
    TopUpResponse,
    ServiceDeployRequest,
    DeployRequest,
    DeployResponse,
    DocumentStoreDetails,
    ServiceIssueRequest,
    IssueRequest,
    IssueResponse,
    DocumentDetails,
  } from "../../src/share/share";

var walletRequest: WalletRequest = { accountId:"accn1", password:"pwd1"};

var tradeTrustService = new TradeTrustService();
var ServiceResponse = tradeTrustService.createWallet( walletRequest );

ServiceResponse.then( function( serviceResponse:ServiceResponse ) {

    console.log(  serviceResponse );
})
