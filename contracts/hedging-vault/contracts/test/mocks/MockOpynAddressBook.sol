/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IOpynAddressBook.sol";

/**
    @title MockOpynAddressBook

    @author Roberto Cano <robercano>

    @notice Mock contract for the Opyn address book
*/
contract MockOpynAddressBook is IOpynAddressBook {
    address public opynFactory;
    address public opynController;
    address public opynOracle;

    constructor(
        address opynController_,
        address opynFactory_,
        address opynOracle_
    ) {
        opynController = opynController_;
        opynFactory = opynFactory_;
        opynOracle = opynOracle_;
    }

    function getOtokenFactory() external view returns (address) {
        return opynFactory;
    }

    function getController() external view returns (address) {
        return opynController;
    }

    function getOracle() external view returns (address) {
        return opynOracle;
    }
}
