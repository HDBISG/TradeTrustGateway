import WrapDocument  from "../../src/components/wrappDocument";
import { WrapResponse, log, Status } from "../../src/share/share";
var wrapper = require('../../src/components/wrappDocument').default;

var wrapDocument = new WrapDocument();

const document = require("../../resource/raw.json");

var wrapResponse = wrapDocument.wrap(  document  );

console.log( wrapResponse);