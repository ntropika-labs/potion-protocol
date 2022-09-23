// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC1155UpgradeableMock.sol";
import "../../extensions/ERC1155FullSupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable-4.7.3/proxy/utils/Initializable.sol";

contract ERC1155FullSupplyUpgradeableMock is Initializable, ERC1155UpgradeableMock, ERC1155FullSupplyUpgradeable {
    function __ERC1155FullSupplyUpgradeableMock_init(string memory uri) internal onlyInitializing {
        __ERC1155_init_unchained(uri);
        __ERC1155Mock_init_unchained(uri);
    }

    function __ERC1155FullSupplyUpgradeableMock_init_unchained(string memory) internal onlyInitializing {}

    function initialize(string memory uri) external initializer {
        __ERC1155FullSupplyUpgradeableMock_init(uri);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155Upgradeable, ERC1155FullSupplyUpgradeable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
