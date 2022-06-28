import { Contract, Wallet } from "ethers";

import { JsonRpcProvider } from "@ethersproject/providers";

import ERC20Abi from "../../../../contracts/core/abis/ERC20.json";
import localDeploymentAddresses from "../../../../contracts/core/deployments/localhost.json";

// Alias query if operationName matches
// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req: any, operationName: string) => {
  const { body } = req;
  return (
    Object.prototype.hasOwnProperty.call(body, "operationName") &&
    body.operationName === operationName
  );
};

// Alias query if operationName matches
export const aliasQuery = (req: any, operationName: string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `${operationName}`;
  }
};

// Create a Wallet from mnemonic and reset the approval for USDC
const usdcAddress = localDeploymentAddresses.contracts.USDC.address;
const potionLiquidityAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";

const mnemonic = "test test test test test test test test test test test junk";
const wallet = Wallet.fromMnemonic(mnemonic);
const provider = new JsonRpcProvider("http://localhost:8545");
const signer = wallet.connect(provider);
export const resetApproval = async () => {
  const contract = new Contract(usdcAddress, ERC20Abi, signer);
  const usdcContractSigner = contract.connect(signer);
  await usdcContractSigner.approve(potionLiquidityAddress, 0);
};
