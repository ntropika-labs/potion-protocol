// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable-4.7.3/proxy/utils/Initializable.sol";

import "./interfaces/IERC1155DecimalsUpgradeable.sol";

/**
 * @dev Extension of ERC1155 that adds decimals to the multi-token
 *
 * @dev No storage gaps have been added as the functionlity of this contract is considered to be
 *      final and there is no need to add more storage variables
 *
 * @author Roberto Cano <robercano>
 */
abstract contract ERC1155DecimalsUpgradeable is Initializable, IERC1155DecimalsUpgradeable {
    function __ERC1155Decimals_init() internal onlyInitializing {}

    function __ERC1155Decimals_init_unchained() internal onlyInitializing {}

    /**
     * @dev Returns the number of decimals used to get its user representation.
     *
     * See {ERC20-decimals}.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }
}
