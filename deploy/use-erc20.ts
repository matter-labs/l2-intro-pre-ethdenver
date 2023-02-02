import { Wallet, Provider, Contract } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/zkToken.sol/zkToken.json";

// Address of the contract on zksync testnet
const TOKEN_ADDRESS = "";

// 0x address of the wallet that will receive a transfer
const DESTINATION_WALLET = "";

if (!TOKEN_ADDRESS) throw "⛔️ ERC20 token address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to transfer token ${TOKEN_ADDRESS}`);

  // Initialize the signer.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new Wallet(PRIVATE_KEY, provider);

  const tokenContract = new Contract(
    TOKEN_ADDRESS,
    ContractArtifact.abi,
    signer
  );

  const AMOUNT = "12";
  console.log(
    `Account ${signer.address} balance is: ${await tokenContract.balanceOf(
      signer.address
    )} tokens`
  );
  console.log(
    `Account ${DESTINATION_WALLET} balance is: ${await tokenContract.balanceOf(
      DESTINATION_WALLET
    )} tokens`
  );

  // transfer tokens
  const transferHandle = await tokenContract.transfer(
    DESTINATION_WALLET,
    ethers.utils.parseEther(AMOUNT)
  );

  // Wait until the transaction is processed on zkSync
  await transferHandle.wait();

  console.log(`Transfer completed in trx ${transferHandle.hash}`);
  console.log(
    `Account ${signer.address} balance now is: ${await tokenContract.balanceOf(
      signer.address
    )} tokens`
  );
  console.log(
    `Account ${DESTINATION_WALLET} balance now is: ${await tokenContract.balanceOf(
      DESTINATION_WALLET
    )} tokens`
  );

  console.log(`Current token supply is ${await tokenContract.totalSupply()}`);
}
