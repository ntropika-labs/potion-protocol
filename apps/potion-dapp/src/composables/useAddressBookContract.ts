import type { AddressBook } from "@potion-protocol/core/typechain";

import { contractsAddresses } from "@/helpers/contracts";
import { AddressBook__factory } from "@potion-protocol/core/typechain";
import { useEthersContract } from "./useEthersContract";

export function useAddressBookContract() {
  const { initContract } = useEthersContract();
  const { AddressBook: AddressBookContract } = contractsAddresses;

  const initContractProvider = () => {
    return initContract(
      false,
      false,
      AddressBook__factory,
      AddressBookContract.address.toLowerCase()
    ) as AddressBook;
  };

  const getController = async () => {
    try {
      const addressBookContract = initContractProvider();
      return await addressBookContract.getController();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get controller contract: ${error.message}`);
      } else {
        throw new Error("Cannot get controller contract");
      }
    }
  };

  const getOracle = async () => {
    try {
      const addressBookContract = initContractProvider();
      return await addressBookContract.getOracle();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cannot get oracle contract: ${error.message}`);
      } else {
        throw new Error("Cannot get oracle contract");
      }
    }
  };

  return {
    getController,
    getOracle,
  };
}
