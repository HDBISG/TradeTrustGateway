//var express  = require('express');
import express, { Request, Response } from "express";
var bodyParser = require("body-parser");

const {
  wrapDocument,
  obfuscateDocument,
  decumentStore,
} = require("@govtechsg/open-attestation");

const util = require("util");
var path = require("path");

import TradeTrustService from "./service/TradeTrustService";
import TTRepositoryService from "./service/TTRepositoryService";


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
  AuditLog,
} from "../src/share/share";

var app = express();
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

var tradeTrustService = new TradeTrustService();
var ttRepositoryService = new TTRepositoryService();

app.post("/createWallet", async function (req: Request, res: Response) {

  let walletRequest = req.body;
  var auditLog:AuditLog = { event:req.path, accountId:walletRequest.accountId, storeName:""
      , remoteIp:"", requestBody:walletRequest, rspStatus:"", rspMessage:"", rspDetails:"" };
  
  try {
    var serviceResponse = await tradeTrustService.createWallet( walletRequest );
    auditLog.rspStatus = serviceResponse.status.toString();
    auditLog.rspMessage = serviceResponse.msg!;
    auditLog.rspDetails = serviceResponse.details;

    log( `serviceResponse.status:    ${serviceResponse.status}`);

    res.end( JSON.stringify(serviceResponse) );
  } finally {
    ttRepositoryService.insertAuditLog(auditLog);
  }

});


app.post("/topUp", async function (req: Request, res: Response) {

  let topUpRequest = req.body;

  if ( !topUpRequest || !topUpRequest.accountId )  {
    res.status(400);
    res.send('Parameter is not correct.');
    res.end();
    return;
  }

  var serviceResponse = await tradeTrustService.topupWallet( topUpRequest );

  log( `serviceResponse.status:    ${ JSON.stringify(serviceResponse) }`);

  res.end( JSON.stringify(serviceResponse) );

});


app.post("/deployDocStore", async function (req: Request, res: Response) {
  let serviceDeployRequest = req.body;

  if ( !serviceDeployRequest || !serviceDeployRequest.accountId
       || !serviceDeployRequest.docStoreName || !serviceDeployRequest.network )  {
    res.status(400);
    res.send('Parameter is not correct.');
    res.end();
    return;
  }

  var serviceResponse = await tradeTrustService.deployDocumentStore( serviceDeployRequest );

  log( `serviceResponse.status:  ${JSON.stringify(serviceResponse)}`);

  res.end( JSON.stringify(serviceResponse) );
});


app.post("/issue", async function (req: Request, res: Response) {

  let serviceIssueRequest = req.body;

  if ( !serviceIssueRequest || !serviceIssueRequest.rawData || !serviceIssueRequest.accountId || !serviceIssueRequest.storeName )  {
    res.status(400);
    res.send('Parameter is not correct.');
    res.end();
    return;
  }

  var serviceResponse = await tradeTrustService.issueDocument( serviceIssueRequest );

  log( `serviceResponse.status:  ${JSON.stringify(serviceResponse)}`);

  res.end( JSON.stringify(serviceResponse) );
});

app.post("/publish", function (req: any, res: any) {
  let data = req.body;
  let document = data;
  const wrappedDocument = wrapDocument(document);
  const obfsucatedDocument = obfuscateDocument(wrappedDocument, [
    "transcript.name",
    "transcript.grade",
  ]);
  console.log(
    util.inspect(wrappedDocument, { showHidden: false, depth: null })
  );
  console.log(
    util.inspect(obfsucatedDocument, { showHidden: false, depth: null })
  );

  // https://medium.com/coinmonks/ethereum-tutorial-sending-transaction-via-nodejs-backend-7b623b885707

  //res.end(JSON.stringify(data));
  res.end(JSON.stringify(wrappedDocument));
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  // if(req.method=="OPTIONS") res.send(200);
  // else  next();
});


app.listen(80, function ( req: Request, res: Response ) {

  console.log("Example app listening at 80");
});
