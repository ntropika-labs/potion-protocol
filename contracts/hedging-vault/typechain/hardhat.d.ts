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
      name: "AccessControlEnumerableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControlEnumerableUpgradeable__factory>;
    getContractFactory(
      name: "AccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControlUpgradeable__factory>;
    getContractFactory(
      name: "IAccessControlEnumerableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlEnumerableUpgradeable__factory>;
    getContractFactory(
      name: "IAccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlUpgradeable__factory>;
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
      name: "ERC1155Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Upgradeable__factory>;
    getContractFactory(
      name: "IERC1155MetadataURIUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155MetadataURIUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155ReceiverUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155ReceiverUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Upgradeable__factory>;
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
      name: "ERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165Upgradeable__factory>;
    getContractFactory(
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165Upgradeable__factory>;
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
      name: "ERC1155DecimalsUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155DecimalsUpgradeable__factory>;
    getContractFactory(
      name: "ERC1155FullSupplyUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155FullSupplyUpgradeable__factory>;
    getContractFactory(
      name: "ERC4626CapUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626CapUpgradeable__factory>;
    getContractFactory(
      name: "ERC4626DeferredOperationUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626DeferredOperationUpgradeable__factory>;
    getContractFactory(
      name: "ERC4626MultiTokenUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626MultiTokenUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155DecimalsUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155DecimalsUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155FullSupplyUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155FullSupplyUpgradeable__factory>;
    getContractFactory(
      name: "IERC4626CapUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4626CapUpgradeable__factory>;
    getContractFactory(
      name: "IERC4626DeferredOperationUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4626DeferredOperationUpgradeable__factory>;
    getContractFactory(
      name: "IERC4626MultiTokenUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4626MultiTokenUpgradeable__factory>;
    getContractFactory(
      name: "HedgingVaultOrchestrator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.HedgingVaultOrchestrator__factory>;
    getContractFactory(
      name: "RoundsVaultExchanger",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RoundsVaultExchanger__factory>;
    getContractFactory(
      name: "IAction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAction__factory>;
    getContractFactory(
      name: "IActionsManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IActionsManager__factory>;
    getContractFactory(
      name: "IBaseRoundsVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBaseRoundsVault__factory>;
    getContractFactory(
      name: "IBaseRoundsVaultUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBaseRoundsVaultUpgradeable__factory>;
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
      name: "IOpynAddressBook",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOpynAddressBook__factory>;
    getContractFactory(
      name: "IOpynController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOpynController__factory>;
    getContractFactory(
      name: "IOpynFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOpynFactory__factory>;
    getContractFactory(
      name: "IOpynOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOpynOracle__factory>;
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
      name: "IRoundsInputVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoundsInputVault__factory>;
    getContractFactory(
      name: "IRoundsInputVaultUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoundsInputVaultUpgradeable__factory>;
    getContractFactory(
      name: "IRoundsOutputVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoundsOutputVault__factory>;
    getContractFactory(
      name: "IRoundsOutputVaultUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoundsOutputVaultUpgradeable__factory>;
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
      name: "TimeUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TimeUtils__factory>;
    getContractFactory(
      name: "ERC1155DecimalsUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155DecimalsUpgradeable__factory>;
    getContractFactory(
      name: "ERC1155FullSupplyUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155FullSupplyUpgradeable__factory>;
    getContractFactory(
      name: "ERC4626DeferredOperationUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626DeferredOperationUpgradeable__factory>;
    getContractFactory(
      name: "ERC4626MultiTokenUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626MultiTokenUpgradeable__factory>;
    getContractFactory(
      name: "ERC4626Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626Upgradeable__factory>;
    getContractFactory(
      name: "IERC1155DecimalsUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155DecimalsUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155FullSupplyUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155FullSupplyUpgradeable__factory>;
    getContractFactory(
      name: "IERC4626DeferredOperationUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4626DeferredOperationUpgradeable__factory>;
    getContractFactory(
      name: "IERC4626MultiTokenUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4626MultiTokenUpgradeable__factory>;
    getContractFactory(
      name: "IERC4626Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4626Upgradeable__factory>;
    getContractFactory(
      name: "BaseRoundsVaultUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseRoundsVaultUpgradeable__factory>;
    getContractFactory(
      name: "RoundsInputVaultUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RoundsInputVaultUpgradeable__factory>;
    getContractFactory(
      name: "RoundsOutputVaultUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RoundsOutputVaultUpgradeable__factory>;
    getContractFactory(
      name: "MockERC20PresetMinterPauser",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockERC20PresetMinterPauser__factory>;
    getContractFactory(
      name: "MockOpynAddressBook",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockOpynAddressBook__factory>;
    getContractFactory(
      name: "MockOpynController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockOpynController__factory>;
    getContractFactory(
      name: "MockOpynFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockOpynFactory__factory>;
    getContractFactory(
      name: "MockOpynOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockOpynOracle__factory>;
    getContractFactory(
      name: "MockPotionLiquidityPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockPotionLiquidityPool__factory>;
    getContractFactory(
      name: "MockUniswapV3Router",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockUniswapV3Router__factory>;
    getContractFactory(
      name: "TestWrapperActionsManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperActionsManager__factory>;
    getContractFactory(
      name: "TestWrapperEmergencyLock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperEmergencyLock__factory>;
    getContractFactory(
      name: "TestWrapperFeeManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperFeeManager__factory>;
    getContractFactory(
      name: "TestWrapperLifecycleStates",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperLifecycleStates__factory>;
    getContractFactory(
      name: "TestWrapperOpynProtocolLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperOpynProtocolLib__factory>;
    getContractFactory(
      name: "TestWrapperPercentageUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperPercentageUtils__factory>;
    getContractFactory(
      name: "TestWrapperPotionProtocolLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperPotionProtocolLib__factory>;
    getContractFactory(
      name: "TestWrapperPriceUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperPriceUtils__factory>;
    getContractFactory(
      name: "TestWrapperRefundsHelper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperRefundsHelper__factory>;
    getContractFactory(
      name: "TestWrapperRolesManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperRolesManager__factory>;
    getContractFactory(
      name: "TestWrapperUniswapV3SwapLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestWrapperUniswapV3SwapLib__factory>;
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
      name: "PotionBuyActionV0",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PotionBuyActionV0__factory>;

    getContractAt(
      name: "AccessControlEnumerableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlEnumerableUpgradeable>;
    getContractAt(
      name: "AccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlUpgradeable>;
    getContractAt(
      name: "IAccessControlEnumerableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlEnumerableUpgradeable>;
    getContractAt(
      name: "IAccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlUpgradeable>;
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
      name: "ERC1155Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Upgradeable>;
    getContractAt(
      name: "IERC1155MetadataURIUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155MetadataURIUpgradeable>;
    getContractAt(
      name: "IERC1155ReceiverUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155ReceiverUpgradeable>;
    getContractAt(
      name: "IERC1155Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Upgradeable>;
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
      name: "ERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165Upgradeable>;
    getContractAt(
      name: "IERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
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
      name: "ERC1155DecimalsUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155DecimalsUpgradeable>;
    getContractAt(
      name: "ERC1155FullSupplyUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155FullSupplyUpgradeable>;
    getContractAt(
      name: "ERC4626CapUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626CapUpgradeable>;
    getContractAt(
      name: "ERC4626DeferredOperationUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626DeferredOperationUpgradeable>;
    getContractAt(
      name: "ERC4626MultiTokenUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626MultiTokenUpgradeable>;
    getContractAt(
      name: "IERC1155DecimalsUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155DecimalsUpgradeable>;
    getContractAt(
      name: "IERC1155FullSupplyUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155FullSupplyUpgradeable>;
    getContractAt(
      name: "IERC4626CapUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4626CapUpgradeable>;
    getContractAt(
      name: "IERC4626DeferredOperationUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4626DeferredOperationUpgradeable>;
    getContractAt(
      name: "IERC4626MultiTokenUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4626MultiTokenUpgradeable>;
    getContractAt(
      name: "HedgingVaultOrchestrator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.HedgingVaultOrchestrator>;
    getContractAt(
      name: "RoundsVaultExchanger",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RoundsVaultExchanger>;
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
      name: "IBaseRoundsVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBaseRoundsVault>;
    getContractAt(
      name: "IBaseRoundsVaultUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBaseRoundsVaultUpgradeable>;
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
      name: "IOpynAddressBook",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOpynAddressBook>;
    getContractAt(
      name: "IOpynController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOpynController>;
    getContractAt(
      name: "IOpynFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOpynFactory>;
    getContractAt(
      name: "IOpynOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOpynOracle>;
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
      name: "IRoundsInputVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoundsInputVault>;
    getContractAt(
      name: "IRoundsInputVaultUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoundsInputVaultUpgradeable>;
    getContractAt(
      name: "IRoundsOutputVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoundsOutputVault>;
    getContractAt(
      name: "IRoundsOutputVaultUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoundsOutputVaultUpgradeable>;
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
      name: "TimeUtils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TimeUtils>;
    getContractAt(
      name: "ERC1155DecimalsUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155DecimalsUpgradeable>;
    getContractAt(
      name: "ERC1155FullSupplyUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155FullSupplyUpgradeable>;
    getContractAt(
      name: "ERC4626DeferredOperationUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626DeferredOperationUpgradeable>;
    getContractAt(
      name: "ERC4626MultiTokenUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626MultiTokenUpgradeable>;
    getContractAt(
      name: "ERC4626Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626Upgradeable>;
    getContractAt(
      name: "IERC1155DecimalsUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155DecimalsUpgradeable>;
    getContractAt(
      name: "IERC1155FullSupplyUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155FullSupplyUpgradeable>;
    getContractAt(
      name: "IERC4626DeferredOperationUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4626DeferredOperationUpgradeable>;
    getContractAt(
      name: "IERC4626MultiTokenUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4626MultiTokenUpgradeable>;
    getContractAt(
      name: "IERC4626Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4626Upgradeable>;
    getContractAt(
      name: "BaseRoundsVaultUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseRoundsVaultUpgradeable>;
    getContractAt(
      name: "RoundsInputVaultUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RoundsInputVaultUpgradeable>;
    getContractAt(
      name: "RoundsOutputVaultUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RoundsOutputVaultUpgradeable>;
    getContractAt(
      name: "MockERC20PresetMinterPauser",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockERC20PresetMinterPauser>;
    getContractAt(
      name: "MockOpynAddressBook",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockOpynAddressBook>;
    getContractAt(
      name: "MockOpynController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockOpynController>;
    getContractAt(
      name: "MockOpynFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockOpynFactory>;
    getContractAt(
      name: "MockOpynOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockOpynOracle>;
    getContractAt(
      name: "MockPotionLiquidityPool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockPotionLiquidityPool>;
    getContractAt(
      name: "MockUniswapV3Router",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockUniswapV3Router>;
    getContractAt(
      name: "TestWrapperActionsManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperActionsManager>;
    getContractAt(
      name: "TestWrapperEmergencyLock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperEmergencyLock>;
    getContractAt(
      name: "TestWrapperFeeManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperFeeManager>;
    getContractAt(
      name: "TestWrapperLifecycleStates",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperLifecycleStates>;
    getContractAt(
      name: "TestWrapperOpynProtocolLib",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperOpynProtocolLib>;
    getContractAt(
      name: "TestWrapperPercentageUtils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperPercentageUtils>;
    getContractAt(
      name: "TestWrapperPotionProtocolLib",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperPotionProtocolLib>;
    getContractAt(
      name: "TestWrapperPriceUtils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperPriceUtils>;
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
      name: "TestWrapperUniswapV3SwapLib",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestWrapperUniswapV3SwapLib>;
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
