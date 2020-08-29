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

    res.end(  walletJson  );
})

app.post('/topUp', async function (req:Request, res:Response) {

    var walletAddress:string = req.query.walletAddress as string;

    var tradeTrustService = new TradeTrustService();
    var topUpresult = await tradeTrustService.topupWallet(walletAddress);

    res.end(  topUpresult  );
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

app.listen(8081, function () {
    console.log("Example app listening at 8081");
})
