import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";
import {
  Status,
  FindWaletRequest,
  FindWalletResponse,
  getWallet,
  log,
  ServiceResponse
} from "../share/share";

import TTRepositoryService from "../service/TTRepositoryService";
/**
 * Deploy the document store
 * @param deployRequest
 */
export default async function FindWallet(
  findWaletRequest: FindWaletRequest
): Promise<FindWalletResponse> {
  log(`<FindWallet> findWaletRequest: ${findWaletRequest}`);

  var findWalletResponse: FindWalletResponse = {
    status: Status.FAIL,
    msg: "",
    walletDetails: { accountId: "", password: "", address: "", privateKey: "", jsonEncrpyted:"" },
  };



  try {
    if (!findWaletRequest) throw new Error("param findWaletRequest null");
    if (!findWaletRequest.accountId) throw new Error("param findWaletRequest.accountId null");

    const repoSvcResponse:TTRepositoryService = new TTRepositoryService();

    var walletResponse: ServiceResponse = await repoSvcResponse.getWallet(
      findWaletRequest.accountId
    );

    log(`walletResponse= ${JSON.stringify(walletResponse)}`);

    if( ! (walletResponse.status < 0 )) {
      findWalletResponse.status = Status.ERROR;
      findWalletResponse.msg = walletResponse.msg;
    }

    const wallet = await getWallet({
      key:walletResponse.details[0].privateKey,
      encryptedWalletJson: walletResponse.details[0].jsonEncrpyted,
      password: walletResponse.details[0].password,
      network: walletResponse.details[0].network,
    });

    findWalletResponse.walletDetails.accountId = findWaletRequest.accountId;
    findWalletResponse.walletDetails.address = wallet.address;
    // findWalletResponse.walletDetails.jsonEncrpyted = "";
    findWalletResponse.walletDetails.privateKey = wallet.privateKey;


    findWalletResponse.status = Status.SUCCESS;

  } catch (error) {
    
    console.log(error.stack);
    findWalletResponse.status = Status.ERROR;
    findWalletResponse.msg = error.message;
  } 

  return findWalletResponse;
}
