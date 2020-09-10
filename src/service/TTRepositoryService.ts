import {
  ServiceResponse,
  WalletDetails,
  DocumentStoreDetails,
  log,
  Status,
  DocumentDetails,
  AuditLog
} from "../share/share";

const util = require('util');

export default class TTRepositoryService {
  private mysql: any = require("mysql2/promise");
  private pool: any;

  constructor() {
    log("TTRepositoryService");

    const configFile = this.getConfigFile();

    this.pool = this.mysql.createPool({
      connectionLimit: 20, //important
      host: configFile.host,
      user: configFile.user,
      password: configFile.password,
      database: configFile.database,
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
      console.log(sql);

      var query = await this.pool.query(sql);

      svcResponse.status = Status.SUCCESS;


    } catch (error) {
      log(error.stack);
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
      let sql: string = this.mysql.format(selectQuery, [
        "T_TTGW_WALLET",
        "WALLET_ACCN_ID",
        accnId,
      ]);

/*
      let selectQuery: string = "SELECT * FROM ?? ";
      let sql: string = this.mysql.format(selectQuery, [
        "T_TTGW_WALLET"
      ]);
*/
      log( `query: ${sql} ` );
      const data = await this.pool.query(sql);

      var wallets:WalletDetails[] = new Array(data[0].length);

      var idx = 0;
      for ( const i in data[0] ) {
        let walletDetails: WalletDetails = {
          accountId: data[0][i].WALLET_ACCN_ID,
          privateKey: data[0][i].WALLET_PRIVATE_KEY,
          password: data[0][i].WALLET_PASSWORD,
          address: data[0][i].WALLET_ADDR,
          jsonEncrpyted: data[0][i].WALLET_JSON,
        };
        wallets[idx] = walletDetails ;
        idx++;
      }

      svcResponse.details = wallets;
      svcResponse.status = Status.SUCCESS;

    } catch (error) {
      console.log(error.stack);
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
        "INSERT INTO ?? (??,??,??,??, ??,??,??,??, ??,??,??,??,  ??,??,??,??,??) VALUES ( ?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,?,?,? )";
      let sql: any = this.mysql.format(insertQuery, [
        "T_TTGW_DOCSTORE",
        "DOCSTORE_ACCN_ID", // primary key
        "DOCSTORE_STORE_NAME", // primary key
        "DOCSTORE_ADDR",
        "DOCSTORE_NETWORK",
        
        "DOCSTORE_RENDER_NAME",
        "DOCSTORE_RENDER_TYPE",
        "DOCSTORE_RENDER_URL",
        "DOCSTORE_NAME",

        "DOCSTORE_ISSUER_NAME",
        "DOCSTORE_ISSUER_TYPE",
        "DOCSTORE_ISSUER_LOCATION",
        "DOCSTORE_REMARK",

        "DOCSTORE_STATUS",
        "DOCSTORE_UID_CREATE",
        "DOCSTORE_DT_CREATE",
        "DOCSTORE_UID_UPD",
        "DOCSTORE_DT_UPD",

        documentStoreDetails.accountId,
        documentStoreDetails.storeName,
        documentStoreDetails.address,
        documentStoreDetails.network,

        documentStoreDetails.renderName,
        documentStoreDetails.renderType,
        documentStoreDetails.renderUrl,
        documentStoreDetails.name,

        documentStoreDetails.issuerName,
        documentStoreDetails.issuerType,
        documentStoreDetails.issuerLocation,
        documentStoreDetails.remark,

        "A",
        "SYS",
        dtNow,
        "SYS",
        dtNow,
      ]);

     //  log(  this.pool);
     console.log(sql);

     var query = await this.pool.query(sql);

     svcResponse.status = Status.SUCCESS;

    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = error.message;
    }

    log(`<insertDocumentStore> svcResponse: ${JSON.stringify(svcResponse)}`);
    return svcResponse;
  }


  /**
   * Insert record into T_TTGW_DOCSTORE
   * @param documentStoreDetails
   */
  public async insertAuditLog(
    auditLog: AuditLog
  ): Promise<ServiceResponse> {
    log(
      `<insertAuditLog> auditLog: ${JSON.stringify( auditLog )}`
    );

    var svcResponse: ServiceResponse = this.getDefaultServiceResponse();
    try {
      if (!auditLog)
        throw new Error("param auditLog null");
      if (!auditLog.accountId)
        throw new Error("param auditLog.accountId null");

      let dtNow: string = TTRepositoryService.getNow();
      let insertQuery: string =
        "INSERT INTO ?? (??,??,??,??,??, ??,??,??, ??,??,??,??,??) VALUES ( ?,?,?,?,?, ?,?,?, ?,?,?,?,? )";
      let sql: any = this.mysql.format(insertQuery, [
        "T_TTGW_AUDITLOG",
        "AUDT_ID", // primary key
        "AUDT_EVENT", // primary key
        "AUDT_TIMESTAMP",
        "AUDT_ACCNID",
        "AUDT_STORE_NAME",

        "AUDT_UID",
        "AUDT_UNAME",
        "AUDT_REMOTE_IP",

        "AUDT_REQUET",
        "AUDT_RSP_STATUS",
        "AUDT_RSP_MESSAGE",
        "AUDT_RSP_DETAILS",
        "AUDT_REMARKS",

        (new Date()).getTime(),
        auditLog.event,
        new Date(),
        auditLog.accountId,
        auditLog.storeName,

        "sys",
        "sys",
        auditLog.remoteIp,
        
        JSON.stringify( auditLog.requestBody ),
        auditLog.rspStatus,
        auditLog.rspMessage,
        JSON.stringify( auditLog.rspDetails ),
        auditLog.remarks
      ]);

     //  log(  this.pool);
     console.log(sql);

     var query = await this.pool.query(sql);

     svcResponse.status = Status.SUCCESS;

    } catch (error) {
      svcResponse.status = Status.ERROR;
      svcResponse.msg = error.message;
    }

    log(`<insertAuditLog> svcResponse: ${JSON.stringify(svcResponse)}`);
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
      let sql: string = this.mysql.format(selectQuery, [
        "T_TTGW_DOCSTORE",
        "DOCSTORE_ACCN_ID",
        accnId,
        "DOCSTORE_STORE_NAME",
        docStoreName,
      ]);
      
      log( `query: ${sql} ` );
      const data = await this.pool.query(sql);

      var documentStores:DocumentStoreDetails[] = new Array(data[0].length);

      var idx = 0;
      for ( const i in data[0] ) {
        let documentStoreDetails: DocumentStoreDetails = {
          accountId: data[0][i].DOCSTORE_ACCN_ID,
          storeName: data[0][i].DOCSTORE_NAME,
          address: data[0][i].DOCSTORE_ADDR,
          network: data[0][i].DOCSTORE_NETWORK,
          renderName: data[0][i].DOCSTORE_RENDER_NAME, 
          renderType:data[0][i].DOCSTORE_RENDER_TYPE, 
          renderUrl: data[0][i].DOCSTORE_RENDER_URL, 
          name: data[0][i].DOCSTORE_NAME, 
          issuerName: data[0][i].DOCSTORE_ISSUER_NAME, 
          issuerType: data[0][i].DOCSTORE_ISSUER_TYPE, 
          issuerLocation: data[0][i].DOCSTORE_ISSUER_LOCATION, 
          remark: data[0][i].DOCSTORE_REMARK, 
        };
        documentStores[idx] = documentStoreDetails ;
        idx++;
      }

      svcResponse.details = documentStores;
      svcResponse.status = Status.SUCCESS;

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
        "INSERT INTO ?? (??,??,??, ??,??,??, ??,??,??, ??,??,??) VALUES (?,?,?, ?,?,?, ?,?,?, ?,?,?)";
      let sql: any = this.mysql.format(insertQuery, [
        "T_TTGW_DOC",
        "DOC_DOC_ID", // Primary key
        "DOC_ACCN_ID",
        "DOC_STORE_NAME",
        "DOC_WRAP_HASH",
        "DOC_ADDR",
        "DOC_WRAP_DOC",
        "DOC_WRAP_RAW_DOC",
        "DOC_STATUS",
        "DOC_UID_CREATE",
        "DOC_DT_CREATE",
        "DOC_UID_UPD",
        "DOC_DT_UPD",
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

      console.log("---------------------------");
      console.log(documentDetails.wrappedDocument);
      console.log(documentDetails.rawDocument);
      console.log("+++++++++++++++++++++++++++++++++");
     //  log(  this.pool);
     console.log(sql);

     var query = await this.pool.query(sql);

     svcResponse.status = Status.SUCCESS;

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

  private getConfigFile() {
    var fs = require("fs");
    const ttConfigJSONfile:string = fs.readFileSync('/home/vcc/tt/TradeTrust.json', 'utf8');
    log(`ttConfigJSONfile= ${ttConfigJSONfile}`);
    const ttConfigFile = JSON.parse( ttConfigJSONfile );
    return ttConfigFile;
  }
}
