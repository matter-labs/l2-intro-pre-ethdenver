import { Wallet, Provider, Contract } from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/zkNFT.sol/zkNFT.json";

// Address of the contract on zksync testnet
const NFT_TOKEN_ADDRESS = "";

// 0x address where tokens will be minted to
const DESTINATION_WALLET = "";

if (!NFT_TOKEN_ADDRESS) throw "⛔️ ERC721 token address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(
    `Running script to interact with ERC721 contract ${NFT_TOKEN_ADDRESS}`
  );

  // Initialize the signer.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new Wallet(PRIVATE_KEY, provider);

  const tokenContract = new Contract(
    NFT_TOKEN_ADDRESS,
    ContractArtifact.abi,
    signer
  );

  console.log(
    `This collection has ${await tokenContract.totalSupply()} NFTs minted`
  );

  // mint NFT for wallet
  const mintHandle = await tokenContract.safeMint(DESTINATION_WALLET);

  // Wait until the transaction is processed on zkSync
  await mintHandle.wait();

  console.log(`Mint completed in trx ${mintHandle.hash}`);

  console.log(
    `This collection has ${await tokenContract.totalSupply()} NFTs minted`
  );

  console.log(
    `Account ${DESTINATION_WALLET} owns ${await tokenContract.balanceOf(
      DESTINATION_WALLET
    )} NFTs`
  );
}
