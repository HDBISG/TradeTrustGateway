import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";

import {
  Status,
  IssueRequest,
  IssueResponse,
  getWallet,
  log,
  Tran,
  TranType,
} from "../share/share";

import TTRepositoryService from "../service/TTRepositoryService";

export default async function issueDocument(
  issueRequest: IssueRequest
): Promise<IssueResponse> {
  
  log(`<issueDocument> issueRequest: ${JSON.stringify(issueRequest)}`);

  var issueResponse: IssueResponse = {
    status: Status.FAIL,
    msg: "",
    details: "",
  };

  var tran:Tran = {
    accountId:"", storeName:"", tranType:TranType.ISSUE, tranHash:"", network:issueRequest.network, tranResult:"", walletAddr:""
  };

  try {
    if (!issueRequest) throw new Error("param issueRequest null");
    if (!issueRequest.wrappedHash)
      throw new Error("param issueRequest.hash null");
    if (!issueRequest.network)
      throw new Error("param issueRequest.network null");
    if (!issueRequest.wallet) throw new Error("param issueRequest.wallet null");
    if (!issueRequest.documentStore)
      throw new Error("param issueRequest.documentStore null");

    const wallet = await getWallet({
      encryptedWalletJson: issueRequest.wallet.jsonEncrpyted,
      password: issueRequest.wallet.password,
      network: issueRequest.network,
      key:issueRequest.wallet.privateKey
    });
    if (!wallet) throw new Error("wallet null");

    var gasPriceScale = 1;
    const gasPrice = await wallet.provider.getGasPrice();
    signale.await(`Sending transaction to pool`);
    const transaction = await DocumentStoreFactory.connect(
      issueRequest.documentStore.address,
      wallet
    ).issue(issueRequest.wrappedHash, {
      gasPrice: gasPrice.mul(gasPriceScale),
    });
    if (!transaction) throw new Error("transaction null");
    log(
      `transaciton: hash:${transaction.hash} blockNo:${transaction.blockNumber}`
    );

    tran.accountId = issueRequest.documentStore.accountId;
    tran.storeName = issueRequest.documentStore.storeName;
    tran.tranHash = transaction.hash;
    tran.walletAddr = wallet.address;

    signale.await(`Waiting for transaction ${transaction.hash} to be mined`);
    var contractAddress: string = await transaction.wait();
    if (!contractAddress) throw new Error("contractAddress null");

    issueResponse.status = Status.SUCCESS;
    issueResponse.details = JSON.stringify ( { "tranHash":transaction.hash, walletAddr:wallet.address } );

    tran.tranResult = "Y";
    tran.storeAdress = issueRequest.documentStore.address;
    tran.wrapHash = issueRequest.wrappedHash;
    tran.network = issueRequest.network;

  } catch (error) {

    log(`Exception: ${error.stack}`);
    tran.tranResult = "N";
    tran.remarks = error.stack;
    issueResponse.status = Status.ERROR;
    issueResponse.msg = error.message;
  } finally {
    // insert into tran 
    // log(`tran.tranHash : ${tran.tranHash}     ${!tran.tranHash}    ${!  tran.tranHash}`);
     if( tran.tranHash ) {
      new TTRepositoryService().insertTran( tran );
     }
  }

  log(`<issueDocument> issueResponse: ${JSON.stringify(issueResponse)}`);
  return issueResponse;
}
