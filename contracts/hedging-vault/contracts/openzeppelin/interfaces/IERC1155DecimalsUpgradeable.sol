// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/**
 * @dev Extension of ERC1155 that adds decimals to the multi-token
 *
 * @dev No storage gaps have been added as the functionlity of this contract is considered to be
 *      final and there is no need to add more storage variables
 */
interface IERC1155DecimalsUpgradeable is IERC1155Upgradeable {
    /**
     * @dev Returns the number of decimals used to get its user representation.
     *
     * See {ERC20-decimals}.
     */
    function decimals() external view returns (uint8);
}
