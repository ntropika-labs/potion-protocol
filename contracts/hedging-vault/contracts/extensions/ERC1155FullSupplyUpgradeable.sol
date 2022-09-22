// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

import "./interfaces/IERC1155FullSupplyUpgradeable.sol";

/**
 * @dev Extension of ERC1155 that adds tracking of total overall supply on top of the
 * per-id supply tracking of ERC1155SupplyUpgradeable.
 *
 * @dev This contract is based on the OpenZeppelin ERC1155SupplyUpgradeable contract, with
 * added functionality track the full supply of all minted ids plus the balance of all ids
 * for a given account.
 *
 * @author robercano
 */
abstract contract ERC1155FullSupplyUpgradeable is Initializable, ERC1155Upgradeable, IERC1155FullSupplyUpgradeable {
    function __ERC1155FullSupply_init() internal onlyInitializing {}

    function __ERC1155FullSupply_init_unchained() internal onlyInitializing {}

    uint256 private _totalSupply;
    mapping(uint256 => uint256) private _totalSupplyByID;
    mapping(address => uint256) private _totalSupplyByAccount;

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @inheritdoc IERC1155FullSupplyUpgradeable
     */
    function totalSupply(uint256 id) public view virtual override returns (uint256) {
        return _totalSupplyByID[id];
    }

    /**
     * @inheritdoc IERC1155FullSupplyUpgradeable
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _totalSupplyByAccount[account];
    }

    /**
     * @inheritdoc IERC1155FullSupplyUpgradeable
     */
    function exists(uint256 id) public view virtual override returns (bool) {
        return ERC1155FullSupplyUpgradeable.totalSupply(id) > 0;
    }

    /**
     * @dev See {ERC1155-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                _totalSupplyByID[ids[i]] += amounts[i];
                _totalSupplyByAccount[to] += amounts[i];
                _totalSupply += amounts[i];
            }
        }

        if (to == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                uint256 id = ids[i];
                uint256 amount = amounts[i];
                uint256 supply = _totalSupplyByID[id];
                require(supply >= amount, "ERC1155: burn amount exceeds totalSupply");

                uint256 accountSupply = _totalSupplyByAccount[from];
                require(accountSupply >= amount, "ERC1155: burn amount exceeds account amount");

                unchecked {
                    _totalSupplyByID[id] = supply - amount;
                    _totalSupplyByAccount[from] = accountSupply - amount;

                    // This is safe because we substract the amount from the specific ID first. The sum
                    // of all IDs supplies is exactly the amount stored in _totalSupply. Thus, the require
                    // statement above will always trigger before _totalSupply underflows.
                    _totalSupply -= amount;
                }
            }
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
