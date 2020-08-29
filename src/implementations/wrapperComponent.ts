import fs from "fs";

const { wrapDocument } = require("@govtechsg/open-attestation");

const util = require("util");

export default class WrapComponent {

     wrap(rawData: string): String {

        console.log( "raw  ---" + ( typeof rawData ) + "  " + JSON.stringify( rawData ) );
        const wrappedDocument = wrapDocument( rawData );
        console.log( "wrappedDocument    " + JSON.stringify( wrappedDocument ) );

        return JSON.stringify( wrappedDocument );
    }

    wrapFileJson(rawFileJson: any ): string {

        console.log( "raw " + rawFileJson );

        const wrappedDocumentJson = wrapDocument( rawFileJson  );
        //const wrappedDocument = wrapDocument( rawData );
        console.log( "wrappedDocument " + JSON.stringify( wrappedDocumentJson ) );

        return wrappedDocumentJson;
    }

    wrapFile(rawFilePath: string, wrappedFilePath:string): String {

        console.log( "raw " + rawFilePath );

        const document = require( rawFilePath );


        const wrappedDocument = wrapDocument( document  );
        //const wrappedDocument = wrapDocument( rawData );

        console.log( "wrappedDocument " + JSON.stringify( wrappedDocument ) );

        fs.writeFileSync( wrappedFilePath, JSON.stringify( wrappedDocument ) );

        return wrappedDocument;
    }

    /*
     wrapFile2(rawFile: string, wrappedFile:string): String {

        console.log( "raw " + rawFile );

        const document = require("./raw1.json");
        const rawData = fs.readFileSync( rawFile );
    
        console.log( "rawData " + ( typeof document ) + "  " + ( typeof rawData ) 
             + " " + Object.keys(document).length  + " " + Object.keys(rawData).length );

        console.log(  document );
        console.log( " 1111111111 "   );
        console.log( JSON.stringify( document )  );
             
        //var wrappedDocument = wrapDocument( document );
        var wrappedDocument = wrapDocument( JSON.stringify( document ) );
        console.log( "wrappedDocument " +  JSON.stringify( wrappedDocument ) );

        console.log( rawData );

        console.log( " 22222222222 "   );
        console.log(   rawData.toString  );
        console.log(   rawData.toString()  );
        console.log(  JSON.stringify( rawData.toString() ) );

        var rawDataReplace =  rawData.toString()
        console.log(  typeof rawData   );
        console.log(  typeof rawDataReplace   );
        rawDataReplace = rawDataReplace.replace(/\r/g,'');
        rawDataReplace =  rawDataReplace.replace(/\n/g,'');
        rawDataReplace =  rawDataReplace.replace(/ /g,'');
        console.log(   rawDataReplace );

        wrappedDocument = wrapDocument( rawDataReplace );

        console.log( "wrappedDocument " + wrappedFile );
        fs.writeFileSync( wrappedFile, wrapDocument );

        return wrappedDocument;
    }
*/
}