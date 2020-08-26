var express = require('express');
var bodyParser = require('body-parser');

const { wrapDocument, obfuscateDocument, decumentStore } = require("@govtechsg/open-attestation");
const util = require("util");

var app = express();
app.use(bodyParser.json());

app.post('/createWallet', function (req, res) {

})

app.post('/topUp', function (req, res) {

})

app.post('/deployDocStore', function (req, res) {

})

app.post('/publish', function (req, res) {
    let data = req.body;
    let document = data;
    const wrappedDocument = wrapDocument(document);
    const obfsucatedDocument = obfuscateDocument(wrappedDocument, ["transcript.name", "transcript.grade"]);
    console.log(util.inspect(wrappedDocument, { showHidden: false, depth: null }));
    console.log(util.inspect(obfsucatedDocument, { showHidden: false, depth: null }));

    // https://medium.com/coinmonks/ethereum-tutorial-sending-transaction-via-nodejs-backend-7b623b885707

    res.end(JSON.stringify(data));
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
