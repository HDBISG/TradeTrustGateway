var express = require("express");
var bodyParser = require("body-parser");

const {
  wrapDocument,
  obfuscateDocument,
  decumentStore,
} = require("@govtechsg/open-attestation");
const util = require("util");
var path = require("path");

var wrapper = require("./components/wrappDocument");

var app = express();
app.use(bodyParser.json());

app.post("/createWallet", function (req, res) {});

app.post("/topUp", function (req, res) {});

app.post("/deployDocStore", function (req, res) {});

app.post("/wrap", function (req, res) {
  let data = req.body;

  var wrapDocumentn = new wrapper.wrapDocument();
  console.log("begin-------------------------------------!");
  var rawPath = path.normalize(
    "/workspace_vs/TradeTrustGateway/resource/raw1.json"
  );
  var wrapPath = path.normalize(
    "/workspace_vs/TradeTrustGateway/resource/wrapp1.json"
  );
  wrapDocumentn.wrapFile(rawPath, wrapPath);

  res.end(wrappedDocument);
});

app.post("/wrap2", function (req, res) {
  let data = req.body;

  var wrapDocumentn = new wrapper.wrapDocument();
  console.log("begin-------------------------------------!");
  wrapDocumentn.wrap(data);

  res.end(wrappedDocument);
});

app.post("/publish", function (req, res) {
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
  res.end(wrappedDocument);
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
