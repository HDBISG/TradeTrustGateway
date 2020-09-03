
import TradeTrustService from "../../src/service/TradeTrustService";
import TTRepositoryService from "../../src/service/TTRepositoryService";


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

var repositoryService = new TTRepositoryService();
var ServiceResponse = repositoryService.getWallet("accn6");

ServiceResponse.then( function( serviceResponse:ServiceResponse ) {

    console.log(  serviceResponse );
})
