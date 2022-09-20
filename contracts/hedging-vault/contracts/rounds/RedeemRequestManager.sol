/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

library RedeemRequestManager {
    struct RedeemRequest {
        uint256[] ids;
        uint256[] amounts;
    }

    struct RedeemRequests {
        mapping(address => RedeemRequest) _map;
    }

    /**
        @notice Adds a request to the redeem requests list of the given account

        @param requests The redeem requests list
        @param account The account to add the requests to
        @param id The id of the request to add
        @param amount The amount of the request to add

        @dev The length of the ids and amounts arrays must be the same. This is not checked in the function
        and it is assumed that the user of the library will check this
     */
    function add(
        RedeemRequests storage requests,
        address account,
        uint256 id,
        uint256 amount
    ) internal {
        RedeemRequest storage request = requests._map[account];
        request.ids.push(id);
        request.amounts.push(amount);
    }

    /**
        @notice Adds several requests at the same time to the redeem requests list of the given account

        @param requests The redeem requests list
        @param account The account to add the requests to
        @param ids The ids of the requests to add
        @param amounts The amounts of the requests to add

        @dev The length of the ids and amounts arrays must be the same. This is not checked in the function
        and it is assumed that the user of the library will check this
     */
    function addBatch(
        RedeemRequests storage requests,
        address account,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) internal {
        RedeemRequest storage request = requests._map[account];

        for (uint256 i = 0; i < ids.length; i++) {
            request.ids.push(ids[i]);
            request.amounts.push(amounts[i]);
        }
    }

    function lengthOf(RedeemRequests storage requests, address account) internal view returns (uint256) {
        return requests._map[account].ids.length;
    }

    function get(
        RedeemRequests storage requests,
        address account,
        uint256 index
    ) internal view returns (uint256, uint256) {
        RedeemRequest storage request = requests._map[account];
        return (request.ids[index], request.amounts[index]);
    }

    function pop(
        RedeemRequests storage requests,
        address account,
        uint256 index
    ) internal view returns (uint256, uint256) {
        RedeemRequest storage request = requests._map[account];
        return (request.ids[index], request.amounts[index]);
    }
}
