// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.14;

/**
 * @dev Extension of ERC1155 that adds tracking of total overall supply on top of the
 *      per-id supply tracking of ERC1155SupplyUpgradeable.
 *
 * Used to implement the ERC-4626 tokenized vault with shares tied to investment rounds.
 */
interface IERC1155FullSupplyUpgradeable {
    /**
     * @dev Total amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Total amount of tokens in with a given id.
     */
    function totalSupply(uint256 id) external view returns (uint256);

    /**
     * @dev Returns the sum of amounts of all ids owned by `account`
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Indicates whether any token exist with a given id, or not.
     */
    function exists(uint256 id) external view returns (bool);
}
