import { ethers } from "ethers";
import { progress as defaultProgress } from "../share/progress";
import { Status, WalletRequest, WalletResponse, log } from "../share/share";

/**
 *
 * @param walletRequest
 */
export default async function createWallet(
  walletRequest: WalletRequest
): Promise<WalletResponse> {
  log(`<createWallet> walletRequest: ${JSON.stringify(walletRequest)}`);

  var walletResponse: WalletResponse = {
    status: Status.FAIL,
    details: { accountId: "", password: "", address: "", jsonEncrpyted: "" },
  };

  try {

    if (!walletRequest) throw new Error("param walletReq null");
    if (!walletRequest.accountId) throw Error("param walletReq.accountId");
    if (!walletRequest.password) throw Error("param walletReq.password");

    var progress = defaultProgress("Encrypting Wallet");
    const wallet = ethers.Wallet.createRandom();
    if (!wallet) throw new Error("wallet null");

    const walletJson = await wallet.encrypt(walletRequest.password, progress);
    if (!walletJson) throw new Error("walletJson null");

    walletResponse.status = Status.SUCCESS;
    walletResponse.details.accountId = walletRequest.accountId;
    walletResponse.details.password = walletRequest.password;
    walletResponse.details.address = wallet.address;
    walletResponse.details.jsonEncrpyted = walletJson;

  } catch (error) {
    walletResponse.status = Status.ERROR;
    walletResponse.msg = error.message;
  }

  log(`<createWallet> walletResponse: ${JSON.stringify(walletResponse)}`);
  return walletResponse;
}
