import createWallet from "../components/createWallet";
import FindWallet from "../components/FindWallet";
import topupWallet from "../components/topupWallet";
import deployDocumentStore from "../components/deployDocumentStore";
import issueDocument from "../components/issueDocument";
import ListTransactions from "../components/ListTransactions";
import { exception } from "console";
import {
  WalletRequest,
  ServiceResponse,
  log,
  Status,
  WalletDetails,
  WalletResponse,
  FindWaletRequest,
  FindWalletResponse,
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
  ListTransactionHttpRequest,
  ListTransactionRequest,
  EtherTransaction,
  WrapRequest
} from "../share/share";
import TTRepositoryService from "./TTRepositoryService";
import { json } from "express";

export default class TradeTrustService {
  
  private repoService: TTRepositoryService = new TTRepositoryService();

  /**
   * Create the wallet asscoiated with the accountId (accountId:wallet = 1:1)
   * @param walletRequest
   */
  async createWallet(walletRequest: WalletRequest): Promise<ServiceResponse> {
    log(`<createwallet> walletRequest: ${JSON.stringify(walletRequest)}`);

    let svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      // Create the wallet into blockchain via the component
      var walletResponse: WalletResponse = await createWallet(walletRequest);
      if (!walletResponse) throw new Error("walletResponse null");
      var walletDetails: WalletDetails = walletResponse.details;
      if (!walletDetails) throw new Error("wallDetails null");

      // Insert wallet into T_TTGW_WALLET
      var repoSvcResponse: ServiceResponse = await this.repoService.insertWallet(
        walletDetails
      );

      if (repoSvcResponse.status != Status.SUCCESS) {
        throw new Error(`repoSvc: ${repoSvcResponse.msg}`);
      }
      svcResponse.status = Status.SUCCESS;
      svcResponse.msg = "SUCCESS";
      svcResponse.details = walletResponse.details; // 
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = "ERROR";
      svcResponse.details = error.message;
    }

