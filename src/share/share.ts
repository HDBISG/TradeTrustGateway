import signale from "signale";
import { ethers, getDefaultProvider, Wallet, providers } from "ethers";
import { progress as defaultProgress } from "./progress";

export enum Status {
  SUCCESS,
  FAIL,
  ERROR,
}

export function log(msg: string) {
  console.log(msg);
}
// Create Wallet Request/Respnose
export declare type WalletRequest = {
  accountId: string;
  password: string;
};

export declare type WalletDetails = {
  accountId: string; // accountId for T_CORE_ACCN  (account:wallet = 1:1)
  password: string; // password of the wallet
  address: string; // contract address of the wallet
  jsonEncrpyted: string; // encrypted json of the wallet
};

export declare type WalletResponse = {
  status: Status;
  msg?: string; // error message asscoiated with failure
  details: WalletDetails;
};

// TopUp Request/Respnose
export declare type TopUpRequest = {
  accountId: string; // accountId used to link to wallet in database
  walletAddress: string; // wallet address
  ether: number; // number of ether for topUp
};

export declare type TopUpResponse = {
  status: Status;
  msg?: string; // error message asscoiated with failure
};

// Deploy Document Request/Respnose
export declare type DeployRequest = {
  accountId: string; // accountId used to link to wallet in database (acount:docStoreName = 1:N)
  docStoreName: string; // document store name
  network: string; // network to deploy to
  wallet: WalletDetails; // details of the wallet
};

export declare type DocumentStoreDetails = {
  accountId: string; // accountId used to link to wallet in database (acount:docStoreName = 1:N)
  storeName: string; // docment store name
  address: string;
  renderName: string;
  renderType: string;
  renderUrl:string;
  name:string;
  issuerName:string;
  issuerType:string;
  issuerLocation:string;
  remark:string;
  network: string; // network to deploy to
};

export declare type DeployResponse = {
  status: Status;
  msg?: string; // error message assoicted with failre
  docStore: DocumentStoreDetails; // document store details
};

// Service deployment request where wallet details are not determined
export declare type ServiceDeployRequest = {
  accountId: string; // accountId used to link to wallet in database (acount:docStoreName = 1:N)
  docStoreName: string; // document store name
  network: string;
  renderName: string;
  renderUrl:string;
  issuerName:string;
  issuerLocation:string;
};

export declare type WrapRequest = {
  accountId: string; 
  wrapJson: string; 
};

// Wrap Document Reponse
export declare type WrapResponse = {
  status: Status;
  msg?: string;
  details?: string;
};

// Issue Document Request/Response
export declare type IssueRequest = {
  wrappedHash: string;
  network: string;
  wallet: WalletDetails;
  documentStore: DocumentStoreDetails;
};

// Issue Document Reponse
export declare type IssueResponse = {
  status: Status;
  msg?: string;
  details: string;
};

// Issue Document Request/Response
export declare type ServiceIssueRequest = {
  rawData: string;
  accountId: string;
  storeName: string;
};

export declare type ServiceResponse = {
  status: Status;
  msg?: string;
  details: any;
};

export declare type DocumentDetails = {
  accountId: string; // accountId used to link to wallet in database (acount:docStoreName = 1:N)
  storeName: string; // docment store name
  wrappedHash: string; // document hash
  address: string; // document hash contract address in the block chain
  wrappedDocument: string; // wrapped document
  rawDocument: string; // raw document
};

// GetWallet
export interface NetworkOption {
  network: string;
}

export interface PrivateKeyOption {
  key?: string;
  keyFile?: string;
}

export interface WalletOption extends PrivateKeyOption {
  encryptedWalletJson: string;
  password: string;
}

export interface GasOption {
  gasPriceScale: number;
  dryRun: boolean;
}

export const getWallet = async ({
  encryptedWalletJson,
  password,
  network,
  progress = defaultProgress("Decrypting Wallet"),
}: WalletOption &
  NetworkOption & { progress?: (progress: number) => void }): Promise<
  Wallet
> => {
  const provider =
    network === "local"
      ? new providers.JsonRpcProvider()
      : getDefaultProvider(network === "mainnet" ? "homestead" : network); // homestead => aka mainnet
  console.info("--" + encryptedWalletJson);
  const wallet = await ethers.Wallet.fromEncryptedJson(
    encryptedWalletJson,
    password,
    progress
  );
  signale.info("Wallet successfully decrypted");
  return wallet.connect(provider);
};
