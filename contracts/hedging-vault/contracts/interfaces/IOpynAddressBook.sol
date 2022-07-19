// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

/**
  @notice Opyn Address Book interface, used to retrieve the addresses of other Opyn contracts
 */
interface IOpynAddressBook {
    /* Getters */

    function getOtokenFactory() external view returns (address);

    function getController() external view returns (address);

    function getOracle() external view returns (address);
}
