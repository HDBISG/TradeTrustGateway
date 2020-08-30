//var express  = require('express');
import express, { Request, Response } from "express";
var bodyParser = require('body-parser');
const { wrapDocument, obfuscateDocument, decumentStore } = require("@govtechsg/open-attestation");
const util = require("util");
var path = require('path');


var wrapper = require('./implementations/wrapperComponent');
import TradeTrustService  from "./TradeTrustService";

var app = express();
app.use(bodyParser.json());


app.post('/createWallet', async function (req:Request, res:Response) {
    
    console.log("req.params = " + JSON.stringify( req.params ) );
    console.log("req.query = " + JSON.stringify( req.query ) );
    // req.param("password");
    var password:string = req.query.password as string;
    // password = req.param("password");

    console.log("password = " + password);

    var tradeTrustService = new TradeTrustService();
    var walletJson = await tradeTrustService.createWallet( password );

    if( ! walletJson) {
        res.writeHead(503);
        res.end();
        return;
    }
    res.end(  walletJson  );
})

app.post('/topUp', async function (req:Request, res:Response) {

    var walletAddress:string = req.query.walletAddress as string;

    // validation;
    if(!walletAddress) {
        res.writeHead(400);
        res.end();
        return;
    }
    var tradeTrustService = new TradeTrustService();
    var topUpresult = await tradeTrustService.topupWallet(walletAddress);

    if( !topUpresult ) {
        res.end( generateResponseJson("failed to topup","") );
        return;
    }
    res.end(  generateResponseJson("","topup successful.")  );
})

app.post('/deployDocStore', async function (req:Request, res:Response) {

    var encryptedWalletJson:string = req.body;
    var walletPassword:string = req.query.walletPassword as string;

    encryptedWalletJson = JSON.stringify( encryptedWalletJson );

    var tradeTrustService = new TradeTrustService();
    var deployDocumentJson = await tradeTrustService.deployDocumentStore(encryptedWalletJson, walletPassword );

    res.end( deployDocumentJson );
})


app.post('/wrap', function (req:any, res:Response) {
    let data = req.body;

    var tradeTrustService = new TradeTrustService();
    const wrappedDocumentJson = tradeTrustService.wrapFileJson(  data );
    console.log(  wrappedDocumentJson);

    res.end( JSON.stringify( wrappedDocumentJson ) );
})


app.post('/issue', async function (req:Request, res:Response) {

    var encryptedWalletJson:string = req.body;
    const walletPassword:string = req.query.walletPassword as string;
    const documentStoreAddress:string = req.query.documentStoreAddress as string;
    const wrappedHash:string = req.query.wrappedHash as string;

    encryptedWalletJson = JSON.stringify( encryptedWalletJson );

    var tradeTrustService = new TradeTrustService();
    var deployDocumentJson = await tradeTrustService.issue(
        encryptedWalletJson, walletPassword, documentStoreAddress, wrappedHash );

    res.end( deployDocumentJson );
})

app.post('/publish', function (req:any, res:any) {
    let data = req.body;
    let document = data;
    const wrappedDocument = wrapDocument(document);
    const obfsucatedDocument = obfuscateDocument(wrappedDocument, ["transcript.name", "transcript.grade"]);
    console.log(util.inspect(wrappedDocument, { showHidden: false, depth: null }));
    console.log(util.inspect(obfsucatedDocument, { showHidden: false, depth: null }));

    // https://medium.com/coinmonks/ethereum-tutorial-sending-transaction-via-nodejs-backend-7b623b885707

    //res.end(JSON.stringify(data));
    res.end( JSON.stringify( wrappedDocument ) );
})

var generateResponseJson = function( errorMsg:string, result:string) {

    var resultJson = { status:"","errorMsg":errorMsg,"result":result};

    resultJson.status = errorMsg ? "failed":"ok";

    console.log("generateResponseJson= " + JSON.stringify(resultJson) );

    return JSON.stringify(resultJson);
}

app.listen(8081, function () {
    console.log("Example app listening at 8081");
})
