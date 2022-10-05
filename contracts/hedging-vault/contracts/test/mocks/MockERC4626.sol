/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts-4.7.3/token/ERC20/extensions/ERC4626.sol";

/**
    @title MockERC4626

    @author Roberto Cano <robercano>

    @notice Mock contract for an ERC4626
 */
contract MockERC4626 is ERC4626 {
    uint256 private dummy;
    uint256 private balanceOfReturn;

    constructor(
        string memory name,
        string memory symbol,
        address asset_
    ) ERC4626(IERC20Metadata(asset_)) ERC20(name, symbol) {}

    function approve(address, uint256) public override(ERC20, IERC20) returns (bool) {
        dummy = 1;
        return true;
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public override(ERC20, IERC20) returns (bool) {
        dummy = 1;
        return true;
    }

    function transfer(address, uint256) public override(ERC20, IERC20) returns (bool) {
        dummy = 1;
        return true;
    }

    function balanceOf(address) public view override(ERC20, IERC20) returns (uint256) {
        return balanceOfReturn;
    }

    function totalAssets() public pure override returns (uint256) {
        return type(uint256).max;
    }

    function convertToShares(uint256 assets) public pure override returns (uint256 shares) {
        return 2 * assets;
    }

    function convertToAssets(uint256 shares) public pure override returns (uint256 assets) {
        return shares / 2;
    }

    function maxDeposit(address) public pure override returns (uint256) {
        return type(uint256).max;
    }

    function maxMint(address) public pure override returns (uint256) {
        return type(uint256).max;
    }

    function maxWithdraw(address) public pure override returns (uint256) {
        return type(uint256).max;
    }

    function maxRedeem(address) public pure override returns (uint256) {
        return type(uint256).max;
    }

    function previewDeposit(uint256 assets) public pure override returns (uint256) {
        return convertToShares(assets);
    }

    function previewMint(uint256 shares) public pure override returns (uint256) {
        return convertToAssets(shares);
    }

    function previewWithdraw(uint256 assets) public pure override returns (uint256) {
        return convertToShares(assets);
    }

    function previewRedeem(uint256 shares) public pure override returns (uint256) {
        return convertToAssets(shares);
    }

    function deposit(uint256 assets, address) public override returns (uint256) {
        dummy = 1;
        return convertToShares(assets);
    }

    function mint(uint256 shares, address) public override returns (uint256) {
        dummy = 1;
        return convertToAssets(shares);
    }

    function withdraw(
        uint256 assets,
        address,
        address
    ) public override returns (uint256) {
        dummy = 1;
        return convertToShares(assets);
    }

    function redeem(
        uint256 shares,
        address,
        address
    ) public override returns (uint256) {
        dummy = 1;
        return convertToAssets(shares);
    }

    function mockSetBalanceOf(uint256 balance) public {
        balanceOfReturn = balance;
    }
}
