import fetch from "node-fetch";
import { Status, TopUpRequest, TopUpResponse, log } from "../share/share";

/**
 * Top up the wallet
 * @param topUpRequest
 */
export default async function topupWallet(
  topUpRequest: TopUpRequest
): Promise<TopUpResponse> {
  log(`<topupWallet> topUpRequest: ${JSON.stringify(topUpRequest)}`);

  var topUpResponse: TopUpResponse = { status: Status.FAIL };
  try {
    if (!topUpRequest) throw new Error("topUpReqest null");
    if (!topUpRequest.walletAddress)
      throw new Error("topUpRequest.wallet null");
    if (!topUpRequest.ether) throw new Error("topUpRequest.ether null");

    var url = "https://faucet.ropsten.be/donate/" + topUpRequest.walletAddress;
    log(`url: ${url}`);
    const response = await fetch(url).then((res) => res.json());
    if (response.message) {
      topUpResponse.status = Status.FAIL;
      topUpResponse.msg = response.message;
    } else {
      topUpResponse.status = Status.SUCCESS;
    }
  } catch (error) {
    topUpResponse.status = Status.ERROR;
    topUpResponse.msg = error.message;
  }

  log(`<topupWallet> topUpResponse: ${JSON.stringify(topUpResponse)}`);
  return topUpResponse;
}
