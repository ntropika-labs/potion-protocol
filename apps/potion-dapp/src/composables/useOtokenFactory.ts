import { OtokenFactoryInterface__factory } from "@potion-protocol/core/typechain";

import { contractsAddresses } from "@/helpers/contracts";
import { parseUnits } from "@ethersproject/units";

import { useEthersContract } from "./useEthersContract";

import type { OtokenFactory } from "@potion-protocol/core/typechain";
export function useOtokenFactory() {
  const { initContract } = useEthersContract();
  const { OtokenFactory, PotionTestUSD } = contractsAddresses;
  const initContractProvider = () => {
    return initContract(
      false,
      false,
      OtokenFactoryInterface__factory,
      OtokenFactory.address.toLowerCase()
    ) as OtokenFactory;
  };

  const getTargetOtokenAddress = async (
    underlyingAddress: string,
    strikeAddress = PotionTestUSD.address.toLowerCase(),
    collateralAddress = PotionTestUSD.address.toLowerCase(),
    strikePrice: number,
    expiry: number,
    isPut = true
  ) => {
    const provider = initContractProvider();
    const otokenAddress = await provider.getTargetOtokenAddress(
      underlyingAddress,
      strikeAddress,
      collateralAddress,
      parseUnits(strikePrice.toFixed(8), 8),
      expiry,
      isPut
    );
    return otokenAddress;
  };

  const getOtoken = async (
    underlyingAddress: string,
    strikeAddress = PotionTestUSD.address.toLowerCase(),
    collateralAddress = PotionTestUSD.address.toLowerCase(),
    strikePrice: number,
    expiry: number,
    isPut = true
  ) => {
    const provider = initContractProvider();
    const otokenAddress = await provider.getOtoken(
      underlyingAddress,
      strikeAddress,
      collateralAddress,
      parseUnits(strikePrice.toFixed(8), 8),
      expiry,
      isPut
    );
    return otokenAddress;
  };

  return {
    getTargetOtokenAddress,
    getOtoken,
  };
}
