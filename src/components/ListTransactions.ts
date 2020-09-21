import { httpclient } from 'typescript-http-client'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Request = httpclient.Request

import {
  Status,
  ListTransactionRequest,
  getWallet,
  log,
  ServiceResponse
} from "../share/share";

import TTRepositoryService from "../service/TTRepositoryService";
/**
 * Deploy the document store
 * @param deployRequest
 */
export default async function ListTransactions(
  listTransactionRequest: ListTransactionRequest
): Promise<ServiceResponse> {
  log(`<ListTransactions> walletAddress: ${listTransactionRequest}`);

  var serviceResponse: ServiceResponse = {
    status: Status.FAIL,
    msg: "",
    details: { },
  };



  try {
    if (!listTransactionRequest) throw new Error("param walletAddress null");

    var path:string = "https://api-ropsten.etherscan.io/api?module=account&action=txlist&startblock=0&endblock=99999999&sort=asc";
    path = path + "&address=" + listTransactionRequest.walletAddress;
    path = path + "&apikey=1XZHDN5ZU621D21MBHV93TENW416N4IN2W";  // regist at https://etherscan.io

    const rep = await get( path );

    log(`rep= ${JSON.stringify(rep)}`);


    serviceResponse.status = Status.SUCCESS;
    serviceResponse.details = rep.result;

  } catch (error) {
    
    console.log(error.stack);
    serviceResponse.status = Status.ERROR;
    serviceResponse.msg = error.message;
  } 

  return serviceResponse;
}

function get(url:string): Promise<any>{
  // return this promise
  return axios.get(url ).then(( rsp )=>{
      console.log('got user')
      return rsp.data
  })
}

/*
function get(url:string) {
  return new (require('httpclient').HttpClient)({
    method: 'GET',
      url: url
    }).finish().body.read().decodeToString();
}
*/
/*
async function get(url:string): Promise<string>  {

  // var responseBody = "";

//  (async () => {
    
    const client = httpclient.newHttpClient();
    // Build the request
    const request = new Request( url, { responseType: 'text' });
    // Execute the request and get the response body as a string
    const rspBody = await client.execute<string>(request);
    return rspBody;
//  })(  );

  // return responseBody;
}
*/