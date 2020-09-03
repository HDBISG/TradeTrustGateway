import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";

import {
  Status,
  IssueRequest,
  IssueResponse,
  getWallet,
  log,
} from "../share/share";

export default async function issueDocument(
  issueRequest: IssueRequest
): Promise<IssueResponse> {
  
  log(`<issueDocument> issueRequest: ${JSON.stringify(issueRequest)}`);

  var issueResponse: IssueResponse = {
    status: Status.FAIL,
    msg: "",
    details: "",
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

    signale.await(`Waiting for transaction ${transaction.hash} to be mined`);
    var contractAddress: string = transaction.wait();
    if (!contractAddress) throw new Error("contractAddress null");

    issueResponse.status = Status.SUCCESS;
    issueResponse.details = contractAddress;
  } catch (error) {
    log(error.stack);
    issueResponse.status = Status.ERROR;
    issueResponse.msg = error.message;
  }

  log(`<issueDocument> issueResponse: ${JSON.stringify(issueResponse)}`);
  return issueResponse;
}
