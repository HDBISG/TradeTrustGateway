import wrapperComponent  from "../src/implementations/wrapperComponent";
var wrapper = require('../src/implementations/wrapperComponent').default;

var wrapDocument = new wrapper();

wrapDocument.wrapFile( "../../resource/raw1.json" , "./resource/wrapp1.json" );