    log(`<createwallet> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  async findWallet(findWaletRequest: FindWaletRequest): Promise<ServiceResponse> {
    log(`<findWallet> FindWaletRequest: ${JSON.stringify(findWaletRequest)}`);

    let svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      // Create the wallet into blockchain via the component
      var walletResponse: FindWalletResponse = await FindWallet(findWaletRequest);
      if (!walletResponse) throw new Error("walletResponse null");
      var walletDetails: WalletDetails = walletResponse.walletDetails;
      if (!walletDetails) throw new Error("wallDetails null");


      svcResponse.status = Status.SUCCESS;
      svcResponse.msg = "SUCCESS";
      svcResponse.details = walletResponse.walletDetails; // 
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = "ERROR";
      svcResponse.details = error.message;
    }

    log(`<createwallet> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  /**
   * Tops up the wallet assoicated with <accountId> for number of <ehter>
   * @param accountId
   * @param ether
   */
  async topupWallet(topUpRequest: TopUpRequest): Promise<ServiceResponse> {
    log(`<topupWallet> topUpRequest: ${JSON.stringify(topUpRequest)}`);

    let svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!topUpRequest) throw Error("param topUpRequest null");
      if (!topUpRequest.accountId)
        throw Error("param topUpRequest.accountId null");
      if (!topUpRequest.ether) throw Error("param topUpRequest.ether null");

      // Get the walletDetails from T_TTGW_WALLET for the wallet associated with the accountId
      var walletDetails: WalletDetails = await this.getWalletDetails(
        topUpRequest.accountId
      );
      if (!walletDetails) throw new Error("Fail to find wallet via " + topUpRequest.accountId );
      
      log(`<topupWallet> walletDetails: ${JSON.stringify(walletDetails)}`);

      // Invoke the top via the component
      topUpRequest.walletAddress = walletDetails.address;
      var topUpResponse: TopUpResponse = await topupWallet(topUpRequest);
      if (!topUpResponse) throw new Error("topUpResponse null");

      if (topUpResponse.status != Status.SUCCESS)
        throw new Error(`repoSvc: ${topUpResponse.msg}`);

      svcResponse.status = Status.SUCCESS;
      svcResponse.msg = "SUCCESS";
      svcResponse.details = "SUCCESS";
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = "ERROR";
      svcResponse.details = error.message;
    }
    log(`svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  /**
   * Deploy the document store
   * @param svcDeployRequest
   */
  async deployDocumentStore(
    svcDeployRequest: ServiceDeployRequest
  ): Promise<ServiceResponse> {

    log(
      `<deployDocumentStore> svcDeployRequest: ${JSON.stringify(
        svcDeployRequest
      )}`
    );

    let svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!svcDeployRequest) throw exception("param docStoreName null");
      if (!svcDeployRequest.accountId)
        throw exception("param svcDeployRequest.accountId null");
      if (!svcDeployRequest.docStoreName)
        throw exception("param svcDeployRequest.docStoreName null");
      if (!svcDeployRequest.network)
        throw exception("param svcDeployRequest.network null");

      // Get the walletDetails from T_TTGW_WALLET for the wallet associated with the accountId
      var walletDetails: WalletDetails = await this.getWalletDetails(
        svcDeployRequest.accountId
      );
      if (!walletDetails) throw new Error("wallDetails null");
      log(
        `<deployDocumentStore> walletDetails: ${JSON.stringify(walletDetails)}`
      );

      // Invoke the deployment of document store via the component
      var deployReqeust: DeployRequest = {
        accountId: svcDeployRequest.accountId,
        docStoreName: svcDeployRequest.docStoreName,
        network: svcDeployRequest.network,
        wallet: walletDetails
      };
      var deployResponse: DeployResponse = await deployDocumentStore(
        deployReqeust
      );
      if (!deployResponse) throw new Error("deployResponse null");
      if (deployResponse.status != Status.SUCCESS) {
        throw new Error(`repoSvc: ${deployResponse.msg}`);
      }

      var documentStoreDetails: DocumentStoreDetails = deployResponse.docStore;

      documentStoreDetails.renderName= svcDeployRequest.renderName; 
      documentStoreDetails.renderType= "EMBEDDED_RENDERER";
      documentStoreDetails.renderUrl= svcDeployRequest.renderUrl; 
      documentStoreDetails.name= "smart eCO";
      documentStoreDetails.issuerName= svcDeployRequest.issuerName; 
      documentStoreDetails.issuerType= "DNS-TXT";
      documentStoreDetails.issuerLocation= svcDeployRequest.issuerLocation;

      // Insert wallet into T_TTGW_DOCSTORE
      var repoSvcResponse: ServiceResponse = await this.repoService.insertDocumentStore(
        documentStoreDetails
      );
      if (repoSvcResponse.status != Status.SUCCESS) {
        throw new Error(`repoSvc: ${repoSvcResponse.msg}`);
      }

      svcResponse.status = Status.SUCCESS;
      svcResponse.msg = "SUCCESS";
      svcResponse.details = documentStoreDetails ; // 
    } catch (error) {
      log( error.stack );
      svcResponse.status = Status.ERROR;
      svcResponse.msg = "ERROR";
      svcResponse.details = error.message;
    }
    log(`svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  /**
   * Issue the document into the document store
   * @param svcIssueRequest
   */
  async issueDocument(
    svcIssueRequest: ServiceIssueRequest
  ): Promise<ServiceResponse> {
    log(`<issueDocument> svcIssueRequest: ${JSON.stringify(svcIssueRequest)}`);

    let svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!svcIssueRequest) throw new Error("param svcIssueRequest null");
      if (!svcIssueRequest.rawData)
        throw new Error("param svcIssueRequest.rawData null");
      if (!svcIssueRequest.accountId)
        throw new Error("param svcIssueRequest.accountId null");
      if (!svcIssueRequest.storeName)
        throw new Error("param svcIssueRequest.storeName null");

      // Get the document store details from T_TTGW_DOCSTORE assoicated with accountId and storeName
      var docStoreDetails: DocumentStoreDetails = await this.getStoreDetails(
        svcIssueRequest.accountId,
        svcIssueRequest.storeName
      );
      if (!docStoreDetails) throw new Error("docStoreDetails null");
      //
      var rawDataWithTempalteIssue = this.prepareRawDataWithTempalteIssue( svcIssueRequest.rawData, docStoreDetails );

      // wrap the raw data into a wrap document
      var wrapper = require("../components/wrappDocument").default;
      var wrapDocument = new wrapper();
      const wrappedDocumentJson = wrapDocument.wrap( rawDataWithTempalteIssue );
      if (!wrappedDocumentJson) throw new Error("wrappedDocumentJson null");
      log(`---wrapp data: ${JSON.stringify( wrappedDocumentJson ) }`);
      const wrappDocument = wrappedDocumentJson.details;
      var merkleRoot = wrappDocument.signature.merkleRoot;

      log(`<issueDocument> merkleRoot: ${merkleRoot}`);

      // Get the walletDetails from T_TTGW_WALLET for the wallet associated with the accountId
      var walletDetails: WalletDetails = await this.getWalletDetails(
        svcIssueRequest.accountId
      );
      if (!walletDetails) throw new Error("walletDetails null");


      //var wrappedHash = sssssss  // "wrappedDocumentJson.hash"; // **** WHAT IS THIS HASH VALUE
      var issueRequest: IssueRequest = {
        wrappedHash: "0x"+merkleRoot,
        network: docStoreDetails.network,
        wallet: walletDetails,
        documentStore: docStoreDetails,
      };

      // Issue the document into the block chain via the component
      var issueResponse: IssueResponse = await issueDocument(issueRequest);
      if (!issueResponse) throw new Error("issueResponse null");
      log(`<issueDocument> issueResponse: ${JSON.stringify(issueResponse)}`);

      if (issueResponse.status != Status.SUCCESS) {
        throw new Error(`repoSvc: ${issueResponse.msg}`);
      }
      var issueDeailRsp = JSON.parse( issueResponse.details );
      
      var docDetails: DocumentDetails = {
        accountId: svcIssueRequest.accountId,
        storeName: svcIssueRequest.storeName,
        wrappedHash: merkleRoot,
        address: docStoreDetails.address,
        walletAddr: issueDeailRsp.walletAddr,
        tranHash: issueDeailRsp.tranHash,
        wrappedDocument: JSON.stringify(wrappDocument),
        rawDocument: JSON.stringify(svcIssueRequest.rawData),
      };

      // Insert wallet into T_TTGW_DOCSTORE
      var repoSvcResponse: ServiceResponse = await this.repoService.insertDocument(
        docDetails
      );
      if (repoSvcResponse.status != Status.SUCCESS) {
        throw new Error(`repoSvc: ${repoSvcResponse.msg}`);
      }

      svcResponse.status = Status.SUCCESS;
      svcResponse.msg = "SUCCESS";
      svcResponse.details = wrappedDocumentJson.details;
    } catch (error) {
      log(error.stack);
      svcResponse.status = Status.ERROR;
      svcResponse.msg = "ERROR";
      svcResponse.details = error.message;
    }
    log(`svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  
  async listTransaction(listTransactionHttpRequest: ListTransactionHttpRequest): Promise<ServiceResponse> {
    log(`<listTransaction> ListTransactionHttpRequest: ${JSON.stringify(listTransactionHttpRequest)}`);

    let svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      // Create the wallet into blockchain via the component
      let findWaletRequest: FindWaletRequest =  { accountId: listTransactionHttpRequest.accountId };
      var walletResponse: FindWalletResponse = await FindWallet(findWaletRequest);

      if (!walletResponse) throw new Error("walletResponse null");
      var walletDetails: WalletDetails = walletResponse.walletDetails;
      if (!walletDetails) throw new Error("wallDetails null");

      const walletAddress:string = walletDetails.address;

      var listTransactionRequest: ListTransactionRequest = { "walletAddress":walletAddress };

      var listTransRsp:ServiceResponse = await ListTransactions( listTransactionRequest );

//       listTransactionRequest: ListTransactionRequest
      var etherscanList = listTransRsp.details;
      
      var transactionList:EtherTransaction[] = []; 
      
      //log(`!etherscanList= ${!etherscanList}`) ;

      if( etherscanList ) {
        var idx:any; 
        for(idx in etherscanList) { 
          console.log(etherscanList[idx]) ;
          let transaction: EtherTransaction = {
            "blockNumber":etherscanList[idx].blockNumber,
            "timeStamp": etherscanList[idx].timeStamp,
            "hash": etherscanList[idx].hash,
            "nonce": etherscanList[idx].nonce,
            "blockHash": etherscanList[idx].blockHash,
            "transactionIndex": etherscanList[idx].transactionIndex,
            "from": etherscanList[idx].from,
            "to": etherscanList[idx].to,
            "value": etherscanList[idx].value,
            "gas": etherscanList[idx].gas,
            "gasPrice": etherscanList[idx].gasPrice,
            "isError": etherscanList[idx].isError,
            "txreceipt_status": etherscanList[idx].txreceipt_status,
            "input": etherscanList[idx].input,
            "contractAddress": etherscanList[idx].contractAddress,
            "cumulativeGasUsed": etherscanList[idx].cumulativeGasUsed,
            "gasUsed": etherscanList[idx].gasUsed,
            "confirmations": etherscanList[idx].confirmations 
          };
          transactionList.push( transaction );
        }
      }

      svcResponse.status = Status.SUCCESS;
      svcResponse.msg = "SUCCESS";
      svcResponse.details = transactionList;
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = "ERROR";
      svcResponse.details = error.message;
    }

    log(`<createwallet> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }


