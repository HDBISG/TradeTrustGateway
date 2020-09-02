import {
  ServiceResponse,
  WalletDetails,
  DocumentStoreDetails,
  log,
  Status,
  DocumentDetails,
} from "../share/share";

export default class TTRepositoryService {
  private mysql: any = require("mysql");
  private pool: any;

  constructor() {
    log("TTRepositoryService");
    this.pool = this.mysql.createPool({
      connectionLimit: 20, //important
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'tradetrust',
      debug: false,
    });
  }

  /**
   * Insert wallet details into database
   * @param walletDetails
   */
  async insertWallet(walletDetails: WalletDetails): Promise<ServiceResponse> {
    log(`<insertWallet> walletDetails: ${JSON.stringify(walletDetails)}`);

    var svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!walletDetails) throw new Error("param walletDetails null");

      let dtNow: string = TTRepositoryService.getNow();
      let insertQuery: string =
        'INSERT INTO ?? (??,??,??,??,??,??,??,??,??) VALUES ( ?,?,?, ?,?,?, ?,?,?)';
      let sql: any = this.mysql.format(insertQuery, [
        "T_TTGW_WALLET",
        "WALLET_ACCN_ID", // primary key
        "WALLET_ADDR",
        "WALLET_PASSWORD",
        "WALLET_JSON",
        "WALLET_STATUS",
        "WALLET_UID_CREATE",
        "WALLET_DT_CREATE",
        "WALLET_UID_UPD",
        "WALLET_DT_UPD",
        walletDetails.accountId,
        walletDetails.address,
        walletDetails.password,
        walletDetails.jsonEncrpyted,
        "A",
        "SYS",
        dtNow,
        "SYS",
        dtNow,
      ]);

     //  log(  this.pool);

