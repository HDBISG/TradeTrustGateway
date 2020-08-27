var express = require('express');
var bodyParser = require('body-parser');

const { wrapDocument, obfuscateDocument, decumentStore } = require("@govtechsg/open-attestation");
const util = require("util");
var path = require('path');

var wrapper = require('./implementations/wrapper');

var app = express();
app.use(bodyParser.json());

app.post('/createWallet', function (req:any, res:any) {

})

app.post('/topUp', function (req:any, res:any) {

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

app.post('/wrap2', async function(req:any, res:any) {
    let data = req.body;

    var wrapDocumentn = new wrapper.WrapDocument( );
    console.log("begin-------------------------------------!");
    var wrappedDocumen = await wrapDocumentn.wrap( data );
    /*
    var wrappedDocumentPromise = wrapDocumentn.wrap( data );
    console.log("wrappedDocumentPromise" + wrappedDocumentPromise );

    var wrappedDocumen = wrappedDocumentPromise.then( function(result:string) {
        return result;
    })
    */
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

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
