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

app.post('/topUp', async function (req:any, res:any) {

    var walletAddress:string = req.query.walletAddress as string;

    var tradeTrustService = new TradeTrustService();
    var topUpresult = await tradeTrustService.topupWallet(walletAddress);

    res.end(  topUpresult  );
})

app.post('/deployDocStore', function (req:any, res:any) {

})


app.post('/wrap', async function (req:any, res:any) {
    let data = req.body;

    var wrapDocument = new wrapper.WrapDocument();
    var rawPath = path.normalize( "/workspace_vs/TradeTrustGateway/resource/raw1.json" ); 
    var wrapPath = path.normalize( "/workspace_vs/TradeTrustGateway/resource/wrapp1.json" ); 
    var wrappedDocumentPromise = wrapDocument.wrapFile( rawPath, wrapPath );

    var wrappedDocumen = wrappedDocumentPromise.then( function(result:string) {
        return result;
    })

    res.end( wrappedDocumen );
})

app.post('/wrapAwait', async function(req:any, res:any) {
    let data = req.body;

    var wrapDocumentn = new wrapper.WrapDocument( );
    var wrappedDocumen = await wrapDocumentn.wrap( data );

    res.end( JSON.stringify( wrappedDocumen ) );
})


app.post('/wrapThen', function(req:any, res:any) {
    let data = req.body;

    var wrapDocumentn = new wrapper.WrapDocument( );

    var wrappedDocumentPromise = wrapDocumentn.wrap( data );
    console.log("wrappedDocumentPromise" + wrappedDocumentPromise );

    var wrappedDocumen ;
    wrappedDocumentPromise.then( function(result:string) {
        wrappedDocumen = result;
        console.log("result" + result );
    })

    res.end( JSON.stringify( wrappedDocumen ) );
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
