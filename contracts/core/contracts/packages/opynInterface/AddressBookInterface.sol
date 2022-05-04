// SPDX-License-Identifier: Apache-2.0
// Adapted from public domain Opyn code
pragma solidity 0.8.4;

interface AddressBookInterface {
    /* Getters */

    function getOtokenImpl() external view returns (address);

    function getOtokenFactory() external view returns (address);

    function getWhitelist() external view returns (address);

    function getController() external view returns (address);

    function getOracle() external view returns (address);

    function getMarginPool() external view returns (address);

    function getMarginCalculator() external view returns (address);

    function getLiquidationManager() external view returns (address);

    function getAddress(bytes32 _id) external view returns (address);

    /* Setters */

    function setOtokenImpl(address _otokenImpl) external;

    function setOtokenFactory(address _factory) external;

    function setOracle(address _oracle) external;

    function setWhitelist(address _whitelist) external;

    function setController(address _controller) external;

    function setMarginPool(address _marginPool) external;

    function setMarginCalculator(address _calculator) external;

    function setLiquidationManager(address _liquidationManager) external;

    function setAddress(bytes32 _id, address _newImpl) external;
}
