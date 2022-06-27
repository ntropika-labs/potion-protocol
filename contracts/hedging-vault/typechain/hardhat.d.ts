/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "PausableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PausableUpgradeable__factory>;
    getContractFactory(
      name: "ReentrancyGuardUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuardUpgradeable__factory>;
    getContractFactory(
      name: "ERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Upgradeable__factory>;
    getContractFactory(
      name: "IERC20MetadataUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20MetadataUpgradeable__factory>;
    getContractFactory(
      name: "IERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Upgradeable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "AccessControlEnumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControlEnumerable__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "IAccessControlEnumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlEnumerable__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "ERC20Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Pausable__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC20PresetMinterPauser",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20PresetMinterPauser__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IUniswapV3SwapCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV3SwapCallback__factory>;
    getContractFactory(
      name: "ISwapRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISwapRouter__factory>;
    getContractFactory(
      name: "BaseActionUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseActionUpgradeable__factory>;
    getContractFactory(
      name: "PotionProtocolHelperUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PotionProtocolHelperUpgradeable__factory>;
    getContractFactory(
      name: "PotionProtocolOracleUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PotionProtocolOracleUpgradeable__factory>;
    getContractFactory(
      name: "UniswapV3HelperUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV3HelperUpgradeable__factory>;
    getContractFactory(
      name: "UniswapV3OracleUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV3OracleUpgradeable__factory>;
    getContractFactory(
      name: "PotionBuyAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PotionBuyAction__factory>;
    getContractFactory(
      name: "EmergencyLockUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EmergencyLockUpgradeable__factory>;
    getContractFactory(
      name: "LifecycleStatesUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LifecycleStatesUpgradeable__factory>;
    getContractFactory(
      name: "RefundsHelperUpgreadable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RefundsHelperUpgreadable__factory>;
    getContractFactory(
      name: "RolesManagerUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RolesManagerUpgradeable__factory>;
    getContractFactory(
      name: "ERC4626CapUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626CapUpgradeable__factory>;
    getContractFactory(
      name: "HedgingVaultOperatorHelper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.HedgingVaultOperatorHelper__factory>;
    getContractFactory(
      name: "IAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAction__factory>;
    getContractFactory(
      name: "IActionsManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IActionsManager__factory>;
    getContractFactory(
      name: "IEmergencyLock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IEmergencyLock__factory>;
    getContractFactory(
      name: "IFeeManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFeeManager__factory>;
    getContractFactory(
      name: "IInvestmentVaultV0",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IInvestmentVaultV0__factory>;
    getContractFactory(
      name: "ILifecycleStates",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILifecycleStates__factory>;
    getContractFactory(
      name: "IOpynController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOpynController__factory>;
    getContractFactory(
      name: "IOtoken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOtoken__factory>;
    getContractFactory(
      name: "IPotionBuyAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPotionBuyAction__factory>;
    getContractFactory(
      name: "IPotionBuyActionV0",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPotionBuyActionV0__factory>;
    getContractFactory(
      name: "IPotionLiquidityPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPotionLiquidityPool__factory>;
    getContractFactory(
      name: "IPotionProtocolOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPotionProtocolOracle__factory>;
    getContractFactory(
      name: "IRefundsHelper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRefundsHelper__factory>;
    getContractFactory(
      name: "IRolesManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRolesManager__factory>;
    getContractFactory(
      name: "IUniswapV3Oracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV3Oracle__factory>;
    getContractFactory(
      name: "IVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVault__factory>;
    getContractFactory(
      name: "PercentageUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PercentageUtils__factory>;
    getContractFactory(
      name: "ERC4626Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626Upgradeable__factory>;
    getContractFactory(
      name: "IERC4626Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4626Upgradeable__factory>;
    getContractFactory(
      name: "TestWrapperEmergencyLock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperEmergencyLock__factory>;
    getContractFactory(
      name: "TestWrapperERC20PresetMinterPauser",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperERC20PresetMinterPauser__factory>;
    getContractFactory(
      name: "TestWrapperLifecycleStates",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperLifecycleStates__factory>;
    getContractFactory(
      name: "TestWrapperRefundsHelper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperRefundsHelper__factory>;
    getContractFactory(
      name: "TestWrapperRolesManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperRolesManager__factory>;
    getContractFactory(
      name: "ActionsManagerUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ActionsManagerUpgradeable__factory>;
    getContractFactory(
      name: "BaseVaultUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseVaultUpgradeable__factory>;
    getContractFactory(
      name: "FeeManagerUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FeeManagerUpgradeable__factory>;
    getContractFactory(
      name: "InvestmentVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.InvestmentVault__factory>;
    getContractFactory(
      name: "InvestmentVaultV0",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.InvestmentVaultV0__factory>;
    getContractFactory(
      name: "PotionBuyActionV0",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PotionBuyActionV0__factory>;

    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "PausableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PausableUpgradeable>;
    getContractAt(
      name: "ReentrancyGuardUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuardUpgradeable>;
    getContractAt(
      name: "ERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Upgradeable>;
    getContractAt(
      name: "IERC20MetadataUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20MetadataUpgradeable>;
    getContractAt(
      name: "IERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Upgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "AccessControlEnumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlEnumerable>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "IAccessControlEnumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlEnumerable>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Burnable>;
    getContractAt(
      name: "ERC20Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Pausable>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC20PresetMinterPauser",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20PresetMinterPauser>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "IUniswapV3SwapCallback",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV3SwapCallback>;
    getContractAt(
      name: "ISwapRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISwapRouter>;
    getContractAt(
      name: "BaseActionUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseActionUpgradeable>;
    getContractAt(
      name: "PotionProtocolHelperUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PotionProtocolHelperUpgradeable>;
    getContractAt(
      name: "PotionProtocolOracleUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PotionProtocolOracleUpgradeable>;
    getContractAt(
      name: "UniswapV3HelperUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV3HelperUpgradeable>;
    getContractAt(
      name: "UniswapV3OracleUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV3OracleUpgradeable>;
    getContractAt(
      name: "PotionBuyAction",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PotionBuyAction>;
    getContractAt(
      name: "EmergencyLockUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.EmergencyLockUpgradeable>;
    getContractAt(
      name: "LifecycleStatesUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LifecycleStatesUpgradeable>;
    getContractAt(
      name: "RefundsHelperUpgreadable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RefundsHelperUpgreadable>;
    getContractAt(
      name: "RolesManagerUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RolesManagerUpgradeable>;
    getContractAt(
      name: "ERC4626CapUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626CapUpgradeable>;
    getContractAt(
      name: "HedgingVaultOperatorHelper",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.HedgingVaultOperatorHelper>;
    getContractAt(
      name: "IAction",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAction>;
    getContractAt(
      name: "IActionsManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IActionsManager>;
    getContractAt(
      name: "IEmergencyLock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IEmergencyLock>;
    getContractAt(
      name: "IFeeManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFeeManager>;
    getContractAt(
      name: "IInvestmentVaultV0",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IInvestmentVaultV0>;
    getContractAt(
      name: "ILifecycleStates",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ILifecycleStates>;
    getContractAt(
      name: "IOpynController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOpynController>;
    getContractAt(
      name: "IOtoken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOtoken>;
    getContractAt(
      name: "IPotionBuyAction",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPotionBuyAction>;
    getContractAt(
      name: "IPotionBuyActionV0",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPotionBuyActionV0>;
    getContractAt(
      name: "IPotionLiquidityPool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPotionLiquidityPool>;
    getContractAt(
      name: "IPotionProtocolOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPotionProtocolOracle>;
    getContractAt(
      name: "IRefundsHelper",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRefundsHelper>;
    getContractAt(
      name: "IRolesManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRolesManager>;
    getContractAt(
      name: "IUniswapV3Oracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV3Oracle>;
    getContractAt(
      name: "IVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVault>;
    getContractAt(
      name: "PercentageUtils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PercentageUtils>;
    getContractAt(
      name: "ERC4626Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626Upgradeable>;
    getContractAt(
      name: "IERC4626Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4626Upgradeable>;
    getContractAt(
      name: "TestWrapperEmergencyLock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperEmergencyLock>;
    getContractAt(
      name: "TestWrapperERC20PresetMinterPauser",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperERC20PresetMinterPauser>;
    getContractAt(
      name: "TestWrapperLifecycleStates",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperLifecycleStates>;
    getContractAt(
      name: "TestWrapperRefundsHelper",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperRefundsHelper>;
    getContractAt(
      name: "TestWrapperRolesManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperRolesManager>;
    getContractAt(
      name: "ActionsManagerUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ActionsManagerUpgradeable>;
    getContractAt(
      name: "BaseVaultUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseVaultUpgradeable>;
    getContractAt(
      name: "FeeManagerUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.FeeManagerUpgradeable>;
    getContractAt(
      name: "InvestmentVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.InvestmentVault>;
    getContractAt(
      name: "InvestmentVaultV0",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.InvestmentVaultV0>;
    getContractAt(
      name: "PotionBuyActionV0",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PotionBuyActionV0>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
