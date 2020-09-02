import fs from "fs";

const { verify, isValid } = require("@govtechsg/oa-verify");

const util = require("util");

export default class VerifyComponent {

    async verifyFileJson(verifyFileJson: string ): Promise<boolean> {

        console.log( "verifyFileJson " + verifyFileJson );

        var t =  verify( verifyFileJson, { network: "ropsten" } );

        t.then(function (fragments:any) {

            console.log(isValid(fragments, ["DOCUMENT_INTEGRITY"])); // output true
            console.log(isValid(fragments, ["DOCUMENT_STATUS"])); // output false
            console.log(isValid(fragments, ["ISSUER_IDENTITY"])); // output false
        });

        return true;
    }
    
    async verifyFile(verifyFilePath: string ): Promise<boolean> {

        console.log( "verifyFilePath " + verifyFilePath );
        const document = require( verifyFilePath );

        const fragments = await verify(document, { network: "ropsten" });
        console.log(fragments); // see below
        console.log(isValid(fragments)); // display true
        console.log(isValid(fragments, ["DOCUMENT_INTEGRITY"]));
        console.log(isValid(fragments, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"]));
        return true;
    }


}