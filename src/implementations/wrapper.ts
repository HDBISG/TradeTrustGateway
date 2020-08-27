import fs from "fs";

const { wrapDocument} = require("@govtechsg/open-attestation");

const util = require("util");

export class WrapDocument {

    async wrap(rawData: string): Promise<String> {

        console.log( "raw " + JSON.stringify( rawData ) );
        const wrappedDocument = wrapDocument( rawData );
        console.log( "wrappedDocument    " + JSON.stringify( wrappedDocument ) );

        return JSON.stringify( wrappedDocument );
    }

    async wrapFile(rawFile: string, wrappedFile:string): Promise<String> {

        console.log( "raw " + rawFile );
        const rawData = fs.readFileSync( rawFile );
        let document = rawData;
        console.log( "rawData " + rawData.toString() );
        console.log( "rawData 2 " + JSON.stringify( rawData.toString() ) );

        const wrappedDocument = wrapDocument( JSON.stringify( rawData.toString() ) );

        console.log( "wrappedDocument " + wrappedFile );
        fs.writeFileSync( wrappedFile, wrapDocument );

        return wrappedDocument;
    }
    
    
}

// new WrapDocument().wrapFile("./resource/raw1.json","../../resource/wrapped1.json");
