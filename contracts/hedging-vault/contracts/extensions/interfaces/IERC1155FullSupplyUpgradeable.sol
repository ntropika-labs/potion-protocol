// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC1155/IERC1155Upgradeable.sol";

/**
 * @dev Extension of ERC1155 that adds tracking of total overall supply on top of the
 *      per-id supply tracking of ERC1155SupplyUpgradeable.
 *
 * Used to implement the ERC-4626 tokenized vault with shares tied to investment rounds.
 *
 * @author Roberto Cano <robercano>
 */
interface IERC1155FullSupplyUpgradeable is IERC1155Upgradeable {
    /**
     * @dev Total amount of tokens in existence for all minted ids
     */
    function totalSupplyAll() external view returns (uint256);

    /**
     * @dev Total amount of tokens in existence with a given id.
     */
    function totalSupply(uint256 id) external view returns (uint256);

    /**
     * @dev Returns the sum of amounts of all ids owned by `account`
     */
    function balanceOfAll(address account) external view returns (uint256);

    /**
     * @dev Indicates whether any token exist with a given id, or not.
     */
    function exists(uint256 id) external view returns (bool);
}
