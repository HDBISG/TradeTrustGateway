import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";
import {
  Status,
  DeployRequest,
  DeployResponse,
  getWallet,
  log,
} from "../share/share";

/**
 * Deploy the document store
 * @param deployRequest
 */
export default async function deployDocumentStore(
  deployRequest: DeployRequest
): Promise<DeployResponse> {
  log(`<deployDocumentStore> deployRequest: ${deployRequest}`);

  var deployResponse: DeployResponse = {
    status: Status.FAIL,
    msg: "",
    docStore: { accountId: "", storeName: "", address: "", network: "",
      renderName: "", renderType: "", renderUrl: "", name: "",
      issuerName: "", issuerType: "", issuerLocation: "", remark: "" },
  };
  try {
    if (!deployRequest) throw new Error("param deployReq null");
    if (!deployRequest.docStoreName)
      throw new Error("param deployReq.docStoreName null");
    if (!deployRequest.network) throw new Error("param deployReq.network null");
    if (!deployRequest.wallet) throw new Error("param deployReq.wallet null");

    const wallet = await getWallet({
      key:deployRequest.wallet.privateKey,
      encryptedWalletJson: deployRequest.wallet.jsonEncrpyted,
      password: deployRequest.wallet.password,
      network: deployRequest.network,
    });

    var gasPriceScale = 1;
    const gasPrice = await wallet.provider.getGasPrice();
    const factory = new DocumentStoreFactory(wallet);
    signale.await(`Sending transaction to pool ${deployRequest.docStoreName}
        ${JSON.stringify(wallet)}   ${gasPrice} `);

    const transaction = await factory.deploy(deployRequest.docStoreName, {
      gasPrice: gasPrice.mul(gasPriceScale),
    });
    log(`details: ${JSON.stringify(transaction.deployTransaction.hash)}`);

    const details: { hash: string; blockNumber: string } =
      transaction.deployTransaction;
    // log(`details: ${JSON.stringify(details)}`);

    signale.await(`Waiting ${transaction.deployTransaction.hash} to be mined`);
    const documentStore = await transaction.deployTransaction.wait();
    if (!documentStore) throw new Error("documentStore null");

    deployResponse.status = Status.SUCCESS;


    deployResponse.docStore = {

      accountId: deployRequest.accountId,
      storeName: deployRequest.docStoreName,
      address: documentStore.contractAddress,
      network: deployRequest.network,

      renderName: "",
      renderType: "",
      renderUrl: "",
      name: "",

      issuerName: "",
      issuerType: "",
      issuerLocation: "",
      remark: "",

    };
  } catch (error) {
    console.log(error.stack);
    deployResponse.status = Status.ERROR;
    deployResponse.msg = error.message;
  }
/*
  log(
    `<deployDocumentStore> deployResponse: ${JSON.stringify(deployResponse)}`
  );*/
  return deployResponse;
}
