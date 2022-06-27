/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IUniswapV3Oracle.sol";
import "../../common/RolesManagerUpgradeable.sol";
import "../../library/PriceUtils.sol";

/**
    @title UniswapV3OracleUpgradeable

    @notice Oracle contract for Uniswap V3 swaps. It takes care of holding information about the
    path to use for a specific swap, and the expected price for a that swap.

    @dev It is very basic and it just aims to abstract the idea of an Oracle into a separate contract
    but it is still very coupled with UniswapV3HelperUpgradeable.

    @dev It inherits from the RolesManagerUpgradeable contract to scope the parameters setting
    functions for only the Keeper role.

    @dev It does not initialize the RolesManagerUpgradeable as that is a contract that is shared
    among several other contracts of the Action. The initialization will happen in the Action contract

 */
contract UniswapV3OracleUpgradeable is IUniswapV3Oracle, RolesManagerUpgradeable {
    /**
        @notice Swap information for each pair of input and output tokens

        @dev inputToken => outputToken => SwapInfo

        @dev the swap direction is important so there is no need to store the
        reverse mapping of outputToken => inputToken
    */
    mapping(address => mapping(address => SwapInfo)) private _swapInfo;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice This does not chain the initialization to the parent contract.
        Also this contract does not need to initialize anything itself.
     */
    // solhint-disable-next-line func-name-mixedcase, no-empty-blocks
    function __UniswapV3Oracle_init_unchained() internal onlyInitializing {
        // Empty on purpose
    }

    /// FUNCTIONS

    /**
        @inheritdoc IUniswapV3Oracle
     */
    function setSwapInfo(SwapInfo calldata info) external onlyOperator {
        _swapInfo[info.inputToken][info.outputToken] = info;
    }

    /**
        @inheritdoc IUniswapV3Oracle

     */
    function getSwapInfo(address inputToken, address outputToken) public view returns (SwapInfo memory) {
        return _swapInfo[inputToken][outputToken];
    }
}
