const { wrapDocument } = require("@govtechsg/open-attestation");
import { WrapResponse, log, Status } from "../share/share";
/**
 *
 */
export default class WrapDocument {
  /**
   * Wraps the document
   * @param rawData raw data for wrapping
   */
  public wrap(rawData: any): WrapResponse {
    log(`<wrap> raw: ${typeof rawData} : ${rawData}`);

    var wrapResponse: WrapResponse = {
      status: Status.FAIL,
      msg: "",
      details: "",
    };

    try {
      if (!rawData) throw new Error("param rawData null");

      const wrappedDocument = wrapDocument(rawData);
      if (!wrappedDocument) throw new Error("wrappedDocument null");

      wrapResponse.status = Status.SUCCESS;
      wrapResponse.details = wrappedDocument;
    } catch (error) {
      wrapResponse.status = Status.ERROR;
      wrapResponse.msg = error.message;
    }

    log(`<wrap> wrapResponse: ${JSON.stringify(wrapResponse)}`);
    return wrapResponse;
  }
}