      var query = this.pool.query(sql, (err: any, response: any) => {
        if (err) {
          svcResponse.status = Status.ERROR;
          svcResponse.msg = err.message;
        } else {
          svcResponse.status = Status.SUCCESS;
          svcResponse.details = response.insertId;
        }

        log( `err: ${err}`);
        log( `response: ${response}`);

      });
      console.log(query.sql);

    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = error.message;
    }

    log(`<insertWallet> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  /**
   * Get WalletDetails assoicated with accountId
   * @param accontId
   */
  public async getWallet(accnId: String): Promise<ServiceResponse> {
    log(`<getWallet> accnId: ${accnId}`);

    var svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!accnId) throw new Error("param accnId null");

      let selectQuery: string = "SELECT * FROM ?? WHERE ?? = ?";
      let query: string = this.mysql.format(selectQuery, [
        "T_TTGW_WALLET",
        "WALLET_ACCN_ID",
        accnId,
      ]);
      this.pool.query(query, (err: any, data: any) => {
        if (err) {
          svcResponse.status = Status.ERROR;
          svcResponse.msg = err.message;
        } else {
          svcResponse.status = Status.SUCCESS;
          let wallets = data.map((item: any) => {
            let walletDetails: WalletDetails = {
              accountId: item.WALLET_ACCN_ID,
              password: item.WALLET_PASSWORD,
              address: item.WALLET_ADDR,
              jsonEncrpyted: item.WALLET_JSON,
            };
          });
          svcResponse.details = wallets;
        }
      });
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = error.message;
    }
    log(`<getWallet> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  /**
   * Insert record into T_TTGW_DOCSTORE
   * @param documentStoreDetails
   */
  public async insertDocumentStore(
    documentStoreDetails: DocumentStoreDetails
  ): Promise<ServiceResponse> {
    log(
      `<insertDocumentStore> documentStoreDetails: ${JSON.stringify(
        documentStoreDetails
      )}`
    );

    var svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!documentStoreDetails)
        throw new Error("param documentStoreDetails null");
      if (!documentStoreDetails.accountId)
        throw new Error("param documentStoreDetails.accountId null");
      if (!documentStoreDetails.storeName)
        throw new Error("param documentStoreDetails.storeName null");
      if (!documentStoreDetails.address)
        throw new Error("param documentStoreDetails.address null");
      if (!documentStoreDetails.network)
        throw new Error("param documentStoreDetails.network null");

      let dtNow: string = TTRepositoryService.getNow();
      let insertQuery: string =
        "INSERT INTO ?? (??,??,??,??,??,??,??,??,??) VALUES ??,??,??,??,??,??,??,??,??)";
      let query: any = this.mysql.format(insertQuery, [
        "T_TTGW_DOCSTORE",
        "DOCSTORE_ACCN_ID", // primary key
        "DOCSTORE_NAME", // primary key
        "DOCSTORE_ADDR",
        "DOCSTORE_NETWORK",
        "DOCSTORE_STATUS",
        "DOCSTORE_UID_CREATE",
        "DOCSTORE_DT_CREATE",
        "DOCSTORE_UID_UPD",
        "DOCSTORE_DT_UPD",
        documentStoreDetails.accountId,
        documentStoreDetails.storeName,
        documentStoreDetails.address,
        documentStoreDetails.network,
        "A",
        "SYS",
        dtNow,
        "SYS",
        dtNow,
      ]);
      this.pool.query(query, (err: any, response: any) => {
        if (err) {
          svcResponse.status = Status.ERROR;
          svcResponse.msg = err.message;
        } else {
          svcResponse.status = Status.SUCCESS;
          svcResponse.details = response.insertId;
        }
      });
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = error.message;
    }

    log(`<insertDocumentStore> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  /**
   * Get the document store details asscoiated with <accnId> and <storeName>
   * @param accnId
   * @param docStoreName
   */
  public async getDocumentStore(
    accnId: String,
    docStoreName: string
  ): Promise<ServiceResponse> {
    log(`<getDocumentStore> accnId: ${accnId} docStoreName: ${docStoreName}`);

    var svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!accnId) throw new Error("param accnId null");
      if (!docStoreName) throw new Error("param docStoreName null");

      let selectQuery: string = "SELECT * FROM ?? WHERE ?? = ? and ?? = ?";
      let query: string = this.mysql.format(selectQuery, [
        "T_TTGW_DOCSTORE",
        "DOCSTORE_ACCN_ID",
        accnId,
        "DOCSTORE_NAME",
        docStoreName,
      ]);
      this.pool.query(query, (err: any, data: any) => {
        if (err) {
          svcResponse.status = Status.ERROR;
          svcResponse.msg = err.message;
        } else {
          svcResponse.status = Status.SUCCESS;
          let docStoreDetails = data.map((item: any) => {
            let docStoreDetal: DocumentStoreDetails = {
              accountId: item.DOCSTORE_ACCN_ID,
              storeName: item.DOCSTORE_NAME,
              address: item.DOCSTORE_ADDR,
              network: item.DOCSTORE_NETWORK,
            };
          });
          svcResponse.details = docStoreDetails;
        }
      });
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = error.message;
    }
    log(`<getDocumentStore> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  /**
   * Insert record into T_TTGW_DOC
   * @param documentDetails
   */
  public async insertDocument(
    documentDetails: DocumentDetails
  ): Promise<ServiceResponse> {
    log(`<insertDocument> documentDetails: ${JSON.stringify(documentDetails)}`);

    var svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!documentDetails) throw new Error("param documentDetails null");
      if (!documentDetails.accountId)
        throw new Error("param documentDetails.accountId null");
      if (!documentDetails.storeName)
        throw new Error("param documentDetails.storeName null");
      if (!documentDetails.wrappedHash)
        throw new Error("param documentDetails.wrappedHash null");
      if (!documentDetails.address)
        throw new Error("param documentDetails.address null");
      if (!documentDetails.wrappedDocument)
        throw new Error("param documentDetails.wrappedDocument null");
      if (!documentDetails.rawDocument)
        throw new Error("param documentDetails.rawDocument null");

      const uuid = require("uuid");
      let dtNow: string = TTRepositoryService.getNow();
      let insertQuery: string =
        "INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??) VALUES ??,??,??,??,??,??,??,??,??,??,??,??)";
      let query: any = this.mysql.format(insertQuery, [
        "T_TTGW_DOC",
        "DOC_DOC_ID", // Primary key
        "DOC_ACCN_ID",
        "DOC_STORE_NAME",
        "DOC_WRAP_HASH",
        "DOC_ADDR",
        "DOC_WRAP_DOC",
        "DOC_WRAP_RAW_DOC",
        "DOC_STATUS",
        "DOCSTORE_UID_CREATE",
        "DOCSTORE_DT_CREATE",
        "DOCSTORE_UID_UPD",
        "DOCSTORE_DT_UPD",
        uuid(),
        documentDetails.accountId,
        documentDetails.storeName,
        documentDetails.wrappedHash,
        documentDetails.address,
        documentDetails.wrappedDocument,
        documentDetails.rawDocument,
        "A",
        "SYS",
        dtNow,
        "SYS",
        dtNow,
      ]);
      this.pool.query(query, (err: any, response: any) => {
        if (err) {
          svcResponse.status = Status.ERROR;
          svcResponse.msg = err.message;
        } else {
          svcResponse.status = Status.SUCCESS;
          svcResponse.details = response.insertId;
        }
      });
    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = error.message;
    }

    log(`<insertDocumentStore> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }

  // Helper Methods
  ////////////////
  /**
   * Get the time now
   */
  private static getNow(): string {
    //var dtNow = new Date();
    //return `${dtNow.toISOString().slice(0, 10)} ${dtNow.getTime()}`;
    // log( dtNow.toISOString().slice(0, 19).replace('T', ' ') );
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    return localISOTime.slice(0, 19).replace('T', ' ');
  }

  /**
   * Get the boilerplate service response
   */
  private getDefaultServiceResponse(): ServiceResponse {
    let svcResponse: ServiceResponse = {
      status: Status.FAIL,
      msg: "",
      details: "",
    };
    return svcResponse;
  }
}