  /**
   * Get the wallet from T_TTGW_WALLET based on <accountId>
   * @param accountId
   */
  private async getWalletDetails(accountId: string): Promise<WalletDetails> {
    log(`<getWalletDetails> accountId: ${accountId}`);

    var walletDetails: WalletDetails = {
      accountId: "",
      password: "",
      address: "",
      jsonEncrpyted: "",
    };
    try {
      if (!accountId) throw new Error("param accountId null");
      var repoSvcResponse: ServiceResponse = await this.repoService.getWallet(
        accountId
      );
      log(`repoSvcResponse: ${JSON.stringify(repoSvcResponse)}`);
      if (!repoSvcResponse) throw new Error("repoSvcResponse null");

      walletDetails = repoSvcResponse.details[0];
    } catch (error) {}
    return walletDetails;
  }

  /**
   * Get the wallet from T_TTGW_WALLET based on <accountId>
   * @param accountId
   */
  private async getStoreDetails(
    accountId: string,
    storeName: string
  ): Promise<DocumentStoreDetails> {
    log(`<getStoreDetails> accountId: ${accountId} storeName: ${storeName}`);

    var docStoreDetails: DocumentStoreDetails = {
      accountId: "",
      storeName: "",
      address: "",
      network: "",
      walletAddr:"", tranHash:"",
      renderName: "", renderType: "", renderUrl: "", name: "",
      issuerName: "", issuerType: "", issuerLocation: "", remark: "",
    };
    try {
      if (!accountId) throw new Error("param accountId null");
      if (!storeName) throw new Error("param storeName null");
      var repoSvcResponse: ServiceResponse = await this.repoService.getDocumentStore(
        accountId,
        storeName
      );
      log(`repoSvcResponse: ${JSON.stringify(repoSvcResponse)}`);
      if (!repoSvcResponse) throw new Error("repoSvcResponse null");

      docStoreDetails = repoSvcResponse.details[0];
    } catch (error) {}
    return docStoreDetails;
  }

  /**
   * Get the boilerplate service response
   */
  private getDefaultServiceResponse(): ServiceResponse {
    let svcResponse: ServiceResponse = {
      status: Status.FAIL,
      msg: "",
      details: "",
    };
    return svcResponse;
  }

  private prepareRawDataWithTempalteIssue( renderBody:any, docStoreDetails: DocumentStoreDetails ) : any {

    // conver string to JSON
    if( (typeof renderBody) === "string" ) {
      renderBody = JSON.parse(renderBody);
    }

    var wrappData = {"$template":{},"name":"","data":renderBody,"issuers":{} };
    //wrappData.$template =  {};

    var template = { "name":docStoreDetails.renderName, "type":docStoreDetails.renderType, "url":docStoreDetails.renderUrl };
    wrappData.$template = template;
    wrappData.name = docStoreDetails.name;

    var issuers = [{"name":docStoreDetails.issuerName , "documentStore":docStoreDetails.address
      , "identityProof":{ "type":docStoreDetails.issuerType, "location":docStoreDetails.issuerLocation } }];

    wrappData.issuers = issuers;

    log(`---row data: ${JSON.stringify(wrappData) }`);
    // return object;
    return wrappData;
  }
}
